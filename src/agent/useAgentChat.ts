import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';
import { matchIntent, type AgentReply, type AgentAction } from './engine';

/** Small awaitable delay used to pace the "agent" output. */
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Role = 'user' | 'agent';

export interface ChatMessage {
  id: number;
  role: Role;
  text: string;
  reasoning?: string[];
  tool?: { name: string; arg: string };
  streaming?: boolean;
}

/**
 * Shared "agent brain" for the UI. Owns the transcript, the boot sequence,
 * the reasoning → tool-call → streamed-answer choreography and the real
 * page-driving side effects. Consumed by both the hero console and the
 * global dock so they behave identically.
 *
 * `respond()` is the single seam where a real LLM backend can replace the
 * deterministic `matchIntent` later — nothing else needs to change.
 */
export function useAgentChat(options: { autoBoot?: boolean } = {}) {
  const { autoBoot = true } = options;
  const { t, locale } = useI18n();
  const { downloadCv } = useCvDownload();

  const [bootLines, setBootLines] = useState<string[]>([]);
  const [booted, setBooted] = useState(!autoBoot);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const idRef = useRef(0);
  const nextId = () => ++idRef.current;

  const aliveRef = useRef(true);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const bootKbRef = useRef<string[]>(t.agent.boot);
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

  // BOOT SEQUENCE
  useEffect(() => {
    if (!autoBoot) return;
    let cancelled = false;
    (async () => {
      const lines = bootKbRef.current;
      for (let i = 0; i < lines.length; i++) {
        await sleep(i === 0 ? 350 : 480);
        if (cancelled || !aliveRef.current) return;
        setBootLines((prev) => [...prev, lines[i]]);
      }
      await sleep(600);
      if (cancelled || !aliveRef.current) return;
      setBooted(true);
    })();
    return () => {
      cancelled = true;
    };
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          void downloadCv(action.locale);
          break;
        case 'open_url':
          window.open(action.url, '_blank', 'noopener');
          break;
        default:
          break;
      }
    },
    [downloadCv],
  );

  const respond = useCallback(
    async (query: string): Promise<AgentReply> => matchIntent(query, t, locale),
    [t, locale],
  );

  const send = useCallback(
    async (raw: string) => {
      const query = raw.trim();
      if (!query || busy) return;
      setBusy(true);
      setInput('');

      setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: query }]);
      await sleep(260);
      if (!aliveRef.current) return;

      const reply = await respond(query);
      if (!aliveRef.current) return;

      const agentId = nextId();
      setMessages((prev) => [
        ...prev,
        { id: agentId, role: 'agent', text: '', reasoning: [], streaming: true },
      ]);

      for (const line of reply.reasoning) {
        await sleep(480);
        if (!aliveRef.current) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === agentId ? { ...m, reasoning: [...(m.reasoning ?? []), line] } : m,
          ),
        );
      }

      if (reply.tool) {
        await sleep(400);
        if (!aliveRef.current) return;
        const tool = reply.tool;
        setMessages((prev) =>
          prev.map((m) => (m.id === agentId ? { ...m, tool: { name: tool.name, arg: tool.arg } } : m)),
        );
        await sleep(680);
        if (!aliveRef.current) return;
        runAction(reply.tool.action);
      }

      await sleep(300);
      const words = reply.answer.split(' ');
      for (let i = 0; i < words.length; i++) {
        await sleep(26);
        if (!aliveRef.current) return;
        const slice = words.slice(0, i + 1).join(' ');
        setMessages((prev) => prev.map((m) => (m.id === agentId ? { ...m, text: slice } : m)));
      }

      setMessages((prev) => prev.map((m) => (m.id === agentId ? { ...m, streaming: false } : m)));
      if (aliveRef.current) setBusy(false);
    },
    [busy, respond, runAction],
  );

  return {
    bootLines,
    booted,
    messages,
    input,
    setInput,
    busy,
    send,
    hasStarted: messages.length > 0,
  };
}
