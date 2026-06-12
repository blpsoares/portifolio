import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Eye } from 'lucide-react';
import { useI18n } from '../i18n';
import { useAgentChat } from '../agent/useAgentChat';
import { useActiveSection } from '../hooks/useActiveSection';
import AgentChat from './AgentChat';
import AiOrb from './ui/AiOrb';

const DEFAULT_SIZE = { w: 420, h: 640 };
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * Persistent, site-wide AI assistant ("bra.ia"). A floating orb launcher opens a
 * resizable chat panel running the hybrid agent, with context-aware suggestions
 * based on the section in view.
 */
const AgentDock: React.FC = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const chat = useAgentChat({ autoBoot: false });
  const active = useActiveSection();

  const [size, setSize] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const s = JSON.parse(localStorage.getItem('braia.size') || '');
        if (s?.w && s?.h) return s as { w: number; h: number };
      } catch {
        /* ignore */
      }
    }
    return DEFAULT_SIZE;
  });
  const sizeRef = useRef(size);
  sizeRef.current = size;

  const startResize = useCallback((e: React.PointerEvent, dir: 'top' | 'left' | 'corner') => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const { w: startW, h: startH } = sizeRef.current;

    const onMove = (ev: PointerEvent) => {
      // panel is anchored bottom-right, so dragging an edge grows up/left
      const w = dir !== 'top' ? clamp(startW + (startX - ev.clientX), 340, window.innerWidth - 24) : startW;
      const h = dir !== 'left' ? clamp(startH + (startY - ev.clientY), 380, window.innerHeight - 32) : startH;
      setSize({ w, h });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      document.body.style.userSelect = '';
      try {
        localStorage.setItem('braia.size', JSON.stringify(sizeRef.current));
      } catch {
        /* ignore */
      }
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, []);

  const ctxMap = t.agent.contextSuggestions as Record<string, string[]>;
  const suggestions = (active && ctxMap[active.id]) || t.agent.suggestions;

  return (
    <>
      {/* LAUNCHER */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            aria-label={t.agent.cta}
            className="group fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full glass gradient-border pl-2 pr-4 py-2 shadow-lg shadow-brand-900/10 hover:shadow-brand-500/20 transition-shadow"
          >
            <AiOrb size={34} pulse />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
              {t.agent.cta}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* PANEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed z-50 inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5"
          >
            <div
              style={{ width: size.w, height: size.h }}
              className="group/panel relative flex flex-col rounded-3xl glass border border-slate-200/80 dark:border-slate-700/60 shadow-2xl shadow-slate-900/20 dark:shadow-black/40 overflow-hidden max-sm:!w-auto max-sm:!h-[74vh]"
            >
              {/* RESIZE — draggable edges (desktop), invisible until hovered */}
              <div
                onPointerDown={(e) => startResize(e, 'top')}
                className="hidden sm:block absolute top-0 left-5 right-5 h-1.5 z-30 cursor-ns-resize"
                aria-hidden="true"
              />
              <div
                onPointerDown={(e) => startResize(e, 'left')}
                className="hidden sm:block absolute left-0 top-5 bottom-5 w-1.5 z-30 cursor-ew-resize"
                aria-hidden="true"
              />
              <div
                onPointerDown={(e) => startResize(e, 'corner')}
                role="separator"
                aria-label="Resize"
                className="hidden sm:flex absolute top-0 left-0 w-5 h-5 z-30 cursor-nwse-resize items-start justify-start p-1.5"
              >
                <span className="w-2 h-2 border-l-2 border-t-2 border-slate-400/0 group-hover/panel:border-slate-400/50 dark:group-hover/panel:border-slate-500/60 rounded-tl-[3px] transition-colors" />
              </div>

              {/* HEADER */}
              <div className="shrink-0 flex items-center gap-3 px-4 py-3 pl-5 border-b border-slate-200/70 dark:border-slate-800/70">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-emerald-600 grid place-items-center shadow-sm shadow-brand-500/30">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{t.agent.cta}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">{t.agent.online}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t.agent.close}
                  className="ml-auto p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* CHAT */}
              <div className="flex-1 min-h-0">
                <AgentChat
                  chat={chat}
                  suggestions={suggestions}
                  contextNote={
                    active ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Eye size={11} aria-hidden="true" />
                        {t.agent.viewing}: <strong className="font-semibold">{active.label}</strong>
                      </span>
                    ) : null
                  }
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AgentDock;
