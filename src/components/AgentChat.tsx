import React, { useEffect, useRef } from 'react';
import { Sparkles, Send, Wrench } from 'lucide-react';
import { useI18n } from '../i18n';
import type { useAgentChat } from '../agent/useAgentChat';
import AiOrb from './ui/AiOrb';

type ChatApi = ReturnType<typeof useAgentChat>;

interface AgentChatProps {
  chat: ChatApi;
  suggestions: string[];
  /** small contextual note shown above the input, e.g. "viewing: Projects" */
  contextNote?: React.ReactNode;
}

const Avatar: React.FC = () => (
  <div
    className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-emerald-600 grid place-items-center shadow-sm shadow-brand-500/30"
    aria-hidden="true"
  >
    <Sparkles size={13} className="text-white" />
  </div>
);

const TypingDots: React.FC = () => (
  <span className="inline-flex items-center gap-1 py-1" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </span>
);

/**
 * Modern chat surface (transcript + suggestions + input). Fills its parent's
 * height; the parent controls sizing. Behaviour lives in `useAgentChat`.
 */
const AgentChat: React.FC<AgentChatProps> = ({ chat, suggestions, contextNote }) => {
  const { t } = useI18n();
  const { booted, messages, input, setInput, busy, send } = chat;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const empty = messages.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* TRANSCRIPT */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-4 py-4" aria-live="polite">
        {/* WELCOME / EMPTY STATE */}
        {empty && (
          <div className="h-full flex flex-col items-center justify-center text-center px-2">
            <AiOrb size={64} pulse={false} className="mb-4" />
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              {t.agent.welcomeTitle}
            </h3>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-[16rem] leading-relaxed">
              {t.agent.welcomeText}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={busy || !booted}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-brand-500/10 hover:text-brand-700 dark:hover:text-brand-300 border border-transparent hover:border-brand-500/30 transition-colors disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="space-y-4">
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-brand-600 text-white px-3.5 py-2.5 text-sm leading-relaxed shadow-sm shadow-brand-600/20">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex gap-2.5">
                <Avatar />
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* reasoning */}
                  {m.reasoning && m.reasoning.length > 0 && m.streaming && !m.text && (
                    <div className="space-y-1 pt-0.5">
                      {m.reasoning.map((line, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 animate-boot-line"
                        >
                          <span className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" aria-hidden="true" />
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* tool call */}
                  {m.tool && (
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 px-2 py-1 text-[11px] text-brand-700 dark:text-brand-300 animate-boot-line">
                      <Wrench size={11} className="shrink-0" aria-hidden="true" />
                      <code className="font-mono">
                        {m.tool.name}(<span className="opacity-80">"{m.tool.arg}"</span>)
                      </code>
                      <span className="opacity-60">↳ {t.agent.toolRunning}</span>
                    </div>
                  )}

                  {/* answer bubble */}
                  {(m.text || m.streaming) && (
                    <div className="inline-block max-w-full rounded-2xl rounded-tl-md bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 text-sm leading-relaxed">
                      {m.text ? (
                        <>
                          {m.text}
                          {m.streaming && (
                            <span className="inline-block w-1.5 h-4 bg-brand-400 align-text-bottom ml-0.5 animate-blink" aria-hidden="true" />
                          )}
                        </>
                      ) : (
                        <TypingDots />
                      )}
                    </div>
                  )}

                  {/* source badge */}
                  {m.source && !m.streaming && (
                    <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                          m.source === 'ai' ? 'bg-brand-500' : 'bg-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                      {m.source === 'ai' ? t.agent.sourceAi : t.agent.sourceLocal}
                    </div>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* SUGGESTIONS (slim, only once a conversation started) */}
      {!empty && (
        <div className="px-3 pt-2 flex gap-2 overflow-x-auto hide-scrollbar">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              disabled={busy || !booted}
              className="shrink-0 text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div className="p-3">
        {contextNote && (
          <div className="px-1 pb-1.5 text-[10px] font-mono text-brand-600 dark:text-brand-400">{contextNote}</div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 pl-4 pr-1.5 py-1.5 focus-within:border-brand-500 dark:focus-within:border-brand-500 transition-colors"
        >
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
            className="shrink-0 w-8 h-8 grid place-items-center rounded-full bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={15} />
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">{t.agent.disclaimer}</p>
      </div>
    </div>
  );
};

export default AgentChat;
