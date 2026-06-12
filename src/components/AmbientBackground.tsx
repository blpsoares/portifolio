import React from 'react';

/**
 * Layered, living backdrop behind the whole site:
 *  - a slowly drifting mesh-gradient field (the "neural glow")
 *  - a perspective tech grid that pans
 * Sits beneath the NeuralBackground canvas. Pure CSS, GPU-friendly.
 */
const AmbientBackground: React.FC = () => {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-mesh animate-aurora-drift" />
      <div className="absolute inset-x-0 top-0 h-[70vh] bg-grid animate-grid-pan opacity-60" />
      {/* vignette to keep edges calm and text legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-950" />
    </div>
  );
};

export default AmbientBackground;
