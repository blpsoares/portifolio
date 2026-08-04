/**
 * Client-side sanitizer for tool calls emitted by the OpenRouter model.
 *
 * The server declares the tools; the browser executes them, because the browser
 * owns the DOM. That split means the model can only ever *name* an action, and
 * everything it names passes through the whitelist below. An unknown tool, a
 * section id outside the enum, or malformed JSON resolves to null and is
 * dropped, so the model can never drive the page outside the allowed set.
 *
 * Mirrors `actionTokens.ts`, which does the same job for the in-browser model's
 * inline `[[action:…]]` protocol. Two transports, one whitelist shape.
 */
import type { AiToolCall } from './chatClient';
import type { AgentAction } from './engine';

/** Sections the model may scroll to. Matches the server-side enum in chat.ts. */
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

export interface ResolvedToolCall {
  name: string;
  arg: string;
  action: AgentAction;
}

/**
 * Map an OpenAI-style tool call to a real action, or null if it isn't allowed.
 * `contactUrls` is injected so this stays free of i18n imports.
 */
export function resolveToolCall(
  call: AiToolCall,
  contactUrls: { github: string; email: string },
): ResolvedToolCall | null {
  let args: Record<string, unknown> = {};
  try {
    const parsed: unknown = call.arguments ? JSON.parse(call.arguments) : {};
    if (parsed && typeof parsed === 'object') args = parsed as Record<string, unknown>;
  } catch {
    /* keep empty args — some tools take none */
  }

  switch (call.name) {
    case 'navigate_to_section': {
      const section = typeof args.section === 'string' ? args.section.toLowerCase() : '';
      if (!SECTIONS.has(section)) return null;
      return {
        name: 'scroll_to_section',
        arg: section,
        action: { type: 'scroll', target: section },
      };
    }

    case 'download_cv': {
      const lang = args.language === 'pt' || args.language === 'en' ? args.language : undefined;
      return { name: 'download_cv', arg: lang ?? '', action: { type: 'download_cv', locale: lang } };
    }

    case 'open_link': {
      const target = typeof args.target === 'string' ? args.target.toLowerCase() : '';
      const url =
        target === 'linkedin'
          ? 'https://linkedin.com/in/blpsoares'
          : target === 'github'
            ? `https://${contactUrls.github}`
            : target === 'email'
              ? `mailto:${contactUrls.email}`
              : '';
      if (!url) return null;
      return { name: 'open_url', arg: target, action: { type: 'open_url', url } };
    }

    default:
      return null;
  }
}
