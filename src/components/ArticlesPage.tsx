import React from 'react';
import { ArrowLeft, PenLine } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from './ui/Reveal';
import ArticleCard from './ui/ArticleCard';

const ArticlesPage: React.FC = () => {
  const { t } = useI18n();
  const items = t.articles.items;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 max-w-3xl">
          <a
            href="#/"
            className="mb-6 flex w-fit items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {t.articles.backHome}
          </a>

          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            <PenLine size={12} aria-hidden="true" />
            <span>{t.articles.navTitle}</span>
          </div>

          <h1 className="mt-5 font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.articles.title}
          </h1>
          <p className="mt-4 text-lg font-light leading-relaxed text-slate-600 dark:text-slate-400">
            {t.articles.pageSubtitle}
          </p>
        </div>

        {items.length === 0 ? (
          <p className="py-20 text-center text-slate-500 dark:text-slate-400">
            {t.articles.empty}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {items.map((article, index) => (
              <Reveal key={article.slug} delay={(index % 3) * 0.08} from="up">
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
