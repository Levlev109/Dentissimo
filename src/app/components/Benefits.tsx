import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    <section className="py-24 bg-white dark:bg-stone-950 overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="font-serif text-3xl md:text-5xl text-stone-900 dark:text-white mb-6 leading-tight">
              {t('benefits.title')}<br/> <span className="text-[#D4AF37] italic">{t('benefits.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 leading-relaxed">
              {t('benefits.description')}
            </p>
            
            <ul className="space-y-4">
              {benefitKeys.map((key, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-stone-700 dark:text-stone-300 font-medium">{t(key)}</span>
                </li>
              ))}
            </ul>
            
            <a href="#about" className="mt-10 inline-block px-8 py-4 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
              {t('benefits.learnMore')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
