import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send, Wrench, ArrowDown, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useI18n } from '../i18n';
import type { useAgentChat } from '../agent/useAgentChat';
import AiOrb from './ui/AiOrb';
import Markdown from './Markdown';

type ChatApi = ReturnType<typeof useAgentChat>;

interface AgentChatProps {
  chat: ChatApi;
  suggestions: string[];
  contextNote?: React.ReactNode;
}

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
 * height. Markdown answers, free scrolling while streaming + a "jump to latest"
 * button. Behaviour lives in `useAgentChat`.
 */
/**
 * Mirrors MAX_QUERY_CHARS in `functions/api/chat.ts`, which now rejects rather
 * than truncates. Capping here means the visitor never composes a question the
 * server will refuse.
 */
const MAX_INPUT_CHARS = 1200;

const AgentChat: React.FC<AgentChatProps> = ({ chat, suggestions, contextNote }) => {
  const { t } = useI18n();
  const { booted, messages, input, setInput, busy, send, scrollToSection, rate } = chat;
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoFollow = useRef(true);
  const lastTop = useRef(0);
  const [showJump, setShowJump] = useState(false);

  const empty = messages.length === 0;

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
    autoFollow.current = true;
    setShowJump(false);
  }, []);

  // Direction-aware: scrolling UP releases the auto-follow (so you can read
  // history while it streams); returning to the bottom re-engages it.
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const top = el.scrollTop;
    const atBottom = el.scrollHeight - top - el.clientHeight < 48;
    if (top < lastTop.current - 2 && !atBottom) {
      autoFollow.current = false;
      setShowJump(true);
    } else if (atBottom) {
      autoFollow.current = true;
      setShowJump(false);
    }
    lastTop.current = top;
  }, []);

  // Follow new content only while the user hasn't scrolled away.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && autoFollow.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* TRANSCRIPT */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto hide-scrollbar px-4 py-4"
          aria-live="polite"
        >
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
                  <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-brand-600 text-white px-3.5 py-2.5 text-sm leading-relaxed shadow-sm shadow-brand-600/20 whitespace-pre-wrap break-words">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="min-w-0 space-y-1.5">
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

                    {m.tool && (
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 px-2 py-1 text-[11px] text-brand-700 dark:text-brand-300 animate-boot-line">
                        {m.tool.done ? (
                          <Check size={12} className="shrink-0 text-emerald-500" aria-hidden="true" />
                        ) : (
                          <Wrench size={11} className="shrink-0" aria-hidden="true" />
                        )}
                        <code className="font-mono">
                          {m.tool.name}(<span className="opacity-80">"{m.tool.arg}"</span>)
                        </code>
                        <span className="opacity-60">↳ {m.tool.done ? t.agent.toolDone : t.agent.toolRunning}</span>
                      </div>
                    )}

                    {(m.text || m.streaming) && (
                      <div className="inline-block max-w-full rounded-2xl rounded-tl-md bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 text-sm leading-relaxed break-words">
                        {m.text ? (
                          <div className="markdown-body">
                            <Markdown
                              onCite={scrollToSection}
                              citationLabels={t.agent.citationLabels}
                            >
                              {m.text}
                            </Markdown>
                            {m.streaming && (
                              <span
                                className="inline-block w-1.5 h-4 bg-brand-400 align-text-bottom ml-0.5 animate-blink"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        ) : (
                          <TypingDots />
                        )}
                      </div>
                    )}

                    {m.source && !m.streaming && (
                      <div
                        title={
                          m.source === 'ai'
                            ? t.agent.sourceAiHint
                            : m.source === 'webllm'
                              ? t.agent.sourceWebllmHint
                              : t.agent.sourceLocalHint
                        }
                        className="inline-flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/70 text-[10px] font-medium text-slate-500 dark:text-slate-400 cursor-default"
                      >
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${
                            m.source === 'ai'
                              ? 'bg-brand-500'
                              : m.source === 'webllm'
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                          }`}
                          aria-hidden="true"
                        />
                        {m.source === 'ai'
                          ? `${t.agent.sourceAi}${m.model ? ` · ${m.model}` : ''}`
                          : m.source === 'webllm'
                          ? `${t.agent.sourceWebllm}${m.model ? ` · ${m.model}` : ''}`
                          : t.agent.sourceLocal}
                      </div>
                    )}

                    {/* The verdict is what turns the log into a measurement:
                        the transcript says what was asked, only this says
                        whether the answer was any good. */}
                    {m.logId && !m.streaming && (
                      <div className="mt-0.5 flex items-center gap-1">
                        {m.rating ? (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {t.agent.feedbackThanks}
                          </span>
                        ) : (
                          <>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              {t.agent.feedbackAsk}
                            </span>
                            <button
                              type="button"
                              onClick={() => rate(m.id, m.logId!, 1)}
                              aria-label={t.agent.feedbackYes}
                              title={t.agent.feedbackYes}
                              className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                            >
                              <ThumbsUp size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => rate(m.id, m.logId!, -1)}
                              aria-label={t.agent.feedbackNo}
                              title={t.agent.feedbackNo}
                              className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                            >
                              <ThumbsDown size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                </div>
              ),
            )}
          </div>
        </div>

        {/* JUMP TO LATEST */}
        {showJump && !empty && (
          <button
            type="button"
            onClick={() => scrollToBottom('smooth')}
            aria-label="↓"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 grid place-items-center rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-lg hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <ArrowDown size={16} />
          </button>
        )}
      </div>

      {/* SUGGESTIONS (slim, once a conversation started) */}
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
      <div className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
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
            onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
            maxLength={MAX_INPUT_CHARS}
            placeholder={t.agent.placeholder}
            aria-label={t.agent.placeholder}
            disabled={!booted}
            className="flex-1 min-w-0 bg-transparent text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
          <span>{t.agent.disclaimer}</span>
          {input.length > MAX_INPUT_CHARS * 0.8 && (
            <span
              className={
                input.length >= MAX_INPUT_CHARS
                  ? 'font-mono font-semibold text-amber-600 dark:text-amber-400'
                  : 'font-mono'
              }
            >
              {input.length}/{MAX_INPUT_CHARS}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
