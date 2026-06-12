import React, { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n';
import { useVibeApps, getAppUrl } from '../hooks/useVibeApps';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';

const ITEMS_PER_TAB = 2;

const VibeProjects: React.FC = () => {
  const { t } = useI18n();
  const { apps, loading, error } = useVibeApps();
  const [activeTab, setActiveTab] = useState(0);

  if (loading || error || apps.length === 0) return null;

  const totalTabs = Math.ceil(apps.length / ITEMS_PER_TAB);
  const currentApps = apps.slice(
    activeTab * ITEMS_PER_TAB,
    activeTab * ITEMS_PER_TAB + ITEMS_PER_TAB,
  );

  return (
    <SectionShell
      id="vibe-projects"
      index={9}
      eyebrow="VIBE CODING"
      navLabel={t.nav.vibeProjects}
      title={t.vibeProjects.title}
      subtitle={t.vibeProjects.subtitle}
    >
      <Reveal from="up">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-500/20">
            <Sparkles size={12} />
            <span>{t.vibeProjects.badge}</span>
          </div>

          <a
            href="#/vibe-projects"
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            {t.vibeProjects.viewAll}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </Reveal>

      {/* Tab indicators */}
      {totalTabs > 1 && (
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
            disabled={activeTab === 0}
            className="p-2 rounded-lg glass border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-brand-500/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalTabs }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === activeTab
                    ? 'bg-brand-500 scale-125 shadow-[0_0_10px_rgba(45,212,191,0.7)]'
                    : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setActiveTab((prev) => Math.min(totalTabs - 1, prev + 1))}
            disabled={activeTab === totalTabs - 1}
            className="p-2 rounded-lg glass border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-brand-500/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Project cards with iframe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {currentApps.map((app, idx) => {
          const url = getAppUrl(app);
          return (
            <Reveal key={app.name} from="up" delay={idx * 0.08}>
              <GlowCard className="h-full overflow-hidden">
                {/* Iframe preview */}
                <div className="relative w-full h-64 bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
                  <iframe
                    src={url}
                    title={app.name}
                    className="w-full h-full border-0 pointer-events-none scale-[0.5] origin-top-left"
                    style={{ width: '200%', height: '200%' }}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  {/* Overlay to prevent interaction */}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 dark:bg-white/90 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                      <ExternalLink size={14} />
                      {t.vibeProjects.visitSite}
                    </span>
                  </a>
                </div>

                {/* Card info */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {app.name}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 glass px-2 py-1 rounded border border-slate-200/70 dark:border-slate-700/60">
                      {app.subdomain}.openvibes.tech
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2.5 py-0.5 bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-semibold rounded-md border border-brand-500/20">
                      Vibe Coded
                    </span>
                    <span className="px-2.5 py-0.5 glass text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200/70 dark:border-slate-700/60">
                      {app.appDeployment}
                    </span>
                  </div>
                </div>
              </GlowCard>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
};

export default VibeProjects;
