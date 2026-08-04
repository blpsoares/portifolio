import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onLocalProgress, type LocalProgress } from '../../agent/localEngine';

/**
 * Site-wide download indicator: a hairline pinned to the very top of the
 * viewport, above everything.
 *
 * The other progress affordances are all conditional: the floating card only
 * shows with the chat closed, the panel hairline only with the chat open, and
 * both sit behind the settings modal's overlay. Starting a download from the
 * settings modal therefore produced no feedback at all. This one is
 * unconditional, so a download is always visible no matter what is on screen.
 */
const LocalModelProgress: React.FC = () => {
  const [state, setState] = useState<LocalProgress | null>(null);
  useEffect(() => onLocalProgress(setState), []);

  const loading = state?.status === 'loading';
  const pct = Math.round((state?.progress ?? 0) * 100);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[200] h-[3px] bg-slate-500/15 pointer-events-none"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={state?.tier?.label ?? 'download'}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"
            animate={{ width: `${pct}%` }}
            transition={{ ease: 'easeOut', duration: 0.35 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LocalModelProgress;
