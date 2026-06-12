import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Terminal, Sparkles, Send, Cpu, ArrowDown, Wrench } from 'lucide-react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';
import { matchIntent, type AgentReply, type AgentAction } from '../agent/engine';

/** Small awaitable delay used to pace the "agent" output. */
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Role = 'user' | 'agent';

interface ChatMessage {
  id: number;
  role: Role;
  /** rendered text (may be streamed in progressively for agent answers) */
  text: string;
  /** reasoning lines revealed so far (agent only) */
  reasoning?: string[];
  /** function-style tool call to render as a block (agent only) */
  tool?: { name: string; arg: string };
  /** whether the answer is still streaming */
  streaming?: boolean;
}

interface AgentConsoleProps {
  className?: string;
}

const AgentConsole: React.FC<AgentConsoleProps> = ({ className = '' }) => {
  const { t, locale } = useI18n();
  const { downloadCv } = useCvDownload();

  const [bootLines, setBootLines] = useState<string[]>([]);
  const [booted, setBooted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const idRef = useRef(0);
  const nextId = () => ++idRef.current;

  // Track mount status + active timers so we can bail out cleanly on unmount.
  const aliveRef = useRef(true);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const bootKbRef = useRef<string[]>([]);

  // Keep latest boot strings available to the async boot loop without
  // re-running it when the locale flips mid-boot.
  bootKbRef.current = t.agent.boot;

  useEffect(() => {
    aliveRef.current = true;
    const timers = timersRef.current;
    return () => {
      aliveRef.current = false;
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  // Auto-scroll the transcript as content streams in.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, bootLines]);

  // BOOT SEQUENCE — type out system lines sequentially on first mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const lines = bootKbRef.current;
      for (let i = 0; i < lines.length; i++) {
        await sleep(i === 0 ? 350 : 520);
        if (cancelled || !aliveRef.current) return;
        setBootLines((prev) => [...prev, lines[i]]);
      }
      await sleep(650);
      if (cancelled || !aliveRef.current) return;
      setBooted(true);
    })();
    return () => {
      cancelled = true;
    };
    // Intentionally run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Execute the real side effect a tool requests — this drives the page. */
  const runAction = useCallback(
    (action: AgentAction) => {
      switch (action.type) {
        case 'scroll': {
          const el = document.getElementById(action.target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            el.classList.add('agent-highlight');
            const tm = setTimeout(() => {
              el.classList.remove('agent-highlight');
              timersRef.current.delete(tm);
            }, 1900);
            timersRef.current.add(tm);
          }
          break;
        }
        case 'download_cv':
          void downloadCv();
          break;
        case 'open_url':
          window.open(action.url, '_blank', 'noopener');
          break;
        case 'none':
        default:
          break;
      }
    },
    [downloadCv],
  );

  /**
   * The ONLY place response data is produced. Swap `matchIntent` for a real
   * API call here later — the rest of the UI is agnostic to the source.
   */
  const respond = useCallback(
    async (query: string): Promise<AgentReply> => {
      return matchIntent(query, t, locale);
    },
    [t, locale],
  );

  const handleSend = useCallback(
    async (raw: string) => {
      const query = raw.trim();
      if (!query || busy) return;
      setBusy(true);
      setInput('');

      // 1. push the user message
      setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: query }]);
      await sleep(280);
      if (!aliveRef.current) return;

      // 2. resolve the reply (deterministic today, API-ready tomorrow)
      const reply = await respond(query);
      if (!aliveRef.current) return;

      // 3. create the agent message shell
      const agentId = nextId();
      setMessages((prev) => [
        ...prev,
        { id: agentId, role: 'agent', text: '', reasoning: [], streaming: true },
      ]);

      // 4. reveal reasoning lines progressively
      for (const line of reply.reasoning) {
        await sleep(520);
        if (!aliveRef.current) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === agentId ? { ...m, reasoning: [...(m.reasoning ?? []), line] } : m,
          ),
        );
      }

      // 5. show the tool-call block + execute the real action
      if (reply.tool) {
        await sleep(420);
        if (!aliveRef.current) return;
        const tool = reply.tool;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === agentId ? { ...m, tool: { name: tool.name, arg: tool.arg } } : m,
          ),
        );
        await sleep(700);
        if (!aliveRef.current) return;
        runAction(reply.tool.action);
      }

      // 6. stream the answer word-by-word with a caret
      await sleep(320);
      const words = reply.answer.split(' ');
      for (let i = 0; i < words.length; i++) {
        await sleep(28);
        if (!aliveRef.current) return;
        const slice = words.slice(0, i + 1).join(' ');
        setMessages((prev) =>
          prev.map((m) => (m.id === agentId ? { ...m, text: slice } : m)),
        );
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === agentId ? { ...m, streaming: false } : m)),
      );
      if (aliveRef.current) setBusy(false);
    },
    [busy, respond, runAction],
  );

  return (
    <div
      className={`relative w-full rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-slate-900/10 dark:shadow-brand-500/10 overflow-hidden ${className}`}
    >
      {/* animated scan line for the "alive" feel */}
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

      {/* TRANSCRIPT */}
      <div
        ref={scrollRef}
        className="h-[340px] sm:h-[380px] overflow-y-auto hide-scrollbar px-4 py-4 space-y-3 font-mono text-[13px] leading-relaxed scroll-smooth"
        aria-live="polite"
      >
        {/* boot lines */}
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

        {/* chat messages */}
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
                {/* reasoning */}
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

                {/* tool-call block */}
                {m.tool && (
                  <div className="flex items-center gap-2 rounded-lg border border-brand-500/30 bg-brand-500/5 dark:bg-brand-400/10 px-2.5 py-1.5 text-[11px] text-brand-700 dark:text-brand-300 animate-boot-line">
                    <Wrench size={12} className="shrink-0" aria-hidden="true" />
                    <code className="font-mono">
                      {m.tool.name}(<span className="text-brand-500 dark:text-brand-400">"{m.tool.arg}"</span>)
                    </code>
                    <span className="text-slate-400 dark:text-slate-500 ml-1">↳ {t.agent.toolRunning}</span>
                  </div>
                )}

                {/* answer bubble */}
                {(m.text || m.streaming) && (
                  <div className="rounded-2xl rounded-bl-sm border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 px-3.5 py-2 text-[13px]">
                    {m.text}
                    {m.streaming && (
                      <span className="inline-block w-1.5 h-3.5 bg-brand-400 align-middle ml-0.5 animate-blink" aria-hidden="true" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ),
        )}
      </div>

      {/* SUGGESTED PROMPTS */}
      <div className="px-4 pt-1 pb-2 flex flex-wrap gap-2 border-t border-slate-200/70 dark:border-slate-700/60">
        {t.agent.suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleSend(s)}
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
          handleSend(input);
        }}
        className="flex items-center gap-2 px-3 py-3 border-t border-slate-200/70 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-950/40"
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
          className="shrink-0 p-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-brand-600/30"
        >
          <Send size={16} />
        </button>
      </form>

      {/* FOOTNOTE */}
      <div className="px-4 pb-3 -mt-1 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
        <ArrowDown size={10} className="rotate-[-45deg]" aria-hidden="true" />
        {t.agent.disclaimer}
      </div>
    </div>
  );
};

export default AgentConsole;
