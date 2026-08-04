/**
 * Shared "free model" filter logic for OpenRouter's catalog.
 *
 * Used by both `GET /api/models` (the operator-facing lister) and the cron
 * Worker that auto-rotates the active free-model list into KV. Keeping the
 * filter in one place means the two stay in lockstep when OpenRouter changes
 * how it flags free models.
 */

export interface OpenRouterModel {
  id?: string;
  name?: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string };
  /** Modality info. Absent on older catalog entries, so treated as unknown. */
  architecture?: {
    input_modalities?: string[];
    output_modalities?: string[];
    modality?: string;
  };
  /** Sampling/params the model accepts, e.g. "tools", "temperature". */
  supported_parameters?: string[];
}

export interface FreeModel {
  id: string;
  name: string;
  context: number;
}

/**
 * A model counts as free when its id ends with `:free` OR both the prompt and
 * completion prices are exactly "0". (OpenRouter expresses prices as strings.)
 */
export function isFreeModel(m: OpenRouterModel): boolean {
  return (
    m.id?.endsWith(':free') === true ||
    (m.pricing?.prompt === '0' && m.pricing?.completion === '0')
  );
}

/**
 * Does this model actually work as our chat backend?
 *
 * THIS IS NOT OPTIONAL, and the obvious check is wrong. Google's Lyria 3 is a
 * free MUSIC model with a 1M context, so sorting the free catalog by context
 * put it first and every chat request went to it. But its output modalities are
 * `["text", "audio"]` — it DOES list text, so "includes text" happily accepts
 * it. Verified against the live catalog: among the free models, the only ones
 * that are not chat are exactly the ones whose output is not *only* text.
 *
 * The second gate is `tools`. We send `tools` + `tool_choice` on every request,
 * and Lyria's supported_parameters lack them entirely. Requiring tool support
 * expresses what we actually depend on rather than guessing at model families.
 */
export function isChatModel(m: OpenRouterModel): boolean {
  const arch = m.architecture;

  // Output must be text and NOTHING else. Audio/image output means it is a
  // generation model that merely accepts a text prompt.
  const out = arch?.output_modalities;
  if (out && !(out.length === 1 && out[0] === 'text')) return false;

  // It must be able to read text at all.
  if (arch?.input_modalities?.length && !arch.input_modalities.includes('text')) return false;

  // Older catalog entries only carry the combined string, e.g. "text->text".
  if (arch?.modality) {
    const rhs = arch.modality.split('->')[1] ?? '';
    if (rhs && rhs.trim() !== 'text') return false;
  }

  // We rely on tool calling; a model that cannot do it is not a candidate.
  const params = m.supported_parameters;
  if (params?.length && !params.includes('tools')) return false;

  return true;
}

/**
 * Filter the raw catalog down to free CHAT models, normalize the shape and sort
 * by context length (largest first). Entries without an id are dropped.
 */
export function freeModels(data: OpenRouterModel[] | undefined): FreeModel[] {
  return (data ?? [])
    .filter(isFreeModel)
    .filter(isChatModel)
    .filter((m): m is OpenRouterModel & { id: string } => typeof m.id === 'string')
    .map((m) => ({
      id: m.id,
      name: m.name ?? m.id,
      context: m.context_length ?? 0,
    }))
    .sort((a, b) => b.context - a.context);
}
