import React from 'react';
import { Quote } from 'lucide-react';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import { useI18n } from '../i18n';

/**
 * The philosophy statement. Was the one section outside the design system —
 * an opaque slab with its own radius, halo and no number, which broke the
 * numbered rhythm right before the footer. Now it is section 10 like any other.
 */
const About: React.FC = () => {
  const { t } = useI18n();

  return (
    <SectionShell
      id="ai-usage"
      index={8}
      eyebrow={t.about.eyebrow}
      navLabel={t.nav.aiUsage}
      title={t.about.title}
      subtitle={t.about.subtitle}
      align="center"
    >
      <GlowCard className="p-8 md:p-14">
        <Quote
          size={40}
          aria-hidden="true"
          className="mx-auto mb-7 text-brand-500/30 dark:text-brand-400/30 -scale-x-100"
        />

        <blockquote className="max-w-3xl mx-auto text-center font-display text-xl md:text-2xl lg:text-[1.75rem] font-medium leading-[1.45] text-slate-800 dark:text-slate-100">
          {t.about.philosophy}
        </blockquote>

        <div
          aria-hidden="true"
          className="mx-auto mt-9 h-1 w-16 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 opacity-60"
        />
      </GlowCard>
    </SectionShell>
  );
};

export default About;
