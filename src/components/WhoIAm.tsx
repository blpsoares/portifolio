import React from 'react';
import { User, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useI18n } from '../i18n';

const WhoIAm: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-xl">
              <User className="text-slate-900 dark:text-white" size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.whoiam.title}
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                {t.whoiam.p1_start}<strong className="text-slate-900 dark:text-slate-200 font-medium">{t.whoiam.p1_highlight1}</strong>{t.whoiam.p1_mid}<strong className="text-slate-900 dark:text-slate-200 font-medium">{t.whoiam.p1_highlight2}</strong>{t.whoiam.p1_end}
              </p>
              <p>
                {t.whoiam.p2}
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-900/10 dark:shadow-none hover:scale-[1.02] active:scale-[0.98]"
              >
                {t.whoiam.cta}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default WhoIAm;
