/**
 * Client half of the conversation log.
 *
 * Every finished turn is posted here, whichever brain answered it — cloud,
 * in-browser model, or rule engine. That is the whole point: the turns worth
 * studying are the ones the server never sees, like a fallback answering the
 * wrong thing confidently.
 *
 * Strictly fire-and-forget. Logging is an observability nicety; it must never
 * delay a reply, surface an error, or break the chat when the endpoint is not
 * deployed. Every failure path here ends in `null`.
 */

export interface TurnLog {
  sessionId: string;
  locale: 'pt' | 'en';
  /** Which brain produced the answer. */
  source: 'cloud' | 'webllm' | 'local';
  model?: string;
  question: string;
  answer: string;
  toolName?: string;
  toolArg?: string;
  /** Milliseconds from send to the last token. */
  latencyMs?: number;
  /** Set when the cloud brain declined and something else took over. */
  fallbackReason?: string;
  /** Section the visitor was viewing when they asked. */
  section?: string;
}

/** Records one turn. Resolves to the row id, or null if logging is unavailable. */
export async function logTurn(turn: TurnLog): Promise<string | null> {
  try {
    const res = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Session-Id': turn.sessionId },
      body: JSON.stringify(turn),
      // The visitor may navigate away right after the answer lands; keepalive
      // lets the browser finish the POST anyway.
      keepalive: true,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; id?: string };
    return data?.ok && data.id ? data.id : null;
  } catch {
    return null;
  }
}

/** Attaches a verdict to a logged turn. Silent on every failure. */
export async function rateTurn(
  id: string,
  sessionId: string,
  rating: 1 | -1,
): Promise<boolean> {
  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Session-Id': sessionId },
      body: JSON.stringify({ id, rating }),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}
