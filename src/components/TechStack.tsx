import React, { useState } from 'react';
import { Brain, Server, Cloud, Plug, Search, ChevronDown, type LucideIcon } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import SectionShell from './ui/SectionShell';
import GlowCard from './ui/GlowCard';
import Reveal from './ui/Reveal';
import SkillGraph from './stack/SkillGraph';
import { useI18n } from '../i18n';

const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  plug: Plug,
  search: Search,
  server: Server,
  cloud: Cloud,
};

const TechStack: React.FC = () => {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const branches = t.techstack.branches;

  const [expanded, setExpanded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  /** Mobile accordion keeps its own open item; the graph is not involved. */
  const [openMobile, setOpenMobile] = useState<string | null>(null);

  const active = branches.find((b) => b.id === activeId) ?? null;

  /** Opening lands on the first branch so the panel is never empty. */
  const open = () => {
    setExpanded(true);
    setActiveId((current) => current ?? branches[0]?.id ?? null);
  };

  const collapse = () => {
    setExpanded(false);
    setActiveId(null);
  };

  const renderClusters = (clusters: (typeof branches)[number]['clusters']) => (
    <div className="space-y-5">
      {clusters.map((cluster) => (
        <div key={cluster.label}>
          <div className="mb-2.5 flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${
                cluster.highlight ? 'bg-emerald-400' : 'bg-brand-500'
              }`}
            />
            <span
              className={`font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${
                cluster.highlight
                  ? 'text-emerald-600 dark:text-emerald-300'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {cluster.label}
            </span>
            {cluster.highlight && (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-px font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-300">
                {t.techstack.shippedLabel}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cluster.items.map((item) => (
              <span
                key={item}
                className={`cursor-default rounded-md border px-2.5 py-1 font-mono text-xs font-medium ${
                  cluster.highlight
                    ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200'
                    : 'border-brand-500/30 bg-brand-500/10 text-brand-700 dark:border-brand-400/25 dark:bg-brand-400/10 dark:text-brand-300'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  /** The methodologies are the core's identity, not a sixth branch. */
  const coreIdentity = (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {t.techstack.coreSubtitle}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {t.techstack.coreTags.map((tag) => (
          <span
            key={tag}
            className="cursor-default rounded-full border border-brand-500/30 bg-brand-500/[0.07] px-3 py-1 font-mono text-[11px] font-medium text-brand-700 dark:border-brand-400/25 dark:text-brand-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <SectionShell
      id="stack"
      index={2}
      eyebrow="TECH ARSENAL"
      navLabel={t.nav.stacks}
      title={t.techstack.title}
      subtitle={t.techstack.subtitle}
    >
      {/* ---------- Wheel + detail (lg and up) ---------- */}
      <Reveal from="up">
        <div className="hidden items-center gap-8 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div>
          <SkillGraph
            nodes={branches.map((b) => ({
              id: b.id,
              short: b.short,
              title: b.title,
              icon: b.icon,
            }))}
            iconMap={iconMap}
            expanded={expanded}
            activeId={activeId}
            onExpand={open}
            onToggleCore={() => (expanded ? collapse() : open())}
            onSelect={(id) => setActiveId((current) => (current === id ? null : id))}
            coreLabel={t.techstack.centerLabel}
            coreTitle={t.techstack.centerTitle}
            hoverHint={t.techstack.hoverHint}
            reduce={!!reduce}
          />
            <div className="mt-2">{coreIdentity}</div>
          </div>

          {/* Detail sits beside the wheel, so selecting a node has a visible target. */}
          <div className="flex min-h-[22rem] items-center">
            <AnimatePresence mode="wait" initial={false}>
              {active ? (
                <motion.div
                  key={active.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                  role="region"
                  aria-labelledby={`branch-${active.id}-title`}
                >
                  <GlowCard className="p-7 md:p-8">
                    <div className="mb-4 flex items-center gap-3.5">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 ring-1 ring-brand-500/20 dark:text-brand-400">
                        {React.createElement(iconMap[active.icon] || Brain, {
                          size: 21,
                          'aria-hidden': true,
                        })}
                      </div>
                      <h3
                        id={`branch-${active.id}-title`}
                        className="font-display text-xl font-bold text-slate-900 dark:text-white"
                      >
                        {active.title}
                      </h3>
                    </div>

                    <p className="mb-7 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {active.blurb}
                    </p>

                    {renderClusters(active.clusters)}
                  </GlowCard>
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.14 }}
                  className="w-full px-6 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400"
                >
                  {expanded ? t.techstack.pickHint : t.techstack.closedHint}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      {/* ---------- Accordion (below lg) — a wheel is unusable on a phone ---------- */}
      <div className="lg:hidden">
        <Reveal from="up">
          <div className="mb-8 rounded-2xl glass gradient-border p-6">{coreIdentity}</div>
        </Reveal>
      </div>

      <div className="space-y-4 lg:hidden">
        {branches.map((branch, index) => {
          const Icon = iconMap[branch.icon] || Brain;
          const isOpen = branch.id === openMobile;

          return (
            <Reveal key={branch.id} delay={index * 0.05} from="up">
              <GlowCard bordered={isOpen}>
                <button
                  type="button"
                  onClick={() => setOpenMobile((current) => (current === branch.id ? null : branch.id))}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3.5 p-5 text-left"
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ring-1 transition-colors ${
                      isOpen
                        ? 'bg-brand-500/15 text-brand-600 ring-brand-500/40 dark:text-brand-300'
                        : 'bg-brand-500/10 text-brand-600 ring-brand-500/20 dark:text-brand-400'
                    }`}
                  >
                    <Icon size={19} aria-hidden="true" />
                  </div>
                  <h3 className="flex-1 font-display text-lg font-bold text-slate-900 dark:text-white">
                    {branch.title}
                  </h3>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={`flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? 'rotate-180 text-brand-500' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-200/70 px-5 pb-6 pt-5 dark:border-white/10">
                      <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {branch.blurb}
                      </p>
                      {renderClusters(branch.clusters)}
                    </div>
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
