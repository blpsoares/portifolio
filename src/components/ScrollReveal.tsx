import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  width?: 'full' | 'auto';
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  width = "full" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is fully in view
      }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 transform ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 filter blur-0' 
          : 'opacity-0 translate-y-12 filter blur-sm'
      } ${width === 'full' ? 'w-full' : 'w-auto'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;