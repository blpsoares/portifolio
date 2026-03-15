import React from 'react';
import { PROJECTS } from '../constants';
import { FolderGit2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useI18n } from '../i18n';

const Projects: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="projects" className="py-32 px-6 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
              <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-xl">
                  <FolderGit2 className="text-slate-900 dark:text-white" size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.projects.title}
              </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project, index) => {
            const translatedProject = t.projects.items[index];
            const isLastOdd = PROJECTS.length % 2 !== 0 && index === PROJECTS.length - 1;
            return (
              <ScrollReveal key={index} delay={index % 2 * 100} className={isLastOdd ? 'md:col-span-2' : ''}>
                <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all duration-300 h-full group${isLastOdd ? ' md:max-w-xl md:mx-auto' : ''}`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded-full border border-brand-100 dark:border-brand-900/30">
                      {translatedProject?.category || project.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {translatedProject?.title || project.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow text-base">
                    {translatedProject?.description || project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
