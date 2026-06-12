import React from 'react';

interface AiOrbProps {
  size?: number;
  className?: string;
  /** show the pulsing rings radiating outward */
  pulse?: boolean;
}

/**
 * Animated "AI core" — a glowing orb wrapped in counter-rotating orbital rings
 * with a small scanning satellite. Pure CSS/SVG, no dependencies. Used as the
 * recurring futuristic / robotic motif (hero, agent dock launcher, headers).
 */
const AiOrb: React.FC<AiOrbProps> = ({ size = 120, className = '', pulse = true }) => {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* radiating pulse rings */}
      {pulse && (
        <>
          <span className="absolute inset-0 rounded-full border border-brand-400/40 animate-pulse-ring" />
          <span
            className="absolute inset-0 rounded-full border border-brand-400/30 animate-pulse-ring"
            style={{ animationDelay: '1.3s' }}
          />
        </>
      )}

      {/* outer orbital ring */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full animate-spin-slow text-brand-400/60"
      >
        <ellipse
          cx="50"
          cy="50"
          rx="46"
          ry="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="2 4"
        />
        <circle cx="96" cy="50" r="2" fill="currentColor" />
      </svg>

      {/* inner counter-rotating ring */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full animate-spin-rev text-emerald-400/50"
        style={{ transform: 'rotate(60deg)' }}
      >
        <ellipse
          cx="50"
          cy="50"
          rx="20"
          ry="46"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="2 5"
        />
        <circle cx="50" cy="4" r="1.8" fill="currentColor" />
      </svg>

      {/* glowing core */}
      <div className="absolute inset-0 flex items-center justify-center animate-orb-bob">
        <div
          className="rounded-full bg-gradient-to-br from-brand-300 via-brand-500 to-emerald-600"
          style={{
            width: size * 0.34,
            height: size * 0.34,
            boxShadow:
              '0 0 18px 4px rgba(45,212,191,0.55), inset 0 0 12px rgba(255,255,255,0.45)',
          }}
        >
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),transparent_55%)]" />
        </div>
      </div>
    </div>
  );
};

export default AiOrb;
