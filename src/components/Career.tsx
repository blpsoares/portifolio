import React, { useState } from 'react';
import { Briefcase, ChevronDown } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useI18n } from '../i18n';

const Career: React.FC = () => {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          {/* Vertical line connecting dots */}
          <div className="absolute left-[1.9375rem] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 hidden md:block" />

          <div className="space-y-4">
            {t.career.items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
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
                      className={`flex-1 bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden ${
                        item.current
                          ? 'border-brand-200 dark:border-brand-800/50'
                          : 'border-slate-200 dark:border-slate-800'
                      } ${isOpen ? 'shadow-lg' : 'hover:shadow-md'}`}
                    >
                      {/* Header — clickable */}
                      <button
                        onClick={() => toggle(index)}
                        className="w-full text-left p-6 flex items-start justify-between gap-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 flex-1">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {item.role}
                              </h3>
                              {item.current && (
                                <span className="px-2 py-0.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-full border border-brand-200 dark:border-brand-800/50">
                                  ● Atual
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

                        <ChevronDown
                          size={18}
                          className={`flex-shrink-0 mt-1 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Accordion body */}
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          isOpen ? 'max-h-[32rem]' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex flex-wrap gap-2 mt-4 mb-5">
                            <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {item.type}
                            </span>
                            <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {item.location}
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {item.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Career;
