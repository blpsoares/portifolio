/**
 * Cron Worker — auto-rotates the free-model list into KV.
 *
 * Pages Functions cannot run on a schedule (Cron Triggers are a Workers-only
 * feature), so this small standalone Worker handles it. It SHARES the KV
 * namespace `MODELS` with the Pages app: every ~6h it fetches OpenRouter's
 * catalog, filters the free models with the SAME util the `/api/models`
 * endpoint uses, takes the top 3 by context length, and writes the ids to the
 * `active` key. The chat function then prefers KV → env → defaults.
 *
 * Deploy separately: `wrangler deploy` inside this directory. It is NOT part of
 * the main `bun run build` (Pages) pipeline.
 */

import { freeModels, type OpenRouterModel } from '../functions/api/_models-util';

interface KVNamespace {
  put(key: string, value: string): Promise<void>;
}

interface Env {
  MODELS: KVNamespace;
  // Optional — account-aware availability; the catalog is public without it.
  OPENROUTER_API_KEY?: string;
}

interface ScheduledEvent {
  cron: string;
  scheduledTime: number;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

async function refreshModels(env: Env): Promise<void> {
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    headers: env.OPENROUTER_API_KEY
      ? { Authorization: `Bearer ${env.OPENROUTER_API_KEY}` }
      : {},
  });
  if (!res.ok) {
    console.error('cron: OpenRouter models fetch failed', res.status);
    return;
  }

  const payload = (await res.json()) as { data?: OpenRouterModel[] };
  // Six, not three. A model listed as free in the catalog can still answer 404
  // "unavailable for free" or 429 "rate-limited upstream" at inference time,
  // and which ones do changes through the day. The chat now walks the whole
  // list until one streams, so depth here is what keeps it alive.
  const top = freeModels(payload.data)
    .slice(0, 6)
    .map((m) => m.id);

  if (top.length === 0) {
    console.error('cron: no free models found, leaving KV untouched');
    return;
  }

  // OpenRouter's own free router goes last: it picks whatever is actually up,
  // so it survives even a day where every specific id above is throttled.
  const list = [...top, 'openrouter/free'];

  await env.MODELS.put('active', JSON.stringify(list));
  console.log('cron: wrote active models', list.join(','));
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // Never throw out of the handler; on failure we simply keep the previous
    // KV value (chat falls through to env/defaults if KV is empty).
    ctx.waitUntil(refreshModels(env).catch((err) => console.error('cron error', err)));
  },
};
