import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';
import { matchIntent, type AgentAction } from './engine';
import { cannedReply } from './canned';
import { setAgentState } from './bus';
import { streamAiReply, AiUnavailable, type AiToolCall } from './chatClient';
import type { Translations } from '../i18n';

/** Whitelisted section ids the model may navigate to (matches the server enum). */
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

/** A resolved, client-executable tool call: chip metadata + the action to run. */
interface ResolvedToolCall {
  name: string;
  arg: string;
  action: AgentAction;
}

/**
 * Sanitize a model-emitted tool call on the CLIENT and map it to an
 * AgentAction. Anything outside the whitelist (unknown tool, bad section,
 * malformed JSON) returns null and is ignored — the model can never drive the
 * page outside the allowed set.
 */
function resolveToolCall(call: AiToolCall, t: Translations): ResolvedToolCall | null {
  let args: Record<string, unknown> = {};
  try {
    const parsed: unknown = call.arguments ? JSON.parse(call.arguments) : {};
    if (parsed && typeof parsed === 'object') args = parsed as Record<string, unknown>;
  } catch {
    /* keep empty args — some tools take none */
  }

  switch (call.name) {
    case 'navigate_to_section': {
      const section = typeof args.section === 'string' ? args.section : '';
      if (!SECTIONS.has(section)) return null;
      return {
        name: 'scroll_to_section',
        arg: section,
        action: { type: 'scroll', target: section },
      };
    }
    case 'download_cv': {
      const lang = args.language === 'pt' || args.language === 'en' ? args.language : undefined;
      return {
        name: 'download_cv',
        arg: lang ?? '',
        action: { type: 'download_cv', locale: lang },
      };
    }
    case 'open_link': {
      const target = typeof args.target === 'string' ? args.target : '';
      const url =
        target === 'linkedin'
          ? 'https://linkedin.com/in/blpsoares'
          : target === 'github'
            ? `https://${t.cv.github}`
            : target === 'email'
              ? `mailto:${t.cv.email}`
              : '';
      if (!url) return null;
      return { name: 'open_url', arg: target, action: { type: 'open_url', url } };
    }
    default:
      return null;
  }
}

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
      // A single minimal placeholder line. Real reasoning (when the model
      // streams it) REPLACES this; plain models keep just this line until the
      // answer starts. We never invent multi-line fake "thoughts".
      const placeholder = L('conectando ao modelo…', 'connecting to the model…');
      let hasRealReasoning = false;
      // Track whether the model itself drove the page, so we only fall back to
      // the deterministic detector when it did NOT (non-tool models).
      let modelActed = false;
      // Buffer incremental reasoning so we render readable lines, not tokens.
      let reasoningBuf = '';

      try {
        patch(agentId, (m) => ({ ...m, reasoning: [placeholder] }));

        await streamAiReply({
          query,
          locale,
          onModel: (model) => {
            if (!aliveRef.current) return;
            patch(agentId, (m) => ({ ...m, model }));
          },
          onReasoning: (delta) => {
            if (!aliveRef.current) return;
            // First real reasoning token wipes the placeholder.
            if (!hasRealReasoning) {
              hasRealReasoning = true;
              reasoningBuf = '';
            }
            reasoningBuf += delta;
            // Split into non-empty lines; the last (possibly partial) line is
            // shown live too so streaming feels continuous.
            const lines = reasoningBuf
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean);
            patch(agentId, (m) => ({ ...m, reasoning: lines }));
          },
          onToolCall: (call) => {
            if (!aliveRef.current) return;
            const resolved = resolveToolCall(call, t);
            if (!resolved) return; // outside whitelist → ignored
            modelActed = true;
            patch(agentId, (m) => ({ ...m, tool: { name: resolved.name, arg: resolved.arg } }));
            runAction(resolved.action);
            patch(agentId, (m) =>
              m.tool ? { ...m, tool: { ...m.tool, done: true } } : m,
            );
          },
          onChunk: (delta) => {
            if (!aliveRef.current) return;
            patch(agentId, (m) => ({ ...m, text: m.text + delta, source: 'ai' }));
          },
        });

        // FALLBACK for models without tool support: if the model never emitted
        // a usable tool call, honor explicit side-effect requests (download CV,
        // open contact link) via the deterministic detector — without
        // hijacking the conversation with scrolls.
        if (!modelActed) {
          const det = matchIntent(query, t, locale);
          if (
            det.tool &&
            (det.tool.action.type === 'download_cv' || det.tool.action.type === 'open_url')
          ) {
            runAction(det.tool.action);
          }
        }
        // If no real reasoning ever arrived, clear the placeholder so nothing
        // fake lingers next to the final answer.
        patch(agentId, (m) => ({
          ...m,
          reasoning: hasRealReasoning ? m.reasoning : [],
          streaming: false,
          source: 'ai',
        }));
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

  return {
    bootLines,
    booted,
    messages,
    input,
    setInput,
    busy,
    limited,
    send,
    scrollToSection,
    hasStarted: messages.length > 0,
  };
}
