import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  width?: 'full' | 'auto';
}

/**
 * Detect once whether the browser can drive the reveal purely in CSS via
 * `animation-timeline: view()` AND the user has NOT requested reduced motion.
 * When true we hand the animation to the GPU-friendly native scroll timeline
 * (`.reveal-on-scroll`); otherwise we fall back to the JS IntersectionObserver.
 */
const useCssScrollDriven = (): boolean => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.CSS?.supports) return;
    const supported = window.CSS.supports('animation-timeline: view()');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(supported && !reduced);
  }, []);
  return enabled;
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  width = 'full',
}) => {
  const cssDriven = useCssScrollDriven();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // CSS scroll-driven path owns the animation — skip the observer entirely.
    if (cssDriven) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we can disconnect if we only want it to animate once
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is fully in view
      },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [cssDriven]);

  const widthClass = width === 'full' ? 'w-full' : 'w-auto';

  // ===== TRACK B — native CSS scroll-driven reveal (progressive enhancement) =====
  if (cssDriven) {
    return (
      <div
        ref={ref}
        className={`reveal-on-scroll transform ${widthClass} ${className}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </div>
    );
  }

  // Fallback: JS IntersectionObserver reveal (universal).
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 filter blur-0'
          : 'opacity-0 translate-y-12 filter blur-sm'
      } ${widthClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
