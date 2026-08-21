import React, { useMemo } from 'react';
import { motion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { Brain, type LucideIcon } from 'lucide-react';

/** Geometry, in the 0–100 space the SVG and the node offsets share. */
export const CORE_R = 15;
export const NODE_R = 11.5;
export const ORBIT_R = 36.5;

/** How far back the ring is wound before it spins into place. */
const WIND_UP = -Math.PI * 1.15;

/** Applied to the selected node, and to its siblings while one is selected. */
const ACTIVE_SCALE = 1.16;
const MUTED_SCALE = 0.88;

const scaleFor = (isActive: boolean, hasActive: boolean) =>
  hasActive ? (isActive ? ACTIVE_SCALE : MUTED_SCALE) : 1;

export interface GraphNode {
  id: string;
  short: string;
  title: string;
  icon: string;
}

interface SkillGraphProps {
  nodes: GraphNode[];
  iconMap: Record<string, LucideIcon>;
  expanded: boolean;
  activeId: string | null;
  onExpand: () => void;
  onToggleCore: () => void;
  onSelect: (id: string) => void;
  coreLabel: string;
  coreTitle: string;
  hoverHint: string;
  reduce: boolean;
}

const baseAngle = (i: number, total: number) => (i / total) * Math.PI * 2 - Math.PI / 2;

/**
 * One node of the ring. Its position is derived from the shared `progress`
 * spring, so every node travels outward *and* around at once — the ring reads
 * as a wheel spinning into place rather than seven things fading in.
 */
const Node: React.FC<{
  node: GraphNode;
  index: number;
  total: number;
  progress: MotionValue<number>;
  Icon: LucideIcon;
  isActive: boolean;
  hasActive: boolean;
  expanded: boolean;
  onSelect: (id: string) => void;
}> = ({ node, index, total, progress, Icon, isActive, hasActive, expanded, onSelect }) => {
  const angle = baseAngle(index, total);

  // Wound back by WIND_UP at rest, unwinding to the true angle as it opens.
  const x = useTransform(progress, (p) => {
    const a = angle + WIND_UP * (1 - p);
    return 50 + Math.cos(a) * ORBIT_R * p;
  });
  const y = useTransform(progress, (p) => {
    const a = angle + WIND_UP * (1 - p);
    return 50 + Math.sin(a) * ORBIT_R * p;
  });

  const left = useTransform(x, (v) => `${v}%`);
  const top = useTransform(y, (v) => `${v}%`);
  const opacity = useTransform(progress, [0, 0.25, 1], [0, 0, 1]);

  // The selected node grows; its siblings give it room by easing back.
  const scale = useTransform(
    progress,
    (p) => (0.35 + p * 0.65) * scaleFor(isActive, hasActive)
  );

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(node.id)}
      aria-pressed={isActive}
      aria-label={node.title}
      tabIndex={expanded ? 0 : -1}
      style={{ left, top, opacity, scale, x: '-50%', y: '-50%' }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="group/node absolute z-10 flex flex-col items-center justify-center rounded-full text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <span
        aria-hidden="true"
        className={`flex flex-col items-center justify-center rounded-full border transition-colors duration-300 ${
          isActive
            ? 'border-brand-500/80 bg-brand-500/15 shadow-[0_0_30px_-2px_rgba(45,212,191,0.7)]'
            : 'border-slate-200/80 bg-white/80 group-hover/node:border-brand-400/60 dark:border-white/12 dark:bg-slate-950/80'
        }`}
        style={{ width: `${NODE_R * 2}cqw`, height: `${NODE_R * 2}cqw` }}
      >
        <Icon
          size={20}
          className={`mb-1 transition-colors ${
            isActive
              ? 'text-brand-600 dark:text-brand-300'
              : 'text-slate-500 group-hover/node:text-brand-500 dark:text-slate-400'
          }`}
        />
        <span
          className={`px-2 font-display text-[11px] font-bold leading-tight transition-colors ${
            isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {node.short}
        </span>
      </span>
    </motion.button>
  );
};

/**
 * The arsenal as a wheel: everything starts folded into the core, hovering it
 * spins the ring out, and clicking the core folds it back. Edges stop at the
 * rim of each node rather than running under its icon.
 */
const SkillGraph: React.FC<SkillGraphProps> = ({
  nodes,
  iconMap,
  expanded,
  activeId,
  onExpand,
  onToggleCore,
  onSelect,
  coreLabel,
  coreTitle,
  hoverHint,
  reduce,
}) => {
  const progress = useSpring(expanded ? 1 : 0, {
    stiffness: reduce ? 400 : 90,
    damping: reduce ? 40 : 17,
    mass: 0.9,
  });

  React.useEffect(() => {
    progress.set(expanded ? 1 : 0);
  }, [expanded, progress]);

  const total = nodes.length;

  // From the core's rim to each node's rim. The far endpoint tracks the node's
  // current scale so the line meets the border exactly, grown or shrunken.
  const edges = useMemo(
    () =>
      nodes.map((node, i) => {
        const a = baseAngle(i, total);
        const isActive = node.id === activeId;
        const rim = ORBIT_R - NODE_R * scaleFor(isActive, activeId !== null);
        return {
          id: node.id,
          isActive,
          x1: 50 + Math.cos(a) * CORE_R,
          y1: 50 + Math.sin(a) * CORE_R,
          x2: 50 + Math.cos(a) * rim,
          y2: 50 + Math.sin(a) * rim,
        };
      }),
    [nodes, total, activeId]
  );

  const edgeOpacity = useTransform(progress, [0, 0.5, 1], [0, 0, 1]);

  return (
    <div
      style={{ containerType: 'inline-size' }}
      className="relative mx-auto aspect-square w-full max-w-[520px]"
      onMouseEnter={onExpand}
    >
      <motion.svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={{ opacity: edgeOpacity }}
        className="absolute inset-0 h-full w-full"
      >
        <circle
          cx={50}
          cy={50}
          r={ORBIT_R}
          fill="none"
          stroke="rgb(45 212 191)"
          strokeOpacity="0.12"
          strokeWidth="0.25"
          strokeDasharray="1.5 2.5"
        />
        {edges.map((edge) => {
          const isActive = edge.isActive;
          return (
            <line
              key={edge.id}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="rgb(45 212 191)"
              strokeOpacity={isActive ? 0.85 : 0.22}
              strokeWidth={isActive ? 0.65 : 0.3}
              className="transition-all duration-300"
            />
          );
        })}
      </motion.svg>

      {/* Core — hover opens the ring, click folds it back. */}
      <button
        type="button"
        onClick={onToggleCore}
        onFocus={onExpand}
        aria-expanded={expanded}
        style={{ width: `${CORE_R * 2}cqw`, height: `${CORE_R * 2}cqw` }}
        className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full glass gradient-border text-center transition-transform duration-300 hover:scale-[1.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-brand-500/10 blur-2xl animate-glow-pulse"
        />
        <Brain
          size={24}
          aria-hidden="true"
          className="relative mb-1.5 text-brand-600 dark:text-brand-400"
        />
        <span className="relative font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          {coreLabel}
        </span>
        <span className="relative px-4 font-display text-[0.95rem] font-bold leading-[1.15] text-slate-900 dark:text-white">
          {coreTitle}
        </span>

        <motion.span
          animate={{ opacity: expanded ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          className="relative mt-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400"
        >
          {hoverHint}
        </motion.span>
      </button>

      {nodes.map((node, i) => (
        <Node
          key={node.id}
          node={node}
          index={i}
          total={total}
          progress={progress}
          Icon={iconMap[node.icon] || Brain}
          isActive={node.id === activeId}
          hasActive={activeId !== null}
          expanded={expanded}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default SkillGraph;
