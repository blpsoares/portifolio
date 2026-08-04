import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Check,
  HardDriveDownload,
  HardDrive,
  Zap,
  Trash2,
  X,
  Loader2,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { useI18n } from '../i18n';
import ModelLogo from './ui/ModelLogo';
import {
  LOCAL_MODEL_TIERS,
  cachedTierIds,
  disableLocal,
  estimateSeconds,
  hasDeclined,
  isLocalSupported,
  isStoragePersisted,
  onLocalProgress,
  probeDevice,
  recommendedTier,
  setPreferredTier,
  startLocalEngine,
  storageUsedMB,
  uninstallTier,
  type DeviceProfile,
  type LocalModelTier,
  type LocalProgress,
} from '../agent/localEngine';

/**
 * Settings for bra.ia's local models.
 *
 * A centered modal rather than a dropdown: three model cards with their
 * tradeoffs plus a storage summary is more content than a menu anchored to a
 * navbar icon can hold without an awkward inner scrollbar. The modal has room
 * to lay the options out side by side, so everything is comparable at a glance.
 */

/** Format a size the way a person reads it. */
const size = (mb: number) => (mb >= 1000 ? `${(mb / 1000).toFixed(1)} GB` : `${mb} MB`);

/** Format an ETA, or null when throughput is unknown. */
function eta(seconds: number | null): string | null {
  if (seconds === null) return null;
  if (seconds < 90) return `~${seconds}s`;
  return `~${Math.round(seconds / 60)} min`;
}

/** Outlined destructive action: red border, red text, no fill. */
const DANGER =
  'inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold bg-transparent border border-red-500/70 text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:border-red-500 disabled:opacity-40 transition-colors';

const BraiaSettings: React.FC = () => {
  const { t } = useI18n();
  const c = t.agent.local.settings;

  const [open, setOpen] = useState(false);
  const [state, setState] = useState<LocalProgress | null>(null);
  const [profile, setProfile] = useState<DeviceProfile | null>(null);
  const [cached, setCached] = useState<string[]>([]);
  const [off, setOff] = useState(false);
  const [diskMB, setDiskMB] = useState<number | null>(null);
  const [persisted, setPersisted] = useState(false);
  // Id of the model awaiting a delete confirmation. Erasing weights someone
  // waited minutes to download should never be one stray click away.
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => onLocalProgress(setState), []);

  const refresh = useCallback(() => {
    void probeDevice().then(setProfile);
    void cachedTierIds().then(setCached);
    void storageUsedMB().then(setDiskMB);
    void isStoragePersisted().then(setPersisted);
    setOff(hasDeclined());
  }, []);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  // Lock the page behind the modal and wire Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!isLocalSupported()) return null;

  // Hardware-based: what this machine can actually run well. Bandwidth only
  // affects the ETA shown on each card, never the badge.
  const recommended = profile ? recommendedTier(profile) : null;
  const activeId = state?.tier?.id ?? null;
  const busy = state?.status === 'loading';

  const choose = (tier: LocalModelTier) => {
    setPreferredTier(tier.id);
    setOff(false);
    void startLocalEngine().catch(() => {
      /* surfaced through the notification centre */
    });
  };

  const remove = (id: string) => {
    setConfirming(null);
    void uninstallTier(id).then(refresh);
  };

  const modal = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={c.title}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-3xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl glass border border-slate-200/80 dark:border-slate-700/60 shadow-2xl shadow-slate-900/30 dark:shadow-black/50"
          >
            <div className="flex items-start gap-4 px-6 pt-6 pb-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{c.title}</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {c.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.agent.close}
                className="ml-auto shrink-0 p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cards side by side: no inner scrollbar, everything comparable at once. */}
            <div className="px-6 grid gap-3 sm:grid-cols-3">
              {LOCAL_MODEL_TIERS.map((tier) => {
                const isCached = cached.includes(tier.id);
                const isActive = activeId === tier.id && state?.status === 'ready';
                const isRecommended = recommended?.id === tier.id;
                const etaText = isCached
                  ? null
                  : eta(profile ? estimateSeconds(tier.downloadMB, profile.mbps) : null);
                // This exact card is the one downloading right now.
                const isLoading = busy && activeId === tier.id;
                const pct = Math.round((state?.progress ?? 0) * 100);

                return (
                  <div
                    key={tier.id}
                    className={`flex flex-col rounded-2xl border p-4 transition-colors ${
                      isActive
                        ? 'border-emerald-500/60 bg-emerald-500/[0.06]'
                        : 'border-slate-200/70 dark:border-slate-700/60 bg-slate-500/[0.03]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <ModelLogo brand={tier.brand} />
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold leading-tight text-slate-900 dark:text-white">
                          {tier.label}
                        </p>
                        <p className="text-[10.5px] text-slate-500 dark:text-slate-500">{tier.lab}</p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                          <Check size={10} /> {c.active}
                        </span>
                      )}
                      {!isActive && isCached && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-500 dark:text-slate-400 text-[10px] font-semibold">
                          {c.downloaded}
                        </span>
                      )}
                      {isRecommended && !isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 text-[10px] font-semibold">
                          <Zap size={10} /> {c.recommended}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                      {c.tradeoffs[tier.id]}
                    </p>

                    {/* `mt-auto` pins the meta + buttons to the card floor, so the
                        actions line up across cards despite different text lengths. */}
                    <p className="mt-auto pt-3 text-[11px] tabular-nums text-slate-500 dark:text-slate-500">
                      {size(tier.downloadMB)}
                      {etaText ? ` · ${etaText}` : ''}
                      {isCached ? ` · ${c.noDownload}` : ''}
                    </p>

                    <div className="mt-2.5 pt-3 border-t border-slate-200/60 dark:border-slate-700/50 flex flex-col gap-2">
                      {isLoading ? (
                        /* The button itself becomes the progress bar: the fill
                           tracks the download and the label carries the number,
                           so the feedback is exactly where the click happened. */
                        <div
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${c.downloading} ${tier.label}`}
                          className="relative overflow-hidden rounded-xl px-3 py-2 bg-brand-500/15 border border-brand-500/40"
                        >
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-brand-500/35"
                            animate={{ width: `${pct}%` }}
                            transition={{ ease: 'easeOut', duration: 0.35 }}
                          />
                          <span className="relative flex items-center justify-center gap-1.5 text-[12px] font-semibold text-brand-700 dark:text-brand-300 tabular-nums">
                            <Loader2 size={12} className="animate-spin" />
                            {c.downloading} {pct}%
                          </span>
                        </div>
                      ) : (
                        !isActive && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => choose(tier)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
                          >
                            <HardDriveDownload size={12} />
                            {isCached ? c.use : c.download}
                          </button>
                        )
                      )}

                      {isCached &&
                        !isLoading &&
                        (confirming === tier.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => remove(tier.id)}
                              className="flex-1 rounded-xl px-3 py-2 text-[12px] font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors"
                            >
                              {c.confirmUninstall}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirming(null)}
                              className="rounded-xl px-3 py-2 text-[12px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                            >
                              {c.cancel}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => setConfirming(tier.id)}
                            aria-label={`${c.uninstall}: ${tier.label}`}
                            className={`${DANGER} px-3 py-2 text-[12px]`}
                          >
                            <Trash2 size={12} />
                            {c.uninstall}
                          </button>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* What is on disk right now, and whether the browser promised to keep it. */}
            <div className="mt-5 px-6 py-4 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-2 text-[12px] text-slate-700 dark:text-slate-300">
                <HardDrive size={13} className="text-slate-400" aria-hidden="true" />
                {cached.length === 0
                  ? c.noneInstalled
                  : c.installed
                      .replace('{n}', String(cached.length))
                      .replace('{mb}', diskMB !== null ? size(diskMB) : '...')}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 text-[11px] ${
                  persisted
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {persisted ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                {persisted ? c.persisted : c.notPersisted}
              </span>

              {!off && cached.length > 0 && (
                <button
                  type="button"
                  onClick={() => void disableLocal().then(refresh)}
                  className={`${DANGER} ml-auto px-3 py-1.5 text-[11.5px]`}
                >
                  <Trash2 size={12} />
                  {c.turnOff}
                </button>
              )}
              {off && (
                <span className="ml-auto text-[11.5px] text-slate-500 dark:text-slate-400">
                  {c.isOff}
                </span>
              )}
            </div>

            {profile && (
              <p className="px-6 pb-5 text-[10.5px] text-slate-400 dark:text-slate-500 tabular-nums">
                {[
                  profile.gpuMB ? `GPU ~${profile.gpuMB} MB` : null,
                  profile.ramGB ? `RAM ${profile.ramGB} GB` : null,
                  profile.mbps ? `${profile.mbps.toFixed(1)} Mbps` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={c.title}
        aria-haspopup="dialog"
        className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
      >
        <Settings size={16} />
      </button>
      {typeof document !== 'undefined' && createPortal(modal, document.body)}
    </>
  );
};

export default BraiaSettings;
