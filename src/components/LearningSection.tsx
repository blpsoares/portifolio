import React from 'react';
import { BookOpen, ExternalLink, Github, FileText } from 'lucide-react';
import { useI18n } from '../i18n';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';

const LEARNING_URL = 'https://learning.blpsoares.dev';
const GITHUB_URL = 'https://github.com/blpsoares/me';
const ARTICLE_URL = 'https://www.linkedin.com/pulse/como-transformei-o-claude-em-uma-escola-particular-e-tenho-soares--pylvf/';

const LearningSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <SectionShell
      id="learning"
      index={8}
      eyebrow="LEARNING SYSTEM"
      navLabel={t.nav.learning}
      title={t.learning.title}
      subtitle={t.learning.subtitle}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Text content */}
        <Reveal from="right" delay={0.05}>
          <GlowCard className="h-full p-8 md:p-10 flex flex-col">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-6 border border-brand-500/20">
              <BookOpen size={12} />
              <span>{t.learning.badge}</span>
            </div>

            <div className="space-y-5 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p className="text-lg">{t.learning.p1}</p>
              <p>{t.learning.p2}</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-8 mt-auto">
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
                className="group inline-flex items-center gap-2 px-5 py-2.5 glass border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:border-brand-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Github size={15} />
                {t.learning.viewSource}
              </a>
              <a
                href={ARTICLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 glass border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:border-brand-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <FileText size={15} />
                {t.learning.readArticle}
              </a>
            </div>
          </GlowCard>
        </Reveal>

        {/* Iframe preview */}
        <Reveal from="left" delay={0.15}>
          <GlowCard className="h-full overflow-hidden">
            <div className="relative w-full h-72 bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
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
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
                  learning.blpsoares.dev
                </span>
                <div className="flex gap-2">
                  <span className="px-2.5 py-0.5 bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-semibold rounded-md border border-brand-500/20">
                    Open Source
                  </span>
                  <span className="px-2.5 py-0.5 glass text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200/70 dark:border-slate-700/60">
                    {t.learning.badgeType}
                  </span>
                </div>
              </div>
            </div>
          </GlowCard>
        </Reveal>
      </div>
    </SectionShell>
  );
};

export default LearningSection;
