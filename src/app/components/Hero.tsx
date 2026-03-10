import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Glacier Aurora Canvas Background ───
// Renders flowing light waves that mimic glacier water refraction / aurora
const useGlacierCanvas = (canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean) => {
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    timeRef.current += 0.003;
    const t = timeRef.current;
    ctx.clearRect(0, 0, W, H);

    // Dark base
    ctx.fillStyle = '#08101e';
    ctx.fillRect(0, 0, W, H);

    // Aurora / glacier light waves
    const waves = [
      { yBase: 0.32, amp: 0.06, freq: 0.8, speed: 0.7, color: [15, 80, 120], alpha: 0.25, width: 0.45 },
      { yBase: 0.42, amp: 0.08, freq: 0.5, speed: -0.5, color: [20, 110, 140], alpha: 0.18, width: 0.6 },
      { yBase: 0.50, amp: 0.05, freq: 1.1, speed: 0.9, color: [40, 160, 180], alpha: 0.12, width: 0.35 },
      { yBase: 0.55, amp: 0.10, freq: 0.35, speed: -0.3, color: [10, 60, 100], alpha: 0.22, width: 0.7 },
      { yBase: 0.65, amp: 0.04, freq: 1.4, speed: 1.1, color: [30, 140, 160], alpha: 0.10, width: 0.3 },
      { yBase: 0.38, amp: 0.07, freq: 0.6, speed: 0.4, color: [8, 50, 90], alpha: 0.20, width: 0.55 },
    ];

    for (const wave of waves) {
      const bandH = H * wave.width;
      const centerY = H * wave.yBase + Math.sin(t * wave.speed * 0.5) * H * 0.03;

      // Each wave is drawn as a series of horizontal gradient bands
      const steps = 60;
      for (let i = 0; i < steps; i++) {
        const frac = i / steps;
        const x = frac * W;
        const nextX = (i + 1) / steps * W;

        // Sine displacement
        const yOff = Math.sin(frac * Math.PI * 2 * wave.freq + t * wave.speed) * H * wave.amp
                   + Math.sin(frac * Math.PI * 3.7 * wave.freq + t * wave.speed * 1.3) * H * wave.amp * 0.3;

        const y = centerY + yOff;

        // Gaussian-like vertical falloff
        const grad = ctx.createLinearGradient(x, y - bandH / 2, x, y + bandH / 2);
        const [r, g, b] = wave.color;
        const peakAlpha = wave.alpha * (0.7 + 0.3 * Math.sin(frac * Math.PI * 4 + t * 2));
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${peakAlpha * 0.5})`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${peakAlpha})`);
        grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${peakAlpha * 0.5})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(x, y - bandH / 2, nextX - x + 1, bandH);
      }
    }

    // Bright focal glow (center-upper area, like light through ice)
    const glowX = W * (0.5 + Math.sin(t * 0.4) * 0.1);
    const glowY = H * (0.38 + Math.sin(t * 0.25) * 0.04);
    const glowR = Math.min(W, H) * 0.45;
    const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowR);
    glow.addColorStop(0, 'rgba(40, 160, 200, 0.06)');
    glow.addColorStop(0.4, 'rgba(20, 100, 140, 0.03)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Secondary warm accent (very subtle)
    const glow2X = W * (0.35 + Math.sin(t * 0.3 + 2) * 0.15);
    const glow2Y = H * (0.55 + Math.sin(t * 0.2 + 1) * 0.05);
    const glow2 = ctx.createRadialGradient(glow2X, glow2Y, 0, glow2X, glow2Y, glowR * 0.6);
    glow2.addColorStop(0, 'rgba(60, 180, 160, 0.04)');
    glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, W, H);
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const animate = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      draw(ctx, W, H);
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', setSize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', setSize);
    };
  }, [active, canvasRef, draw]);
};

export const Hero = () => {
  const { t } = useTranslation();
  const glacierCanvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [splashDone, setSplashDone] = useState(false);
  const [splashPhase, setSplashPhase] = useState(0);

  // Activate glacier canvas
  useGlacierCanvas(glacierCanvasRef, true);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  // Splash sequence: ring expand → text reveal → fade out
  useEffect(() => {
    const t1 = setTimeout(() => setSplashPhase(1), 400);
    const t2 = setTimeout(() => setSplashPhase(2), 1800);
    const t3 = setTimeout(() => setSplashDone(true), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const titleWords = t('hero.title').split(' ');
  const firstLine = titleWords.slice(0, 2).join(' ');
  const secondLine = titleWords.slice(2).join(' ');

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Splash — expanding ring reveal */}
      <AnimatePresence>
        {!splashDone && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Expanding ring */}
            <motion.div
              className="absolute rounded-full border border-white/20"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{
                width: splashPhase >= 1 ? '120vmax' : 80,
                height: splashPhase >= 1 ? '120vmax' : 80,
                opacity: splashPhase >= 1 ? 0 : 0.6,
              }}
              transition={{ duration: splashPhase >= 1 ? 1.2 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            {/* Inner ring */}
            <motion.div
              className="absolute rounded-full"
              style={{ border: '1px solid rgba(20,184,166,0.15)' }}
              initial={{ width: 0, height: 0 }}
              animate={{ width: 160, height: 160, opacity: splashPhase >= 2 ? 0 : 0.4 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            />

            {/* Brand logo */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: splashPhase >= 1 ? 1 : 0, scale: splashPhase >= 1 ? 1 : 0.85 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <img
                src="/images/dentissimo-logo.png"
                alt="Dentissimo"
                className="h-20 md:h-32 w-auto object-contain brightness-0 invert"
              />
            </motion.div>

            {/* Radial pulse */}
            <motion.div
              className="absolute w-[300px] h-[300px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Glacier Aurora Canvas Background ═══ */}
      <motion.div
        className="absolute inset-3 sm:inset-4 md:inset-6 lg:inset-8 z-0 overflow-hidden"
        style={{ scale: bgScale, opacity: bgOpacity }}
      >
        <canvas
          ref={glacierCanvasRef}
          className="w-full h-full"
          style={{ display: 'block' }}
        />

        {/* Frame border */}
        <div className="absolute inset-0 z-30 ring-1 ring-inset ring-white/[0.08] pointer-events-none" />

        {/* Subtle noise texture over canvas */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)' }}
        />
      </motion.div>

      {/* Decorative geometric elements */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {/* Corner brackets — aligned to video frame edges */}
        <motion.div
          className="absolute top-[72px] left-5 md:top-[88px] md:left-9 lg:left-11 w-10 h-10 md:w-16 md:h-16"
          initial={{ opacity: 0 }}
          animate={splashDone ? { opacity: 0.15 } : {}}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-white/80 to-transparent" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-white/80 to-transparent" />
        </motion.div>
        <motion.div
          className="absolute bottom-56 right-5 md:bottom-20 md:right-9 lg:right-11 w-10 h-10 md:w-16 md:h-16"
          initial={{ opacity: 0 }}
          animate={splashDone ? { opacity: 0.15 } : {}}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-white/80 to-transparent" />
          <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-white/80 to-transparent" />
        </motion.div>

        {/* Rotating arc */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-[0.04]">
            <circle cx="100" cy="100" r="95" fill="none" stroke="white" strokeWidth="0.3" strokeDasharray="30 570" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[550px] md:h-[550px]"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-[0.03]">
            <circle cx="100" cy="100" r="95" fill="none" stroke="white" strokeWidth="0.3" strokeDasharray="20 580" />
          </svg>
        </motion.div>
      </div>

      {/* Main content — centered cinematic layout */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6"
        style={{ y: contentY }}
      >
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={splashDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="inline-flex items-center gap-3 text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/60 uppercase mb-8">
            <span className="w-8 h-px bg-white/30" />
            {t('hero.tagline')}
            <span className="w-8 h-px bg-white/30" />
          </span>
        </motion.div>

        {/* Title — split reveal */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-white font-bold"
            initial={{ y: '100%' }}
            animate={splashDone ? { y: '0%' } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {firstLine}
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-6">
          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-white/70 italic font-light"
            initial={{ y: '100%' }}
            animate={splashDone ? { y: '0%' } : {}}
            transition={{ duration: 1, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {secondLine}
          </motion.h1>
        </div>

        {/* Expanding center line */}
        <motion.div
          className="flex items-center justify-center gap-0 mb-8"
          initial={{ opacity: 0 }}
          animate={splashDone ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div
            className="h-px bg-gradient-to-r from-transparent to-white/30"
            initial={{ width: 0 }}
            animate={splashDone ? { width: 80 } : {}}
            transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
          />
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-white/40 mx-3"
            initial={{ scale: 0 }}
            animate={splashDone ? { scale: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.4 }}
          />
          <motion.div
            className="h-px bg-gradient-to-l from-transparent to-white/30"
            initial={{ width: 0 }}
            animate={splashDone ? { width: 80 } : {}}
            transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={splashDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base md:text-lg text-stone-300 max-w-lg mx-auto leading-relaxed font-medium mb-10"
        >
          {t('hero.description')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={splashDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#products"
            className="group relative px-8 py-4 bg-white text-stone-900 font-semibold tracking-wide hover:bg-stone-100 transition-all duration-300 flex items-center gap-2 rounded-none text-sm md:text-base overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('hero.buyNow')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          <a
            href="#about"
            className="px-8 py-4 border border-white/25 text-white font-semibold tracking-wide hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center backdrop-blur-sm rounded-none text-sm md:text-base"
          >
            {t('hero.learnMore')}
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent z-[3] pointer-events-none" />

      {/* Scroll indicator — minimal line */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0 }}
        animate={splashDone ? { opacity: 0.4 } : {}}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-semibold">{t('common.scroll')}</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent origin-top"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Side text — vertical label */}
      <motion.div
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 items-center"
        initial={{ opacity: 0 }}
        animate={splashDone ? { opacity: 0.2 } : {}}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-white font-semibold [writing-mode:vertical-rl] rotate-180">
          {t('hero.sideLabel', 'Est. Switzerland')}
        </span>
      </motion.div>
    </section>
  );
};
