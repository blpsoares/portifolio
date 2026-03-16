import React from 'react';
import { GraduationCap } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useI18n } from '../i18n';

const Education: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="education" className="py-32 px-6 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-xl">
              <GraduationCap className="text-slate-900 dark:text-white" size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.education.title}
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Vertical line connecting dots */}
          <div className="absolute left-[1.9375rem] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 hidden md:block" />

          <div className="space-y-4">
            {t.education.items.map((item, index) => (
              <ScrollReveal key={index} delay={index * 80}>
                <div className="flex gap-8">
                  {/* Timeline dot */}
                  <div className="hidden md:flex flex-col items-center flex-shrink-0 w-[3.875rem] pt-6">
                    {item.current ? (
                      <div className="relative flex items-center justify-center w-4 h-4 z-10">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60 animate-ping [animation-duration:2s]" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-500" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 z-10 flex-shrink-0" />
                    )}
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden hover:shadow-md ${
                      item.current
                        ? 'border-brand-200 dark:border-brand-800/50'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="p-6 flex items-start gap-4">
                      <img
                        src={item.logo}
                        alt={item.institution}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-white"
                      />
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 flex-1">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              {item.institution}
                            </h3>
                            {item.current && (
                              <span className="px-2 py-0.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-full border border-brand-200 dark:border-brand-800/50">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-500 mr-1 animate-pulse align-middle" />
                                {item.status}
                              </span>
                            )}
                          </div>
                          <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm mt-0.5">
                            {item.degree}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {item.field}
                          </p>
                        </div>
                        <div className="sm:text-right flex-shrink-0">
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {item.period}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
