/**
 * Cloudflare Pages Function — conversation log for the bra.ia chat.
 *
 *   POST /api/log       records one finished turn, returns its id
 *   POST /api/feedback  attaches a 👍/👎 verdict to a turn  (see feedback.ts)
 *
 * WHY THE BROWSER POSTS THIS instead of `/api/chat` logging it server-side:
 * only one of the three brains goes through the server. The in-browser WebLLM
 * model and the deterministic rule engine both answer without a request, so
 * server-side capture would silently miss every fallback and every wrong
 * deterministic answer — which are precisely the turns worth reading.
 *
 * Everything here is best-effort. A logging failure must never surface to the
 * visitor or block the chat, so the endpoint always answers 200-ish and the
 * client ignores the result.
 */

interface D1Result {
  success: boolean;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1Result>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

interface Env {
  /** D1 binding. When absent, logging is simply off. */
  CHAT_LOG?: D1Database;
  RATE_LIMIT?: KVNamespace;
}

interface LogBody {
  sessionId?: string;
  locale?: string;
  source?: string;
  model?: string;
  question?: string;
  answer?: string;
  toolName?: string;
  toolArg?: string;
  latencyMs?: number;
  fallbackReason?: string;
  section?: string;
}

/**
 * Caps mirror what the chat itself allows, with headroom for the answer.
 * Anything longer is truncated rather than rejected: a clipped log row is more
 * useful than no row, and nobody is reading the tail of a runaway answer.
 */
const MAX_QUESTION = 1200;
const MAX_ANSWER = 8000;
const MAX_SHORT = 64;

const SOURCES = new Set(['cloud', 'webllm', 'local']);

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Same-origin guard: this endpoint is for the site, not for the internet. */
export const originAllowed = (request: Request): boolean => {
  const origin = request.headers.get('Origin');
  if (!origin) return true; // same-origin fetches may omit it
  try {
    const o = new URL(origin);
    const host = new URL(request.url).hostname;
    return (
      o.hostname === host ||
      o.hostname === 'localhost' ||
      o.hostname === '127.0.0.1' ||
      o.hostname.endsWith('.blpsoares.dev') ||
      o.hostname.endsWith('.pages.dev')
    );
  } catch {
    return false;
  }
};

const str = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

/** Cheap per-session write ceiling so the endpoint cannot be used to fill D1. */
async function overLimit(kv: KVNamespace | undefined, sessionId: string): Promise<boolean> {
  if (!kv || !sessionId) return false;
  const key = `log:${sessionId}:h`;
  try {
    const current = parseInt((await kv.get(key)) ?? '0', 10) || 0;
    if (current >= 120) return true;
    await kv.put(key, String(current + 1), { expirationTtl: 3600 });
    return false;
  } catch {
    // A KV hiccup must not stop the site from logging.
    return false;
  }
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
  waitUntil?: (p: Promise<unknown>) => void;
}): Promise<Response> => {
  const { request, env } = context;

  if (!originAllowed(request)) return json({ ok: false }, 403);
  // No database bound yet → logging is off, and that is not an error.
  if (!env.CHAT_LOG) return json({ ok: false, reason: 'disabled' });

  let body: LogBody;
  try {
    body = (await request.json()) as LogBody;
  } catch {
    return json({ ok: false, reason: 'bad_request' }, 400);
  }

  const question = str(body.question, MAX_QUESTION);
  const answer = str(body.answer, MAX_ANSWER);
  if (!question || !answer) return json({ ok: false, reason: 'empty' }, 400);

  const sessionId =
    str(request.headers.get('X-Session-Id'), MAX_SHORT) || str(body.sessionId, MAX_SHORT);
  if (await overLimit(env.RATE_LIMIT, sessionId)) {
    return json({ ok: false, reason: 'rate_limited' }, 429);
  }

  const source = SOURCES.has(str(body.source, MAX_SHORT)) ? str(body.source, MAX_SHORT) : 'local';
  const locale = body.locale === 'pt' || body.locale === 'en' ? body.locale : 'pt';
  const latency =
    typeof body.latencyMs === 'number' && Number.isFinite(body.latencyMs)
      ? Math.max(0, Math.round(body.latencyMs))
      : null;

  const id = crypto.randomUUID();

  try {
    await env.CHAT_LOG.prepare(
      `INSERT INTO chat_turns
         (id, created_at, session_id, locale, source, model, question, answer,
          tool_name, tool_arg, latency_ms, fallback_reason, section)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        // Server clock: a skewed client must not scatter rows across time.
        Date.now(),
        sessionId || 'anon',
        locale,
        source,
        str(body.model, MAX_SHORT) || null,
        question,
        answer,
        str(body.toolName, MAX_SHORT) || null,
        str(body.toolArg, MAX_SHORT) || null,
        latency,
        str(body.fallbackReason, MAX_SHORT) || null,
        str(body.section, MAX_SHORT) || null,
      )
      .run();
  } catch (err) {
    console.error('chat log insert failed', err);
    return json({ ok: false, reason: 'db_error' });
  }

  return json({ ok: true, id });
};
