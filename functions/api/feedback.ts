/**
 * Cloudflare Pages Function — the 👍/👎 verdict on one chat turn.
 *
 *   POST /api/feedback   { id, rating: 1 | -1 }
 *
 * This is the half that turns the log into a metric. Question/answer pairs on
 * their own tell you WHAT people asked; only the verdict tells you whether the
 * answer was any good, which is what "is the chat working?" actually asks.
 *
 * The update is scoped to the session that created the row, so one visitor
 * cannot rate another's conversation.
 */

import { originAllowed, type D1Database } from './log';

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

interface Env {
  CHAT_LOG?: D1Database;
  RATE_LIMIT?: KVNamespace;
}

interface FeedbackBody {
  id?: string;
  rating?: number;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** UUID v4, as produced by crypto.randomUUID() in log.ts. */
const isUuid = (v: unknown): v is string =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;

  if (!originAllowed(request)) return json({ ok: false }, 403);
  if (!env.CHAT_LOG) return json({ ok: false, reason: 'disabled' });

  let body: FeedbackBody;
  try {
    body = (await request.json()) as FeedbackBody;
  } catch {
    return json({ ok: false, reason: 'bad_request' }, 400);
  }

  if (!isUuid(body.id)) return json({ ok: false, reason: 'bad_id' }, 400);
  const rating = body.rating === 1 || body.rating === -1 ? body.rating : null;
  if (rating === null) return json({ ok: false, reason: 'bad_rating' }, 400);

  const sessionId = (request.headers.get('X-Session-Id') ?? '').slice(0, 64);
  if (!sessionId) return json({ ok: false, reason: 'no_session' }, 400);

  try {
    // `session_id = ?` is the authorization: a visitor may only rate the turns
    // their own browser produced. A mismatch updates nothing and says nothing.
    await env.CHAT_LOG.prepare(
      `UPDATE chat_turns
          SET rating = ?, rated_at = ?
        WHERE id = ? AND session_id = ?`,
    )
      .bind(rating, Date.now(), body.id, sessionId)
      .run();
  } catch (err) {
    console.error('chat feedback update failed', err);
    return json({ ok: false, reason: 'db_error' });
  }

  return json({ ok: true });
};
