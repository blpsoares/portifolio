import React from 'react';
import { PROJECTS } from '../constants';
import { FolderGit2 } from 'lucide-react';

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-32 px-6 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
            <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-xl">
                <FolderGit2 className="text-slate-900 dark:text-white" size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Cases Selecionados
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project, index) => (
            <div key={index} className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded-full border border-brand-100 dark:border-brand-900/30">
                  {project.category}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {project.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow text-base">
                {project.description}
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;