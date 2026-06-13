import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface DecryptTextProps {
  /** The final, real text to resolve to. */
  text: string;
  /** Total animation duration in ms (default 800). */
  duration?: number;
  className?: string;
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}=+*^?#';
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/** Cubic ease-out so glyphs resolve quickly then settle. */
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Renders `text` with a one-time "decrypt" reveal on mount: random glyphs
 * scramble into the real characters left-to-right over `duration`.
 *
 * No layout shift — the final string is always present in the DOM (visually
 * hidden) to reserve its size. Under `prefers-reduced-motion` the real text is
 * shown instantly. The accessible name is always the real text; the animating
 * glyphs are `aria-hidden`.
 */
const DecryptText: React.FC<DecryptTextProps> = ({ text, duration = 800, className = '' }) => {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState<string>(text);
  const [done, setDone] = useState<boolean>(!!reduce);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      setDone(true);
      return;
    }
    setDone(false);
    const start = performance.now();
    const chars = text.split('');

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(progress);
      // Number of fully-resolved characters grows with eased progress.
      const resolved = Math.floor(eased * chars.length);
      const next = chars
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < resolved) return ch;
          return randomGlyph();
        })
        .join('');
      setDisplay(next);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
        setDone(true);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
    // Run once on mount per text value.
  }, [text, duration, reduce]);

  // When finished (or under reduced motion) render the real text directly so it
  // keeps the host styling (e.g. holo-text gradient) with no positioning quirks.
  if (done) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={className}
      aria-label={text}
      role="text"
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Reserve the final size so animating glyphs cause no layout shift. */}
      <span aria-hidden="true" style={{ visibility: 'hidden' }}>
        {text}
      </span>
      <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0 }}>
        {display}
      </span>
    </span>
  );
};

export default DecryptText;
