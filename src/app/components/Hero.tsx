import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';

export const Hero = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = window.innerWidth < 768;
    const src = isMobile ? '/waterfall-blue-mobile.mp4' : '/waterfall-blue.mp4';

    const tryPlay = () => {
      video.play().then(() => setVideoLoaded(true)).catch(() => {
        // Autoplay might be blocked, mute and retry
        video.muted = true;
        video.play().then(() => setVideoLoaded(true)).catch(() => {});
      });
    };

    video.src = src;
    video.addEventListener('canplay', tryPlay, { once: true });
    video.addEventListener('error', () => {
      // Retry once on error
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

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-16 md:pt-20">
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
        {/* Light overlays — let blue water shine through */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/30"></div>
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-2 px-4 border border-stone-900/30 rounded-full text-xs font-semibold tracking-widest text-stone-800 uppercase mb-6 backdrop-blur-md bg-white/50 shadow-lg hover:bg-white/70 transition-all duration-300">
              {t('hero.tagline')}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight text-stone-900 drop-shadow-sm">
              {t('hero.title').split(' ').slice(0, 2).join(' ')} <br />
              <span className="italic text-stone-700">{t('hero.title').split(' ').slice(2).join(' ')}</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-stone-700 max-w-md leading-relaxed font-light mt-8"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap gap-3 mt-8"
          >
            <a href="#products" className="px-6 py-3.5 bg-stone-900 text-white font-semibold tracking-wide hover:bg-stone-800 transition-all duration-300 flex items-center justify-center gap-2 group rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transform text-sm md:text-base md:px-8 md:py-4">
              {t('hero.buyNow')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#about" className="px-6 py-3.5 border-2 border-stone-900/30 text-stone-900 font-semibold tracking-wide hover:bg-white/60 hover:border-stone-900/50 transition-all duration-300 flex items-center justify-center backdrop-blur-md rounded-xl shadow-lg hover:scale-105 transform text-sm md:text-base md:px-8 md:py-4">
              {t('hero.learnMore')}
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative scroll indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-60 md:left-10 md:translate-x-0 md:items-start z-10">
         <span className="text-[10px] uppercase tracking-widest text-stone-500">{t('common.scroll')}</span>
         <div className="w-[1px] h-10 bg-stone-400/40"></div>
      </div>
    </section>
  );
};
