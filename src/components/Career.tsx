import React from 'react';
import { Briefcase } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useI18n } from '../i18n';

const Career: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="career" className="py-32 px-6 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-xl">
              <Briefcase className="text-slate-900 dark:text-white" size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.career.title}
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[1.9rem] top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

          <div className="space-y-4">
            {t.career.items.map((item, index) => (
              <ScrollReveal key={index} delay={index * 80}>
                <div className="flex gap-8">
                  {/* Timeline dot */}
                  <div className="hidden md:flex flex-col items-center flex-shrink-0 pt-6">
                    <div
                      className={`w-4 h-4 rounded-full z-10 transition-all ${
                        item.current
                          ? 'bg-brand-500 ring-4 ring-brand-500/20 dark:ring-brand-500/30'
                          : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 bg-white dark:bg-slate-900 rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${
                      item.current
                        ? 'border-brand-200 dark:border-brand-800/50'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {item.role}
                          </h3>
                          {item.current && (
                            <span className="px-2 py-0.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-full border border-brand-200 dark:border-brand-800/50">
                              ●&nbsp;atual
                            </span>
                          )}
                        </div>
                        <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm mt-0.5">
                          {item.company}
                        </p>
                      </div>
                      <div className="sm:text-right flex-shrink-0">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {item.period}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          {item.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.type}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.location}
                      </span>
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

export default Career;
