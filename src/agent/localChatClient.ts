/**
 * Local (in-browser) counterpart to `chatClient.ts`.
 *
 * Same shape as the old cloud client, so `useAgentChat` can swap engines without
 * knowing which one is answering. The difference is where the tokens come from:
 * here they are generated on the visitor's own GPU by WebLLM.
 *
 * Tool calls: Qwen2.5-1.5B has no reliable function-calling, so we don't
 * declare tools. `useAgentChat` already covers that case — when no tool call
 * arrives it runs the deterministic intent matcher for side effects (CV
 * download, contact links). Swapping `LOCAL_MODEL_ID` to
 * `Hermes-3-Llama-3.2-3B-q4f16_1-MLC` (~2.2 GB) would unlock real tool calls.
 */
import { buildSystemPrompt } from '../../functions/api/_context';
import type { Locale } from '../i18n';
import { getLocalEngine, getLocalTier } from './localEngine';
import { ActionTokenStream } from './actionTokens';
import { answerLanguage } from './language';

/** Thrown when the in-browser model can't serve the request. */
export class AiUnavailable extends Error {
  constructor(
    public reason: string,
    public status?: number,
  ) {
    super(`ai_unavailable:${reason}`);
  }
}

interface LocalStreamArgs {
  query: string;
  jobText?: string;
  locale: Locale;
  onChunk: (delta: string) => void;
  onModel?: (model: string) => void;
  /** Fired for each `[[action:name:arg]]` token the model emits. */
  onAction?: (name: string, arg: string) => void;
  signal?: AbortSignal;
}

// 700 was a ceiling on a runaway: with no repetition penalty a 360M model would
// happily fill every one of them repeating the same sentence. 300 comfortably
// covers the "~140 words" the system prompt asks for.
const MAX_TOKENS = 300;

/**
 * Stream an answer from the in-browser model. Throws `AiUnavailable` when the
 * engine isn't ready or generation fails, which the caller treats exactly like
 * any other engine failure — the caller falls back to the rule engine.
 */
export async function streamLocalReply({
  query,
  jobText,
  locale,
  onChunk,
  onModel,
  onAction,
  signal,
}: LocalStreamArgs): Promise<void> {
  const engine = getLocalEngine();
  if (!engine) throw new AiUnavailable('local_not_ready');

  onModel?.(getLocalTier()?.label ?? 'local');

  let produced = false;
  // Actions ride inline in the text, so the stream has to be filtered before it
  // reaches the bubble — otherwise the visitor watches raw tokens get typed out.
  const tokens = new ActionTokenStream();
  const emit = (text: string, actions: { name: string; arg: string }[]) => {
    for (const a of actions) onAction?.(a.name, a.arg);
    if (text) {
      produced = true;
      onChunk(text);
    }
  };

  try {
    // Answer in the language the visitor wrote in, falling back to the site
    // locale. The site defaults to English when nothing is stored, which is how
    // a message in Portuguese got answered in English.
    const lang = answerLanguage(query, locale);

    const stream = await engine.chat.completions.create({
      messages: [
        { role: 'system', content: buildSystemPrompt(lang, getLocalTier()?.label) },
        {
          role: 'user',
          content: jobText
            ? `${query}\n\n--- JOB DESCRIPTION PROVIDED BY THE USER ---\n${jobText}`
            : query,
        },
      ],
      stream: true,
      // Tuned for the small models we run locally. A 360M at temperature 0.4
      // with no penalties falls into a repetition attractor and emits the same
      // sentence until max_tokens runs out; these three penalties are what
      // break the cycle. `repetition_penalty` acts over the whole history,
      // the OpenAI-style pair handles literal phrase repeats.
      temperature: 0.7,
      top_p: 0.9,
      repetition_penalty: 1.15,
      frequency_penalty: 0.4,
      presence_penalty: 0.3,
      max_tokens: MAX_TOKENS,
      // Safety net against the model role-playing the next turn.
      stop: ['\nUser:', '\nUsuário:', '\nVisitor:', '\n\n\n'],
    });

    for await (const chunk of stream) {
      if (signal?.aborted) {
        await engine.interruptGenerate();
        return;
      }
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        const { text, actions } = tokens.push(delta);
        emit(text, actions);
      }
    }
    // Whatever was held back waiting on a possible token is plain text after all.
    emit(tokens.flush(), []);
  } catch (err) {
    if (!produced) throw new AiUnavailable('local_error');
    // Partial answer already on screen — let it stand rather than wiping it.
    console.error('local engine error', err);
    return;
  }

  if (!produced) throw new AiUnavailable('empty');
}
