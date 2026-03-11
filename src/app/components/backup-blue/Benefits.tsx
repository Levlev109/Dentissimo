import { Check, Droplets, Shield, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export const Benefits = () => {
  const { t } = useTranslation();
  
  const benefitKeys = [
    'benefits.benefit1',
    'benefits.benefit2',
    'benefits.benefit3',
    'benefits.benefit4',
    'benefits.benefit5',
    'benefits.benefit6'
  ];

  return (
    <section className="py-24 bg-stone-950 overflow-hidden transition-colors duration-500 relative">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgba(20,184,166,0.04),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-teal-500 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              {t('benefits.subtitle', 'Swiss Quality')}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6 leading-tight">
              {t('benefits.title')}<br/> <span className="text-stone-200 italic">{t('benefits.titleHighlight')}</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-transparent mb-8" />
            <p className="text-lg text-stone-300 mb-8 leading-relaxed">
              {t('benefits.description')}
            </p>
            
            <ul className="space-y-4">
              {benefitKeys.map((key, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-teal-900/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-800/40 transition-colors duration-300 shadow-sm">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span className="text-stone-300 font-medium">{t(key)}</span>
                </motion.li>
              ))}
            </ul>
            
            <motion.a
              href="#about"
              className="mt-10 inline-block px-8 py-4 bg-white text-stone-900 font-semibold hover:bg-stone-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {t('benefits.learnMore')}
            </motion.a>
          </motion.div>

          {/* Right side — decorative premium visual */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md">
              {/* Decorative floating icons */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-teal-900/20 border border-teal-700/30 flex items-center justify-center shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Droplets size={24} className="text-teal-500" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 w-14 h-14 bg-cyan-900/20 border border-cyan-700/30 flex items-center justify-center shadow-lg"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <Shield size={22} className="text-cyan-500" />
              </motion.div>
              <motion.div
                className="absolute top-1/2 -right-6 w-12 h-12 bg-amber-900/20 border border-amber-700/30 flex items-center justify-center shadow-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Sparkles size={18} className="text-amber-500" />
              </motion.div>

              {/* Main card with product image */}
              <div className="bg-gradient-to-br from-stone-800 via-stone-850 to-stone-800 p-8 border border-stone-700 shadow-xl">
                <img
                  src="/images/DENTISSIMO_box_Gold_Italy.webp"
                  alt="Dentissimo Premium"
                  className="w-full h-auto max-h-72 object-contain mx-auto drop-shadow-2xl"
                />
                <div className="mt-6 text-center">
                  <p className="text-stone-400 text-xs font-bold tracking-[0.15em] uppercase">{t('footer.swissQuality')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
