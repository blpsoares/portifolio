import React, { useRef } from 'react';

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
 */
const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  bordered = true,
  as = 'div',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  // @react-three/fiber augments the global JSX.IntrinsicElements with the
  // entire three.js element set. Resolving a dynamic JSX tag against that
  // augmented interface produces a "union too complex" error, so we render via
  // a typed React.createElement that bypasses IntrinsicElements lookup.
  const Tag = as as React.ElementType;

  return React.createElement(
    Tag,
    {
      ref,
      onMouseMove: handleMove,
      className: `group relative overflow-hidden rounded-2xl glass spotlight transition-all duration-300 hover:-translate-y-1 ${
        bordered ? 'gradient-border' : 'border border-slate-200/70 dark:border-slate-700/50'
      } shadow-lg shadow-slate-900/5 dark:shadow-black/30 ${className}`,
    },
    children
  );
};

export default GlowCard;
