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

interface StreamArgs {
  query: string;
  jobText?: string;
  locale: Locale;
  onChunk: (delta: string) => void;
  /** reports which model actually answered (e.g. "openai/gpt-oss-120b:free") */
  onModel?: (model: string) => void;
  signal?: AbortSignal;
}

/**
 * Calls the Cloudflare Function at /api/chat and streams the model's answer
 * token-by-token through `onChunk`. Throws `AiUnavailable` whenever the real
 * AI can't serve the request (no key configured, free quota exhausted, rate
 * limited, network error, or the endpoint doesn't exist — e.g. local `vite`
 * dev) so the caller can drop to the deterministic engine.
 */
export async function streamAiReply({
  query,
  jobText,
  locale,
  onChunk,
  onModel,
  signal,
}: StreamArgs): Promise<void> {
  let res: Response;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      const data = (await res.clone().json()) as { reason?: string };
      if (data?.reason) reason = data.reason;
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
        if (!produced) throw new AiUnavailable('empty');
        return;
      }
      try {
        const parsed = JSON.parse(payload) as {
          model?: string;
          choices?: { delta?: { content?: string } }[];
        };
        if (!modelReported && parsed.model && onModel) {
          modelReported = true;
          onModel(parsed.model);
        }
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          produced = true;
          onChunk(delta);
        }
      } catch {
        /* ignore keep-alive / partial frames */
      }
    }
  }

  if (!produced) throw new AiUnavailable('empty');
}
