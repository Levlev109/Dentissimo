import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CategorySection = () => {
  const { t } = useTranslation();

  const categories = [
    {
      id: 1,
      titleKey: 'categories.limitedEdition',
      descriptionKey: 'categories.limitedEditionDesc',
      image: '/images/DENTISSIMO_box_Gold_Italy.webp',
      link: '#products',
      gradient: 'from-stone-950 via-stone-900/80 to-stone-950',
      gradientLight: 'from-stone-100 via-stone-50 to-stone-200',
      accent: 'bg-gradient-to-r from-stone-400 to-stone-500',
    },
    {
      id: 2,
      titleKey: 'categories.professional',
      descriptionKey: 'categories.professionalDesc',
      image: '/images/DENTISSIMO_box_Complete_care (1).webp',
      link: '#products',
      gradient: 'from-teal-950 via-blue-900/80 to-stone-950',
      gradientLight: 'from-teal-100 via-blue-50 to-teal-200',
      accent: 'bg-gradient-to-r from-teal-400 to-blue-500',
    },
    {
      id: 3,
      titleKey: 'categories.natural',
      descriptionKey: 'categories.naturalDesc',
      image: '/images/DENTISSIMO_box_Vegan.webp',
      link: '#products',
      gradient: 'from-emerald-950 via-green-900/80 to-stone-950',
      gradientLight: 'from-emerald-100 via-green-50 to-emerald-200',
      accent: 'bg-gradient-to-r from-emerald-400 to-green-500',
    },
    {
      id: 4,
      titleKey: 'categories.kids',
      descriptionKey: 'categories.kidsDesc',
      image: '/images/DENTISSIMO_box_Kids.webp',
      link: '#products',
      gradient: 'from-rose-950 via-pink-900/80 to-stone-950',
      gradientLight: 'from-rose-100 via-pink-50 to-rose-200',
      accent: 'bg-gradient-to-r from-rose-400 to-pink-500',
    }
  ];

  return (
    <section className="py-24 bg-stone-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-stone-400 uppercase tracking-[0.3em] text-xs font-bold mb-4">{t('categorySection.subtitle')}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">{t('categorySection.title')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent mx-auto mt-6" />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <motion.a
              href={cat.link}
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`group block relative overflow-hidden aspect-[3/4] bg-gradient-to-b ${cat.gradient} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-stone-800/50`}
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${cat.accent} opacity-80 group-hover:h-1.5 transition-all duration-300`} />
              <img
                src={cat.image}
                alt={t(cat.titleKey)}
                className="w-full h-full object-contain p-8 transition-all duration-700 group-hover:scale-110 group-hover:rotate-2 filter group-hover:drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent group-hover:from-stone-900/85 transition-all duration-500"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-all duration-500">
                <h3 className="font-serif text-xl md:text-2xl mb-2 drop-shadow-lg font-bold group-hover:text-stone-200 transition-colors">{t(cat.titleKey)}</h3>
                <p className="text-sm text-white/95 mb-3 drop-shadow-md leading-relaxed font-medium">{t(cat.descriptionKey)}</p>
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-r from-white/20 to-transparent backdrop-blur-sm px-3 py-2 rounded-lg w-fit border border-white/30">
                  <span>{t('categorySection.learnMore')}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
