import { useCallback, useRef } from 'react';
import { useMotionValue, useSpring, useReducedMotion, type MotionValue } from 'framer-motion';

interface UseMagneticOptions {
  /** Maximum translation in px applied toward the cursor (default 8). */
  strength?: number;
  /** Activation radius in px around the element center (default 120). */
  radius?: number;
}

interface UseMagneticResult<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T | null>;
  /** Spread onto the motion element's `style` prop. */
  style: { x: MotionValue<number>; y: MotionValue<number> };
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

/**
 * Magnetic pull effect: the element drifts a few px toward the cursor while it
 * is within `radius`, then springs back on mouse leave. Mirrors the
 * useMotionValue + useSpring pattern used in Hero.tsx.
 *
 * Fully inert under `prefers-reduced-motion` and on coarse (touch) pointers —
 * it never shifts the click target for keyboard or touch users.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>({
  strength = 8,
  radius = 120,
}: UseMagneticOptions = {}): UseMagneticResult<T> {
  const reduce = useReducedMotion();
  const ref = useRef<T | null>(null);

  const spring = { stiffness: 220, damping: 18, mass: 0.4 };
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      // Guard: disabled when reduced-motion or on non-fine pointers (touch).
      if (reduce || !el || !window.matchMedia('(pointer: fine)').matches) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.hypot(dx, dy);
      if (distance > radius) {
        x.set(0);
        y.set(0);
        return;
      }
      const pull = 1 - distance / radius;
      x.set(dx * pull * (strength / 10));
      y.set(dy * pull * (strength / 10));
    },
    [reduce, radius, strength, x, y],
  );

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, style: { x, y }, onMouseMove, onMouseLeave };
}
