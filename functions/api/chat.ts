/**
 * Cloudflare Pages Function — the "waiter".
 * Lives at  https://<site>/api/chat  automatically (Pages serves /functions).
 *
 * Holds the OpenRouter key (server-side secret), enforces guardrails + rate
 * limits, then streams the model's answer back to the browser. The model can
 * also emit tool_calls and reasoning, which pass through the SSE stream and are
 * executed/rendered by the browser. When the key is missing or the free quota
 * is exhausted, it returns a `{ fallback: true }` signal so the frontend
 * gracefully drops to the internal deterministic agent.
 */

import { buildSystemPrompt } from './_context';

/** Minimal KV namespace shape (only the methods we use). */
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

/**
 * Minimal Cloudflare Analytics Engine dataset binding. We only ever call
 * `writeDataPoint` and never read back, so this is all we need.
 */
interface AnalyticsEngineDataset {
  writeDataPoint(event: {
    blobs?: (string | null)[];
    doubles?: number[];
    indexes?: string[];
  }): void;
}

interface Env {
  OPENROUTER_API_KEY?: string;
  /** Comma-separated ordered list of models (preferred over defaults). */
  OPENROUTER_MODELS?: string;
  /** Single model (legacy / fallback if OPENROUTER_MODELS unset). */
  OPENROUTER_MODEL?: string;
  // Optional KV binding named RATE_LIMIT for cross-edge rate limiting.
  RATE_LIMIT?: KVNamespace;
  // Optional KV binding named MODELS — the cron Worker writes the fresh free
  // model list here under the `active` key (JSON array of strings).
  MODELS?: KVNamespace;
  // Optional Analytics Engine dataset for PII-free telemetry.
  ANALYTICS?: AnalyticsEngineDataset;
  // Optional rate-limit overrides (strings from env; parsed to ints).
  RATE_LIMIT_IP_PER_MIN?: string;
  RATE_LIMIT_SESSION_PER_MIN?: string;
  RATE_LIMIT_SESSION_PER_HOUR?: string;
}

interface ChatBody {
  query?: string;
  jobText?: string;
  locale?: string;
}

/**
 * Ordered list of free models. OpenRouter routes through them with automatic
 * fallback: if one is down / busy / rate-limited it tries the next. Only when
 * ALL fail does the request error and the frontend drops to the local
 * deterministic agent. Resolution order: KV `MODELS:active` (auto-rotated by
 * the cron Worker) → env OPENROUTER_MODELS → this built-in list. NOTE:
 * OpenRouter caps the fallback list at 3 models, so only the first 3 are used.
 * Free model ids rotate — keep fresh from
 * https://openrouter.ai/models?max_price=0
 */
const DEFAULT_MODELS = [
  'openai/gpt-oss-120b:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
];

const envModels = (env: Env): string[] => {
  const raw = env.OPENROUTER_MODELS || env.OPENROUTER_MODEL || '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

/** Validate a KV payload as a non-empty array of non-empty strings. */
const parseKvModels = (raw: string | null): string[] | null => {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const list = parsed.filter(
      (x): x is string => typeof x === 'string' && x.trim().length > 0,
    );
    return list.length ? list : null;
  } catch {
    return null;
  }
};

/**
 * Resolve the model list: KV (cron-refreshed) → env → defaults. Any KV error
 * silently falls through so today's behavior is always preserved.
 */
const resolveModels = async (env: Env): Promise<string[]> => {
  if (env.MODELS) {
    try {
      const kvList = parseKvModels(await env.MODELS.get('active'));
      if (kvList) return kvList;
    } catch {
      /* KV unavailable — fall through to env/defaults */
    }
  }
  const list = envModels(env);
  return list.length ? list : DEFAULT_MODELS;
};

const MAX_QUERY_CHARS = 1200;
const MAX_JOB_CHARS = 6000;
const MAX_TOKENS = 700;

const intEnv = (raw: string | undefined, fallback: number): number => {
  const n = parseInt(raw ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/** Whitelisted, navigable section ids — also the tool/citation enum. */
const SECTIONS = [
  'profile',
  'about',
  'stack',
  'lowcode',
  'mcp',
  'projects',
  'career',
  'education',
  'learning',
  'ai-usage',
] as const;

/**
 * Tool schema mapping 1:1 to the client's AgentAction. The browser executes
 * the calls (it owns the DOM); the server only declares them.
 */
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'navigate_to_section',
      description:
        'Scroll the visitor to a section of the portfolio when they ask to see/show it.',
      parameters: {
        type: 'object',
        properties: {
          section: { type: 'string', enum: [...SECTIONS] },
        },
        required: ['section'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'download_cv',
      description: "Generate and download Bryan's CV (PDF) in the browser.",
      parameters: {
        type: 'object',
        properties: {
          language: { type: 'string', enum: ['pt', 'en'] },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'open_link',
      description: "Open one of Bryan's contact links in a new tab.",
      parameters: {
        type: 'object',
        properties: {
          target: { type: 'string', enum: ['linkedin', 'github', 'email'] },
        },
        required: ['target'],
      },
    },
  },
];

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/**
 * Reject requests that don't originate from the site itself. Browsers always
 * send `Origin` on a POST (same-origin and cross-origin), so this blocks casual
 * scripted abuse from other origins and no-origin tools (curl without a header).
 * It's a cheap filter, NOT strong auth — Origin can be spoofed by a determined
 * caller. Allows the prod domain, its subdomains, Pages previews, and localhost.
 */
function originAllowed(request: Request): boolean {
  const ref = request.headers.get('Origin') || request.headers.get('Referer') || '';
  if (!ref) return false;
  try {
    const host = new URL(ref).hostname;
    return (
      host === 'blpsoares.dev' ||
      host.endsWith('.blpsoares.dev') ||
      host.endsWith('.pages.dev') ||
      host === 'localhost' ||
      host === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

/** Bump a fixed-window KV counter; returns true if the limit was exceeded. */
async function overLimit(
  kv: KVNamespace,
  key: string,
  limit: number,
  ttlSeconds: number,
): Promise<boolean> {
  const current = parseInt((await kv.get(key)) ?? '0', 10);
  if (current >= limit) return true;
  await kv.put(key, String(current + 1), { expirationTtl: ttlSeconds });
  return false;
}

/**
 * Infer a coarse, PII-free category from the query for telemetry only. Never
 * stored: the raw text. Just one of a fixed set of buckets.
 */
function inferCategory(query: string, hasJob: boolean): string {
  if (hasJob) return 'hire';
  const q = query.toLowerCase();
  if (/hire|contrat|vale a pena|why|por que|diferencial|fit/.test(q)) return 'hire';
  if (/project|projeto|case|portfolio|rag|chatbot/.test(q)) return 'projects';
  if (/\bia\b|\bai\b|llm|mcp|agent|genai|model/.test(q)) return 'ai';
  if (/career|carreira|experien|trajetor|emprego|work|job/.test(q)) return 'career';
  return 'other';
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
  // Pages passes a `waitUntil` for fire-and-forget work; may be absent in the
  // advanced-mode Worker shim, so it's optional and used defensively.
  waitUntil?: (promise: Promise<unknown>) => void;
}): Promise<Response> {
  const { request, env } = context;
  const startedAt = Date.now();

  // Fire-and-forget a PII-free analytics datapoint (never blocks the response).
  const recordTelemetry = (
    category: string,
    model: string,
    locale: string,
    fallbackReason: string | null,
  ): void => {
    if (!env.ANALYTICS) return;
    try {
      env.ANALYTICS.writeDataPoint({
        blobs: [category, model, locale, fallbackReason],
        doubles: [Date.now() - startedAt],
        indexes: [category],
      });
    } catch {
      /* telemetry must never affect the response */
    }
  };

  // Block requests that aren't coming from the site itself.
  if (!originAllowed(request)) {
    return json({ error: 'forbidden' }, 403);
  }

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

  // Rate limiting (only when a KV binding is present). Two independent windows:
  // per-IP (coarse, protects the shared origin) and per-session (fine, stops a
  // single tab from bursting). Distinct sessions behind one IP don't collide
  // until the IP ceiling. All limits are env-tunable.
  if (env.RATE_LIMIT) {
    const ipPerMin = intEnv(env.RATE_LIMIT_IP_PER_MIN, 20);
    const sessPerMin = intEnv(env.RATE_LIMIT_SESSION_PER_MIN, 8);
    const sessPerHour = intEnv(env.RATE_LIMIT_SESSION_PER_HOUR, 40);

    const ip = request.headers.get('CF-Connecting-IP') ?? 'anon';
    const sessionId = (request.headers.get('X-Session-Id') ?? '').slice(0, 64);

    const checks: Promise<boolean>[] = [
      overLimit(env.RATE_LIMIT, `rl:ip:${ip}`, ipPerMin, 60),
    ];
    if (sessionId) {
      checks.push(
        overLimit(env.RATE_LIMIT, `rl:sess:${sessionId}:m`, sessPerMin, 60),
        overLimit(env.RATE_LIMIT, `rl:sess:${sessionId}:h`, sessPerHour, 3600),
      );
    }
    const exceeded = (await Promise.all(checks)).some(Boolean);
    if (exceeded) {
      recordTelemetry(inferCategory(query, !!jobText), 'none', locale ?? 'auto', 'rate_limited');
      return json({ fallback: true, reason: 'rate_limited' }, 429);
    }
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

  const modelList = await resolveModels(env);
  const category = inferCategory(query, !!jobText);

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
        // Multi-model fallback: OpenRouter tries each in order until one
        // responds. Providing `model` (primary) + `models` (full list) is the
        // most compatible form across API versions.
        model: modelList[0],
        // OpenRouter caps the fallback array at 3 models.
        models: modelList.slice(0, 3),
        stream: true,
        temperature: 0.4,
        max_tokens: MAX_TOKENS,
        // Let the MODEL decide and emit tool calls; the browser executes them.
        tools: TOOLS,
        tool_choice: 'auto',
        // Ask reasoning-capable models to stream their thoughts. Models that
        // don't support it ignore the field; the client shows nothing fake.
        reasoning: { effort: 'low' },
        messages,
      }),
    });
  } catch {
    recordTelemetry(category, 'none', locale ?? 'auto', 'network');
    return json({ fallback: true, reason: 'network' }, 502);
  }

  // Free quota exhausted / rate-limited upstream / any error → fallback.
  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    console.error('OpenRouter error', upstream.status, detail.slice(0, 600));
    const reason = upstream.status === 429 ? 'quota' : 'upstream';
    recordTelemetry(category, 'none', locale ?? 'auto', reason);
    return json(
      { fallback: true, reason, status: upstream.status, detail: detail.slice(0, 400) },
      upstream.status === 429 ? 429 : 502,
    );
  }

  // A successful stream is one datapoint. We don't know the exact answering
  // model here without inspecting the stream, so report the primary candidate.
  // Latency captured is time-to-headers (close enough; never logs PII).
  const telemetry = () =>
    recordTelemetry(category, modelList[0] ?? 'unknown', locale ?? 'auto', null);
  if (context.waitUntil) context.waitUntil(Promise.resolve().then(telemetry));
  else telemetry();

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
