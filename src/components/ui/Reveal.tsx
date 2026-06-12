import React from 'react';
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

  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(8px)', ...offset(from) },
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
