import { motion } from 'motion/react';
import { Sparkles, Shield, Droplets, Atom, FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const ingredientIcons = [Sparkles, Droplets, Shield, FlaskConical, Atom] as const;

const ingredientColors = [
  { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-300 dark:ring-amber-700', glow: 'shadow-amber-200/50 dark:shadow-amber-800/30' },
  { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-600 dark:text-sky-400', ring: 'ring-sky-300 dark:ring-sky-700', glow: 'shadow-sky-200/50 dark:shadow-sky-800/30' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-300 dark:ring-emerald-700', glow: 'shadow-emerald-200/50 dark:shadow-emerald-800/30' },
  { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-300 dark:ring-violet-700', glow: 'shadow-violet-200/50 dark:shadow-violet-800/30' },
  { bg: 'bg-stone-100 dark:bg-stone-800/50', text: 'text-stone-600 dark:text-stone-400', ring: 'ring-stone-300 dark:ring-stone-600', glow: 'shadow-stone-200/50 dark:shadow-stone-800/30' },
];

export const GoldShowcase = () => {
  const { t } = useTranslation();
  const [activeIngredient, setActiveIngredient] = useState<number | null>(null);

  const ingredients = [
    { nameKey: 'goldShowcase.gold24k', descKey: 'goldShowcase.gold24kDesc' },
    { nameKey: 'goldShowcase.hyaluronate', descKey: 'goldShowcase.hyaluronateDesc' },
    { nameKey: 'goldShowcase.monofluorophosphate', descKey: 'goldShowcase.monofluorophosphateDesc' },
    { nameKey: 'goldShowcase.leuconostoc', descKey: 'goldShowcase.leuconostocDesc' },
    { nameKey: 'goldShowcase.colloidalSilver', descKey: 'goldShowcase.colloidalSilverDesc' },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-stone-50 via-white to-stone-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 overflow-hidden transition-colors duration-500 relative">
      {/* Gold decorative glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(217,169,56,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(217,169,56,0.05),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-amber-200 dark:border-amber-800/50">
            {t('goldShowcase.badge')}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-3">
            {t('goldShowcase.title')}
          </h2>
          <p className="text-lg text-amber-700 dark:text-amber-400 font-semibold italic">
            {t('goldShowcase.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6" />
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — Product Image & Info */}
          <motion.div
            className="w-full lg:w-5/12 flex flex-col items-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative w-full max-w-sm">
              {/* Gold glow behind product */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200/40 via-yellow-100/20 to-amber-200/40 dark:from-amber-800/20 dark:via-yellow-900/10 dark:to-amber-800/20 rounded-3xl blur-2xl scale-110" />
              <div className="relative bg-gradient-to-br from-amber-50/80 via-white to-amber-50/80 dark:from-stone-800/80 dark:via-stone-850 dark:to-stone-800/80 rounded-3xl p-8 border border-amber-200/50 dark:border-amber-800/30 shadow-xl backdrop-blur-sm">
                <img
                  src="/images/DENTISSIMO_box_Gold_Italy.webp"
                  alt="Dentissimo Advanced Whitening Gold"
                  className="w-full h-auto max-h-80 object-contain mx-auto drop-shadow-2xl"
                />
              </div>

              {/* Info chips beneath product */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <span className="px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800/40">
                  {t('goldShowcase.volume')}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/40">
                  {t('goldShowcase.dailyUse')}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-sky-800/40">
                  {t('goldShowcase.fluoride')}
                </span>
              </div>
            </div>

            {/* Benefits block */}
            <motion.div
              className="mt-8 w-full max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white/60 dark:bg-stone-800/40 rounded-2xl p-5 border border-stone-200/50 dark:border-stone-700/50 backdrop-blur-sm">
                <p className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-2">{t('goldShowcase.stimulates')}</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    {t('goldShowcase.softTissue')}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    {t('goldShowcase.gumHealing')}
                  </li>
                </ul>
                <p className="mt-3 text-xs text-stone-500 dark:text-stone-500 leading-relaxed">
                  {t('goldShowcase.noHarmful')}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Ingredients */}
          <motion.div
            className="w-full lg:w-7/12"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="space-y-4">
              {ingredients.map((ing, index) => {
                const Icon = ingredientIcons[index];
                const color = ingredientColors[index];
                const isActive = activeIngredient === index;

                return (
                  <motion.div
                    key={index}
                    className={`group relative rounded-2xl p-5 cursor-pointer transition-all duration-400 border ${
                      isActive
                        ? `bg-white dark:bg-stone-800 shadow-lg ${color.glow} border-stone-200 dark:border-stone-600 ring-1 ${color.ring}`
                        : 'bg-white/50 dark:bg-stone-800/30 border-stone-200/50 dark:border-stone-700/30 hover:bg-white dark:hover:bg-stone-800 hover:shadow-md'
                    }`}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    onClick={() => setActiveIngredient(isActive ? null : index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${color.bg} flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                        <Icon size={22} className={color.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white mb-1">
                          {t(ing.nameKey)}
                        </h3>
                        <p className={`text-sm leading-relaxed transition-all duration-300 ${
                          isActive
                            ? 'text-stone-700 dark:text-stone-300 max-h-40 opacity-100'
                            : 'text-stone-500 dark:text-stone-400 max-h-0 opacity-0 md:max-h-40 md:opacity-100'
                        }`}>
                          {t(ing.descKey)}
                        </p>
                      </div>
                      {/* Mobile expand indicator */}
                      <div className={`flex-shrink-0 md:hidden w-6 h-6 rounded-full ${color.bg} flex items-center justify-center transition-transform duration-300 ${isActive ? 'rotate-45' : ''}`}>
                        <span className={`text-sm font-bold ${color.text}`}>+</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
