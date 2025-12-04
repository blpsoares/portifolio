import React from 'react';
import { LOW_CODE_TOOLS } from '../constants';
import { Zap } from 'lucide-react';

const LowCode: React.FC = () => {
  return (
    <section id="lowcode" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-4">
                    <Zap size={12} />
                    <span>Speed & Agility</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Low Code & Aceleração
                </h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
                    Integração estratégica de ferramentas visuais para MVPs, automações e dashboards, reduzindo o time-to-market sem comprometer a qualidade arquitetural.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LOW_CODE_TOOLS.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div key={index} className="flex flex-col p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center mb-6 text-brand-600 dark:text-brand-400">
                            <Icon size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            {item.category}
                        </h3>
                        <div className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-4 font-mono">
                            {item.tools}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                );
            })}
        </div>
      </div>
    </section>
  );
};

export default LowCode;