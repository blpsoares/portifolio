import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, ChevronDown, Download, Loader2, Circle } from 'lucide-react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';
import AgentConsole from './AgentConsole';
import AiOrb from './ui/AiOrb';

const Hero: React.FC = () => {
  const { t } = useI18n();
  const { generating, downloadCv } = useCvDownload();

  return (
    <section
      id="profile"
      data-section="profile"
      data-section-label={t.nav.profile}
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-6 overflow-hidden"
    >
      {/* Aurora + decorative orb behind the hero */}
      <div aria-hidden="true" className="hero-aurora pointer-events-none absolute inset-0 z-0" />
      <AiOrb
        size={420}
        pulse={false}
        className="pointer-events-none absolute -right-40 -top-10 opacity-40 hidden lg:block"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">
        {/* LEFT COLUMN */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* availability + identity badge */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full glass gradient-border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Bryan Soares
            </span>
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              {t.hero.badge}
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.02]">
              {t.hero.title1}
              <br />
              <span className="holo-text">{t.hero.title2}</span>
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
              className="group px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-900/10 dark:shadow-brand-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.hero.cta}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={downloadCv}
              disabled={generating}
              className="group px-6 py-3.5 rounded-xl gradient-border glass text-slate-900 dark:text-white font-semibold hover:text-brand-600 dark:hover:text-brand-400 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
            >
              {generating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              )}
              {t.footer.downloadCv}
            </button>

            <div className="flex items-center gap-2 sm:px-2">
              {[
                { href: 'https://github.com/blpsoares', label: 'GitHub', Icon: Github },
                { href: 'https://linkedin.com/in/blpsoares', label: 'LinkedIn', Icon: Linkedin },
                { href: 'mailto:bryanluccas@hotmail.com', label: 'Email', Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-white transition-colors hover:scale-110"
                  aria-label={label}
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-500 font-mono">
            {[t.hero.tag1, t.hero.tag2, t.hero.tag3, t.hero.tag4].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-default"
              >
                <Circle size={6} className="fill-brand-500/60 text-brand-500/60" aria-hidden="true" />
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN — the AI agent console (centerpiece) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:pl-4"
        >
          <div className="hidden lg:flex items-center justify-end gap-2 mb-3 text-sm font-medium text-brand-600 dark:text-brand-400">
            <span className="animate-float">{t.agent.hint}</span>
          </div>
          <AgentConsole />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 dark:text-slate-600 hidden md:block z-10">
        <ChevronDown size={24} />
      </div>
    </section>
  );
};

export default Hero;
