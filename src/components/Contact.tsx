import React from 'react';
import { Mail, Github, Linkedin, Download, Loader2, MapPin, ArrowUpRight } from 'lucide-react';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';

const EMAIL = 'bryanluccas@hotmail.com';
const LINKEDIN = 'https://linkedin.com/in/blpsoares';
const GITHUB = 'https://github.com/blpsoares';

/**
 * Closing call to action. The page used to end on the philosophy quote and
 * drop straight into the footer, leaving a visitor who was sold with nowhere
 * obvious to go.
 */
const Contact: React.FC = () => {
  const { t } = useI18n();
  const { generating, downloadCv } = useCvDownload();

  const channels = [
    { href: `mailto:${EMAIL}`, label: t.contact.emailLabel, value: EMAIL, Icon: Mail },
    {
      href: LINKEDIN,
      label: t.contact.linkedinLabel,
      value: 'linkedin.com/in/blpsoares',
      Icon: Linkedin,
    },
    { href: GITHUB, label: t.contact.githubLabel, value: 'github.com/blpsoares', Icon: Github },
  ];

  return (
    <SectionShell
      id="contact"
      index={9}
      eyebrow="CONTACT"
      navLabel={t.nav.contact}
      title={t.contact.title}
      subtitle={t.contact.subtitle}
      align="center"
    >
      <Reveal from="up">
        <GlowCard className="p-8 md:p-12">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            <span className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {t.contact.availability}
            </span>
            <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <MapPin size={14} aria-hidden="true" />
              {t.contact.location}
            </span>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {channels.map(({ href, label, value, Icon }) => {
              const external = href.startsWith('http');
              return (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="group/link relative flex flex-col items-center gap-2 rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] px-5 py-6 text-center transition-all hover:-translate-y-0.5 hover:border-brand-400/50 dark:hover:border-brand-400/40 hover:bg-brand-500/[0.05]"
                >
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="absolute right-3 top-3 text-slate-300 dark:text-slate-600 transition-colors group-hover/link:text-brand-500"
                  />
                  <Icon
                    size={22}
                    aria-hidden="true"
                    className="text-brand-600 dark:text-brand-400"
                  />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    {label}
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 break-all">
                    {value}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center gap-2">
            <button
              onClick={() => downloadCv()}
              disabled={generating}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold transition-all shadow-lg shadow-slate-900/10 dark:shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
            >
              {generating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              )}
              {t.contact.cvLabel}
            </button>
            <p className="text-xs text-slate-400 dark:text-slate-500">{t.contact.cvHint}</p>
          </div>
        </GlowCard>
      </Reveal>
    </SectionShell>
  );
};

export default Contact;
