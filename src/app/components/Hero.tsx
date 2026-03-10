import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';

export const Hero = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [splashPhase, setSplashPhase] = useState(0); // 0=ring, 1=text, 2=done

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const isMobile = window.innerWidth < 768;
    const src = isMobile ? '/waterfall-blue-mobile.mp4' : '/waterfall-blue.mp4';
    const tryPlay = () => {
      video.play().then(() => setVideoLoaded(true)).catch(() => {
        video.muted = true;
        video.play().then(() => setVideoLoaded(true)).catch(() => {});
      });
    };
    video.src = src;
    video.addEventListener('canplay', tryPlay, { once: true });
    video.addEventListener('error', () => {
      setTimeout(() => { video.src = src + '?retry=' + Date.now(); video.load(); }, 2000);
    }, { once: true });
    video.load();
    return () => { video.removeEventListener('canplay', tryPlay); };
  }, []);

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
              style={{ border: '1px solid rgba(56,189,248,0.15)' }}
              initial={{ width: 0, height: 0 }}
              animate={{ width: 160, height: 160, opacity: splashPhase >= 2 ? 0 : 0.4 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            />

            {/* Brand text */}
            <div className="relative flex flex-col items-center gap-3">
              <div className="overflow-hidden">
                <motion.h1
                  className="font-serif text-5xl md:text-8xl text-white tracking-[0.12em] font-bold"
                  initial={{ y: '110%' }}
                  animate={{ y: splashPhase >= 1 ? '0%' : '110%' }}
                  transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  dentissimo
                </motion.h1>
              </div>
              <motion.div
                className="flex items-center gap-4 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: splashPhase >= 1 ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.div
                  className="h-px bg-white/30"
                  initial={{ width: 0 }}
                  animate={{ width: splashPhase >= 1 ? 60 : 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                />
                <motion.span
                  className="text-stone-500 text-[10px] tracking-[0.4em] uppercase font-semibold whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: splashPhase >= 1 ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Swiss Premium Care
                </motion.span>
                <motion.div
                  className="h-px bg-white/30"
                  initial={{ width: 0 }}
                  animate={{ width: splashPhase >= 1 ? 60 : 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                />
              </motion.div>
            </div>

            {/* Radial pulse */}
            <motion.div
              className="absolute w-[300px] h-[300px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video background with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: videoScale, opacity: videoOpacity }}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline preload="auto"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-stone-950/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/90" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 40%, transparent 30%, rgba(12,10,9,0.6) 100%)' }} />
      </div>

      {/* Decorative geometric elements */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {/* Corner brackets */}
        <motion.div
          className="absolute top-24 left-8 md:left-16 w-16 h-16 md:w-24 md:h-24"
          initial={{ opacity: 0 }}
          animate={splashDone ? { opacity: 0.15 } : {}}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-white to-transparent" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-white to-transparent" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-8 md:right-16 w-16 h-16 md:w-24 md:h-24"
          initial={{ opacity: 0 }}
          animate={splashDone ? { opacity: 0.15 } : {}}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-white to-transparent" />
          <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-white to-transparent" />
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
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent z-[3]" />

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
          Est. Switzerland
        </span>
      </motion.div>
    </section>
  );
};
