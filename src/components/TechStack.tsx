import React from 'react';
import { SKILLS } from '../constants';
import { Server, Zap, Brain, Cloud } from 'lucide-react';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';
import { useI18n } from '../i18n';

const iconMap = [Server, Zap, Brain, Cloud];

const TechStack: React.FC = () => {
  const { t } = useI18n();

  return (
    <SectionShell
      id="stack"
      index={2}
      eyebrow="TECH ARSENAL"
      navLabel={t.nav.stacks}
      title={t.techstack.title}
      subtitle={t.techstack.subtitle}
      align="center"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {SKILLS.map((category, index) => {
          const Icon = iconMap[index] || Server;
          const categoryTitle =
            t.techstack.categories[category.title as keyof typeof t.techstack.categories] ||
            category.title;
          return (
            <Reveal key={index} delay={index * 0.08} from="up">
              <GlowCard className="p-8 h-full">
                {/* faint background icon flourish */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.04] group-hover:opacity-10 transition-opacity duration-500">
                  <Icon size={88} className="text-slate-900 dark:text-white" />
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} />
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-6">
                    {categoryTitle}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 text-sm font-medium rounded-md font-mono bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-white/10 transition-colors hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-400/50 dark:hover:border-brand-400/40 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
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

export default TechStack;
