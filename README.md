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

## AI assistant (bra.ia)

The chat has three brains and always answers, degrading silently between them:

1. **OpenRouter** (`functions/api/chat.ts`) — a real cloud LLM, streamed, with
   model-driven tool calls, reasoning and clickable grounding citations. Works
   on every device, so it leads.
2. **In-browser model** (`@mlc-ai/web-llm`) — takes over on quota exhaustion,
   rate limits, or offline. Runs on the visitor's own GPU via WebGPU inside a
   Web Worker, so the page never janks and no token leaves the device.
3. **Rule engine** (`src/agent/engine.ts`) — the floor. Answers when neither LLM
   can serve (no key, no WebGPU, download declined).

The visitor never sees a downgrade notice; the source badge under each answer
says which brain replied.

### Choosing a cloud model

`functions/api/_models-util.ts` filters OpenRouter's catalog down to free models
that can actually chat. **The modality check is not optional and the obvious
version of it is wrong:** Google's Lyria 3 is a free MUSIC model with a 1M
context, so sorting free models by context put it first and every chat request
went to it. Its `output_modalities` are `["text", "audio"]` — it *does* list
text, so an "includes text" check accepts it. The filter therefore requires
output to be **exclusively** text, and requires `tools` support, which is what
we actually depend on.

The list is re-validated when READ from KV, not only when written, so a poisoned
list written by an earlier cron run is survivable immediately.

### Local model tiers

Which model a visitor gets is decided per device in `src/agent/localEngine.ts`:

| Tier | Model | Download | Requires |
| --- | --- | --- | --- |
| High | Llama 3.2 3B | ~1.8 GB | GPU budget ≥ 2 GB, RAM ≥ 8 GB, ≥ 15 Mbps |
| Mid | Qwen2.5 1.5B | ~950 MB | GPU budget ≥ 1 GB, RAM ≥ 8 GB, ≥ 5 Mbps |
| Low | SmolLM2 360M | ~300 MB | GPU budget ≥ 256 MB, RAM ≥ 4 GB |

Signals used: `navigator.gpu.requestAdapter()` limits, `navigator.deviceMemory`,
and throughput measured from the Resource Timing entries of assets the page
already fetched (`navigator.connection.downlink` is capped and unreliable, so it
is only a fallback). The "recommended" badge in the settings modal uses hardware
only — bandwidth decides the ETA, never the recommendation, because a noisy
reading made the badge jump between visits on the same machine.

Two rules keep this honest:

- The chosen tier is persisted **only once the download actually starts**, so an
  unlucky early bandwidth reading can't permanently condemn a strong machine.
- If any tier's weights are already cached, they win over a nominally better
  model — except when the visitor picked a model by hand, where substituting it
  would ignore what they just asked for.

WebGPU requires a **secure context**: over plain HTTP on a LAN/Tailscale IP the
whole local-model feature hides itself. Use HTTPS or `localhost` to test it.

### Answer language

`src/agent/language.ts` detects whether the visitor wrote Portuguese or English
and that beats the site locale. The site locale alone was a bad proxy: it used
to default to English regardless of `navigator.language`, so a message written
in Portuguese got a system prompt saying "always respond in English" and the
model obeyed. The locale now seeds from the browser too.

### Cloudflare config

Secrets / env vars (Pages → Settings → Variables):

- `OPENROUTER_API_KEY` — without it `/api/chat` returns `{ fallback: true }` and
  the chat drops to the in-browser model.
- `OPENROUTER_MODELS` — optional ordered, comma-separated override. OpenRouter
  caps the fallback list at 3.
- `RATE_LIMIT_IP_PER_MIN` (20), `RATE_LIMIT_SESSION_PER_MIN` (8),
  `RATE_LIMIT_SESSION_PER_HOUR` (40) — only applied when the KV binding exists.

KV namespaces (Pages → Settings → Functions):

- `RATE_LIMIT` — per-IP + per-session counters. Failures here fail *open*: a KV
  hiccup must never turn into a 502.
- `MODELS` — the cron Worker writes the fresh free-model list under `active`.
  Resolution order: KV → `OPENROUTER_MODELS` → built-in defaults.

Analytics Engine dataset binding `ANALYTICS` is optional (PII-free telemetry).
The free-model auto-rotation cron lives in `worker-cron/` and deploys separately.
