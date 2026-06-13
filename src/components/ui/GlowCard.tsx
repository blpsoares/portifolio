import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
// ===== TRACK A — subtle 3D tilt (does not touch the --mx/--my spotlight tracking) =====
import { useTilt } from '../../hooks/useTilt';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  /** render the animated gradient stroke border */
  bordered?: boolean;
  as?: 'div' | 'article' | 'li';
}

/**
 * Glassmorphic card with an animated gradient-stroke border and a
 * mouse-tracking spotlight glow. The signature surface of the redesign.
 *
 * Adds a subtle cursor-following 3D tilt on top of the existing spotlight. The
 * tilt is disabled under `prefers-reduced-motion` and on coarse pointers, and
 * never interferes with the `--mx/--my` CSS variables the spotlight reads.
 */
const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  bordered = true,
  as = 'div',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const tilt = useTilt({ max: 6, perspective: 900 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }
    // Feed the same pointer event to the tilt hook (no-op under reduced motion / touch).
    tilt.onMouseMove(e);
  };

  const handleLeave = () => {
    tilt.onMouseLeave();
  };

  // framer-motion's motion factory provides typed motion components for the
  // intrinsic tags we support. Selecting via a record keeps types intact and
  // avoids the "union too complex" error from the r3f-augmented JSX namespace.
  const MotionTag = (
    as === 'article' ? motion.article : as === 'li' ? motion.li : motion.div
  ) as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={tilt.style}
      // The hover lift moves to framer-motion because the tilt now owns the
      // inline `transform`; an inline transform would override a Tailwind
      // `hover:-translate-y` utility. Disabled under reduced motion.
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`group relative overflow-hidden rounded-2xl glass spotlight transition-shadow duration-300 ${
        bordered ? 'gradient-border' : 'border border-slate-200/70 dark:border-slate-700/50'
      } shadow-lg shadow-slate-900/5 dark:shadow-black/30 ${className}`}
    >
      {children}
    </MotionTag>
  );
};

export default GlowCard;
