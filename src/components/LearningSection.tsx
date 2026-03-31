import React from 'react';
import { BookOpen, ExternalLink, Github, FileText } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useI18n } from '../i18n';

const LEARNING_URL = 'https://learning.blpsoares.dev';
const GITHUB_URL = 'https://github.com/blpsoares/me';
const ARTICLE_URL = 'https://www.linkedin.com/pulse/como-transformei-o-claude-em-uma-escola-particular-e-tenho-soares--pylvf/';

const LearningSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="learning" className="py-32 px-6 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
            <BookOpen size={12} />
            <span>{t.learning.badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            {t.learning.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mb-16">
            {t.learning.subtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <ScrollReveal delay={80}>
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p className="text-lg">{t.learning.p1}</p>
              <p>{t.learning.p2}</p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={LEARNING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ExternalLink size={15} />
                  {t.learning.visitSite}
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Github size={15} />
                  {t.learning.viewSource}
                </a>
                <a
                  href={ARTICLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FileText size={15} />
                  {t.learning.readArticle}
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Iframe preview */}
          <ScrollReveal delay={160}>
            <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-emerald-200/20 dark:hover:shadow-emerald-900/10 transition-all duration-300">
              <div className="relative w-full h-72 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <iframe
                  src={LEARNING_URL}
                  title="learning.blpsoares.dev"
                  className="w-full h-full border-0 pointer-events-none scale-[0.5] origin-top-left"
                  style={{ width: '200%', height: '200%' }}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
                <a
                  href={LEARNING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 dark:bg-white/90 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <ExternalLink size={14} />
                    {t.learning.visitSite}
                  </span>
                </a>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
                    learning.blpsoares.dev
                  </span>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-md border border-emerald-100 dark:border-emerald-900/30">
                      Open Source
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700">
                      {t.learning.badgeType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
