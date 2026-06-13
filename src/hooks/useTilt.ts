import { useCallback, useRef } from 'react';
import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

interface UseTiltOptions {
  /** Maximum tilt angle in degrees on each axis (default 7). */
  max?: number;
  /** CSS perspective in px applied to the transform (default 800). */
  perspective?: number;
}

interface UseTiltResult {
  /** Spread onto the motion element's `style` prop. */
  style: {
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    transformPerspective: number;
    transformStyle: 'preserve-3d';
  };
  /** Chain alongside any existing onMouseMove handler. */
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

/**
 * Subtle 3D tilt that follows the cursor across the element surface. Uses the
 * same useMotionValue + useSpring pattern as Hero.tsx. Disabled under
 * `prefers-reduced-motion` and on coarse pointers so it never interferes with
 * touch or keyboard interaction.
 */
export function useTilt({ max = 7, perspective = 800 }: UseTiltOptions = {}): UseTiltResult {
  const reduce = useReducedMotion();
  const tiltRef = useRef<HTMLElement | null>(null);

  // Normalized -0.5..0.5 cursor position over the element.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 200, damping: 20, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  // Vertical cursor → rotateX (inverted), horizontal cursor → rotateY.
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
      const el = e.currentTarget as HTMLElement;
      tiltRef.current = el;
      const rect = el.getBoundingClientRect();
      px.set((e.clientX - rect.left) / rect.width - 0.5);
      py.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [reduce, px, py],
  );

  const onMouseLeave = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  return {
    style: { rotateX, rotateY, transformPerspective: perspective, transformStyle: 'preserve-3d' },
    onMouseMove,
    onMouseLeave,
  };
}
