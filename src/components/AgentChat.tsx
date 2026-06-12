import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, Wrench, Paperclip, X } from 'lucide-react';
import { useI18n } from '../i18n';
import type { useAgentChat } from '../agent/useAgentChat';

type ChatApi = ReturnType<typeof useAgentChat>;

interface AgentChatProps {
  chat: ChatApi;
  /** suggestion chips (context-aware when provided by the dock) */
  suggestions: string[];
  /** tailwind height class for the transcript area */
  heightClass?: string;
  /** small contextual note shown above the input, e.g. "viewing: Projects" */
  contextNote?: React.ReactNode;
}

/**
 * Presentational transcript + attach + suggestions + input. Behaviour lives in
 * `useAgentChat`; this just renders it. Shared by the hero console and the dock.
 */
const AgentChat: React.FC<AgentChatProps> = ({
  chat,
  suggestions,
  heightClass = 'h-[340px]',
  contextNote,
}) => {
  const { t } = useI18n();
  const { bootLines, booted, messages, input, setInput, busy, send, jobText, setJobText } = chat;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [attachOpen, setAttachOpen] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, bootLines]);

  return (
    <>
      {/* TRANSCRIPT */}
      <div
        ref={scrollRef}
        className={`${heightClass} overflow-y-auto hide-scrollbar px-4 py-4 space-y-3 font-mono text-[13px] leading-relaxed`}
        aria-live="polite"
      >
        <div className="space-y-1 text-slate-500 dark:text-slate-500">
          {bootLines.map((line, i) => (
            <div key={i} className="animate-boot-line flex items-start gap-2">
              <span className="text-brand-500/70 select-none">$</span>
              <span>{line}</span>
            </div>
          ))}
          {!booted && bootLines.length > 0 && (
            <span className="inline-block w-2 h-4 bg-brand-400 align-middle animate-blink" aria-hidden="true" />
          )}
        </div>

        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-600 text-white px-3.5 py-2 text-[13px] shadow-sm shadow-brand-600/30">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex justify-start">
              <div className="max-w-[92%] space-y-2">
                {m.reasoning && m.reasoning.length > 0 && (
                  <div className="space-y-1">
                    {m.reasoning.map((line, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 animate-boot-line"
                      >
                        <Sparkles size={11} className="text-brand-500/80 shrink-0" aria-hidden="true" />
                        <span className="italic">
                          {t.agent.thinking}: {line}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {m.tool && (
                  <div className="flex items-center gap-2 rounded-lg border border-brand-500/30 bg-brand-500/5 dark:bg-brand-400/10 px-2.5 py-1.5 text-[11px] text-brand-700 dark:text-brand-300 animate-boot-line">
                    <Wrench size={12} className="shrink-0" aria-hidden="true" />
                    <code className="font-mono">
                      {m.tool.name}(<span className="text-brand-500 dark:text-brand-400">"{m.tool.arg}"</span>)
                    </code>
                    <span className="text-slate-400 dark:text-slate-500 ml-1">↳ {t.agent.toolRunning}</span>
                  </div>
                )}

                {(m.text || m.streaming) && (
                  <div className="rounded-2xl rounded-bl-sm border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 px-3.5 py-2 text-[13px]">
                    {m.text}
                    {m.streaming && (
                      <span className="inline-block w-1.5 h-3.5 bg-brand-400 align-middle ml-0.5 animate-blink" aria-hidden="true" />
                    )}
                    {m.source && !m.streaming && (
                      <span className="mt-1.5 flex items-center gap-1 text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${
                            m.source === 'ai' ? 'bg-brand-500' : 'bg-slate-400'
                          }`}
                          aria-hidden="true"
                        />
                        {m.source === 'ai' ? t.agent.sourceAi : t.agent.sourceLocal}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ),
        )}
      </div>

      {/* ATTACHMENT (job description) */}
      {attachOpen && (
        <div className="px-4 pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder={t.agent.attachPlaceholder}
            rows={3}
            className="w-full resize-none rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/70 px-3 py-2 text-[12px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      )}

      {/* SUGGESTED PROMPTS */}
      <div className="px-4 pt-2 pb-2 flex flex-wrap items-center gap-2 border-t border-slate-200/70 dark:border-slate-700/60">
        {contextNote && (
          <div className="w-full text-[10px] font-mono text-brand-600 dark:text-brand-400 mb-1">
            {contextNote}
          </div>
        )}
        {jobText.trim() && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/30">
            <Paperclip size={10} aria-hidden="true" />
            {t.agent.attached}
            <button
              type="button"
              onClick={() => setJobText('')}
              aria-label={t.agent.clear}
              className="hover:text-brand-900 dark:hover:text-white"
            >
              <X size={11} />
            </button>
          </span>
        )}
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            disabled={busy || !booted}
            className="text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {s}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 px-3 py-3 border-t border-slate-200/70 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-950/40"
      >
        <button
          type="button"
          onClick={() => setAttachOpen((v) => !v)}
          aria-label={t.agent.attach}
          title={t.agent.attach}
          className={`shrink-0 p-2 rounded-lg border transition-colors ${
            attachOpen || jobText.trim()
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400'
          }`}
        >
          <Paperclip size={15} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.agent.placeholder}
          aria-label={t.agent.placeholder}
          disabled={!booted}
          className="flex-1 min-w-0 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={busy || !booted || !input.trim()}
          aria-label="Send"
          className="shrink-0 p-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-brand-600/30"
        >
          <Send size={16} />
        </button>
      </form>
    </>
  );
};

export default AgentChat;
