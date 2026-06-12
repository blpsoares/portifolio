import React from 'react';
import { MCP_WORKFLOWS } from '../constants';
import { Terminal, FileText, Database } from 'lucide-react';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';
import { useI18n } from '../i18n';

const iconMap = {
  terminal: Terminal,
  file: FileText,
  database: Database,
};

const McpSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <SectionShell
      id="mcp"
      index={4}
      eyebrow="MODEL CONTEXT PROTOCOL"
      navLabel={t.nav.mcps}
      title={t.mcp.title}
      subtitle={t.mcp.subtitle}
    >
      {/* subtle grid background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {MCP_WORKFLOWS.map((item, index) => {
          const Icon = iconMap[item.icon];
          return (
            <Reveal key={index} delay={index * 0.08} from="up">
              <GlowCard className="p-8 h-full">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {item.tool}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {t.mcp.descriptions[index]}
                </p>
              </GlowCard>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
};

export default McpSection;
