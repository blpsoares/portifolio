import React from 'react';
import { Bot, Quote } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useI18n } from '../i18n';

const About: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="ai-usage" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Vibe Coding / AI Philosophy Card */}
        <ScrollReveal>
          <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-emerald-600 rounded-[2rem] opacity-20 group-hover:opacity-40 blur transition duration-500"></div>

              <div className="relative bg-white dark:bg-slate-950 rounded-[2rem] p-8 md:p-16 border border-slate-200 dark:border-slate-800 shadow-xl">
                  <div className="flex flex-col items-center text-center space-y-8">

                      <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 mb-2 animate-bounce-slow">
                          <Bot size={32} />
                      </div>

                      <div className="space-y-4">
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm">
                              {t.about.title}
                          </h2>

                          <div className="relative">
                              <Quote className="absolute -top-4 -left-4 text-slate-200 dark:text-slate-800 transform -scale-x-100" size={48} />
                              <p className="text-xl md:text-3xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed relative z-10 px-4">
                                  {t.about.philosophy}
                              </p>
                              <Quote className="absolute -bottom-8 -right-4 text-slate-200 dark:text-slate-800" size={48} />
                          </div>
                      </div>

                      <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full opacity-50"></div>
                  </div>
              </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default About;
