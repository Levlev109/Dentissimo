import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { FlaskConical, Leaf, Shield } from 'lucide-react';

export const AboutSection = () => {
  const { t } = useTranslation();
  
  const regera = [
    { key: 'RE', icon: FlaskConical, titleKey: 'about.regeraRegen', descKey: 'about.regeraRegenDesc' },
    { key: 'RE', icon: Shield, titleKey: 'about.regeraRestor', descKey: 'about.regeraRestorDesc' },
    { key: 'RE', icon: Leaf, titleKey: 'about.regeraRemin', descKey: 'about.regeraReminDesc' },
  ];

  return (
    <section id="about" className="bg-stone-900 text-white overflow-hidden">
      {/* Part 1: Glacier Water Story */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div
              className="w-full md:w-1/2 order-2 md:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="block text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">{t('about.tagline')}</span>
              <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
                {t('about.glacierTitle')}
              </h2>
              <p className="text-stone-300 mb-6 leading-relaxed font-light">
                {t('about.glacierText1')}
              </p>
              <p className="text-stone-300 mb-6 leading-relaxed font-light">
                {t('about.glacierText2')}
              </p>
              <p className="text-stone-300 mb-8 leading-relaxed font-light">
                {t('about.glacierText3')}
              </p>
              
              <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Switzerland.svg/512px-Flag_of_Switzerland.svg.png" 
                 alt={t('about.swissFlag')} 
                 className="h-8 w-auto opacity-80 grayscale hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>
            <motion.div
              className="w-full md:w-1/2 order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-stone-800/50 rounded-2xl p-8 border border-stone-700/50">
                <h3 className="font-serif text-2xl text-[#D4AF37] mb-6">{t('about.storyTitle')}</h3>
                <p className="text-stone-300 mb-4 leading-relaxed font-light text-sm">
                  {t('about.storyText1')}
                </p>
                <p className="text-stone-300 mb-6 leading-relaxed font-light text-sm">
                  {t('about.storyText2')}
                </p>
                <blockquote className="border-l-2 border-[#D4AF37] pl-4 italic text-stone-400 text-sm leading-relaxed">
                  {t('about.doctorQuote')}
                </blockquote>
                <p className="text-[#D4AF37] text-xs mt-3 font-medium">
                  — Dr. Michael Meier, Perfect Smile Swiss Dental Care
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Part 2: Regera-PRO Complex */}
      <div className="py-20 bg-stone-800/30 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">{t('about.complexLabel')}</span>
            <h3 className="font-serif text-3xl md:text-4xl mb-4">{t('about.complexTitle')}</h3>
            <p className="text-stone-400 max-w-2xl mx-auto leading-relaxed">
              {t('about.complexDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {regera.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-stone-800/50 rounded-xl p-8 border border-stone-700/30 text-center hover:border-[#D4AF37]/30 transition-colors duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-5">
                    <Icon size={24} className="text-[#D4AF37]" />
                  </div>
                  <h4 className="font-serif text-xl mb-3">{t(item.titleKey)}</h4>
                  <p className="text-stone-400 text-sm leading-relaxed">{t(item.descKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Part 3: Manufacturing & Bad Ragaz */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">{t('about.badRagazLabel')}</span>
              <h3 className="font-serif text-2xl md:text-3xl mb-6">{t('about.badRagazTitle')}</h3>
              <p className="text-stone-300 mb-5 leading-relaxed font-light text-sm">
                {t('about.badRagazText1')}
              </p>
              <p className="text-stone-300 mb-5 leading-relaxed font-light text-sm">
                {t('about.badRagazText2')}
              </p>
            </motion.div>
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">{t('about.manufactureLabel')}</span>
              <h3 className="font-serif text-2xl md:text-3xl mb-6">{t('about.manufactureTitle')}</h3>
              <p className="text-stone-300 mb-5 leading-relaxed font-light text-sm">
                {t('about.manufactureText1')}
              </p>
              <p className="text-stone-300 leading-relaxed font-light text-sm">
                {t('about.manufactureText2')}
              </p>
            </motion.div>
          </div>

          {/* Certifications row */}
          <motion.div
            className="mt-16 pt-12 border-t border-stone-800 flex flex-wrap justify-center gap-8 md:gap-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {['GMP', 'ISO 9001', 'Halal', 'Vegan Society', 'CPNP (EU)'].map((cert) => (
              <div key={cert} className="text-center">
                <div className="w-16 h-16 rounded-full border border-stone-700 flex items-center justify-center mx-auto mb-2 hover:border-[#D4AF37] transition-colors">
                  <Shield size={24} className="text-stone-500" />
                </div>
                <span className="text-xs text-stone-500 font-medium tracking-wide">{cert}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
