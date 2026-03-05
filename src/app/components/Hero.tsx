import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center overflow-hidden pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%231c1917' width='1' height='1'/%3E%3C/svg%3E"
        >
          <source src="/gorge-water.mp4" type="video/mp4" />
        </video>
        {/* Neutral gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-transparent to-stone-950/80"></div>
        {/* Subtle gold accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/8 via-transparent to-transparent"></div>
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F9F8F6] dark:from-stone-950 to-transparent transition-colors duration-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-2 px-4 border border-white/40 rounded-full text-xs font-semibold tracking-widest text-white/90 uppercase mb-6 backdrop-blur-md bg-white/10 shadow-lg hover:bg-white/15 transition-all duration-300">
              {t('hero.tagline')}
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-white drop-shadow-2xl [text-shadow:_0_4px_12px_rgb(0_0_0_/_40%)]">
              {t('hero.title').split(' ').slice(0, 2).join(' ')} <br />
              <span className="italic text-white/80 bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">{t('hero.title').split(' ').slice(2).join(' ')}</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-white/80 max-w-md leading-relaxed font-light mt-8 drop-shadow-lg"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <a href="#products" className="px-8 py-4 bg-white text-stone-900 font-semibold tracking-wide hover:from-[#D4AF37] hover:to-[#B8960C] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group rounded-xl shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:scale-105 transform hover:bg-gradient-to-r">
              {t('hero.buyNow')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#about" className="px-8 py-4 border-2 border-white/40 text-white font-semibold tracking-wide hover:bg-white/20 hover:border-white/60 transition-all duration-300 flex items-center justify-center backdrop-blur-md rounded-xl shadow-lg hover:scale-105 transform">
              {t('hero.learnMore')}
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative scroll indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-60 md:left-10 md:translate-x-0 md:items-start z-10">
         <span className="text-[10px] uppercase tracking-widest text-white/60">{t('common.scroll')}</span>
         <div className="w-[1px] h-10 bg-white/30"></div>
      </div>
    </section>
  );
};
