import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionShell from './ui/SectionShell';
import Reveal from './ui/Reveal';
import ArticleCard from './ui/ArticleCard';
import { useI18n } from '../i18n';

const HOME_LIMIT = 2;

/** Home teaser for the articles page. Shows the most recent few. */
const Articles: React.FC = () => {
  const { t } = useI18n();
  const items = t.articles.items.slice(0, HOME_LIMIT);

  if (items.length === 0) return null;

  return (
    <SectionShell
      id="articles"
      index={6}
      eyebrow="WRITING"
      navLabel={t.nav.articles}
      title={t.articles.title}
      subtitle={t.articles.subtitle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {items.map((article, index) => (
          <Reveal key={article.slug} delay={index * 0.08} from="up">
            <ArticleCard article={article} />
          </Reveal>
        ))}
      </div>

      {t.articles.items.length > HOME_LIMIT && (
        <Reveal from="up" delay={0.12}>
          <div className="mt-10 flex justify-center">
            <a
              href="#/articles"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold transition-all shadow-lg shadow-slate-900/10 dark:shadow-brand-500/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.articles.viewAll}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </Reveal>
      )}
    </SectionShell>
  );
};

export default Articles;
