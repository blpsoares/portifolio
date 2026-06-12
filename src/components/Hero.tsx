import React from 'react';
import { ArrowRight, Sparkles, Github, Linkedin, Mail, ChevronDown, Download, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';
import AgentConsole from './AgentConsole';

const Hero: React.FC = () => {
  const { t } = useI18n();
  const { generating, downloadCv } = useCvDownload();

  return (
    <section id="profile" className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-6 overflow-hidden">

      {/* Aurora glow layer behind the hero */}
      <div aria-hidden="true" className="hero-aurora pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">

        {/* LEFT COLUMN */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
            <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Bryan Soares
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">· {t.hero.badge}</span>
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              {t.hero.title1}
              <br />
              <span className="gradient-animate text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-500 to-brand-400 dark:from-brand-400 dark:via-emerald-400 dark:to-brand-300">
                {t.hero.title2}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-light">
              {t.hero.subtitle_prefix}
              <strong className="text-slate-900 dark:text-slate-200 font-medium">{t.hero.subtitle_highlight}</strong>
              {t.hero.subtitle_suffix}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-900/10 dark:shadow-none flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.hero.cta}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={downloadCv}
              disabled={generating}
              className="group px-6 py-3.5 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg hover:border-brand-500 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
            >
              {generating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              )}
              {t.footer.downloadCv}
            </button>

            <div className="flex items-center gap-2 sm:px-2">
              <a
                href="https://github.com/blpsoares"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-white transition-colors hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={22} />
              </a>
              <a
                href="https://linkedin.com/in/blpsoares"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-white transition-colors hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={22} />
              </a>
              <a
                href="mailto:bryanluccas@hotmail.com"
                className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-white transition-colors hover:scale-110"
                aria-label="Email"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-500 font-mono">
            <span className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-default">{t.hero.tag1}</span>
            <span className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-default">{t.hero.tag2}</span>
            <span className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-default">{t.hero.tag3}</span>
            <span className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-default">{t.hero.tag4}</span>
          </div>
        </div>

        {/* RIGHT COLUMN — the AI agent console (centerpiece) */}
        <div className="relative lg:pl-4 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <div className="hidden lg:flex items-center justify-end gap-2 mb-3 text-sm font-medium text-brand-600 dark:text-brand-400">
            <span className="animate-float">{t.agent.hint}</span>
          </div>
          <AgentConsole />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 dark:text-slate-600 hidden md:block z-10">
        <ChevronDown size={24} />
      </div>
    </section>
  );
};

export default Hero;
