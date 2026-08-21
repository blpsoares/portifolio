import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, ChevronDown, Download, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';

const NeuralGlobe = lazy(() => import('./hero/NeuralGlobe'));

/** Soft teal glow shown while the 3D bundle loads (and as a graceful base layer). */
const GlobeFallback: React.FC = () => (
  <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
    <div className="h-[60%] w-[60%] rounded-full bg-brand-500/20 blur-[80px] animate-glow-pulse" />
  </div>
);

/**
 * Hero in the language of the personal brand banner: the name split white/teal,
 * a hairline rule and a wide-tracked title underneath, over a dark field.
 */
const Hero: React.FC = () => {
  const { t } = useI18n();
  const { generating, downloadCv } = useCvDownload();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const [showGlobe, setShowGlobe] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setShowGlobe(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgScrollY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const contentScrollY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

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

  const socials = [
    { href: 'https://github.com/blpsoares', label: 'GitHub', Icon: Github, handle: 'github.com/blpsoares' },
    { href: 'https://linkedin.com/in/blpsoares', label: 'LinkedIn', Icon: Linkedin, handle: 'linkedin.com/in/blpsoares' },
    { href: 'mailto:bryanluccas@hotmail.com', label: 'Email', Icon: Mail, handle: 'bryanluccas@hotmail.com' },
  ];

  return (
    <section
      ref={ref}
      id="profile"
      data-section="profile"
      data-section-label={t.nav.profile}
      onMouseMove={handleMove}
      className="relative min-h-[100svh] flex items-center pt-28 pb-20 px-6 overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        style={{ y: bgScrollY, opacity: heroFade }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="hero-aurora absolute inset-0" />

        {/* Dot field on the trailing edge. */}
        <div className="hero-dotfield absolute right-0 top-0 h-[62%] w-[38%] opacity-60 dark:opacity-80" />

        <motion.div
          style={{ x: glowAX, y: glowAY }}
          className="absolute right-[6%] top-[14%] h-[420px] w-[420px] rounded-full bg-brand-500/12 blur-[110px]"
        />
      </motion.div>

      <motion.div
        style={{ y: contentScrollY }}
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          {/* The position, stated before the name. Above a headline this large a
              kicker has to stay small or the two fight; the weight split does
              the work that size would otherwise have to. */}
          <p className="mb-6 font-display text-[clamp(1.05rem,1.6vw,1.3rem)] font-bold leading-snug tracking-tight text-slate-900 dark:text-white">
            {t.hero.thesis1}{' '}
            <span className="text-slate-500 dark:text-slate-400">{t.hero.thesis2}</span>
          </p>

          {/* Name — white/teal split, straight off the brand mark. */}
          <h1 className="font-display text-[clamp(2.75rem,7vw,5.25rem)] font-bold leading-[0.98] tracking-tight text-slate-900 dark:text-white">
            Bryan <span className="text-brand-500 dark:text-brand-400">Soares</span>
          </h1>

          {/* Hairline rule + wide-tracked title, as on the banner. */}
          <div className="mt-6 max-w-xl">
            <span
              aria-hidden="true"
              className="block h-px w-full bg-gradient-to-r from-brand-500/70 via-brand-500/25 to-transparent"
            />
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[clamp(0.8rem,1.5vw,1rem)] font-medium uppercase tracking-[0.2em]">
              <span className="text-brand-600 dark:text-brand-400">AI Engineer</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-slate-700 dark:text-slate-200">Software Developer</span>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
            {t.hero.subtitle_suffix}
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:shadow-brand-500/20 dark:hover:bg-slate-100 sm:w-auto"
            >
              {t.hero.cta}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => downloadCv()}
              disabled={generating}
              className="group flex w-full items-center justify-center gap-2 rounded-xl gradient-border glass px-6 py-3.5 font-semibold text-slate-900 transition-all hover:scale-[1.02] hover:text-brand-600 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 dark:text-white dark:hover:text-brand-400 sm:w-auto"
            >
              {generating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} className="transition-transform group-hover:translate-y-0.5" />
              )}
              {t.footer.downloadCv}
            </button>
          </div>

          {/* Mono link stack, echoing the bottom-right block of the banner. */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-slate-200/60 pt-6 dark:border-slate-800/60">
            {socials.map(({ href, label, Icon, handle }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group inline-flex items-center gap-2 font-mono text-[12px] text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
              >
                <Icon size={13} aria-hidden="true" className="transition-transform group-hover:scale-110" />
                {handle}
              </a>
            ))}
          </div>
        </motion.div>

        {showGlobe && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative h-[440px] lg:col-span-5 xl:h-[540px]"
            aria-hidden="true"
          >
            <Suspense fallback={<GlobeFallback />}>
              <NeuralGlobe reducedMotion={!!reduce} />
            </Suspense>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        style={{ opacity: heroFade }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce text-slate-400 dark:text-slate-600 md:block"
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;
