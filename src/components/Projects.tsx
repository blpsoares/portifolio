import React from 'react';
import { PROJECTS } from '../constants';
import { TrendingUp } from 'lucide-react';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';
import { useI18n } from '../i18n';

const Projects: React.FC = () => {
  const { t } = useI18n();

  return (
    <SectionShell
      id="projects"
      index={3}
      eyebrow="PROJECTS"
      navLabel={t.nav.projects}
      title={t.projects.title}
      subtitle={t.projects.subtitle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {PROJECTS.map((project, index) => {
          const translatedProject = t.projects.items[index];
          const isLastOdd =
            PROJECTS.length % 2 !== 0 && index === PROJECTS.length - 1;
          const impact = translatedProject?.impact;

          return (
            <Reveal
              key={index}
              delay={(index % 2) * 0.08}
              className={isLastOdd ? 'md:col-span-2' : ''}
            >
              <GlowCard
                className={`p-8 h-full flex flex-col${
                  isLastOdd ? ' md:max-w-xl md:mx-auto' : ''
                }`}
              >
                <span className="inline-flex self-start items-center font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300 bg-brand-500/10 dark:bg-brand-400/10 px-3 py-1.5 rounded-full border border-brand-500/30 dark:border-brand-400/30 shadow-[0_0_18px_-4px_rgba(45,212,191,0.55)]">
                  {translatedProject?.category || project.category}
                </span>

                <h3 className="mt-6 font-display text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-snug transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
                  {translatedProject?.title || project.title}
                </h3>

                {/* The outcome, pulled out of the paragraph so it survives a scan. */}
                {impact && (
                  <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-brand-500/20 dark:border-brand-400/20 bg-brand-500/[0.06] dark:bg-brand-400/[0.06] px-4 py-3">
                    <TrendingUp
                      size={16}
                      aria-hidden="true"
                      className="mt-0.5 flex-shrink-0 text-brand-600 dark:text-brand-400"
                    />
                    <div>
                      <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600/70 dark:text-brand-400/70">
                        {t.projects.impactLabel}
                      </span>
                      <span className="block mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                        {impact}
                      </span>
                    </div>
                  </div>
                )}

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow text-[15px]">
                  {translatedProject?.description || project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-200/70 dark:border-white/10">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-md font-mono text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 transition-colors group-hover:border-brand-500/30 dark:group-hover:border-brand-400/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </GlowCard>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
};

export default Projects;
