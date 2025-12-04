import React from 'react';
import { SKILLS, PROFILE } from '../constants';
import { Server, Zap, Brain, Cloud } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const iconMap = [Server, Zap, Brain, Cloud];

const TechStack: React.FC = () => {
  return (
    <section id="stack" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-20 md:text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Arsenal Tecnológico
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 backdrop-blur-sm bg-white/40 dark:bg-slate-900/40 rounded-xl p-4 inline-block">
              Ferramentas selecionadas para performance, segurança e velocidade de desenvolvimento.
            </p>
          </div>
        </ScrollReveal>

        {/* Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {SKILLS.map((category, index) => {
            const Icon = iconMap[index] || Server;
            return (
              <ScrollReveal key={index} delay={index * 100}>
                <div 
                  className="group relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/30 dark:hover:border-brand-500/30 transition-all duration-300 shadow-sm hover:shadow-lg h-full"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Icon size={80} className="text-slate-900 dark:text-white" />
                  </div>

                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center mb-6 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform duration-300">
                          <Icon size={24} />
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                          {category.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill, idx) => (
                          <span 
                              key={idx} 
                              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-md border border-slate-100 dark:border-slate-800 group-hover:border-brand-200 dark:group-hover:border-brand-800 transition-colors hover:text-brand-600 dark:hover:text-brand-400 cursor-default"
                          >
                              {skill}
                          </span>
                          ))}
                      </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Identity Section */}
        <ScrollReveal delay={200}>
          <div className="relative bg-slate-900 dark:bg-white rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl group">
              {/* Animated Blob */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 group-hover:bg-brand-500/30 transition-colors duration-700"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 dark:text-brand-700 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-500/20">
                          <Zap size={12} />
                          <span>Performance First</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white dark:text-slate-900 mb-4">
                          Runtime & Performance
                      </h3>
                      <p className="text-slate-300 dark:text-slate-600 leading-relaxed text-lg">
                          {PROFILE.identity} Venho utilizando o <strong className="text-white dark:text-slate-900">Bun</strong> como runtime principal pela eficiência em benchmarks e pela experiência de desenvolvimento unificada.
                      </p>
                  </div>
                  
                  <div className="shrink-0 p-6 bg-white/10 dark:bg-slate-100 rounded-2xl border border-white/10 dark:border-slate-200 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                      <div className="text-center">
                          <span className="block text-4xl md:text-5xl font-bold text-white dark:text-slate-900 mb-1">3x</span>
                          <span className="text-sm text-slate-400 dark:text-slate-500 font-mono">Faster Startup</span>
                      </div>
                  </div>
              </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default TechStack;