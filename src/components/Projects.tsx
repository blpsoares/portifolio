import React from 'react';
import { PROJECTS } from '../constants';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';
import { useI18n } from '../i18n';

const Projects: React.FC = () => {
  const { t } = useI18n();

  return (
    <SectionShell
      id="projects"
      index={5}
      eyebrow="PROJECTS"
      navLabel={t.nav.projects}
      title={t.projects.title}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROJECTS.map((project, index) => {
          const translatedProject = t.projects.items[index];
          const isLastOdd =
            PROJECTS.length % 2 !== 0 && index === PROJECTS.length - 1;
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
                <div className="flex justify-between items-start mb-6">
                  <span className="inline-flex items-center font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300 bg-brand-500/10 dark:bg-brand-400/10 px-3 py-1.5 rounded-full border border-brand-500/30 dark:border-brand-400/30 shadow-[0_0_18px_-4px_rgba(45,212,191,0.55)]">
                    {translatedProject?.category || project.category}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-snug transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
                  {translatedProject?.title || project.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow text-base">
                  {translatedProject?.description || project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-200/70 dark:border-white/10">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
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
