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
 * Filter the raw catalog down to free models, normalize the shape and sort by
 * context length (largest first). Entries without an id are dropped.
 */
export function freeModels(data: OpenRouterModel[] | undefined): FreeModel[] {
  return (data ?? [])
    .filter(isFreeModel)
    .filter((m): m is OpenRouterModel & { id: string } => typeof m.id === 'string')
    .map((m) => ({
      id: m.id,
      name: m.name ?? m.id,
      context: m.context_length ?? 0,
    }))
    .sort((a, b) => b.context - a.context);
}
