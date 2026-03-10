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
    <section id="about" className="bg-stone-950 text-white overflow-visible relative">
      {/* Part 1: Glacier Water Story */}
      <div className="py-16 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <motion.div
              className="w-full md:w-1/2 order-2 md:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="block text-teal-500 text-xs font-bold tracking-[0.2em] uppercase mb-4">{t('about.tagline')}</span>
              <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight text-white">
                {t('about.glacierTitle')}
              </h2>
              <p className="text-stone-300 mb-6 leading-relaxed font-normal">
                {t('about.glacierText1')}
              </p>
              <p className="text-stone-300 mb-6 leading-relaxed font-normal">
                {t('about.glacierText2')}
              </p>
              <p className="text-stone-300 mb-8 leading-relaxed font-normal">
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
              <div className="bg-white/[0.03] backdrop-blur-sm p-8 border border-white/[0.06]">
                <h3 className="font-serif text-2xl text-white mb-6">{t('about.storyTitle')}</h3>
                <p className="text-stone-200 mb-4 leading-relaxed font-normal">
                  {t('about.storyText1')}
                </p>
                <p className="text-stone-200 mb-6 leading-relaxed font-normal">
                  {t('about.storyText2')}
                </p>
                <blockquote className="border-l-2 border-teal-400/40 pl-4 italic text-stone-300 leading-relaxed">
                  {t('about.doctorQuote')}
                </blockquote>
                <p className="text-stone-400 text-sm mt-3 font-medium">
                  {t('about.doctorAttribution')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Part 2: Regera-PRO Complex */}
      <div className="py-14 md:py-24 relative">
        {/* Subtle section separator */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-400/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/30 via-stone-900/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-8 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <span className="text-teal-500 text-xs font-bold tracking-[0.2em] uppercase mb-3 block">{t('about.complexLabel')}</span>
              <h3 className="font-serif text-3xl md:text-4xl text-white">{t('about.complexTitle')}</h3>
              <p className="text-stone-400 max-w-xl mt-4 leading-relaxed">
                {t('about.complexDesc')}
              </p>
            </div>
            <div className="w-24 h-px bg-gradient-to-r from-white/15 to-transparent hidden md:block" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {regera.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="relative p-8 border-l border-white/[0.06] hover:border-teal-500/20 transition-colors duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  {/* Editorial number */}
                  <span className="absolute -top-2 -left-3 font-serif text-6xl text-white/[0.04] font-bold leading-none select-none">
                    0{index + 1}
                  </span>
                  <div className="w-12 h-12 rounded-full bg-teal-900/20 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-teal-500" />
                  </div>
                  <h4 className="font-serif text-xl mb-3 text-white">
                    <span className="text-teal-500 font-bold">Re</span>{(t(item.titleKey) as string).substring(2)}
                  </h4>
                  <p className="text-stone-400 text-sm leading-relaxed">{t(item.descKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Part 3: Manufacturing & Bad Ragaz */}
      <div className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-teal-500 text-xs font-bold tracking-[0.2em] uppercase mb-3 block">{t('about.badRagazLabel')}</span>
              <h3 className="font-serif text-2xl md:text-3xl mb-6 text-white">{t('about.badRagazTitle')}</h3>
              <p className="text-stone-200 mb-5 leading-relaxed font-normal">
                {t('about.badRagazText1')}
              </p>
              <p className="text-stone-200 mb-5 leading-relaxed font-normal">
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
              <span className="text-teal-500 text-xs font-bold tracking-[0.2em] uppercase mb-3 block">{t('about.manufactureLabel')}</span>
              <h3 className="font-serif text-2xl md:text-3xl mb-6 text-white">{t('about.manufactureTitle')}</h3>
              <p className="text-stone-200 mb-5 leading-relaxed font-normal">
                {t('about.manufactureText1')}
              </p>
              <p className="text-stone-200 leading-relaxed font-normal">
                {t('about.manufactureText2')}
              </p>
            </motion.div>
          </div>

          {/* Certifications row */}
          <motion.div
            className="mt-16 pt-12 border-t border-white/[0.05]"
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
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/[0.08] flex items-center justify-center mx-auto mb-2 group-hover:border-teal-400/30 group-hover:bg-teal-900/20 transition-all duration-300">
                    <cert.icon size={22} className="text-stone-500 group-hover:text-teal-500 transition-colors" />
                  </div>
                  <span className="text-xs sm:text-sm text-stone-300 font-medium tracking-wide group-hover:text-stone-200 transition-colors leading-tight block">{t(cert.titleKey)}</span>
                </div>
              ))}
            </div>

            {/* Expanded cert description вЂ” shown below the row */}
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
                    <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] p-5 sm:p-6 max-w-lg mx-auto relative mb-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveCert(null); }}
                        className="absolute top-3 right-3 text-stone-500 hover:text-stone-200 transition-colors p-1"
                      >
                        <X size={16} />
                      </button>
                      <h5 className="text-white font-bold text-sm mb-2">{t(cert.titleKey)}</h5>
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
