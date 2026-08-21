import React from 'react';
import Reveal from './Reveal';

interface SectionShellProps {
  id: string;
  /** zero-padded index shown in the eyebrow, e.g. 2 -> "02" */
  index: number;
  /** short uppercase label, e.g. "TECH ARSENAL" */
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
  /** human label used by the context-aware AI dock */
  navLabel?: string;
}

/**
 * Consistent immersive section wrapper: numbered command-style eyebrow,
 * a glowing animated divider and a unified heading treatment. Every section
 * uses this so the whole page reads as one cohesive system.
 *
 * The `data-section` / `data-section-label` attributes let the global AI dock
 * detect which section the visitor is currently viewing.
 */
const SectionShell: React.FC<SectionShellProps> = ({
  id,
  index,
  eyebrow,
  title,
  subtitle,
  children,
  className = '',
  align = 'left',
  navLabel,
}) => {
  const num = String(index).padStart(2, '0');
  const centered = align === 'center';

  return (
    <section
      id={id}
      data-section={id}
      data-section-label={navLabel ?? eyebrow}
      className={`relative py-16 md:py-24 px-6 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <Reveal from="up">
          <div className={`mb-10 md:mb-14 ${centered ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'}`}>
            <div className={`flex items-center gap-3 mb-5 ${centered ? 'justify-center' : ''}`}>
              <span className="font-mono text-xs font-semibold text-brand-500 dark:text-brand-400">
                {num}
              </span>
              <span className="h-px w-16 bg-gradient-to-r from-brand-500/70 via-brand-500/30 to-transparent" />
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                {subtitle}
              </p>
            )}
          </div>
        </Reveal>

        {children}
      </div>
    </section>
  );
};

export default SectionShell;
