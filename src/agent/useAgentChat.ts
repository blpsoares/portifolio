import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';
import { matchIntent, type AgentAction } from './engine';
import { cannedReply } from './canned';
import { setAgentState } from './bus';
import { streamAiReply, AiUnavailable } from './chatClient';

/** Small awaitable delay used to pace the "agent" output. */
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Role = 'user' | 'agent';

export interface ChatMessage {
  id: number;
  role: Role;
  text: string;
  reasoning?: string[];
  tool?: { name: string; arg: string; done?: boolean };
  streaming?: boolean;
  /** which brain produced the answer */
  source?: 'ai' | 'local';
  /** the exact model id that answered (ai only) */
  model?: string;
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
  // True while the AI is rate-limited / out of quota — blocks free-typed input
  // (suggestion chips keep working since they're answered locally).
  const [limited, setLimited] = useState(false);

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
      setAgentState('thinking');
      setInput('');

      setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: query }]);
      await sleep(200);
      if (!aliveRef.current) return;

      const agentId = nextId();
      setMessages((prev) => [
        ...prev,
        { id: agentId, role: 'agent', text: '', reasoning: [], streaming: true },
      ]);

      // ===== 0) Pre-fixed suggestion chips → instant canned answer (no LLM) =====
      const canned = cannedReply(query, locale);
      if (canned) {
        if (canned.tool) {
          await sleep(220);
          if (!aliveRef.current) return;
          const tool = canned.tool;
          patch(agentId, (m) => ({ ...m, tool: { name: tool.name, arg: tool.arg } }));
          await sleep(420);
          if (!aliveRef.current) return;
          runAction(canned.tool.action);
          patch(agentId, (m) => (m.tool ? { ...m, tool: { ...m.tool, done: true } } : m));
        }
        await sleep(160);
        const cwords = canned.answer.split(' ');
        for (let i = 0; i < cwords.length; i++) {
          await sleep(20);
          if (!aliveRef.current) return;
          patch(agentId, (m) => ({ ...m, text: cwords.slice(0, i + 1).join(' ') }));
        }
        patch(agentId, (m) => ({ ...m, streaming: false }));
        setAgentState('idle');
        if (aliveRef.current) setBusy(false);
        return;
      }

      // ===== 1) Free-typed questions → real AI =====
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
          onModel: (model) => {
            if (!aliveRef.current) return;
            patch(agentId, (m) => ({ ...m, model }));
          },
          onChunk: (delta) => {
            if (!aliveRef.current) return;
            patch(agentId, (m) => ({ ...m, text: m.text + delta, source: 'ai' }));
          },
        });

        // The LLM answers in words but can't drive the page. Honor explicit
        // side-effect requests (download CV, open contact link) via the
        // deterministic detector — without hijacking with scrolls.
        const det = matchIntent(query, t, locale);
        if (det.tool && (det.tool.action.type === 'download_cv' || det.tool.action.type === 'open_url')) {
          runAction(det.tool.action);
        }
        patch(agentId, (m) => ({ ...m, streaming: false, source: 'ai' }));
        setAgentState('idle');
        if (aliveRef.current) setBusy(false);
        return;
      } catch (err) {
        // OpenRouter unavailable (no key / quota exhausted / rate-limited /
        // offline / local dev). No deterministic answer fallback — show a clean
        // message. If it's a usage limit, block the input for a cooldown
        // (suggestion chips still work, since those are answered locally).
        if (!(err instanceof AiUnavailable)) console.error('agent error', err);
        if (!aliveRef.current) return;
        const reason = err instanceof AiUnavailable ? err.reason : 'unavailable';
        const isLimit = reason === 'quota' || reason === 'rate_limited';
        patch(agentId, (m) => ({
          ...m,
          reasoning: [],
          tool: undefined,
          text: isLimit ? t.agent.limitReached : t.agent.unavailable,
          streaming: false,
          source: undefined,
        }));
        if (isLimit) {
          setLimited(true);
          const cooldown = reason === 'rate_limited' ? 45000 : 5 * 60000;
          const tm = setTimeout(() => {
            if (aliveRef.current) setLimited(false);
            timersRef.current.delete(tm);
          }, cooldown);
          timersRef.current.add(tm);
        }
        setAgentState('idle');
        if (aliveRef.current) setBusy(false);
      }
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
    limited,
    send,
    hasStarted: messages.length > 0,
  };
}
