import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full h-screen min-h-[700px] bg-[#F9F8F6] flex items-center overflow-hidden pt-20">
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full">
        <img
          src="https://images.unsplash.com/photo-1674632655437-077f7edbe65c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Premium Dentissimo Toothpaste"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F9F8F6] md:hidden"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="md:w-1/2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 border border-stone-300 rounded-full text-xs font-semibold tracking-widest text-stone-500 uppercase mb-4 bg-white/50 backdrop-blur-sm">
              {t('hero.tagline')}
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-stone-900">
              {t('hero.title').split(' ').slice(0, 2).join(' ')} <br />
              <span className="italic text-stone-600">{t('hero.title').split(' ').slice(2).join(' ')}</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-stone-600 max-w-md leading-relaxed font-light"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="px-8 py-4 bg-stone-900 text-white font-medium tracking-wide hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 group">
              {t('hero.buyNow')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-stone-300 text-stone-900 font-medium tracking-wide hover:bg-stone-100 transition-colors flex items-center justify-center">
              {t('hero.learnMore')}
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50 md:left-10 md:translate-x-0 md:items-start">
         <span className="text-[10px] uppercase tracking-widest text-stone-400">Scroll</span>
         <div className="w-[1px] h-10 bg-stone-300"></div>
      </div>
    </section>
  );
};
