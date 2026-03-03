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
      image: '/images/DENTISSIMO_box_Gold_Italy.png',
      link: '#products'
    },
    {
      id: 2,
      titleKey: 'categories.professional',
      descriptionKey: 'categories.professionalDesc',
      image: '/images/DENTISSIMO_box_Complete_care (1).png',
      link: '#products'
    },
    {
      id: 3,
      titleKey: 'categories.natural',
      descriptionKey: 'categories.naturalDesc',
      image: '/images/DENTISSIMO_box_Vegan.png',
      link: '#products'
    },
    {
      id: 4,
      titleKey: 'categories.kids',
      descriptionKey: 'categories.kidsDesc',
      image: '/images/DENTISSIMO_box_Kids.png',
      link: '#products'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">{t('categorySection.title')}</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">{t('categorySection.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <motion.a
              href={cat.link}
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group block relative overflow-hidden aspect-[3/4] bg-gradient-to-b from-stone-100 to-stone-200"
            >
              <img
                src={cat.image}
                alt={t(cat.titleKey)}
                className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <h3 className="font-serif text-xl mb-1">{t(cat.titleKey)}</h3>
                <p className="text-sm text-white/80 mb-2">{t(cat.descriptionKey)}</p>
                <div className="flex items-center gap-2 text-xs font-medium tracking-wide opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span>{t('categorySection.learnMore')}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
