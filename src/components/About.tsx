import React from 'react';
import { Quote } from 'lucide-react';
import { useI18n } from '../i18n';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';
import AiOrb from './ui/AiOrb';

const About: React.FC = () => {
  const { t } = useI18n();

  return (
    <SectionShell
      id="ai-usage"
      index={10}
      eyebrow="AI AUTOMATION"
      navLabel={t.nav.aiUsage}
      title={t.about.title}
      align="center"
    >
      <Reveal from="scale">
        <GlowCard className="p-8 md:p-16 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-10">
            <AiOrb size={120} />

            <div className="relative max-w-3xl">
              <Quote
                className="absolute -top-4 -left-2 md:-left-6 text-brand-500/20 dark:text-brand-400/20 transform -scale-x-100"
                size={48}
              />
              <p className="text-xl md:text-3xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed relative z-10 px-4">
                {t.about.philosophy}
              </p>
              <Quote
                className="absolute -bottom-8 -right-2 md:-right-6 text-brand-500/20 dark:text-brand-400/20"
                size={48}
              />
            </div>

            <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full opacity-60" />
          </div>
        </GlowCard>
      </Reveal>
    </SectionShell>
  );
};

export default About;
