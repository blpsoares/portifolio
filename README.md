<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/129fNjSRDf-d_2JJlp5bg8Z3roW_kpF2d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## AI assistant (OpenRouter) — Cloudflare config

The chat is hybrid: the Pages Function `functions/api/chat.ts` streams a real
LLM answer (with model-driven tool calls, reasoning, and clickable grounding
citations); on any failure it gracefully drops to the in-browser deterministic
agent. Everything below is OPTIONAL — without it the site still works on the
local fallback.

### Secrets / env vars (Cloudflare Pages → Settings → Variables)

- `OPENROUTER_API_KEY` (secret) — enables the real AI. Without it: local fallback.
- `OPENROUTER_MODELS` (optional) — comma-separated ordered free-model list.
- Rate-limit tuning (optional, ints): `RATE_LIMIT_IP_PER_MIN` (default 20),
  `RATE_LIMIT_SESSION_PER_MIN` (default 8), `RATE_LIMIT_SESSION_PER_HOUR`
  (default 40).

### KV namespaces (Pages → Settings → Functions → KV bindings)

- `RATE_LIMIT` — per-IP (`rl:ip:*`) and per-session (`rl:sess:*`) counters.
  Without it, no rate limiting is applied.
- `MODELS` — the cron Worker writes the fresh free-model list here under the
  `active` key. Chat resolves models in order: KV `MODELS:active` →
  `OPENROUTER_MODELS` → built-in defaults. Without it, env/defaults are used.

Create the shared `MODELS` namespace once and bind the same id in both the
Pages app and the cron Worker:

```sh
wrangler kv namespace create MODELS
wrangler kv namespace create RATE_LIMIT
```

### Analytics Engine (PII-free telemetry)

Add an Analytics Engine dataset binding named `ANALYTICS` (Pages → Functions →
Analytics Engine bindings, or via `wrangler.toml`):

```toml
[[analytics_engine_datasets]]
binding = "ANALYTICS"
```

Each chat request writes ONE datapoint: `blobs:[category, model, locale,
fallbackReason]`, `doubles:[latencyMs]`, `indexes:[category]`. It NEVER logs the
question text, IP, or any PII — only an inferred category
(`career|projects|ai|hire|other`). Telemetry failures never affect the response.

### Cron Worker (auto-rotate free models)

Free `:free` model ids rotate over time. The standalone Worker in `worker-cron/`
refreshes the list every 6h. Pages Functions can't run cron, hence a separate
Worker sharing the `MODELS` KV namespace. Deploy it separately:

```sh
cd worker-cron
# put the shared MODELS namespace id into wrangler.toml first
wrangler deploy
# optional, for account-aware availability:
wrangler secret put OPENROUTER_API_KEY
```

It is NOT part of `bun run build` (the Pages pipeline) and is deployed on its
own.
