import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionShell from './ui/SectionShell';
import Reveal from './ui/Reveal';
import { useI18n } from '../i18n';

/**
 * The narrative section.
 *
 * Deliberately just the prose. Two things were tried here and removed: a
 * sticky "in numbers" rail, which restated figures the Projects cards already
 * carry with better context, and a row of "how I work" principle cards, which
 * read as aphorisms rather than as anything Bryan would actually say. On a page
 * whose argument is evidence, neither was earning its space.
 */
const WhoIAm: React.FC = () => {
  const { t } = useI18n();

  return (
    <SectionShell
      id="about"
      index={1}
      eyebrow="WHO I AM"
      navLabel={t.nav.about}
      title={t.whoiam.title}
    >
      <Reveal from="up">
        <div className="max-w-3xl">
          <p className="text-lg font-light leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl">
            {t.whoiam.p1_start}
            <strong className="font-medium text-slate-900 dark:text-white">
              {t.whoiam.p1_highlight1}
            </strong>
            {t.whoiam.p1_mid}
            <strong className="font-medium text-slate-900 dark:text-white">
              {t.whoiam.p1_highlight2}
            </strong>
            {t.whoiam.p1_end}
          </p>

          <p className="mt-6 text-lg font-light leading-relaxed text-slate-600 dark:text-slate-400">
            {t.whoiam.p2}
          </p>

          <button
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02] hover:shadow-brand-500/30 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:shadow-brand-500/10"
          >
            {t.whoiam.cta}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      </Reveal>

    </SectionShell>
  );
};

export default WhoIAm;
