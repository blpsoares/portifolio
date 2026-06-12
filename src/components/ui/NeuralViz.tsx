import React, { useMemo } from 'react';

interface NeuralVizProps {
  className?: string;
}

const LAYERS = [4, 6, 6, 3];
const W = 400;
const H = 340;
const PADX = 46;
const PADY = 46;

interface Node {
  x: number;
  y: number;
  i: number;
}
interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  key: string;
  active: boolean;
  delay: number;
}

/**
 * A living feed-forward neural network: nodes pulse and signals flow along the
 * connections. A meaningful, on-brand "AI is computing" motif for an AI
 * engineer — not a decorative blob.
 */
const NeuralViz: React.FC<NeuralVizProps> = ({ className = '' }) => {
  const { nodes, edges } = useMemo(() => {
    const cols = LAYERS.length;
    const layered: Node[][] = LAYERS.map((count, li) => {
      const x = PADX + (W - 2 * PADX) * (li / (cols - 1));
      return Array.from({ length: count }, (_, ni) => ({
        x,
        y: count === 1 ? H / 2 : PADY + (H - 2 * PADY) * (ni / (count - 1)),
        i: 0,
      }));
    });

    const edges: Edge[] = [];
    for (let li = 0; li < layered.length - 1; li++) {
      layered[li].forEach((a, ai) =>
        layered[li + 1].forEach((b, bi) => {
          edges.push({
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y,
            key: `${li}-${ai}-${bi}`,
            active: (ai + bi + li) % 3 === 0,
            delay: ((ai + bi + li) % 5) * 0.25,
          });
        }),
      );
    }

    const nodes = layered.flat().map((n, i) => ({ ...n, i }));
    return { nodes, edges };
  }, []);

  return (
    <div className={`relative text-brand-500 dark:text-brand-400 ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Neural network visualization"
      >
        <defs>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* connections */}
        {edges.map((e) => (
          <line
            key={e.key}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke="currentColor"
            strokeWidth={e.active ? 1 : 0.6}
            strokeOpacity={e.active ? 0.55 : 0.12}
            className={e.active ? 'neural-edge' : undefined}
            style={e.active ? { animationDelay: `${e.delay}s` } : undefined}
          />
        ))}

        {/* nodes */}
        {nodes.map((n) => (
          <g key={n.i}>
            <circle
              cx={n.x}
              cy={n.y}
              r={4.5}
              fill="currentColor"
              filter="url(#nodeGlow)"
              className="neural-node"
              style={{ animationDelay: `${(n.i % 7) * 0.35}s` }}
            />
          </g>
        ))}
      </svg>

      {/* HUD label */}
      <div className="absolute top-1 left-1 flex items-center gap-2 font-mono text-[10px] tracking-wider text-slate-500 dark:text-slate-400">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
        </span>
        neural.inference
      </div>

      {/* layer captions */}
      <div className="absolute -bottom-1 inset-x-3 flex justify-between font-mono text-[10px] tracking-wider text-slate-400 dark:text-slate-500">
        <span>context</span>
        <span className="hidden sm:inline">reasoning</span>
        <span>action</span>
      </div>
    </div>
  );
};

export default NeuralViz;
