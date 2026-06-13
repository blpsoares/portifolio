import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';

interface CountUpStatProps {
  /** Final numeric value to count up to. */
  to: number;
  /** Static text rendered before the number (e.g. "~"). */
  prefix?: string;
  /** Static text rendered after the number (e.g. "+", "%", "s"). */
  suffix?: string;
  /** Small caption rendered under the number. */
  label: string;
  className?: string;
}

/**
 * A single count-up metric: a large locale-formatted number that animates once
 * on viewport entry (instant under reduced motion) with a caption beneath it.
 * Width is reserved by the layout so the count-up causes no layout jump.
 */
const CountUpStat: React.FC<CountUpStatProps> = ({ to, prefix, suffix, label, className = '' }) => {
  const { ref, value } = useCountUp<HTMLDivElement>({ to, prefix, suffix });

  return (
    <div ref={ref} className={`flex flex-col ${className}`}>
      <span className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
        {value}
      </span>
      <span className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
};

export default CountUpStat;
