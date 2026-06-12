/**
 * Cloudflare Pages Function — the "waiter".
 * Lives at  https://<site>/api/chat  automatically (Pages serves /functions).
 *
 * Holds the OpenRouter key (server-side secret), enforces guardrails + a basic
 * rate limit, then streams the model's answer back to the browser. When the
 * key is missing or the free quota is exhausted, it returns a `{ fallback: true }`
 * signal so the frontend gracefully drops to the internal deterministic agent.
 */

import { buildSystemPrompt } from './_context';

interface Env {
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  // Optional KV binding named RATE_LIMIT for cross-edge rate limiting.
  RATE_LIMIT?: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
  };
}

interface ChatBody {
  query?: string;
  jobText?: string;
  locale?: string;
}

const DEFAULT_MODEL = 'deepseek/deepseek-chat-v3-0324:free';
const MAX_QUERY_CHARS = 1200;
const MAX_JOB_CHARS = 6000;
const MAX_TOKENS = 700;
const RATE_PER_MIN = 15;

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  // No key configured yet → tell the client to use the local fallback.
  if (!env.OPENROUTER_API_KEY) {
    return json({ fallback: true, reason: 'no_key' }, 503);
  }

  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  const query = (body.query ?? '').toString().trim().slice(0, MAX_QUERY_CHARS);
  const jobText = (body.jobText ?? '').toString().slice(0, MAX_JOB_CHARS);
  const locale = body.locale === 'pt' || body.locale === 'en' ? body.locale : undefined;
  if (!query) return json({ error: 'empty_query' }, 400);

  // Basic per-IP rate limit (only when a KV binding is present).
  if (env.RATE_LIMIT) {
    const ip = request.headers.get('CF-Connecting-IP') ?? 'anon';
    const key = `rl:${ip}`;
    const current = parseInt((await env.RATE_LIMIT.get(key)) ?? '0', 10);
    if (current >= RATE_PER_MIN) {
      return json({ fallback: true, reason: 'rate_limited' }, 429);
    }
    await env.RATE_LIMIT.put(key, String(current + 1), { expirationTtl: 60 });
  }

  const messages = [
    { role: 'system', content: buildSystemPrompt(locale) },
    {
      role: 'user',
      content: jobText
        ? `${query}\n\n--- JOB DESCRIPTION PROVIDED BY THE USER ---\n${jobText}`
        : query,
    },
  ];

  let upstream: Response;
  try {
    upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://blpsoares.dev',
        'X-Title': 'blpsoares.dev portfolio assistant',
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL || DEFAULT_MODEL,
        stream: true,
        temperature: 0.4,
        max_tokens: MAX_TOKENS,
        messages,
      }),
    });
  } catch {
    return json({ fallback: true, reason: 'network' }, 502);
  }

  // Free quota exhausted / rate-limited upstream / any error → fallback.
  if (!upstream.ok || !upstream.body) {
    const reason = upstream.status === 429 ? 'quota' : 'upstream';
    return json({ fallback: true, reason, status: upstream.status }, upstream.status === 429 ? 429 : 502);
  }

  // Stream the SSE response straight through to the browser.
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Agent-Source': 'openrouter',
    },
  });
}
