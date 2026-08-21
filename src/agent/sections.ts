/**
 * Single source of truth for what the agent is allowed to drive.
 *
 * These lists used to be copy-pasted into four places (`actionTokens.ts`,
 * `cloudTools.ts`, `useAgentChat.ts` and the server tool schema). They drifted:
 * the agent kept a whitelist entry for a section that no longer existed and had
 * no entry for the ones that did, so it silently refused to navigate to them.
 *
 * The server keeps its own copy in `functions/api/chat.ts` because Pages
 * Functions are bundled separately and cannot import from `src/` — that copy is
 * marked and must be kept in sync with this file.
 */

/** In-page sections, in the order they appear on the home page. */
export const SECTION_IDS = [
  'profile',
  'about',
  'stack',
  'projects',
  'career',
  'education',
  'articles',
  'open-source',
  'ai-usage',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTIONS: ReadonlySet<string> = new Set(SECTION_IDS);

/** Standalone pages the agent may open, mapped to their hash route. */
export const PAGE_ROUTES: Record<string, string> = {
  home: '#/',
  articles: '#/articles',
  'open-source': '#/open-source',
};

export const PAGE_IDS = Object.keys(PAGE_ROUTES);

export const isSection = (value: string): value is SectionId => SECTIONS.has(value);
