/**
 * WebLLM — the local models that power bra.ia.
 *
 * Runs a quantized LLM entirely in the visitor's browser via WebGPU. Zero cost,
 * zero tokens leaving the device, no rate limit. The engine lives in a Web
 * Worker (see `llmWorker.ts`) so neither the download nor inference ever blocks
 * the UI.
 *
 * Which model gets downloaded is decided per device (see `pickTier`): a machine
 * with a discrete GPU on fiber gets the 3B, a modest laptop gets the 1.5B, and
 * anything weaker is never offered the feature at all.
 *
 * This is now the ONLY LLM in the product — there is no cloud fallback. When a
 * device can't run it (no WebGPU, mobile, declined), the deterministic rule
 * engine in `engine.ts` answers instead, so the chat is never dead.
 */
import type { MLCEngineInterface } from '@mlc-ai/web-llm';
import { notify, untag } from './notifications';

/** A downloadable model option, ordered strongest first. */
export interface LocalModelTier {
  id: string;
  /** Short name for the UI / source badge. */
  label: string;
  /** Emblem key used by `ModelLogo`. */
  brand: 'meta' | 'alibaba' | 'hf';
  /** Lab that published the model, shown under the name. */
  lab: string;
  /** Approximate transfer size in MB — what the visitor actually pays. */
  downloadMB: number;
  /** Resident VRAM per WebLLM's own `vram_required_MB`. */
  vramMB: number;
  /** Minimum estimated GPU budget (MB) before we'll pick this tier. */
  minGpuMB: number;
  /** Minimum `navigator.deviceMemory` (GB) before we'll pick this tier. */
  minRamGB: number;
  /** Minimum *measured* throughput (Mbps) before we'll pick this tier. */
  minMbps: number;
}

/**
 * Ordered strongest → weakest. `vramMB` values come straight from WebLLM's
 * `prebuiltAppConfig.model_list`, so the VRAM check is exact even though the
 * GPU budget it's compared against is an estimate.
 */
export const LOCAL_MODEL_TIERS: LocalModelTier[] = [
  {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    label: 'Llama 3.2 3B',
    brand: 'meta',
    lab: 'Meta',
    downloadMB: 1750,
    vramMB: 2264,
    // 2048 is Chrome's ceiling for maxBufferSize (see probeGpuBudgetMB) — a
    // discrete card and a strong iGPU both saturate it, so RAM and measured
    // bandwidth are what actually separate this tier from the next.
    minGpuMB: 2048,
    minRamGB: 8,
    minMbps: 15,
  },
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    label: 'Qwen2.5 1.5B',
    brand: 'alibaba',
    lab: 'Alibaba',
    downloadMB: 950,
    vramMB: 1630,
    minGpuMB: 1024,
    minRamGB: 8,
    minMbps: 5,
  },
  {
    id: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
    label: 'SmolLM2 360M',
    brand: 'hf',
    lab: 'Hugging Face',
    downloadMB: 300,
    vramMB: 376,
    minGpuMB: 256,
    minRamGB: 4,
    minMbps: 0,
  },
];

export type LocalStatus =
  | 'unsupported' // no WebGPU / device can't handle it
  | 'idle' // supported, not started (waiting for consent or trigger)
  | 'loading' // weights streaming in
  | 'ready' // loaded and answering
  | 'error';

export interface LocalProgress {
  status: LocalStatus;
  /** 0..1 — only meaningful while `loading`. */
  progress: number;
  /** Raw progress text from WebLLM (e.g. "Fetching param cache[12/38]"). */
  text: string;
  /** True when the weights were already in the Cache API (silent fast path). */
  fromCache: boolean;
  /** Which model this device settled on. Null until resolved. */
  tier: LocalModelTier | null;
  /** Rough download time in seconds from the measured throughput, when known. */
  etaSeconds: number | null;
}

type Listener = (p: LocalProgress) => void;

const listeners = new Set<Listener>();

let state: LocalProgress = {
  status: 'idle',
  progress: 0,
  text: '',
  fromCache: false,
  tier: null,
  etaSeconds: null,
};

let enginePromise: Promise<MLCEngineInterface> | null = null;
let engine: MLCEngineInterface | null = null;
/**
 * True when the visitor picked a model by hand in the settings modal.
 *
 * Gates the "reuse whatever is already cached" shortcut below: saving a
 * download is a kindness when WE chose the model, and a bug when the visitor
 * did. Clicking Download on SmolLM2 must download SmolLM2, not quietly load the
 * Llama that happened to be cached.
 */
let explicitChoice = false;

/** Shared tag so download progress collapses into a single updating row. */
const PROGRESS_TAG = 'local-model-progress';

const CONSENT_KEY = 'braia.local.consent';
const READY_KEY = 'braia.local.ready';
const MODEL_KEY = 'braia.local.model';

function emit(patch: Partial<LocalProgress>): void {
  state = { ...state, ...patch };
  listeners.forEach((l) => l(state));
}

/**
 * Trace the boot sequence. Loading a local model touches WebGPU, Cache Storage,
 * a Web Worker and a multi-GB download — when it stalls, "nothing happened" is
 * the worst possible diagnostic, so every stage announces itself.
 */
const log = (stage: string, detail?: unknown): void => {
  if (detail === undefined) console.info(`[braia:local] ${stage}`);
  else console.info(`[braia:local] ${stage}`, detail);
};

export function onLocalProgress(cb: Listener): () => void {
  listeners.add(cb);
  cb(state);
  return () => listeners.delete(cb);
}

export const getLocalState = (): LocalProgress => state;
export const getLocalEngine = (): MLCEngineInterface | null =>
  state.status === 'ready' ? engine : null;
/** The tier actually in use (or about to be), for the source badge. */
export const getLocalTier = (): LocalModelTier | null => state.tier;

const ls = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode — degrade to per-session behavior */
    }
  },
};

/** The visitor already accepted the download at least once. */
export const hasConsent = (): boolean => ls.get(CONSENT_KEY) === '1';
export const grantConsent = (): void => ls.set(CONSENT_KEY, '1');
export const declineConsent = (): void => ls.set(CONSENT_KEY, '0');
/** Explicitly refused — never ask again on this device. */
export const hasDeclined = (): boolean => ls.get(CONSENT_KEY) === '0';
/** A previous visit finished loading, so the weights are very likely cached. */
export const loadedBefore = (): boolean => ls.get(READY_KEY) === '1';

/**
 * Console handle for inspecting and resetting the local model.
 *
 * `window.__braia.purge()` then reload = a real first visit again, which is the
 * only way to re-measure download time once the weights are cached.
 */
if (typeof window !== 'undefined') {
  (window as Window & { __braia?: unknown }).__braia = {
    state: getLocalState,
    tiers: () => LOCAL_MODEL_TIERS,
    probe: () => probeDevice(),
    purge: () => purgeLocalModel(),
  };
}

const tierById = (id: string | null): LocalModelTier | null =>
  LOCAL_MODEL_TIERS.find((t) => t.id === id) ?? null;

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
}

const netInfo = (): NetworkInformation | undefined =>
  (navigator as Navigator & { connection?: NetworkInformation }).connection;

/** Everything we can learn about the device without asking permission. */
export interface DeviceProfile {
  /** Estimated usable GPU budget in MB. See `probeGpuBudgetMB` for caveats. */
  gpuMB: number | null;
  /** `navigator.deviceMemory` — coarse by design (privacy), often capped at 8. */
  ramGB: number | null;
  /** Throughput in Mbps, measured from bytes this page actually transferred. */
  mbps: number | null;
  saveData: boolean;
}

/**
 * Measure real download throughput — for free.
 *
 * `navigator.connection.downlink` is a poor guide: Chrome rounds it, caps it at
 * 10 Mbps and reports a moving average that is often stale at page load (this
 * machine reported 1.45 Mbps on a connection doing far better). Instead we read
 * the Resource Timing entries for assets the page ALREADY downloaded and divide
 * real bytes by real time. Costs nothing extra and reflects the actual link.
 */
function measureMbps(): number | null {
  try {
    const samples = performance
      .getEntriesByType('resource')
      .filter((r): r is PerformanceResourceTiming => 'transferSize' in r)
      // Skip cache hits (transferSize 0) and tiny files, where per-request
      // overhead dominates and would badly understate the link.
      .filter((r) => r.transferSize > 40_000 && r.duration > 5);

    if (samples.length === 0) return null;
    const bytes = samples.reduce((a, r) => a + r.transferSize, 0);
    const ms = samples.reduce((a, r) => a + r.duration, 0);
    if (ms <= 0) return null;
    return (bytes * 8) / (ms / 1000) / 1e6;
  } catch {
    return null;
  }
}

/**
 * Estimate the GPU budget.
 *
 * WebGPU deliberately does NOT expose real VRAM (it's a fingerprinting vector),
 * so there is no honest way to read "this card has 8 GB". What adapters DO
 * report are their supported *limits*, and those separate a weak adapter (spec
 * minimum, 128–256 MB) from a capable one.
 *
 * IMPORTANT CEILING: Chrome clamps `maxBufferSize` at 2048 MB, so an RTX 4090
 * and a decent integrated GPU report the identical number. This value is a
 * usable FLOOR ("is this adapter capable at all?") but says nothing about the
 * top end — which is why the strongest tier leans on RAM and measured
 * bandwidth rather than on this figure.
 */
async function probeGpuBudgetMB(): Promise<number | null> {
  // Minimal structural types — the project doesn't depend on @webgpu/types, and
  // these two limits are all we read.
  interface MinimalAdapter {
    limits: { maxBufferSize?: number; maxStorageBufferBindingSize?: number };
  }
  interface MinimalGpu {
    requestAdapter(): Promise<MinimalAdapter | null>;
  }

  try {
    const gpu = (navigator as Navigator & { gpu?: MinimalGpu }).gpu;
    if (!gpu) return null;
    const adapter = await gpu.requestAdapter();
    if (!adapter) return null;
    const { maxBufferSize, maxStorageBufferBindingSize } = adapter.limits;
    const bytes = Math.min(Number(maxBufferSize), Number(maxStorageBufferBindingSize));
    if (!Number.isFinite(bytes) || bytes <= 0) return null;
    return Math.round(bytes / (1024 * 1024));
  } catch {
    return null;
  }
}

/** Collect the device profile. Never throws; unknown signals come back null. */
export async function probeDevice(): Promise<DeviceProfile> {
  const conn = netInfo();
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  // Measured throughput first; fall back to the browser's own (worse) estimate.
  const measured = measureMbps();
  return {
    gpuMB: await probeGpuBudgetMB(),
    ramGB: typeof mem === 'number' ? mem : null,
    mbps: measured ?? (typeof conn?.downlink === 'number' ? conn.downlink : null),
    saveData: !!conn?.saveData,
  };
}

/**
 * Pick the best tier this device can comfortably carry.
 *
 * Unknown signals are treated as "meets the bar" rather than disqualifying —
 * `deviceMemory` is absent in Firefox/Safari and `downlink` is often missing or
 * still warming up at page load, and we'd rather occasionally over-serve a good
 * machine than permanently under-serve every non-Chrome visitor.
 */
const meets = (value: number | null, min: number) => value === null || value >= min;

/**
 * The best model this machine can actually RUN — hardware only.
 *
 * Bandwidth is deliberately excluded. It says how long a download takes, not
 * how well the model performs once resident, and the measurement is noisy
 * enough that folding it in made the "recommended" badge jump between visits on
 * the very same machine. What the hardware can carry doesn't change like that.
 */
export function recommendedTier(profile: DeviceProfile): LocalModelTier {
  return (
    LOCAL_MODEL_TIERS.find(
      (t) => meets(profile.gpuMB, t.minGpuMB) && meets(profile.ramGB, t.minRamGB),
    ) ?? LOCAL_MODEL_TIERS[LOCAL_MODEL_TIERS.length - 1]
  );
}

/**
 * What to download automatically — hardware AND bandwidth.
 *
 * Stricter than `recommendedTier` on purpose: an unattended download has to be
 * cautious about making someone wait, whereas a visitor clicking a model in the
 * settings menu has seen the size and the ETA and chosen anyway.
 */
export function pickTier(profile: DeviceProfile): LocalModelTier {
  return (
    LOCAL_MODEL_TIERS.find(
      (t) =>
        meets(profile.gpuMB, t.minGpuMB) &&
        meets(profile.ramGB, t.minRamGB) &&
        meets(profile.mbps, t.minMbps),
    ) ?? LOCAL_MODEL_TIERS[LOCAL_MODEL_TIERS.length - 1]
  );
}

/** Rough seconds to download `mb` at the currently observed downlink. */
export function estimateSeconds(mb: number, mbps: number | null): number | null {
  if (!mbps || mbps <= 0) return null;
  // The measurement already reflects real transfer, so only a small haircut for
  // the sustained multi-GB case (connection warm-up, CDN variance).
  return Math.round((mb * 8) / (mbps * 0.85));
}

/**
 * Resolve which model this device will use, and remember it.
 *
 * Stickiness matters more than optimality here: once a visitor has paid for a
 * download, re-picking a bigger tier on their next visit would throw those
 * megabytes away and charge them again. So a previously chosen tier always
 * wins, and capability is only consulted the first time.
 */
export async function resolveTier(): Promise<{ tier: LocalModelTier; profile: DeviceProfile }> {
  const profile = await probeDevice();
  const remembered = tierById(ls.get(MODEL_KEY));
  // NOTE: the choice is deliberately NOT persisted here. Throughput is measured
  // from the handful of assets loaded so far, and an unlucky early reading can
  // land a whole tier too low. Locking that in at offer time would condemn a
  // strong machine to the weakest model forever. We only commit the choice once
  // bytes are actually being spent (see `startLocalEngine`), which is the only
  // moment stickiness has anything to protect.
  return { tier: remembered ?? pickTier(profile), profile };
}

/** Which tiers already have their weights in the browser cache. */
export async function cachedTierIds(): Promise<string[]> {
  try {
    const webllm = await import('@mlc-ai/web-llm');
    const results = await Promise.all(
      LOCAL_MODEL_TIERS.map(async (t) => ((await webllm.hasModelInCache(t.id)) ? t.id : null)),
    );
    return results.filter((id): id is string => id !== null);
  } catch {
    return [];
  }
}

/**
 * Remove ONE model's weights from the browser, freeing its disk.
 *
 * Distinct from `disableLocal`, which switches the whole feature off: here the
 * visitor is just reclaiming space from a model they no longer want, and may
 * well keep using another one.
 */
export async function uninstallTier(id: string): Promise<void> {
  const tier = tierById(id);
  if (!tier) return;

  const webllm = await import('@mlc-ai/web-llm');
  try {
    await webllm.deleteModelAllInfoInCache(id);
  } catch {
    /* wasn't cached — nothing to free */
  }

  // Uninstalling the model currently loaded has to tear the engine down too,
  // otherwise it keeps answering from memory with no weights left on disk.
  if (state.tier?.id === id) {
    enginePromise = null;
    engine = null;
    if (ls.get(MODEL_KEY) === id) {
      try {
        localStorage.removeItem(MODEL_KEY);
        localStorage.removeItem(READY_KEY);
      } catch {
        /* ignore */
      }
    }
    emit({ status: 'idle', progress: 0, text: '', fromCache: false, tier: null, etaSeconds: null });
  }

  notify({
    kind: 'info',
    title: `${tier.label} desinstalado`,
    detail: `~${tier.downloadMB} MB liberados no navegador.`,
  });
}

/**
 * Override the automatic pick with an explicit choice from the settings menu.
 *
 * Writes the same key the automatic flow uses, so the preference survives
 * reloads and `resolveTier` honors it over any capability-based guess.
 */
export function setPreferredTier(id: string): void {
  if (!LOCAL_MODEL_TIERS.some((t) => t.id === id)) return;
  explicitChoice = true;
  ls.set(MODEL_KEY, id);
  ls.set(CONSENT_KEY, '1');
  enginePromise = null;
  engine = null;
  emit({ status: 'idle', progress: 0, text: '', fromCache: false, tier: tierById(id) });
}

/** Uninstall every local model and switch the feature off. */
export async function disableLocal(): Promise<void> {
  await purgeLocalModel();
  ls.set(CONSENT_KEY, '0');
  notify({ kind: 'info', title: 'Modelo local desativado', detail: 'O chat volta a responder por regras.' });
}

/**
 * Cheap synchronous pre-gate: should this device be offered the feature at all?
 *
 * Deliberately conservative — pulling ~1 GB on someone's mobile data plan is
 * the kind of thing that burns trust, so we require a desktop-class device on
 * an unmetered connection with real WebGPU support. The finer question of
 * WHICH model is answered later by `resolveTier`, which needs async probes.
 */
export function isLocalSupported(): boolean {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false;
  // WebGPU is non-negotiable.
  if (!('gpu' in navigator)) return false;
  // Touch-first / small screens: the download and the VRAM budget aren't worth it.
  if (window.matchMedia('(pointer: coarse)').matches) return false;
  if (window.innerWidth < 900) return false;
  // Respect Data Saver and slow connections.
  const conn = netInfo();
  if (conn?.saveData) return false;
  if (conn?.effectiveType && !/4g/.test(conn.effectiveType)) return false;
  return true;
}

/**
 * Ask the browser to make our storage durable BEFORE spending a multi-GB
 * download on it.
 *
 * Cache Storage is best-effort by default: Chrome may evict it whenever the
 * disk gets tight, which would silently throw away weights the visitor waited
 * minutes for and make the site look like it re-downloads on every visit.
 * `persist()` opts into the durable bucket. It can be refused (it's the
 * browser's call, based on engagement), so this is an improvement in odds, not
 * a guarantee — hence best-effort and never blocking.
 */
async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

/** How much disk the cached models currently occupy, in MB. */
export async function storageUsedMB(): Promise<number | null> {
  try {
    const est = await navigator.storage?.estimate?.();
    if (!est || typeof est.usage !== 'number') return null;
    return Math.round(est.usage / (1024 * 1024));
  } catch {
    return null;
  }
}

export const isStoragePersisted = async (): Promise<boolean> => {
  try {
    return (await navigator.storage?.persisted?.()) ?? false;
  } catch {
    return false;
  }
};

/** Enough free storage to persist the weights? Best-effort, never blocks. */
async function hasStorageRoom(mb: number): Promise<boolean> {
  try {
    const est = await navigator.storage?.estimate?.();
    if (!est || typeof est.quota !== 'number') return true;
    const free = est.quota - (est.usage ?? 0);
    return free > mb * 1.5 * 1024 * 1024;
  } catch {
    return true;
  }
}

/**
 * Prepare the tier + ETA and publish them, so the consent card can show a real
 * size and a real time estimate before anything is downloaded. Safe to call
 * repeatedly; it never starts the engine.
 */
export async function prepareLocalTier(): Promise<LocalModelTier> {
  const { tier, profile } = await resolveTier();
  emit({ tier, etaSeconds: estimateSeconds(tier.downloadMB, profile.mbps) });
  return tier;
}

/**
 * Boot the local engine. Idempotent — concurrent callers share one promise.
 * Resolves only when the model can actually answer; rejects silently otherwise
 * (the caller just falls back to the deterministic engine).
 */
/**
 * Wipe every trace of the local model: cached weights, consent, chosen model.
 *
 * Exists because the download is a one-time event that then becomes impossible
 * to observe again — you cannot re-measure a 1.8 GB first-visit download when
 * the weights are already in the Cache API. Reloading after this reproduces a
 * genuine first visit.
 */
export async function purgeLocalModel(): Promise<void> {
  const webllm = await import('@mlc-ai/web-llm');
  for (const tier of LOCAL_MODEL_TIERS) {
    try {
      await webllm.deleteModelAllInfoInCache(tier.id);
    } catch {
      /* not cached — nothing to remove */
    }
  }
  for (const key of [CONSENT_KEY, READY_KEY, MODEL_KEY]) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
  enginePromise = null;
  engine = null;
  emit({ status: 'idle', progress: 0, text: '', fromCache: false, tier: null, etaSeconds: null });
  notify({
    kind: 'info',
    title: 'Modelo local apagado',
    detail: 'Recarregue a página para reproduzir uma primeira visita.',
  });
  log('purged — reload for a clean first-visit run');
}

/**
 * Discard a failed boot so the next `startLocalEngine` genuinely retries.
 * Without this the rejected promise is cached and every retry re-fails instantly.
 */
export function resetLocalEngine(): void {
  enginePromise = null;
  engine = null;
  emit({ status: 'idle', progress: 0, text: '', fromCache: false });
}

export function startLocalEngine(): Promise<MLCEngineInterface> {
  if (enginePromise) return enginePromise;

  enginePromise = (async () => {
    log('start');
    if (!isLocalSupported()) {
      log('aborted: device not supported');
      notify({
        kind: 'error',
        title: 'Este dispositivo não roda o modelo local',
        detail: 'Sem WebGPU, tela pequena ou economia de dados ativa.',
      });
      emit({ status: 'unsupported' });
      throw new Error('local_unsupported');
    }

    const { tier, profile } = await resolveTier();
    log('tier resolved', { model: tier.label, profile });
    notify({
      kind: 'info',
      title: `Modelo escolhido: ${tier.label}`,
      detail: [
        `${tier.downloadMB} MB`,
        profile.gpuMB ? `GPU ~${profile.gpuMB} MB` : null,
        profile.ramGB ? `RAM ${profile.ramGB} GB` : null,
        profile.mbps ? `${profile.mbps.toFixed(1)} Mbps medidos` : 'banda desconhecida',
      ]
        .filter(Boolean)
        .join(' · '),
    });
    emit({ tier, etaSeconds: estimateSeconds(tier.downloadMB, profile.mbps) });

    if (!(await hasStorageRoom(tier.downloadMB))) {
      log('aborted: not enough storage', { neededMB: tier.downloadMB * 1.5 });
      notify({
        kind: 'error',
        title: 'Espaço insuficiente no navegador',
        detail: `${tier.label} precisa de ~${Math.round(tier.downloadMB * 1.5)} MB livres.`,
      });
      emit({ status: 'unsupported' });
      throw new Error('local_no_storage');
    }

    const webllm = await import('@mlc-ai/web-llm');
    log('web-llm loaded');

    // Stickiness, part two: if ANY tier's weights are already cached, use them
    // rather than spending a fresh download on a nominally better model. Skipped
    // entirely for an explicit pick, where substituting the model would ignore
    // what the visitor just asked for.
    let chosen = tier;
    let cached = false;
    try {
      if (await webllm.hasModelInCache(tier.id)) {
        cached = true;
      } else if (!explicitChoice) {
        for (const candidate of LOCAL_MODEL_TIERS) {
          if (candidate.id !== tier.id && (await webllm.hasModelInCache(candidate.id))) {
            chosen = candidate;
            cached = true;
            break;
          }
        }
      }
    } catch {
      cached = !explicitChoice && loadedBefore();
    }
    // The preference is honored once; later automatic boots go back to the
    // cache-first shortcut.
    explicitChoice = false;

    if (chosen.id !== tier.id) emit({ tier: chosen });
    // Commit the choice NOW — from here on real bytes are spent, so every later
    // visit must reuse this exact model rather than re-downloading a different
    // one on a luckier (or unluckier) bandwidth reading.
    ls.set(MODEL_KEY, chosen.id);

    // Retried on every boot, not just before a download: Chrome decides this by
    // site-engagement heuristics, so a request refused on a first visit is
    // often granted once the visitor comes back.
    log('persistent storage', await requestPersistentStorage());

    log('loading', { model: chosen.label, cached });
    notify({
      kind: 'progress',
      tag: PROGRESS_TAG,
      title: cached ? `Carregando ${chosen.label} do cache…` : `Baixando ${chosen.label}…`,
      detail: cached ? 'Pesos já estavam no navegador' : `${chosen.downloadMB} MB`,
    });
    const startedAt = Date.now();
    emit({ status: 'loading', progress: cached ? 0.85 : 0, fromCache: cached, text: '' });

    let lastNotifiedPct = -1;
    const worker = new Worker(new URL('./llmWorker.ts', import.meta.url), {
      type: 'module',
    });
    // A worker that dies mid-load leaves the engine promise pending forever, so
    // the failure has to be turned into a rejection explicitly.
    const workerDied = new Promise<never>((_, reject) => {
      worker.onerror = (e) => reject(new Error(`worker crashed: ${e.message || 'unknown'}`));
    });

    try {
      engine = await Promise.race([
        webllm.CreateWebWorkerMLCEngine(worker, chosen.id, {
          initProgressCallback: (report) => {
            const pct = Math.round(report.progress * 100);
            // Tagged, so this rewrites one row instead of flooding the log.
            if (pct !== lastNotifiedPct) {
              lastNotifiedPct = pct;
              notify({
                kind: 'progress',
                tag: PROGRESS_TAG,
                title: cached ? `Carregando ${chosen.label}… ${pct}%` : `Baixando ${chosen.label}… ${pct}%`,
                detail: report.text,
              });
            }
            emit({
              status: 'loading',
              // WebLLM's `progress` is already 0..1 across fetch + GPU upload.
              progress: cached ? Math.max(0.85, report.progress) : report.progress,
              text: report.text,
            });
          },
        }),
        workerDied,
      ]);
    } catch (err) {
      log('failed', err);
      untag(PROGRESS_TAG);
      notify({
        kind: 'error',
        title: `Falha ao carregar ${chosen.label}`,
        detail: String(err).slice(0, 160),
      });
      worker.terminate();
      emit({ status: 'error', text: String(err) });
      throw err;
    }

    log('ready', chosen.label);
    untag(PROGRESS_TAG);
    notify({
      kind: 'success',
      title: `${chosen.label} pronto, rodando 100% local`,
      detail: `${cached ? 'Carregado do cache' : 'Baixado'} em ${((Date.now() - startedAt) / 1000).toFixed(1)}s`,
    });
    ls.set(READY_KEY, '1');
    emit({ status: 'ready', progress: 1, text: '' });
    return engine;
  })();

  // Never leave an unhandled rejection floating; callers handle their own copy.
  enginePromise.catch(() => {
    enginePromise = null;
  });

  return enginePromise;
}
