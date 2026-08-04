/**
 * Inline action tokens — how the in-browser model drives the page.
 *
 * WebLLM only supports the OpenAI function-calling protocol on 7B/8B models
 * (`functionCallingModelIds`), which are ~4.5 GB downloads and out of the
 * question for a portfolio visitor. So actions travel as plain text instead:
 * the model writes `[[action:scroll:projects]]` and this module lifts it out of
 * the stream, turning it into a real `AgentAction`.
 *
 * The site already trains these models to emit `[[section:<id>]]` citation
 * tokens successfully, so this reuses a channel that demonstrably works.
 *
 * Security note: the model can only ever name an action; the mapping to real
 * behavior is a whitelist here on the client. An unknown name, a bad section id
 * or a malformed token resolves to null and is dropped.
 */
import type { AgentAction } from './engine';

/** Sections the model may scroll to — mirrors the list in the system prompt. */
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

/** A resolved action plus the chip metadata the chat bubble renders. */
export interface ParsedAction {
  /** Tool name shown in the UI chip. */
  name: string;
  /** Argument shown in the UI chip. */
  arg: string;
  action: AgentAction;
}

/** Matches one complete token. Arguments are restricted to a safe charset. */
const TOKEN = /\[\[action:([a-z_]+):([a-z-]+)\]\]/gi;

/**
 * Map a token to a real action, or null if it isn't on the whitelist.
 * `contactUrls` is injected so this module stays free of i18n/profile imports.
 */
export function resolveAction(
  name: string,
  arg: string,
  contactUrls: { github: string; email: string },
): ParsedAction | null {
  const n = name.toLowerCase();
  const a = arg.toLowerCase();

  if (n === 'scroll') {
    if (!SECTIONS.has(a)) return null;
    return { name: 'scroll_to_section', arg: a, action: { type: 'scroll', target: a } };
  }

  if (n === 'download_cv') {
    const locale = a === 'pt' || a === 'en' ? a : undefined;
    return { name: 'download_cv', arg: locale ?? '', action: { type: 'download_cv', locale } };
  }

  if (n === 'open') {
    const url =
      a === 'linkedin'
        ? 'https://linkedin.com/in/blpsoares'
        : a === 'github'
          ? `https://${contactUrls.github}`
          : a === 'email'
            ? `mailto:${contactUrls.email}`
            : '';
    if (!url) return null;
    return { name: 'open_url', arg: a, action: { type: 'open_url', url } };
  }

  return null;
}

/**
 * Incremental extractor for a token stream.
 *
 * Tokens arrive split across arbitrary chunk boundaries (`[[act` … `ion:scr`
 * … `oll:projects]]`), so text that *might* still become a token has to be held
 * back rather than printed and retracted. `push` returns only the text that is
 * safe to display; `flush` releases whatever is left when the stream ends.
 */
export class ActionTokenStream {
  private buffer = '';

  /**
   * Feed a chunk. Returns the display-safe text produced by it, and any
   * complete action tokens found (as raw name/arg pairs, still unresolved).
   */
  push(delta: string): { text: string; actions: { name: string; arg: string }[] } {
    this.buffer += delta;
    const actions: { name: string; arg: string }[] = [];

    // Pull out every complete token, removing it from the visible text.
    this.buffer = this.buffer.replace(TOKEN, (_match, name: string, arg: string) => {
      actions.push({ name, arg });
      return '';
    });

    // Hold back a trailing fragment that could still grow into a token. Only
    // `[[…` is ambiguous; anything before the last unclosed `[[` is settled.
    const open = this.buffer.lastIndexOf('[[');
    const safeUpTo = open !== -1 && !this.buffer.slice(open).includes(']]') ? open : this.buffer.length;

    const text = this.buffer.slice(0, safeUpTo);
    this.buffer = this.buffer.slice(safeUpTo);
    return { text, actions };
  }

  /** Release any held-back text once the stream is over. */
  flush(): string {
    const rest = this.buffer;
    this.buffer = '';
    return rest;
  }
}
