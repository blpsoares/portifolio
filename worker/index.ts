/**
 * Cloudflare Pages "advanced mode" Worker.
 *
 * The deploy pipeline (embark-me) only uploads `dist/` as the artifact — it does
 * NOT carry the `functions/` directory to the deploy step. That made file-based
 * Pages Functions vanish in production (POST /api/chat → 405 from the static
 * asset server). Bundling this `_worker.js` INTO `dist/` makes the API travel
 * with the artifact, so it always deploys.
 *
 * It reuses the exact same handlers from `functions/` (no duplicated logic), and
 * a `_routes.json` limits it to `/api/*` so every other route is served as a
 * normal static asset (SPA + _redirects untouched).
 */
import { onRequestPost as chatHandler } from '../functions/api/chat';
import { onRequestGet as modelsHandler } from '../functions/api/models';

interface Env {
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
  [key: string]: unknown;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/chat') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return chatHandler({ request, env, waitUntil: ctx?.waitUntil?.bind(ctx) } as any);
    }

    if (pathname === '/api/models') {
      if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return modelsHandler({ env } as any);
    }

    // Anything else (only reached if _routes.json widens scope): serve assets.
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response('Not Found', { status: 404 });
  },
};
