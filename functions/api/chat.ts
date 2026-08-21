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
import { isChatModel } from './_models-util';

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
 * Ordered list of free model candidates, tried one at a time until one streams.
 *
 * These ids rot fast: a model that lists as free in the catalog can still
 * answer 404 "unavailable for free" or 429 "rate-limited upstream" at inference
 * time, and which ones do changes through the day. The durable fix is the cron
 * Worker in `worker-cron/`, which rotates this list into KV — these values are
 * only the floor for when KV is empty or unbound.
 *
 * Resolution order: KV `MODELS:active` → env OPENROUTER_MODELS → this list.
 * Refresh from https://openrouter.ai/models?max_price=0
 */
const DEFAULT_MODELS = [
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'cohere/north-mini-code:free',
  // OpenRouter's own free router: it picks whatever is actually up right now,
  // so it is the candidate least likely to rot when the ids above go stale.
  'openrouter/free',
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
    const list = parsed
      .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
      // Re-validate on READ, not just on write. KV holds whatever the cron put
      // there, and a cron that once wrote a music model keeps serving it until
      // the next successful run. Checking here means a bad list is survivable
      // immediately instead of after the next rotation.
      .filter((id) => isChatModel({ id }));
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
      // A single survivor means the stored list has rotted: free ids disappear
      // from the catalog, and the modality filter strips whatever non-chat
      // models an older cron run wrote. One model is also zero fallback, so
      // prefer the curated defaults over limping on the remains.
      if (kvList && kvList.length >= 2) return kvList;
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
/** Give up on the upstream model before Cloudflare gives up on us. */
const UPSTREAM_TIMEOUT_MS = 20000;

const intEnv = (raw: string | undefined, fallback: number): number => {
  const n = parseInt(raw ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/**
 * Whitelisted, navigable section ids — also the tool/citation enum.
 *
 * MUST stay in sync with `src/agent/sections.ts`. Pages Functions are bundled
 * separately from the app and cannot import from `src/`, so this is a
 * deliberate duplicate rather than a shared module.
 */
const SECTIONS = [
  'profile',
  'about',
  'stack',
  'projects',
  'career',
  'education',
  'articles',
  'open-source',
  'ai-usage',
  'contact',
] as const;

/** Standalone pages the agent may open. Mirrors PAGE_ROUTES in sections.ts. */
const PAGES = ['home', 'articles', 'open-source'] as const;

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
        'Scroll the visitor to a section of the portfolio when they ask to see or be shown something that lives there. Call it at most once per answer, and only when the visitor actually asked to go somewhere.',
      parameters: {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            enum: [...SECTIONS],
            description:
              'profile = hero/intro. about = who he is, his positioning. stack = the technical arsenal (agents, MCP, RAG, backend & data, infra & automation, and his PDD/SDD methodologies). projects = delivered work with outcomes. career = job history. education = degrees. articles = his written pieces. open-source = Agentistics, PDD, Embark, learning. ai-usage = his philosophy on working with AI. contact = email, LinkedIn, GitHub, CV download.',
          },
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
      name: 'open_page',
      description:
        'Open one of the standalone pages of the site (the full articles list, the full open-source project list, or back to the home page).',
      parameters: {
        type: 'object',
        properties: {
          page: { type: 'string', enum: [...PAGES] },
        },
        required: ['page'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'set_theme',
      description:
        'Switch the site between dark and light appearance. Use it when the visitor asks for dark mode, light mode, or says the page is hard to read.',
      parameters: {
        type: 'object',
        properties: {
          theme: { type: 'string', enum: ['dark', 'light'] },
        },
        required: ['theme'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'set_language',
      description:
        'Switch the whole site between Portuguese and English. Use it when the visitor writes in the other language or asks to change it.',
      parameters: {
        type: 'object',
        properties: {
          language: { type: 'string', enum: ['pt', 'en'] },
        },
        required: ['language'],
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
  // A KV hiccup must never become a 502: rate limiting is a guard rail, and
  // failing open keeps the chat answering while still protecting the common case.
  try {
    const current = parseInt((await kv.get(key)) ?? '0', 10);
    if (current >= limit) return true;
    await kv.put(key, String(current + 1), { expirationTtl: ttlSeconds });
    return false;
  } catch {
    return false;
  }
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

export async function onRequestPost(ctx: {
  request: Request;
  env: Env;
  waitUntil?: (promise: Promise<unknown>) => void;
}): Promise<Response> {
  // Any unhandled throw in here surfaces as Cloudflare's own opaque 502
  // (`content-type: text/plain`), which tells the visitor nothing and the
  // frontend even less. Wrapping the handler guarantees the client always gets
  // the `{ fallback: true, reason }` contract it knows how to degrade from.
  try {
    return await handleChat(ctx);
  } catch (err) {
    console.error('chat handler crashed', err);
    return json({ fallback: true, reason: 'crash' }, 502);
  }
}

async function handleChat(context: {
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

  const rawQuery = (body.query ?? '').toString().trim();
  // Truncating meant the model answered half a question and the visitor never
  // knew why the reply missed the point. Refuse, and let the client say so.
  if (rawQuery.length > MAX_QUERY_CHARS) {
    return json({ error: 'query_too_long', limit: MAX_QUERY_CHARS }, 413);
  }
  const query = rawQuery;
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

  /**
   * Try each candidate in turn until one actually streams.
   *
   * OpenRouter's own `models` fallback array does not cover this: a free model
   * that answers 429 "temporarily rate-limited upstream" comes straight back as
   * the response instead of rolling over to the next candidate. Since free-tier
   * availability flaps minute to minute, a single bad draw was taking the whole
   * cloud brain down and dropping every visitor onto the rule engine — which is
   * the "Local · determinístico" badge showing up on questions that deserved a
   * real answer.
   */
  const attempt = async (
    model: string,
  ): Promise<{ res: Response } | { failure: string; status: number }> => {
    // A slow or queued model must degrade, not kill the Worker. Without this
    // the request hangs until Cloudflare returns its own opaque 502.
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), UPSTREAM_TIMEOUT_MS);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        signal: abort.signal,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://blpsoares.dev',
          'X-Title': 'blpsoares.dev portfolio assistant',
        },
        body: JSON.stringify({
          model,
          stream: true,
          temperature: 0.4,
          max_tokens: MAX_TOKENS,
          // Let the MODEL decide and emit tool calls; the browser executes them.
          tools: TOOLS,
          tool_choice: 'auto',
          messages,
        }),
      });
      clearTimeout(timer);
      if (res.ok && res.body) return { res };
      const detail = await res.text().catch(() => '');
      console.error('OpenRouter rejected', model, res.status, detail.slice(0, 300));
      return { failure: res.status === 429 ? 'quota' : 'upstream', status: res.status };
    } catch (err) {
      clearTimeout(timer);
      const timedOut = (err as Error)?.name === 'AbortError';
      return { failure: timedOut ? 'timeout' : 'network', status: 0 };
    }
  };

  let upstream: Response | null = null;
  let answering = '';
  let lastFailure = 'upstream';
  let lastStatus = 502;

  for (const model of modelList) {
    const out = await attempt(model);
    if ('res' in out) {
      upstream = out.res;
      answering = model;
      break;
    }
    lastFailure = out.failure;
    lastStatus = out.status || 502;
  }

  if (!upstream) {
    recordTelemetry(category, 'none', locale ?? 'auto', lastFailure);
    return json(
      { fallback: true, reason: lastFailure, status: lastStatus },
      lastStatus === 429 ? 429 : 502,
    );
  }

  // Latency captured is time-to-headers (close enough; never logs PII).
  const telemetry = () => recordTelemetry(category, answering, locale ?? 'auto', null);
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
