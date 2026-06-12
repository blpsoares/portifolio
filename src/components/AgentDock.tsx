import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Eye } from 'lucide-react';
import { useI18n } from '../i18n';
import { useAgentChat } from '../agent/useAgentChat';
import { useActiveSection } from '../hooks/useActiveSection';
import AgentChat from './AgentChat';
import AiOrb from './ui/AiOrb';

/**
 * Persistent, site-wide AI assistant. A floating orb launcher (present on every
 * section) opens a drawer running the same agent engine as the hero console,
 * but with context-aware suggestions based on the section currently in view.
 */
const AgentDock: React.FC = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const chat = useAgentChat();
  const active = useActiveSection();

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
            className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full glass gradient-border pl-2 pr-4 py-2 shadow-xl shadow-brand-900/20"
          >
            <AiOrb size={38} pulse />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 pr-1 hidden sm:block">
              {t.agent.cta}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* DRAWER */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="fixed z-50 bottom-0 right-0 sm:bottom-5 sm:right-5 w-full sm:w-[400px] max-w-full"
          >
            <div className="relative m-3 sm:m-0 rounded-2xl gradient-border glass shadow-2xl shadow-slate-900/20 dark:shadow-brand-500/10 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent animate-scan"
              />

              {/* HEADER */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200/70 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-950/50">
                <AiOrb size={26} pulse={false} />
                <div className="min-w-0">
                  <p className="text-xs font-mono font-medium text-slate-700 dark:text-slate-200 truncate">
                    {t.agent.title}
                  </p>
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    {t.agent.online}
                    <span className="hidden md:inline-flex items-center gap-1 ml-1 text-slate-400 dark:text-slate-500">
                      <Cpu size={10} aria-hidden="true" /> {t.agent.badge}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t.agent.close}
                  className="ml-auto p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <AgentChat
                chat={chat}
                suggestions={suggestions}
                heightClass="h-[44vh] sm:h-[360px]"
                contextNote={
                  active ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Eye size={11} aria-hidden="true" />
                      {t.agent.viewing}: <strong className="font-semibold">{active.label}</strong>
                    </span>
                  ) : null
                }
              />

              <div className="px-4 pb-3 pt-1 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-200/70 dark:border-slate-700/60">
                {t.agent.disclaimer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AgentDock;
