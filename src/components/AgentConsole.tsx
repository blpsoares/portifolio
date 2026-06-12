import React from 'react';
import { Terminal, Cpu, ArrowDown } from 'lucide-react';
import { useI18n } from '../i18n';
import { useAgentChat } from '../agent/useAgentChat';
import AgentChat from './AgentChat';

interface AgentConsoleProps {
  className?: string;
}

/**
 * The framed "terminal" console used in the hero. Chrome + status bar around
 * the shared <AgentChat>. The global dock reuses the same chat engine.
 */
const AgentConsole: React.FC<AgentConsoleProps> = ({ className = '' }) => {
  const { t } = useI18n();
  const chat = useAgentChat();

  return (
    <div
      className={`relative w-full rounded-2xl gradient-border glass shadow-2xl shadow-slate-900/10 dark:shadow-brand-500/10 overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent animate-scan"
      />

      {/* HEADER BAR */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200/70 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-950/50">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-red-400/90" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/90" />
          <span className="w-3 h-3 rounded-full bg-green-400/90" />
        </div>
        <div className="flex items-center gap-2 ml-1 min-w-0">
          <img
            src="/bryan.png"
            alt="Bryan Soares"
            className="w-5 h-5 rounded-full object-cover ring-1 ring-brand-400/50 hidden sm:block"
          />
          <Terminal size={14} className="text-brand-600 dark:text-brand-400 sm:hidden" aria-hidden="true" />
          <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 truncate">
            {t.agent.title}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {t.agent.online}
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/70">
            <Cpu size={11} aria-hidden="true" />
            {t.agent.badge}
          </span>
        </div>
      </div>

      <AgentChat chat={chat} suggestions={t.agent.suggestions} heightClass="h-[340px] sm:h-[360px]" />

      {/* FOOTNOTE */}
      <div className="px-4 pb-3 pt-1 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-200/70 dark:border-slate-700/60">
        <ArrowDown size={10} className="rotate-[-45deg]" aria-hidden="true" />
        {t.agent.disclaimer}
      </div>
    </div>
  );
};

export default AgentConsole;
