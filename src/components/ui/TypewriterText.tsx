import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TypewriterTextProps {
  /**
   * Phrase(s) to type. A single string types once and stops (caret fades).
   * Multiple strings cycle forever: type → hold → delete → next → repeat.
   */
  text: string | string[];
  /** Delay before typing starts, ms (default 350). */
  startDelay?: number;
  /** Time per character while typing, ms (default 60). */
  speed?: number;
  /** Time per character while deleting, ms (default 35). */
  deleteSpeed?: number;
  /** How long a completed phrase stays on screen before deleting, ms (default 1600). */
  holdTime?: number;
  className?: string;
}

/**
 * Typewriter headline. With a single string it reveals once on mount; with an
 * array it loops through the phrases (typing, holding, then deleting each).
 *
 * No layout shift — the longest phrase is always present in the DOM (visually
 * hidden) to reserve its size. Under `prefers-reduced-motion` the first phrase
 * is shown instantly with no caret/animation. The accessible name lists every
 * phrase; the animating characters are `aria-hidden`. The `className` (e.g. the
 * `holo-text` gradient) is applied to the typed text so it keeps its styling.
 */
const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startDelay = 350,
  speed = 60,
  deleteSpeed = 35,
  holdTime = 1600,
  className = '',
}) => {
  const reduce = useReducedMotion();
  const phrases = Array.isArray(text) ? text : [text];
  const loop = phrases.length > 1;
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), '');

  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(reduce ? phrases[0].length : 0);
  const [phase, setPhase] = useState<'typing' | 'deleting'>('typing');

  useEffect(() => {
    if (reduce) return;
    const current = phrases[index] ?? '';

    if (phase === 'typing' && count >= current.length && !loop) {
      // Single phrase finished: stop here, caret will fade.
      return;
    }

    let delay: number;
    if (phase === 'typing') {
      delay = count === 0 ? startDelay : speed;
    } else {
      delay = deleteSpeed;
    }
    if (phase === 'typing' && count >= current.length) {
      // Reached the end of the phrase — hold it before deleting.
      delay = holdTime;
    }

    const id = setTimeout(() => {
      if (phase === 'typing') {
        if (count < current.length) {
          setCount(count + 1);
        } else {
          setPhase('deleting');
        }
      } else {
        if (count > 0) {
          setCount(count - 1);
        } else {
          setIndex((index + 1) % phrases.length);
          setPhase('typing');
        }
      }
    }, delay);
    return () => clearTimeout(id);
    // phrases is a stable reference from the i18n object, so it is safe to omit.
  }, [count, phase, index, reduce, loop, speed, deleteSpeed, holdTime, startDelay]);

  // Reduced motion → plain styled first phrase, no caret.
  if (reduce) {
    return <span className={className}>{phrases[0]}</span>;
  }

  const current = phrases[index] ?? '';
  const typedDone = !loop && count >= phrases[0].length;
  const caretVisible = !typedDone;

  return (
    <span
      aria-label={phrases.join('. ')}
      role="text"
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Reserve the size of the longest phrase so cycling causes no layout shift. */}
      <span aria-hidden="true" className={className} style={{ visibility: 'hidden' }}>
        {longest}
      </span>
      {/* Visible typed text keeps the host styling (e.g. holo-text gradient). */}
      <span
        aria-hidden="true"
        className={className}
        style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'pre' }}
      >
        {current.slice(0, count)}
        {caretVisible && (
          // Caret uses a background color so it stays visible over gradient text.
          <span className="inline-block w-[2px] h-[0.85em] translate-y-[0.08em] ml-[1px] bg-brand-400 animate-blink" />
        )}
      </span>
    </span>
  );
};

export default TypewriterText;
