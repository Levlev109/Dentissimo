import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { FlaskConical, Leaf, Shield, X } from 'lucide-react';

export const AboutSection = () => {
  const { t } = useTranslation();
  const [activeCert, setActiveCert] = useState<string | null>(null);
  
  const regera = [
    { icon: FlaskConical, titleKey: 'about.regeraRegen', descKey: 'about.regeraRegenDesc' },
    { icon: Shield, titleKey: 'about.regeraRestor', descKey: 'about.regeraRestorDesc' },
    { icon: Leaf, titleKey: 'about.regeraRemin', descKey: 'about.regeraReminDesc' },
  ];

  const certifications = [
    { id: 'gmp', titleKey: 'about.certGmpTitle', descKey: 'about.certGmpDesc', icon: Shield },
    { id: 'iso', titleKey: 'about.certIsoTitle', descKey: 'about.certIsoDesc', icon: Shield },
    { id: 'halal', titleKey: 'about.certHalalTitle', descKey: 'about.certHalalDesc', icon: Shield },
    { id: 'vegan', titleKey: 'about.certVeganTitle', descKey: 'about.certVeganDesc', icon: Shield },
    { id: 'cpnp', titleKey: 'about.certCpnpTitle', descKey: 'about.certCpnpDesc', icon: Shield },
  ];

  return (
    <section id="about" className="bg-stone-900 text-white overflow-visible">
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
              
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-8 w-8 opacity-80 hover:opacity-100 transition-all duration-500" aria-label={t('about.swissFlag')}>
                <rect width="32" height="32" rx="2" fill="#DA291C"/>
                <rect x="13" y="6" width="6" height="20" rx="1" fill="#fff"/>
                <rect x="6" y="13" width="20" height="6" rx="1" fill="#fff"/>
              </svg>
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
                  <h4 className="font-serif text-xl mb-3">
                    <span className="text-[#D4AF37] font-bold">Re</span>{(t(item.titleKey) as string).substring(2)}
                  </h4>
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
            className="mt-16 pt-12 border-t border-stone-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6 md:gap-12 mb-6">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="text-center cursor-pointer group"
                  onClick={() => setActiveCert(activeCert === cert.id ? null : cert.id)}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-stone-700 flex items-center justify-center mx-auto mb-2 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all duration-300">
                    <cert.icon size={22} className="text-stone-500 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-wide group-hover:text-stone-300 transition-colors leading-tight block">{t(cert.titleKey)}</span>
                </div>
              ))}
            </div>

            {/* Expanded cert description — shown below the row */}
            <AnimatePresence mode="wait">
              {activeCert && (() => {
                const cert = certifications.find(c => c.id === activeCert);
                if (!cert) return null;
                return (
                  <motion.div
                    key={activeCert}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-5 sm:p-6 max-w-lg mx-auto relative mb-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveCert(null); }}
                        className="absolute top-3 right-3 text-stone-500 hover:text-white transition-colors p-1"
                      >
                        <X size={16} />
                      </button>
                      <h5 className="text-[#D4AF37] font-bold text-sm mb-2">{t(cert.titleKey)}</h5>
                      <p className="text-stone-300 text-sm leading-relaxed">{t(cert.descKey)}</p>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
