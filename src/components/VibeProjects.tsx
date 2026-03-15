import React, { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useI18n } from '../i18n';
import { useVibeApps, getAppUrl } from '../hooks/useVibeApps';

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
    <section id="vibe-projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles size={12} />
                <span>{t.vibeProjects.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                {t.vibeProjects.title}
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                {t.vibeProjects.subtitle}
              </p>
            </div>

            <a
              href="#/vibe-projects"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              {t.vibeProjects.viewAll}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </ScrollReveal>

        {/* Tab indicators */}
        {totalTabs > 1 && (
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
              disabled={activeTab === 0}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                      ? 'bg-purple-500 scale-125'
                      : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveTab((prev) => Math.min(totalTabs - 1, prev + 1))}
              disabled={activeTab === totalTabs - 1}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Project cards with iframe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentApps.map((app) => {
            const url = getAppUrl(app);
            return (
              <ScrollReveal key={app.name}>
                <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-purple-200/20 dark:hover:shadow-purple-900/10 transition-all duration-300">
                  {/* Iframe preview */}
                  <div className="relative w-full h-64 bg-slate-100 dark:bg-slate-800 overflow-hidden">
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
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {app.name}
                      </h3>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {app.subdomain}.openvibes.tech
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2.5 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-md border border-purple-100 dark:border-purple-900/30">
                        Vibe Coded
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700">
                        {app.appDeployment}
                      </span>
                    </div>
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

export default VibeProjects;
