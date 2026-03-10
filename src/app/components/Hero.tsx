import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';

export const Hero = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

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
      setTimeout(() => {
        video.src = src + '?retry=' + Date.now();
        video.load();
      }, 2000);
    }, { once: true });
    video.load();

    return () => {
      video.removeEventListener('canplay', tryPlay);
    };
  }, []);

  // Splash intro timing
  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-16 md:pt-20">
      {/* Splash/intro overlay */}
      <AnimatePresence>
        {!splashDone && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {/* Radial glow behind logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-[600px] h-[600px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)' }}
                animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.6, 0.3] }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>
            
            {/* Animated brand text */}
            <div className="relative flex flex-col items-center gap-4">
              <motion.h1
                className="font-serif text-5xl md:text-7xl text-white tracking-[0.15em] font-bold"
                initial={{ opacity: 0, y: 30, letterSpacing: '0.4em' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '0.15em' }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                dentissimo
              </motion.h1>
              <motion.div
                className="h-[1px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
              />
              <motion.p
                className="text-stone-400 text-xs tracking-[0.3em] uppercase font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                Premium Oral Care
              </motion.p>
            </div>

            {/* Floating particles in splash */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-sky-400/30"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0.5], y: [0, -40] }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: 0.3 + Math.random() * 1.2,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-stone-950/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/30 via-transparent to-stone-950/70"></div>
        {/* Vignette effect */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(12,10,9,0.5) 100%)' }}></div>
        {/* Bottom seamless fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={splashDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          >
            <span className="inline-block py-2 px-4 border border-white/20 rounded-full text-xs font-bold tracking-widest text-white/90 uppercase mb-6 backdrop-blur-md bg-white/[0.05] shadow-lg">
              {t('hero.tagline')}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight text-white drop-shadow-md font-bold">
              {t('hero.title').split(' ').slice(0, 2).join(' ')} <br />
              <span className="italic text-stone-200 font-semibold">{t('hero.title').split(' ').slice(2).join(' ')}</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={splashDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-lg text-stone-300 max-w-md leading-relaxed font-medium mt-8 drop-shadow-sm"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={splashDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-wrap gap-3 mt-8"
          >
            <a href="#products" className="px-6 py-3.5 bg-white text-stone-900 font-semibold tracking-wide hover:bg-stone-100 transition-all duration-300 flex items-center justify-center gap-2 group rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transform text-sm md:text-base md:px-8 md:py-4">
              {t('hero.buyNow')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#about" className="px-6 py-3.5 border border-white/20 text-white font-semibold tracking-wide hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center justify-center backdrop-blur-md rounded-xl shadow-lg hover:scale-105 transform text-sm md:text-base md:px-8 md:py-4 bg-white/[0.04]">
              {t('hero.learnMore')}
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative scroll indicator */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 md:left-10 md:translate-x-0 md:items-start z-10"
        initial={{ opacity: 0 }}
        animate={splashDone ? { opacity: 0.5 } : {}}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
         <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold drop-shadow-sm">{t('common.scroll')}</span>
         <motion.div
           className="w-[1px] h-10 bg-gradient-to-b from-stone-400/50 to-transparent"
           animate={{ scaleY: [1, 0.5, 1] }}
           transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
         />
      </motion.div>
    </section>
  );
};
