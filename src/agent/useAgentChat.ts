import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';
import { matchIntent, type AgentAction } from './engine';
import { streamAiReply, AiUnavailable } from './chatClient';

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
  /** which brain produced the answer */
  source?: 'ai' | 'local';
}

/**
 * Shared "agent brain". Hybrid by design:
 *   1. tries the real AI (OpenRouter via /api/chat) and streams its answer;
 *   2. on any failure (no key, free quota exhausted, rate limit, offline, or
 *      local dev where the function doesn't exist) it gracefully falls back to
 *      the deterministic engine. The site is never "down".
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

  // BOOT SEQUENCE (only when enabled)
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

  const patch = useCallback((id: number, fn: (m: ChatMessage) => ChatMessage) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? fn(m) : m)));
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const query = raw.trim();
      if (!query || busy) return;
      const L = (pt: string, en: string) => (locale === 'pt' ? pt : en);

      setBusy(true);
      setInput('');

      setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: query }]);
      await sleep(200);
      if (!aliveRef.current) return;

      const agentId = nextId();
      setMessages((prev) => [
        ...prev,
        { id: agentId, role: 'agent', text: '', reasoning: [], streaming: true },
      ]);

      // ===== 1) Try the real AI =====
      try {
        const thinking = [
          L('conectando ao modelo…', 'connecting to the model…'),
          L('recuperando contexto do CV…', 'retrieving CV context…'),
        ];
        for (const line of thinking) {
          await sleep(360);
          if (!aliveRef.current) return;
          patch(agentId, (m) => ({ ...m, reasoning: [...(m.reasoning ?? []), line] }));
        }

        await streamAiReply({
          query,
          locale,
          onChunk: (delta) => {
            if (!aliveRef.current) return;
            patch(agentId, (m) => ({ ...m, text: m.text + delta, source: 'ai' }));
          },
        });

        patch(agentId, (m) => ({ ...m, streaming: false, source: 'ai' }));
        if (aliveRef.current) setBusy(false);
        return;
      } catch (err) {
        if (!(err instanceof AiUnavailable)) console.error('agent error', err);
        if (!aliveRef.current) return;
        patch(agentId, (m) => ({ ...m, reasoning: [], text: '', source: 'local' }));
      }

      // ===== 2) Deterministic fallback =====
      const reply = matchIntent(query, t, locale);

      for (const line of reply.reasoning) {
        await sleep(440);
        if (!aliveRef.current) return;
        patch(agentId, (m) => ({ ...m, reasoning: [...(m.reasoning ?? []), line] }));
      }

      if (reply.tool) {
        await sleep(380);
        if (!aliveRef.current) return;
        const tool = reply.tool;
        patch(agentId, (m) => ({ ...m, tool: { name: tool.name, arg: tool.arg } }));
        await sleep(660);
        if (!aliveRef.current) return;
        runAction(reply.tool.action);
      }

      await sleep(280);
      const words = reply.answer.split(' ');
      for (let i = 0; i < words.length; i++) {
        await sleep(24);
        if (!aliveRef.current) return;
        patch(agentId, (m) => ({ ...m, text: words.slice(0, i + 1).join(' ') }));
      }

      patch(agentId, (m) => ({ ...m, streaming: false }));
      if (aliveRef.current) setBusy(false);
    },
    [busy, locale, t, runAction, patch],
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
