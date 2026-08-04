import React from 'react';

/**
 * Small emblem for each local model, drawn inline as SVG.
 *
 * Inline because a strict CSP forbids remote images, and original marks rather
 * than the vendors' trademarked logos: each card also names the lab in text, so
 * the emblem only has to be a recognizable, consistent visual anchor.
 */

type Props = { size?: number; className?: string };

/** Meta (Llama): two interlocking loops, echoing the infinity motif. */
const MetaMark: React.FC<Props> = ({ size = 18, className }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none">
    <path
      d="M3 15.2c0-4.2 2.1-8 4.9-8 2.2 0 3.5 1.9 4.6 4.1 1.1-2.2 2.5-4.1 4.6-4.1 2.8 0 4.9 3.8 4.9 8 0 2-.9 3.3-2.4 3.3-1.9 0-3-1.7-4.4-4.6-.9-1.9-1.7-3.3-2.7-3.3s-1.8 1.4-2.7 3.3C8.4 16.8 7.3 18.5 5.4 18.5 3.9 18.5 3 17.2 3 15.2Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

/** Alibaba (Qwen): a faceted diamond, nodding to the origami-style mark. */
const QwenMark: React.FC<Props> = ({ size = 18, className }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none">
    <path
      d="M12 2.5 21 8v8l-9 5.5L3 16V8l9-5.5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M12 8.2 16.2 11v4.2L12 17.6 7.8 15.2V11L12 8.2Z" fill="currentColor" opacity="0.85" />
  </svg>
);

/** Hugging Face (SmolLM2): a face between two open hands. */
const HuggingMark: React.FC<Props> = ({ size = 18, className }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none">
    <circle cx="12" cy="11" r="6.4" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="9.9" cy="9.7" r="1" fill="currentColor" />
    <circle cx="14.1" cy="9.7" r="1" fill="currentColor" />
    <path d="M9.6 13.4c.7.8 1.5 1.2 2.4 1.2s1.7-.4 2.4-1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M4.6 13.2c-.9.5-1.2 1.5-.8 2.3.4.8 1.4 1 2.3.6M19.4 13.2c.9.5 1.2 1.5.8 2.3-.4.8-1.4 1-2.3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const MARKS: Record<string, React.FC<Props>> = {
  meta: MetaMark,
  alibaba: QwenMark,
  hf: HuggingMark,
};

/** Brand-ish tint per lab, kept subtle so the cards stay one family. */
const TINTS: Record<string, string> = {
  meta: 'text-[#0866FF] bg-[#0866FF]/10',
  alibaba: 'text-[#7C5CFF] bg-[#7C5CFF]/10',
  hf: 'text-[#FF9D00] bg-[#FF9D00]/10',
};

/** Rounded badge holding the emblem. */
const ModelLogo: React.FC<{ brand: string; size?: number }> = ({ brand, size = 18 }) => {
  const Mark = MARKS[brand];
  if (!Mark) return null;
  return (
    <span
      className={`grid place-items-center shrink-0 w-8 h-8 rounded-xl ${TINTS[brand] ?? 'text-slate-500 bg-slate-500/10'}`}
    >
      <Mark size={size} />
    </span>
  );
};

export default ModelLogo;
