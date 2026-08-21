import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';
import { matchIntent, type AgentAction } from './engine';
import { SECTIONS, PAGE_ROUTES } from './sections';
import { setSiteTheme } from './themeControls';
import { cannedReply } from './canned';
import { setAgentState } from './bus';
import { streamAiReply, AiUnavailable, getSessionId, type AiToolCall } from './chatClient';
import { logTurn, rateTurn } from './chatLog';
import { getLocalEngine, getLocalTier } from './localEngine';

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
  /** Row id in the conversation log; present once the turn has been recorded. */
  logId?: string;
  /** Verdict the visitor gave on this answer. */
  rating?: 1 | -1;
}

/**
 * Shared agent logic. Two engines, no cloud:
 *   1. the in-browser LLM (WebLLM) answers free-typed questions once loaded;
 *   2. the deterministic rule engine covers suggestion chips, devices that
 *      can't run WebGPU, and any failure of (1) — so the chat is never down.
 */
export function useAgentChat(options: { autoBoot?: boolean } = {}) {
  const { autoBoot = true } = options;
  const { t, locale, setLocale } = useI18n();
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
    (action: AgentAction): boolean => {
      switch (action.type) {
        case 'scroll': {
          // A section on the home page cannot be scrolled to from a sub-page;
          // go home first and let the hash listener land us there.
          if (window.location.hash.startsWith('#/') && window.location.hash !== '#/') {
            window.location.hash = '';
          }
          const el = document.getElementById(action.target);
          if (!el) {
            // The section was renamed or removed. Report the miss instead of
            // showing a tool chip that says it worked.
            console.warn('[bra.ia] unknown section', action.target);
            return false;
          }
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
        case 'open_page': {
          const route = PAGE_ROUTES[action.page];
          if (!route) return false;
          window.location.hash = route === '#/' ? '' : route;
          break;
        }
        case 'set_theme':
          setSiteTheme(action.theme);
          break;
        case 'set_language':
          setLocale(action.locale);
          break;
        default:
          return false;
      }
      return true;
    },
    [downloadCv, setLocale],
  );

  /**
   * Latest state of the turn in flight.
   *
   * The log needs the finished message, but `messages` is state and reading it
   * straight after a patch gives the stale value. Mirroring the patched message
   * into a ref is idempotent, so a StrictMode double-render is harmless.
   */
  const turnRef = useRef<{ id: number; msg: ChatMessage | null }>({ id: -1, msg: null });

  const patch = useCallback((id: number, fn: (m: ChatMessage) => ChatMessage) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const next = fn(m);
        if (turnRef.current.id === id) turnRef.current.msg = next;
        return next;
      }),
    );
  }, []);

  /** Best-effort read of the section the visitor is looking at right now. */
  const currentSection = (): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    const mid = window.innerHeight / 2;
    const hit = Array.from(document.querySelectorAll<HTMLElement>('[data-section]')).find((el) => {
      const r = el.getBoundingClientRect();
      return r.top <= mid && r.bottom >= mid;
    });
    return hit?.dataset.section;
  };

  /**
   * Records the finished turn, whichever brain answered it. Fire-and-forget:
   * the id comes back later and only unlocks the 👍/👎 control.
   */
  const finishTurn = useCallback(
    (agentId: number, question: string, startedAt: number, fallbackReason?: string) => {
      const msg = turnRef.current.msg;
      if (!msg || !msg.text.trim()) return;
      const source = msg.source === 'ai' ? 'cloud' : msg.source === 'webllm' ? 'webllm' : 'local';
      void logTurn({
        sessionId: getSessionId(),
        locale,
        source,
        model: msg.model,
        question,
        answer: msg.text,
        toolName: msg.tool?.name,
        toolArg: msg.tool?.arg,
        latencyMs: Date.now() - startedAt,
        fallbackReason,
        section: currentSection(),
      }).then((logId) => {
        if (logId && aliveRef.current) patch(agentId, (m) => ({ ...m, logId }));
      });
    },
    [locale, patch],
  );

  /** Sends the visitor's verdict on an answer and reflects it in the bubble. */
  const rate = useCallback(
    (messageId: number, logId: string, rating: 1 | -1) => {
      patch(messageId, (m) => ({ ...m, rating }));
      void rateTurn(logId, getSessionId(), rating);
    },
    [patch],
  );

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
      const startedAt = Date.now();
      turnRef.current = { id: agentId, msg: null };
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
          const ok = runAction(canned.tool.action);
          patch(agentId, (m) =>
            ok
              ? m.tool
                ? { ...m, tool: { ...m.tool, done: true } }
                : m
              : { ...m, tool: undefined },
          );
        }
        await sleep(160);
        const cwords = canned.answer.split(' ');
        for (let i = 0; i < cwords.length; i++) {
          await sleep(20);
          if (!aliveRef.current) return;
          patch(agentId, (m) => ({ ...m, text: cwords.slice(0, i + 1).join(' ') }));
        }
        patch(agentId, (m) => ({ ...m, streaming: false, source: 'local' }));
        finishTurn(agentId, query, startedAt, 'canned');
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
          const ok = runAction(det.tool.action);
          patch(agentId, (m) =>
            ok
              ? m.tool
                ? { ...m, tool: { ...m.tool, done: true } }
                : m
              : { ...m, tool: undefined },
          );
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
      /** Why the cloud brain declined, when it did — recorded with the turn. */
      let cloudFailure: string | undefined;

      /** Run a whitelisted action emitted by either LLM. */
      const applyAction = (resolved: { name: string; arg: string; action: AgentAction } | null) => {
        if (!resolved || !aliveRef.current || modelActed) return;
        modelActed = true;
        patch(agentId, (m) => ({ ...m, tool: { name: resolved.name, arg: resolved.arg } }));
        const ok = runAction(resolved.action);
        patch(agentId, (m) =>
          ok
            ? m.tool
              ? { ...m, tool: { ...m.tool, done: true } }
              : m
            : { ...m, tool: undefined },
        );
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
          // Free OpenRouter models don't reliably use real function-calling —
          // some just write the inline [[action:...]] token as plain text (the
          // same protocol the system prompt teaches the in-browser model).
          // Parse it the same way here so it drives the page instead of
          // leaking into the visible answer.
          const { ActionTokenStream, resolveAction } = await import('./actionTokens');
          const tokenStream = new ActionTokenStream();
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
              const { text, actions } = tokenStream.push(delta);
              for (const a of actions) {
                applyAction(resolveAction(a.name, a.arg, { github: t.cv.github, email: t.cv.email }));
              }
              if (text) patch(agentId, (m) => ({ ...m, text: m.text + text, source: 'ai' }));
            },
          });

          const trailing = tokenStream.flush();
          if (trailing) patch(agentId, (m) => ({ ...m, text: m.text + trailing, source: 'ai' }));

          honorMissedIntent();
          patch(agentId, (m) => ({
            ...m,
            reasoning: hasRealReasoning ? m.reasoning : [],
            streaming: false,
            source: 'ai',
          }));
          finishTurn(agentId, query, startedAt);
          setAgentState('idle');
          if (aliveRef.current) setBusy(false);
          return;
        } catch (cloudErr) {
          // No key, quota gone, rate limited, offline, or the endpoint is down.
          // Silently hand over: the visitor should never see a downgrade notice.
          cloudFailure =
            cloudErr instanceof AiUnavailable ? cloudErr.reason || 'unavailable' : 'error';
          if (!(cloudErr instanceof AiUnavailable)) console.error('cloud agent error', cloudErr);
          if (!aliveRef.current) return;
          patch(agentId, (m) => ({ ...m, text: '', reasoning: [placeholder], tool: undefined }));
          modelActed = false;
        }

        // ---- Brain 2: the in-browser model ----
        if (!localReady) throw new Error('local_not_ready');
        await answerLocally();
        finishTurn(agentId, query, startedAt, cloudFailure);
        setAgentState('idle');
        if (aliveRef.current) setBusy(false);
        return;
      } catch (err) {
        // ---- Brain 3: the rule engine, the floor that always answers ----
        console.error('local agent error', err);
        if (!aliveRef.current) return;
        patch(agentId, (m) => ({ ...m, text: '', reasoning: [], tool: undefined }));
        await answerDeterministically();
        finishTurn(agentId, query, startedAt, cloudFailure ?? 'local_engine');
        setAgentState('idle');
        if (aliveRef.current) setBusy(false);
      }
    },
    [busy, locale, t, runAction, patch, finishTurn],
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
    rate,
    hasStarted: messages.length > 0,
  };
}
