import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Compact, chat-friendly Markdown renderer. Raw HTML is NOT rendered (no
 * rehype-raw), so model output is safe. Styled to read well inside a small bubble.
 * `node` is stripped from every component so it never leaks onto the DOM.
 */
const components: Components = {
  p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
  a: ({ node, ...props }) => (
    <a
      className="text-brand-600 dark:text-brand-400 underline underline-offset-2 break-words hover:opacity-80"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
  li: ({ node, ...props }) => <li className="marker:text-slate-400 dark:marker:text-slate-500" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900 dark:text-white" {...props} />,
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
  code: ({ node, className, children, ...props }) => {
    const isBlock = /language-/.test(className || '');
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/60 font-mono text-[0.85em]"
        {...props}
      >
        {children}
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
  td: ({ node, ...props }) => <td className="border border-slate-200 dark:border-slate-700 px-2 py-1" {...props} />,
};

const Markdown: React.FC<{ children: string }> = ({ children }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
    {children}
  </ReactMarkdown>
);

export default Markdown;
