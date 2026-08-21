import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';
import { useI18n } from '../i18n';

const Career: React.FC = () => {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SectionShell
      id="career"
      index={4}
      eyebrow="CAREER"
      navLabel={t.nav.career}
      title={t.career.title}
    >
      <div className="relative">
        {/* Vertical rail connecting the timeline nodes */}
        <div className="absolute left-[1.9375rem] top-6 bottom-6 w-px bg-gradient-to-b from-brand-500/50 via-brand-500/20 to-transparent hidden md:block" />

        <div className="space-y-5">
          {t.career.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={index} delay={index * 0.08}>
                <div className="flex gap-8">
                  {/* Timeline node */}
                  <div className="hidden md:flex flex-col items-center flex-shrink-0 w-[3.875rem] pt-6">
                    {item.current ? (
                      <div className="relative flex items-center justify-center w-4 h-4 z-10">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60 animate-ping [animation-duration:2s]" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-500 shadow-[0_0_14px_2px_rgba(45,212,191,0.7)]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-slate-50 dark:ring-slate-950 z-10 flex-shrink-0" />
                    )}
                  </div>

                  {/* Card */}
                  <GlowCard
                    className={`flex-1 transition-shadow duration-500 ${
                      isOpen ? 'shadow-xl shadow-brand-900/10 dark:shadow-brand-500/10' : ''
                    }`}
                    bordered={!!item.current || isOpen}
                  >
                    {/* Header — clickable accordion trigger */}
                    <button
                      onClick={() => toggle(index)}
                      aria-expanded={isOpen}
                      className="w-full text-left p-6 flex items-start justify-between gap-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 flex-1">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                              {item.role}
                            </h3>
                            {item.current && (
                              <span className="px-2.5 py-0.5 bg-brand-500/10 dark:bg-brand-400/10 text-brand-600 dark:text-brand-300 text-xs font-bold rounded-full border border-brand-500/30 dark:border-brand-400/30">
                                ● {t.career.current}
                              </span>
                            )}
                          </div>
                          <p className="text-brand-600 dark:text-brand-300 font-semibold text-sm mt-0.5">
                            {item.company}
                          </p>
                        </div>
                        <div className="sm:text-right flex-shrink-0">
                          <p className="font-mono text-sm font-medium text-slate-600 dark:text-slate-400">
                            {item.period}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            {item.duration}
                          </p>
                        </div>
                      </div>

                      <ChevronDown
                        size={18}
                        className={`flex-shrink-0 mt-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isOpen
                            ? 'rotate-180 text-brand-500'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      />
                    </button>

                    {/* Accordion body — grid 0fr→1fr animates to auto height smoothly */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div
                          className={`px-6 pb-6 border-t border-slate-200/70 dark:border-white/10 transition-all duration-500 ease-out ${
                            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                          }`}
                        >
                          <div className="flex flex-wrap gap-2 mt-4 mb-5">
                            <span className="px-2.5 py-1 rounded-md font-mono text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                              {item.type}
                            </span>
                            <span className="px-2.5 py-1 rounded-md font-mono text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                              {item.location}
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {item.bullets.map((bullet, bIdx) => (
                              <li
                                key={bIdx}
                                style={{ transitionDelay: isOpen ? `${120 + bIdx * 55}ms` : '0ms' }}
                                className={`flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-all duration-500 ease-out ${
                                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                                }`}
                              >
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0 shadow-[0_0_8px_1px_rgba(45,212,191,0.6)]" />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
};

export default Career;
