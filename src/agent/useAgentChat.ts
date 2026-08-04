import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';
import { matchIntent, type AgentAction } from './engine';
import { cannedReply } from './canned';
import { setAgentState } from './bus';
import { streamAiReply, AiUnavailable, type AiToolCall } from './chatClient';
import { getLocalEngine, getLocalTier } from './localEngine';

/** Whitelisted section ids the agent may navigate to. */
const SECTIONS = new Set([
  'profile',
  'about',
  'stack',
  'lowcode',
  'mcp',
  'projects',
  'career',
  'education',
  'learning',
  'ai-usage',
]);

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
  /** which engine produced the answer: in-browser LLM, or the rule engine */
  source?: 'ai' | 'webllm' | 'local';
  /** the exact model id that answered (ai only) */
  model?: string;
}

/**
 * Shared agent logic. Two engines, no cloud:
 *   1. the in-browser LLM (WebLLM) answers free-typed questions once loaded;
 *   2. the deterministic rule engine covers suggestion chips, devices that
 *      can't run WebGPU, and any failure of (1) — so the chat is never down.
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

      // ===== 1) Free-typed questions → three brains, in order =====
      // A single minimal placeholder line, replaced by the answer as soon as
      // the first token lands. We never invent fake "thoughts".
      const placeholder = L('pensando…', 'thinking…');

      // OpenRouter answers best and works on every device, so it leads. The
      // in-browser model catches quota/rate-limit/offline without the visitor
      // noticing, and the rule engine is the floor that keeps the chat alive
      // when neither LLM can serve.
      const localReady = getLocalEngine() !== null;

      /** Deterministic engine: rule-based answer + its side effects. */
      const answerDeterministically = async () => {
        const det = matchIntent(query, t, locale);
        if (det.tool) {
          await sleep(220);
          if (!aliveRef.current) return;
          const tool = det.tool;
          patch(agentId, (m) => ({ ...m, tool: { name: tool.name, arg: tool.arg } }));
          await sleep(400);
          if (!aliveRef.current) return;
          runAction(det.tool.action);
          patch(agentId, (m) => (m.tool ? { ...m, tool: { ...m.tool, done: true } } : m));
        }
        const words = det.answer.split(' ');
        for (let i = 0; i < words.length; i++) {
          await sleep(20);
          if (!aliveRef.current) return;
          patch(agentId, (m) => ({ ...m, text: words.slice(0, i + 1).join(' ') }));
        }
        patch(agentId, (m) => ({ ...m, reasoning: [], streaming: false, source: 'local' }));
      };

      // Did an LLM drive the page itself? Decides whether the rule-based
      // detector needs to step in afterwards.
      let modelActed = false;

      /** Run a whitelisted action emitted by either LLM. */
      const applyAction = (resolved: { name: string; arg: string; action: AgentAction } | null) => {
        if (!resolved || !aliveRef.current || modelActed) return;
        modelActed = true;
        patch(agentId, (m) => ({ ...m, tool: { name: resolved.name, arg: resolved.arg } }));
        runAction(resolved.action);
        patch(agentId, (m) => (m.tool ? { ...m, tool: { ...m.tool, done: true } } : m));
      };

      /** Side effects the LLM asked for in prose but never emitted as an action. */
      const honorMissedIntent = () => {
        if (modelActed) return;
        const det = matchIntent(query, t, locale);
        if (
          det.tool &&
          (det.tool.action.type === 'download_cv' || det.tool.action.type === 'open_url')
        ) {
          runAction(det.tool.action);
        }
      };

      /** In-browser model. Throws if it can't serve, so the caller can fall through. */
      const answerLocally = async () => {
        // Loaded on demand so the grounding prompt never ships in the initial
        // bundle — it's only needed once a local model is live.
        const { streamLocalReply } = await import('./localChatClient');
        const { resolveAction } = await import('./actionTokens');

        await streamLocalReply({
          query,
          locale,
          onModel: (model) => {
            if (!aliveRef.current) return;
            patch(agentId, (m) => ({ ...m, model }));
          },
          onAction: (name, arg) =>
            applyAction(resolveAction(name, arg, { github: t.cv.github, email: t.cv.email })),
          onChunk: (delta) => {
            if (!aliveRef.current) return;
            patch(agentId, (m) => ({ ...m, text: m.text + delta, source: 'webllm' }));
          },
        });

        honorMissedIntent();
        patch(agentId, (m) => ({ ...m, reasoning: [], streaming: false, source: 'webllm' }));
      };

      try {
        patch(agentId, (m) => ({ ...m, reasoning: [placeholder] }));

        // ---- Brain 1: OpenRouter ----
        let hasRealReasoning = false;
        let reasoningBuf = '';
        try {
          const { resolveToolCall } = await import('./cloudTools');
          await streamAiReply({
            query,
            locale,
            onModel: (model) => {
              if (!aliveRef.current) return;
              patch(agentId, (m) => ({ ...m, model }));
            },
            onReasoning: (delta) => {
              if (!aliveRef.current) return;
              if (!hasRealReasoning) {
                hasRealReasoning = true;
                reasoningBuf = '';
              }
              reasoningBuf += delta;
              const lines = reasoningBuf.split('\n').map((x) => x.trim()).filter(Boolean);
              patch(agentId, (m) => ({ ...m, reasoning: lines }));
            },
            onToolCall: (call: AiToolCall) =>
              applyAction(resolveToolCall(call, { github: t.cv.github, email: t.cv.email })),
            onChunk: (delta) => {
              if (!aliveRef.current) return;
              patch(agentId, (m) => ({ ...m, text: m.text + delta, source: 'ai' }));
            },
          });

          honorMissedIntent();
          patch(agentId, (m) => ({
            ...m,
            reasoning: hasRealReasoning ? m.reasoning : [],
            streaming: false,
            source: 'ai',
          }));
          setAgentState('idle');
          if (aliveRef.current) setBusy(false);
          return;
        } catch (cloudErr) {
          // No key, quota gone, rate limited, offline, or the endpoint is down.
          // Silently hand over: the visitor should never see a downgrade notice.
          if (!(cloudErr instanceof AiUnavailable)) console.error('cloud agent error', cloudErr);
          if (!aliveRef.current) return;
          patch(agentId, (m) => ({ ...m, text: '', reasoning: [placeholder], tool: undefined }));
          modelActed = false;
        }

        // ---- Brain 2: the in-browser model ----
        if (!localReady) throw new Error('local_not_ready');
        await answerLocally();
        setAgentState('idle');
        if (aliveRef.current) setBusy(false);
        return;
      } catch (err) {
        // ---- Brain 3: the rule engine, the floor that always answers ----
        console.error('local agent error', err);
        if (!aliveRef.current) return;
        patch(agentId, (m) => ({ ...m, text: '', reasoning: [], tool: undefined }));
        await answerDeterministically();
        setAgentState('idle');
        if (aliveRef.current) setBusy(false);
      }
    },
    [busy, locale, t, runAction, patch],
  );

  // Used by clickable grounding citations ([[section:<id>]]) rendered inside
  // answers. Whitelisted client-side so a malformed token never scrolls
  // anywhere unexpected.
  const scrollToSection = useCallback(
    (section: string) => {
      if (!SECTIONS.has(section)) return;
      runAction({ type: 'scroll', target: section });
    },
    [runAction],
  );

  /**
   * Inject a proactive agent message (used by the local-model greeting). It's
   * typed out word by word so it reads as bra.ia talking, not as a banner.
   */
  const greet = useCallback(async (text: string) => {
    const id = nextId();
    setMessages((prev) => {
      // Never interrupt an ongoing conversation with a proactive hello.
      if (prev.length > 0) return prev;
      return [...prev, { id, role: 'agent', text: '', streaming: true }];
    });
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      await sleep(28);
      if (!aliveRef.current) return;
      patch(id, (m) => ({ ...m, text: words.slice(0, i + 1).join(' ') }));
    }
    // Same provenance badge as any other answer, model name included.
    patch(id, (m) => ({
      ...m,
      streaming: false,
      source: 'webllm',
      model: getLocalTier()?.label,
    }));
  }, [patch]);

  return {
    bootLines,
    booted,
    messages,
    input,
    setInput,
    busy,
    send,
    greet,
    scrollToSection,
    hasStarted: messages.length > 0,
  };
}
