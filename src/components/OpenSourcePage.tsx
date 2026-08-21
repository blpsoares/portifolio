import React from 'react';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { useI18n } from '../i18n';
import { useOpenSourceApps, getAppUrl } from '../hooks/useOpenSourceApps';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';

const OpenSourcePage: React.FC = () => {
  const { t } = useI18n();
  const { apps, loading, error } = useOpenSourceApps();

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 max-w-3xl">
          <a
            href="#/"
            className="mb-6 flex w-fit items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {t.openSource.backHome}
          </a>

          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            <Github size={12} aria-hidden="true" />
            <span>{t.openSource.badge}</span>
          </div>

          <h1 className="mt-5 font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.openSource.pageTitle}
          </h1>
          <p className="mt-4 text-lg font-light leading-relaxed text-slate-600 dark:text-slate-400">
            {t.openSource.pageSubtitle}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        )}

        {error && !loading && (
          <p className="mb-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {t.openSource.errorLoading}
          </p>
        )}

        {!loading && apps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {apps.map((app, index) => {
              const url = getAppUrl(app);
              return (
                <Reveal key={app.name} delay={(index % 3) * 0.08} from="up">
                  <GlowCard className="h-full overflow-hidden">
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800/60">
                      <iframe
                        src={url}
                        title={app.displayName}
                        className="h-full w-full border-0 pointer-events-none scale-[0.5] origin-top-left"
                        style={{ width: '200%', height: '200%' }}
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin"
                      />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-transparent transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <span className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-4 py-2 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/90 dark:text-slate-900">
                          <ExternalLink size={14} />
                          {t.openSource.visitSite}
                        </span>
                      </a>
                    </div>

                    <div className="p-5">
                      <h3 className="font-display text-lg font-bold text-slate-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                        {app.displayName}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {app.host}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-500/20 bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                          {t.openSource.liveLabel}
                        </span>
                        <span className="rounded-md border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {app.appDeployment}
                        </span>
                      </div>
                    </div>
                  </GlowCard>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenSourcePage;
