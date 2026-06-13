/**
 * GET /api/models — lists the currently-available FREE models on OpenRouter so
 * the OPENROUTER_MODELS env list can be kept fresh (free ids rotate over time).
 *
 * Uses the API key when present (account-aware availability) but works without
 * it too, since OpenRouter's model catalog is public. Cached for 10 minutes.
 *
 * The `:free` filter lives in `_models-util.ts` and is shared with the cron
 * Worker that auto-rotates the active list into KV — no duplicated logic.
 */

import { freeModels, type OpenRouterModel } from './_models-util';

interface Env {
  OPENROUTER_API_KEY?: string;
}

const json = (data: unknown, status = 200, cacheSeconds = 0): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': cacheSeconds ? `public, max-age=${cacheSeconds}` : 'no-store',
    },
  });

export async function onRequestGet(context: { env: Env }): Promise<Response> {
  const { env } = context;

  let upstream: Response;
  try {
    upstream = await fetch('https://openrouter.ai/api/v1/models', {
      headers: env.OPENROUTER_API_KEY
        ? { Authorization: `Bearer ${env.OPENROUTER_API_KEY}` }
        : {},
    });
  } catch {
    return json({ error: 'network' }, 502);
  }

  if (!upstream.ok) {
    return json({ error: 'upstream', status: upstream.status }, 502);
  }

  const payload = (await upstream.json()) as { data?: OpenRouterModel[] };
  const free = freeModels(payload.data);

  return json(
    {
      count: free.length,
      // ready-to-paste value for the OPENROUTER_MODELS env var
      suggested: free.slice(0, 6).map((m) => m.id).join(','),
      models: free,
    },
    200,
    600,
  );
}
