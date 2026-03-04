import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Testimonials = () => {
  const { t } = useTranslation();
  
  const reviews = [
    {
      id: 1,
      nameKey: 'testimonials.review1Name',
      locationKey: 'testimonials.review1Location',
      textKey: 'testimonials.review1Text',
      rating: 5
    },
    {
      id: 2,
      nameKey: 'testimonials.review2Name',
      locationKey: 'testimonials.review2Location',
      textKey: 'testimonials.review2Text',
      rating: 5
    },
    {
      id: 3,
      nameKey: 'testimonials.review3Name',
      locationKey: 'testimonials.review3Location',
      textKey: 'testimonials.review3Text',
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-[#F9F8F6] dark:bg-stone-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-white mb-4">{t('testimonials.title')}</h2>
          <p className="text-stone-500 dark:text-stone-400">{t('testimonials.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-stone-800 p-8 shadow-sm hover:shadow-md transition-shadow border border-stone-100 dark:border-stone-700">
              <div className="flex gap-1 text-[#D4AF37] mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-stone-700 dark:text-stone-300 mb-6 italic leading-relaxed">"{t(review.textKey)}"</p>
              <div>
                <p className="font-bold text-stone-900 dark:text-white text-sm">{t(review.nameKey)}</p>
                <p className="text-xs text-stone-400 uppercase tracking-wide">{t(review.locationKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
