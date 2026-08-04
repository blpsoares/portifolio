import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { useI18n } from '../i18n';
import type { LocalProgress } from '../agent/localEngine';

/**
 * Everything the visitor ever sees about the local (WebLLM) brain, anchored
 * just above the floating launcher.
 *
 * Only one of three things is ever on screen: the one-time offer, the download
 * progress, or the greeting ping. On a returning visit with cached weights,
 * none of them appear — the model just quietly takes over.
 */

interface Props {
  state: LocalProgress;
  offering: boolean;
  greeting: string | null;
  onAccept: () => void;
  onDecline: () => void;
  onOpenGreeting: () => void;
  onDismissGreeting: () => void;
  onRetry: () => void;
}

const shell =
  'w-[19rem] rounded-2xl glass border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-slate-900/15 dark:shadow-black/40 p-3.5';

const BraiaLocalBrain: React.FC<Props> = ({
  state,
  offering,
  greeting,
  onAccept,
  onDecline,
  onOpenGreeting,
  onDismissGreeting,
  onRetry,
}) => {
  const { t, locale } = useI18n();
  const c = t.agent.local;

  // The silent path: cached weights load without ever showing a bar.
  const showProgress = state.status === 'loading' && !state.fromCache;
  const pct = Math.round(state.progress * 100);

  // Size and time come from the tier this specific device qualified for, so a
  // fast machine and a modest one see genuinely different numbers.
  const sizeMB = state.tier?.downloadMB ?? 0;
  const eta = state.etaSeconds;
  const etaText =
    eta === null
      ? null
      : eta < 90
        ? `~${eta}s`
        : `~${Math.round(eta / 60)} min`;

  const offerText = c.offerText
    .replace('{mb}', sizeMB >= 1000 ? `${(sizeMB / 1000).toFixed(1)} GB` : `${sizeMB} MB`)
    .replace('{model}', state.tier?.label ?? '')
    .replace(
      '{eta}',
      etaText ? (locale === 'pt' ? `, ${etaText} na sua conexão` : `, ${etaText} on your connection`) : '',
    );

  return (
    <div className="fixed bottom-20 right-5 z-50 flex flex-col items-end gap-2 pointer-events-none">
      <AnimatePresence mode="wait">
        {/* 1 — ONE-TIME OFFER */}
        {offering && (
          <motion.div
            key="offer"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className={`${shell} pointer-events-auto`}
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 grid place-items-center w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <Cpu size={16} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-900 dark:text-white">
                  {c.offerTitle}
                </p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {offerText}
                </p>
              </div>
              <button
                type="button"
                onClick={onDecline}
                aria-label={c.decline}
                className="ml-auto -mt-1 -mr-1 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={onAccept}
                className="flex-1 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-[12px] font-semibold py-1.5 transition-colors"
              >
                {c.accept}
              </button>
              <button
                type="button"
                onClick={onDecline}
                className="rounded-xl px-3 py-1.5 text-[12px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                {c.decline}
              </button>
            </div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-500">
              <ShieldCheck size={11} aria-hidden="true" />
              {c.privacy}
            </p>
          </motion.div>
        )}

        {/* 2 — DOWNLOAD PROGRESS */}
        {!offering && showProgress && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className={shell}
          >
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-brand-500 animate-pulse" aria-hidden="true" />
              <p className="text-[12px] font-semibold text-slate-900 dark:text-white">
                {c.loadingTitle}
              </p>
              <span className="ml-auto text-[11px] tabular-nums font-medium text-brand-600 dark:text-brand-400">
                {pct}%
              </span>
            </div>

            <div
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={c.loadingTitle}
              className="mt-2.5 h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-700/60 overflow-hidden"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                animate={{ width: `${pct}%` }}
                transition={{ ease: 'easeOut', duration: 0.4 }}
              />
            </div>

            <p className="mt-2 text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-500">
              {state.tier ? `${state.tier.label} · ` : ''}
              {c.loadingHint}
            </p>
          </motion.div>
        )}

        {/* 2b — FAILURE. Never fail silently: a load that dies without a word
            is indistinguishable from a button that does nothing. */}
        {!offering && state.status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className={`${shell} pointer-events-auto`}
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
              <p className="text-[12px] leading-relaxed text-slate-700 dark:text-slate-200">
                {c.errorText}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={onRetry}
                className="flex-1 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-[12px] font-semibold py-1.5 transition-colors"
              >
                {c.retry}
              </button>
              <button
                type="button"
                onClick={onDecline}
                className="rounded-xl px-3 py-1.5 text-[12px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                {c.decline}
              </button>
            </div>
          </motion.div>
        )}

        {/* 3 — READY PING */}
        {!offering && greeting && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className={`${shell} pointer-events-auto cursor-pointer hover:border-brand-400/60 transition-colors`}
            onClick={onOpenGreeting}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onOpenGreeting();
            }}
          >
            <div className="flex items-start gap-2">
              <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[12.5px] leading-relaxed text-slate-700 dark:text-slate-200">
                {greeting}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismissGreeting();
                }}
                aria-label={t.agent.close}
                className="ml-auto -mt-1 -mr-1 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <p className="mt-2 text-[10.5px] font-medium text-brand-600 dark:text-brand-400">
              {c.openChat}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BraiaLocalBrain;
