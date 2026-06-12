import React from 'react';
import { LOW_CODE_TOOLS } from '../constants';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';
import { useI18n } from '../i18n';

const LowCode: React.FC = () => {
  const { t } = useI18n();

  return (
    <SectionShell
      id="lowcode"
      index={3}
      eyebrow="LOW CODE"
      navLabel={t.nav.lowcode}
      title={t.lowcode.title}
      subtitle={t.lowcode.subtitle}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {LOW_CODE_TOOLS.map((item, index) => {
          const Icon = item.icon;
          const categoryName =
            t.lowcode.categories[item.category as keyof typeof t.lowcode.categories] ||
            item.category;
          return (
            <Reveal key={index} delay={index * 0.08} from="up">
              <GlowCard className="flex flex-col p-8 h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {categoryName}
                </h3>
                <div className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-4 font-mono">
                  {item.tools}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t.lowcode.descriptions[index]}
                </p>
              </GlowCard>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
};

export default LowCode;
