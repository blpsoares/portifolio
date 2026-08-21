import React from 'react';
import { ArrowUpRight, Clock, Star } from 'lucide-react';
import GlowCard from './GlowCard';
import { useI18n } from '../../i18n';

export interface ArticleCardData {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readingMinutes: number;
  url: string;
  cover: string;
  tags: string[];
  featured: boolean;
}

/** Shared between the home teaser and the dedicated articles page. */
const ArticleCard: React.FC<{ article: ArticleCardData }> = ({ article }) => {
  const { t, locale } = useI18n();

  // The stored date is a plain ISO day; parsing it as UTC and formatting in UTC
  // keeps it from sliding a day backwards for anyone west of Greenwich.
  const published = new Date(`${article.date}T12:00:00Z`).toLocaleDateString(
    locale === 'pt' ? 'pt-BR' : 'en-US',
    { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }
  );

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-2xl"
    >
      <GlowCard className="h-full flex flex-col overflow-hidden">
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800/60">
          <img
            src={article.cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
          />
          {article.featured && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg">
              <Star size={10} className="fill-white" aria-hidden="true" />
              {t.articles.featured}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-7">
          <div className="mb-3 flex items-center gap-3 font-mono text-[11px] text-slate-400 dark:text-slate-500">
            <time dateTime={article.date}>{published}</time>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={11} aria-hidden="true" />
              {t.articles.readingTime.replace('{n}', String(article.readingMinutes))}
            </span>
          </div>

          <h3 className="font-display text-xl font-bold leading-snug text-slate-900 dark:text-white transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
            {article.title}
          </h3>

          <p className="mt-3 flex-grow text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {article.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-slate-200/80 bg-slate-100/80 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="mt-6 inline-flex items-center gap-1.5 border-t border-slate-200/70 pt-5 text-sm font-semibold text-brand-600 dark:border-white/10 dark:text-brand-400">
            {t.articles.readOn}
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </GlowCard>
    </a>
  );
};

export default ArticleCard;
