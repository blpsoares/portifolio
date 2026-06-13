import React, { useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Whitelisted grounding-citation section ids (matches the server enum). */
const CITE_SECTIONS = new Set([
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

const CITE_PREFIX = 'cite:';

/**
 * Rewrite the model's grounding tokens `[[section:<id>]]` into ordinary
 * markdown links with a `cite:<id>` href, so they flow naturally through the
 * markdown pipeline and get rendered as clickable chips by the `a` component.
 * Unknown/malformed ids are left as plain text (never break layout). The chip
 * label is resolved client-side via the provided `labels` map.
 */
function transformCitations(src: string, labels: Record<string, string>): string {
  return src.replace(/\[\[section:([a-z-]+)\]\]/gi, (whole, rawId: string) => {
    const id = rawId.toLowerCase();
    if (!CITE_SECTIONS.has(id)) return whole; // leave malformed token as-is
    const label = labels[id] ?? id;
    // Escape any ] in the label defensively (labels are controlled, but safe).
    return `[↳ ${label.replace(/]/g, '')}](${CITE_PREFIX}${id})`;
  });
}

interface MarkdownProps {
  children: string;
  /** Click handler for a grounding citation chip (a whitelisted section id). */
  onCite?: (section: string) => void;
  /** Localized chip labels keyed by section id. */
  citationLabels?: Record<string, string>;
}

/**
 * Compact, chat-friendly Markdown renderer. Raw HTML is NOT rendered (no
 * rehype-raw), so model output is safe. Styled to read well inside a small
 * bubble. Also turns `[[section:<id>]]` grounding tokens into clickable chips.
 */
const Markdown: React.FC<MarkdownProps> = ({ children, onCite, citationLabels }) => {
  const labels = citationLabels ?? {};

  const components: Components = useMemo(
    () => ({
      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
      a: ({ node, href, children: linkChildren, ...props }) => {
        // Grounding citation → render as a clickable chip, not an anchor.
        if (typeof href === 'string' && href.startsWith(CITE_PREFIX)) {
          const section = href.slice(CITE_PREFIX.length);
          if (CITE_SECTIONS.has(section)) {
            return (
              <button
                type="button"
                onClick={() => onCite?.(section)}
                className="inline-flex items-center gap-0.5 align-baseline mx-0.5 px-1.5 py-0.5 rounded-md bg-brand-500/10 border border-brand-500/20 text-[11px] font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-500/20 transition-colors"
              >
                {linkChildren}
              </button>
            );
          }
          // Unknown section slipped through → render label as plain text.
          return <>{linkChildren}</>;
        }
        return (
          <a
            href={href}
            className="text-brand-600 dark:text-brand-400 underline underline-offset-2 break-words hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {linkChildren}
          </a>
        );
      },
      ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
      ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
      li: ({ node, ...props }) => (
        <li className="marker:text-slate-400 dark:marker:text-slate-500" {...props} />
      ),
      strong: ({ node, ...props }) => (
        <strong className="font-semibold text-slate-900 dark:text-white" {...props} />
      ),
      em: ({ node, ...props }) => <em className="italic" {...props} />,
      h1: ({ node, ...props }) => <h3 className="font-semibold text-[15px] mt-1 mb-1.5" {...props} />,
      h2: ({ node, ...props }) => <h3 className="font-semibold text-sm mt-1 mb-1.5" {...props} />,
      h3: ({ node, ...props }) => <h3 className="font-semibold text-sm mt-1 mb-1" {...props} />,
      blockquote: ({ node, ...props }) => (
        <blockquote
          className="border-l-2 border-brand-500/40 pl-3 italic text-slate-600 dark:text-slate-400 my-2"
          {...props}
        />
      ),
      hr: () => <hr className="my-2.5 border-slate-200 dark:border-slate-700" />,
      pre: ({ node, ...props }) => (
        <pre
          className="my-2 p-2.5 rounded-lg bg-slate-900 dark:bg-black/40 text-slate-100 overflow-x-auto text-[12px] leading-relaxed hide-scrollbar"
          {...props}
        />
      ),
      code: ({ node, className, children: codeChildren, ...props }) => {
        const isBlock = /language-/.test(className || '');
        if (isBlock) {
          return (
            <code className={className} {...props}>
              {codeChildren}
            </code>
          );
        }
        return (
          <code
            className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/60 font-mono text-[0.85em]"
            {...props}
          >
            {codeChildren}
          </code>
        );
      },
      table: ({ node, ...props }) => (
        <div className="overflow-x-auto my-2 hide-scrollbar">
          <table className="text-[12px] border-collapse w-full" {...props} />
        </div>
      ),
      th: ({ node, ...props }) => (
        <th
          className="border border-slate-300 dark:border-slate-600 px-2 py-1 font-semibold text-left"
          {...props}
        />
      ),
      td: ({ node, ...props }) => (
        <td className="border border-slate-200 dark:border-slate-700 px-2 py-1" {...props} />
      ),
    }),
    [onCite],
  );

  const text = useMemo(() => transformCitations(children, labels), [children, labels]);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {text}
    </ReactMarkdown>
  );
};

export default Markdown;
