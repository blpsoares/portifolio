import React from 'react';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n';
import { useVibeApps, getAppUrl } from '../hooks/useVibeApps';

const VibeProjectsPage: React.FC = () => {
  const { t } = useI18n();
  const { apps, loading, error } = useVibeApps();

  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <a
            href="#/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            {t.vibeProjects.backHome}
          </a>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4 block">
            <Sparkles size={12} />
            <span>Open Source</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.vibeProjects.pageTitle}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            {t.vibeProjects.pageSubtitle}
          </p>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            {t.vibeProjects.errorLoading}
          </div>
        )}

        {/* All projects grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map((app) => {
              const url = getAppUrl(app);
              return (
                <div
                  key={app.name}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-purple-200/20 dark:hover:shadow-purple-900/10 transition-all duration-300"
                >
                  {/* Iframe preview */}
                  <div className="relative w-full h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <iframe
                      src={url}
                      title={app.name}
                      className="w-full h-full border-0 pointer-events-none scale-[0.5] origin-top-left"
                      style={{ width: '200%', height: '200%' }}
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin"
                    />
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
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-500 mb-3">
                      {app.subdomain}.openvibes.tech
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-md border border-purple-100 dark:border-purple-900/30">
                        Vibe Coded
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700">
                        {app.appDeployment}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VibeProjectsPage;
