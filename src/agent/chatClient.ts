import type { Locale } from '../i18n';

/** Thrown when the real-AI backend is unavailable and we should fall back. */
export class AiUnavailable extends Error {
  constructor(
    public reason: string,
    public status?: number,
  ) {
    super(`ai_unavailable:${reason}`);
  }
}

/** A completed tool call emitted by the model (arguments are raw JSON). */
export interface AiToolCall {
  name: string;
  /** raw JSON string, e.g. '{"section":"projects"}' — the caller parses it */
  arguments: string;
}

interface StreamArgs {
  query: string;
  jobText?: string;
  locale: Locale;
  onChunk: (delta: string) => void;
  /** reports which model actually answered (e.g. "openai/gpt-oss-120b:free") */
  onModel?: (model: string) => void;
  /** incremental reasoning string from reasoning-capable models */
  onReasoning?: (delta: string) => void;
  /** fired once per completed tool call (at completion or stream end) */
  onToolCall?: (call: AiToolCall) => void;
  signal?: AbortSignal;
}

/** Internal accumulator for a fragmented tool call. */
interface PartialToolCall {
  name: string;
  arguments: string;
  emitted: boolean;
}

/** Shape of the OpenAI/OpenRouter SSE `delta` we care about. */
interface SseDelta {
  content?: string;
  reasoning?: string;
  tool_calls?: {
    index?: number;
    function?: { name?: string; arguments?: string };
  }[];
}

const SESSION_KEY = 'bryan_ai_session_id';

/** Stable per-browser session id, persisted in localStorage (best-effort). */
export function getSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    // localStorage blocked (private mode / SSR) — degrade to ephemeral id.
    return `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Calls the Cloudflare Function at /api/chat and streams the model's answer
 * token-by-token through `onChunk`. Also surfaces real reasoning (`onReasoning`)
 * and model-decided tool calls (`onToolCall`). Throws `AiUnavailable` whenever
 * the real AI can't serve the request (no key configured, free quota exhausted,
 * rate limited, network error, or the endpoint doesn't exist — e.g. local
 * `vite` dev) so the caller can drop to the deterministic engine.
 */
export async function streamAiReply({
  query,
  jobText,
  locale,
  onChunk,
  onModel,
  onReasoning,
  onToolCall,
  signal,
}: StreamArgs): Promise<void> {
  let res: Response;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': getSessionId(),
      },
      body: JSON.stringify({ query, jobText, locale }),
      signal,
    });
  } catch {
    throw new AiUnavailable('network');
  }

  if (!res.ok || !res.body) {
    // The function returns { fallback: true, reason } for graceful degradation.
    let reason = 'unavailable';
    try {
      const data = (await res.clone().json()) as { reason?: string; error?: string };
      // Guard-rail refusals arrive as `error`, graceful degradation as `reason`.
      if (data?.reason) reason = data.reason;
      else if (data?.error) reason = data.error;
    } catch {
      /* non-JSON (e.g. 404 in dev) */
    }
    throw new AiUnavailable(reason, res.status);
  }

  // Parse the OpenAI/OpenRouter SSE stream.
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let produced = false;
  let modelReported = false;
  // Tool calls arrive fragmented across deltas, keyed by `index`.
  const toolCalls = new Map<number, PartialToolCall>();

  /** Emit a single accumulated tool call exactly once. */
  const emit = (call: PartialToolCall) => {
    if (call.emitted || !call.name || !onToolCall) return;
    call.emitted = true;
    onToolCall({ name: call.name, arguments: call.arguments });
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') {
        // Flush any tool calls that never got a separate finish signal.
        toolCalls.forEach(emit);
        if (!produced && toolCalls.size === 0) throw new AiUnavailable('empty');
        return;
      }
      try {
        const parsed = JSON.parse(payload) as {
          model?: string;
          choices?: { delta?: SseDelta; finish_reason?: string | null }[];
        };
        if (!modelReported && parsed.model && onModel) {
          modelReported = true;
          onModel(parsed.model);
        }

        const choice = parsed.choices?.[0];
        const delta = choice?.delta;

        if (delta?.reasoning && onReasoning) {
          produced = true;
          onReasoning(delta.reasoning);
        }

        if (delta?.content) {
          produced = true;
          onChunk(delta.content);
        }

        // Accumulate fragmented tool-call pieces.
        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            const idx = tc.index ?? 0;
            const acc = toolCalls.get(idx) ?? { name: '', arguments: '', emitted: false };
            if (tc.function?.name) acc.name = tc.function.name;
            if (tc.function?.arguments) acc.arguments += tc.function.arguments;
            toolCalls.set(idx, acc);
          }
        }

        // A finish_reason of tool_calls means every accumulated call is done.
        if (choice?.finish_reason === 'tool_calls') {
          toolCalls.forEach(emit);
        }
      } catch {
        /* ignore keep-alive / partial frames */
      }
    }
  }

  // Stream ended without an explicit [DONE]; flush remaining tool calls.
  toolCalls.forEach(emit);
  if (!produced && toolCalls.size === 0) throw new AiUnavailable('empty');
}
