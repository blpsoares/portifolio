import React from 'react';
import { Bot, Quote, Zap, ShieldCheck, Repeat2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useI18n } from '../i18n';

const AI_TOOLS = [
  'Claude',
  'GitHub Copilot',
  'Cursor',
  'v0.dev',
  'Make',
  'n8n',
  'Windmill',
];

const PRINCIPLE_ICONS = [
  <Zap size={18} className="text-brand-500" />,
  <ShieldCheck size={18} className="text-emerald-500" />,
  <Repeat2 size={18} className="text-violet-500" />,
];

const About: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="ai-usage" className="py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Philosophy Card */}
        <ScrollReveal>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-emerald-600 rounded-[2rem] opacity-20 group-hover:opacity-40 blur transition duration-500"></div>

            <div className="relative bg-white dark:bg-slate-950 rounded-[2rem] p-8 md:p-16 border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex flex-col items-center text-center space-y-8">

                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 mb-2 animate-bounce-slow">
                  <Bot size={32} />
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">
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

        {/* Principles */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.about.principles.map((principle, i) => (
              <div
                key={principle.title}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-3 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
              >
                <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                  {PRINCIPLE_ICONS[i]}
                  {principle.title}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* AI Tools */}
        <ScrollReveal>
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {t.about.toolsTitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {AI_TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-default"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default About;
