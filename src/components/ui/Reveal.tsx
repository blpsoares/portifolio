import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** entrance direction */
  from?: Direction;
  /** seconds of delay before animating */
  delay?: number;
  /** stagger children when true (children should be <Reveal.Item>) */
  once?: boolean;
}

const offset = (dir: Direction) => {
  switch (dir) {
    case 'up':
      return { y: 40 };
    case 'down':
      return { y: -40 };
    case 'left':
      return { x: 40 };
    case 'right':
      return { x: -40 };
    case 'scale':
      return { scale: 0.92 };
    default:
      return {};
  }
};

/**
 * Scroll-triggered entrance animation. Animates once when it enters the
 * viewport, with a soft blur+slide that fits the immersive aesthetic.
 */
const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  from = 'up' as Direction,
  delay = 0,
  once = true,
}) => {
  const reduce = useReducedMotion();

  /**
   * Sideways entrances are for side-by-side columns. Once those columns stack,
   * a horizontal slide both reads wrong and pushes the element past the
   * viewport edge, which shows up as a horizontal scrollbar mid-animation.
   */
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const direction: Direction =
    narrow && (from === 'left' || from === 'right') ? 'up' : from;

  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(8px)', ...offset(direction) },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '0px 0px -80px 0px' }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
