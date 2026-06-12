import React, { useRef, Suspense, lazy } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, ChevronDown, Download, Loader2, Circle } from 'lucide-react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';

// Heavy three.js visual — code-split so it never blocks first paint.
const NeuralGlobe = lazy(() => import('./hero/NeuralGlobe'));

/** Soft teal glow shown while the 3D bundle loads (and as a graceful base layer). */
const GlobeFallback: React.FC = () => (
  <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
    <div className="h-[60%] w-[60%] rounded-full bg-brand-500/20 blur-[80px] animate-glow-pulse" />
  </div>
);

const Hero: React.FC = () => {
  const { t } = useI18n();
  const { generating, downloadCv } = useCvDownload();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Scroll-driven parallax.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgScrollY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const contentScrollY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  // Mouse-driven parallax for the ambient glows.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 40, damping: 18, mass: 0.6 };
  const px = useSpring(mx, spring);
  const py = useSpring(my, spring);

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const glowAX = useTransform(px, [-1, 1], [40, -40]);
  const glowAY = useTransform(py, [-1, 1], [32, -32]);
  const glowBX = useTransform(px, [-1, 1], [-30, 30]);
  const glowBY = useTransform(py, [-1, 1], [-24, 24]);

  return (
    <section
      ref={ref}
      id="profile"
      data-section="profile"
      data-section-label={t.nav.profile}
      onMouseMove={handleMove}
      className="relative min-h-[100svh] flex items-center pt-28 pb-20 px-6 overflow-hidden"
    >
      {/* ===== AMBIENT PARALLAX GLOWS ===== */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgScrollY, opacity: heroFade }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="hero-aurora absolute inset-0" />
        <motion.div
          style={{ x: glowAX, y: glowAY }}
          className="absolute right-[4%] top-[12%] w-[460px] h-[460px] rounded-full bg-brand-500/12 blur-[100px]"
        />
        <motion.div
          style={{ x: glowBX, y: glowBY }}
          className="absolute left-[-6%] bottom-[6%] w-[420px] h-[420px] rounded-full bg-emerald-500/10 blur-[100px]"
        />
      </motion.div>

      {/* ===== CONTENT ===== */}
      <motion.div
        style={{ y: contentScrollY }}
        className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 lg:items-center gap-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 max-w-3xl space-y-8"
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

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-white leading-[0.95]">
            {t.hero.title1}
            <br />
            <span className="holo-text">{t.hero.title2}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-light">
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

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-500 font-mono">
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

        {/* ===== INTERACTIVE 3D NEURAL GLOBE (desktop-only, lazy) ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="hidden lg:block lg:col-span-5 relative h-[520px] xl:h-[600px]"
          aria-hidden="true"
        >
          <Suspense fallback={<GlobeFallback />}>
            <NeuralGlobe reducedMotion={!!reduce} />
          </Suspense>
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
