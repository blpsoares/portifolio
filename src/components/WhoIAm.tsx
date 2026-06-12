import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import { useI18n } from '../i18n';

const WhoIAm: React.FC = () => {
  const { t } = useI18n();

  return (
    <SectionShell
      id="about"
      index={1}
      eyebrow="WHO I AM"
      navLabel={t.nav.about}
      title={t.whoiam.title}
      align="center"
    >
      <GlowCard className="p-8 md:p-12">
        <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          <p>
            {t.whoiam.p1_start}
            <strong className="font-medium text-slate-900 dark:text-white">{t.whoiam.p1_highlight1}</strong>
            {t.whoiam.p1_mid}
            <strong className="font-medium text-slate-900 dark:text-white">{t.whoiam.p1_highlight2}</strong>
            {t.whoiam.p1_end}
          </p>
          <p>{t.whoiam.p2}</p>
        </div>

        <div className="mt-10">
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold transition-all shadow-lg shadow-slate-900/10 dark:shadow-brand-500/10 hover:scale-[1.02] active:scale-[0.98] hover:shadow-brand-500/30"
          >
            {t.whoiam.cta}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </GlowCard>
    </SectionShell>
  );
};

export default WhoIAm;
