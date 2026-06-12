import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, ChevronDown, Download, Loader2, Circle } from 'lucide-react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';
import AgentConsole from './AgentConsole';
import AiOrb from './ui/AiOrb';

const Hero: React.FC = () => {
  const { t } = useI18n();
  const { generating, downloadCv } = useCvDownload();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Scroll-driven parallax: layers drift at different speeds as you leave the hero.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const bgScrollY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const contentScrollY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -50]);
  const heroFade = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0]);

  // Mouse-driven parallax: spring-smoothed pointer position in [-1, 1].
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 45, damping: 18, mass: 0.6 };
  const px = useSpring(mx, spring);
  const py = useSpring(my, spring);

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  // Layer offsets (further layers move more = depth).
  const orbX = useTransform(px, [-1, 1], [50, -50]);
  const orbY = useTransform(py, [-1, 1], [40, -40]);
  const haloX = useTransform(px, [-1, 1], [26, -26]);
  const haloY = useTransform(py, [-1, 1], [22, -22]);
  const consoleX = useTransform(px, [-1, 1], [-14, 14]);
  const consoleY = useTransform(py, [-1, 1], [-10, 10]);
  const consoleRotX = useTransform(py, [-1, 1], [4, -4]);
  const consoleRotY = useTransform(px, [-1, 1], [-5, 5]);

  return (
    <section
      ref={ref}
      id="profile"
      data-section="profile"
      data-section-label={t.nav.profile}
      onMouseMove={handleMove}
      className="relative min-h-[100svh] flex items-center pt-28 pb-20 px-6 overflow-hidden"
    >
      {/* ===== BACKGROUND PARALLAX LAYERS (decorative, behind everything) ===== */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgScrollY, opacity: heroFade }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="hero-aurora absolute inset-0" />
        {/* the AI orb now lives quietly in the back-right, as ambient depth */}
        <motion.div
          style={{ x: orbX, y: orbY }}
          className="absolute right-[-6%] top-[8%] opacity-[0.22] dark:opacity-30 hidden md:block"
        >
          <AiOrb size={360} pulse={false} />
        </motion.div>
        {/* soft counter-halo on the left for balance */}
        <motion.div
          style={{ x: haloX, y: haloY }}
          className="absolute left-[-10%] bottom-[6%] w-[420px] h-[420px] rounded-full bg-brand-500/10 blur-3xl"
        />
      </motion.div>

      {/* ===== FOREGROUND CONTENT ===== */}
      <motion.div
        style={{ y: contentScrollY }}
        className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-x-10 gap-y-14 items-center"
      >
        {/* LEFT COLUMN */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-7"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full glass gradient-border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Bryan Soares
            </span>
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              {t.hero.badge}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[0.98]">
            {t.hero.title1}
            <br />
            <span className="holo-text">{t.hero.title2}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-light">
            {t.hero.subtitle_prefix}
            <strong className="text-slate-900 dark:text-slate-200 font-medium">{t.hero.subtitle_highlight}</strong>
            {t.hero.subtitle_suffix}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-900/10 dark:shadow-brand-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.hero.cta}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => downloadCv()}
              disabled={generating}
              className="group px-6 py-3.5 rounded-xl gradient-border glass text-slate-900 dark:text-white font-semibold hover:text-brand-600 dark:hover:text-brand-400 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
            >
              {generating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              )}
              {t.footer.downloadCv}
            </button>

            <div className="flex items-center gap-2 sm:px-1">
              {[
                { href: 'https://github.com/blpsoares', label: 'GitHub', Icon: Github },
                { href: 'https://linkedin.com/in/blpsoares', label: 'LinkedIn', Icon: Linkedin },
                { href: 'mailto:bryanluccas@hotmail.com', label: 'Email', Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-white transition-colors hover:scale-110"
                  aria-label={label}
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-500 font-mono">
            {[t.hero.tag1, t.hero.tag2, t.hero.tag3, t.hero.tag4].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-default"
              >
                <Circle size={6} className="fill-brand-500/60 text-brand-500/60" aria-hidden="true" />
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN — the AI agent console (with 3D parallax tilt) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            x: consoleX,
            y: consoleY,
            rotateX: consoleRotX,
            rotateY: consoleRotY,
            transformPerspective: 1200,
          }}
          className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto [transform-style:preserve-3d]"
        >
          <div className="hidden lg:flex items-center justify-end gap-2 mb-3 text-sm font-medium text-brand-600 dark:text-brand-400">
            <span className="animate-float">{t.agent.hint}</span>
          </div>
          <AgentConsole />
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity: heroFade }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 dark:text-slate-600 hidden md:block z-10"
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;
