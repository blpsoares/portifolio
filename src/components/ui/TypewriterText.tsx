import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TypewriterTextProps {
  /** The final text to type out. */
  text: string;
  /** Delay before typing starts, ms (default 350). */
  startDelay?: number;
  /** Time per character, ms (default 60). */
  speed?: number;
  className?: string;
}

/**
 * Renders `text` with a one-time typewriter reveal on mount: characters appear
 * left-to-right with a blinking caret that disappears once typing finishes.
 *
 * No layout shift — the full string is always present in the DOM (visually
 * hidden) to reserve its final size. Under `prefers-reduced-motion` the real
 * text is shown instantly with no caret. The accessible name is always the real
 * text; the animating characters are `aria-hidden`. The `className` (e.g. the
 * `holo-text` gradient) is applied to the typed text so it keeps its styling.
 */
const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startDelay = 350,
  speed = 60,
  className = '',
}) => {
  const reduce = useReducedMotion();
  const [count, setCount] = useState<number>(reduce ? text.length : 0);
  const [done, setDone] = useState<boolean>(!!reduce);

  useEffect(() => {
    if (reduce) {
      setCount(text.length);
      setDone(true);
      return;
    }
    setCount(0);
    setDone(false);
    const timers: ReturnType<typeof setTimeout>[] = [];
    const startTimer = setTimeout(() => {
      let i = 0;
      const step = () => {
        i += 1;
        setCount(i);
        if (i < text.length) {
          timers.push(setTimeout(step, speed));
        } else {
          setDone(true);
        }
      };
      step();
    }, startDelay);
    timers.push(startTimer);
    return () => timers.forEach(clearTimeout);
    // Runs once per text value on mount.
  }, [text, speed, startDelay, reduce]);

  // Reduced motion → plain styled text, no caret.
  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      aria-label={text}
      role="text"
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Reserve the final size so typing causes no layout shift. */}
      <span aria-hidden="true" className={className} style={{ visibility: 'hidden' }}>
        {text}
      </span>
      {/* Visible typed text keeps the host styling (e.g. holo-text gradient). */}
      <span
        aria-hidden="true"
        className={className}
        style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'pre' }}
      >
        {text.slice(0, count)}
        {!done && (
          // Caret uses a background color so it stays visible over gradient text.
          <span className="inline-block w-[2px] h-[0.85em] translate-y-[0.08em] ml-[1px] bg-brand-400 animate-blink" />
        )}
      </span>
    </span>
  );
};

export default TypewriterText;
