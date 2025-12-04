import React from 'react';
import { MCP_WORKFLOWS } from '../constants';
import { Terminal, FileText, Database, Cpu } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const iconMap = {
  terminal: Terminal,
  file: FileText,
  database: Database,
};

const McpSection: React.FC = () => {
  return (
    <section id="mcp" className="py-32 px-6 relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <Cpu size={12} />
                  <span>Workflow Intelligence</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                Model Context Protocol (MCP)
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                O uso de MCPs não é apenas uma ferramenta, é a base da minha produtividade. Conecto LLMs diretamente ao contexto do projeto para eliminar tarefas repetitivas.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MCP_WORKFLOWS.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <ScrollReveal key={index} delay={index * 150}>
                <div 
                  className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-300 group h-full hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                    <Icon className="text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {item.tool}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default McpSection;