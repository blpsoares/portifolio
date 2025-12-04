import React from 'react';
import { ArrowRight, Terminal, Github, Linkedin, Mail, ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="profile" className="relative min-h-screen flex flex-col justify-center pt-20 pb-10 px-6 overflow-hidden">
      
      {/* Main Content Layer */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        
        <div className="inline-flex items-center space-x-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm w-fit animate-fade-in-up">
          <Terminal size={14} className="text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Senior Backend Engineer
          </span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Sistemas Robustos.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500 dark:from-brand-400 dark:to-emerald-400">
              Inteligência Aplicada.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed font-light backdrop-blur-sm dark:backdrop-blur-none bg-white/30 dark:bg-transparent rounded-lg">
             Especialista em Backend focado em escalabilidade e no uso estratégico de <strong className="text-slate-900 dark:text-slate-200 font-medium">IA</strong> e <strong className="text-slate-900 dark:text-slate-200 font-medium">Low-Code</strong> para acelerar entregas de alto valor.
          </p>
        </div>
        
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="group px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-900/10 dark:shadow-none flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            Alguns projetos
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-4 px-4">
             <a 
               href="https://github.com/blpsoares" 
               target="_blank" 
               rel="noopener noreferrer"
               className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-white transition-colors hover:scale-110"
               aria-label="GitHub"
             >
               <Github size={24} />
             </a>
             <a 
               href="https://linkedin.com/in/blpsoares" 
               target="_blank" 
               rel="noopener noreferrer"
               className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-white transition-colors hover:scale-110"
               aria-label="LinkedIn"
             >
               <Linkedin size={24} />
             </a>
             <a 
               href="mailto:bryanluccas@hotmail.com" 
               className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-white transition-colors hover:scale-110"
               aria-label="Email"
             >
               <Mail size={24} />
             </a>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap gap-8 text-sm text-slate-500 dark:text-slate-500 font-mono">
            <span className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-default">// Node.js & Bun</span>
            <span className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-default">// Integrations</span>
            <span className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-default">// AI Agents</span>
            <span className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-default">// Low Code</span>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 dark:text-slate-600 hidden md:block z-10">
        <ChevronDown size={24} />
      </div>
    </section>
  );
};

export default Hero;