import React from 'react';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';
import { useI18n } from '../i18n';

const Education: React.FC = () => {
  const { t } = useI18n();

  return (
    <SectionShell
      id="education"
      index={5}
      eyebrow="EDUCATION"
      navLabel={t.nav.education}
      title={t.education.title}
    >
      <div className="relative">
        {/* Vertical rail connecting the timeline nodes */}
        <div className="absolute left-[1.9375rem] top-6 bottom-6 w-px bg-gradient-to-b from-brand-500/50 via-brand-500/20 to-transparent hidden md:block" />

        <div className="space-y-5">
          {t.education.items.map((item, index) => (
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
                <GlowCard className="flex-1" bordered={!!item.current}>
                  <div className="p-6 flex items-start gap-4">
                    <img
                      src={item.logo}
                      alt={item.institution}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-white ring-1 ring-slate-200/80 dark:ring-white/10"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 flex-1">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                            {item.institution}
                          </h3>
                          {item.current && (
                            <span className="px-2.5 py-0.5 bg-brand-500/10 dark:bg-brand-400/10 text-brand-600 dark:text-brand-300 text-xs font-bold rounded-full border border-brand-500/30 dark:border-brand-400/30">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-500 mr-1 animate-pulse align-middle" />
                              {item.status}
                            </span>
                          )}
                        </div>
                        <p className="text-brand-600 dark:text-brand-300 font-semibold text-sm mt-0.5">
                          {item.degree}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {item.field}
                        </p>
                      </div>
                      <div className="sm:text-right flex-shrink-0">
                        <p className="font-mono text-sm font-medium text-slate-600 dark:text-slate-400">
                          {item.period}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

export default Education;
