import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useI18n } from '../i18n';

interface UseCountUpOptions {
  /** Final numeric value to count up to. */
  to: number;
  /** Animation duration in milliseconds (default 1600). */
  duration?: number;
  /** Static text rendered before the number (e.g. "~"). */
  prefix?: string;
  /** Static text rendered after the number (e.g. "+", "%", "s"). */
  suffix?: string;
  /** IntersectionObserver visibility threshold (default 0.4). */
  threshold?: number;
}

interface UseCountUpResult<T extends HTMLElement = HTMLElement> {
  /** Attach to the element whose viewport entry should trigger the count. */
  ref: React.RefObject<T | null>;
  /** Fully formatted, locale-aware string ready to render. */
  value: string;
}

/** Cubic ease-out — fast start, gentle settle. */
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Animated count-up that fires ONCE when the host element enters the viewport.
 * Numbers are formatted with locale-aware thousand separators. Under
 * `prefers-reduced-motion` the final value is shown immediately (no animation).
 */
export function useCountUp<T extends HTMLElement = HTMLElement>({
  to,
  duration = 1600,
  prefix = '',
  suffix = '',
  threshold = 0.4,
}: UseCountUpOptions): UseCountUpResult<T> {
  const { locale } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<T | null>(null);
  const [current, setCurrent] = useState<number>(reduce ? to : 0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: skip animation entirely, render the final value.
    if (reduce) {
      setCurrent(to);
      return;
    }

    const startAnimation = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      let frame = 0;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setCurrent(to * easeOutCubic(progress));
        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        }
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration, reduce, threshold]);

  const formatted = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US').format(
    Math.round(current),
  );

  return { ref, value: `${prefix}${formatted}${suffix}` };
}
