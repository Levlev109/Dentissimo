import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

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
    <section className="py-24 bg-stone-950 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(56,189,248,0.02),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_50%,rgba(56,189,248,0.015),transparent)]" />
      {/* Top transition line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sky-600/70 uppercase tracking-[0.3em] text-xs font-bold mb-4">{t('testimonials.subtitle')}</p>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">{t('testimonials.title')}</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="relative bg-white/[0.03] backdrop-blur-sm p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 border border-white/[0.06] group hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              {/* Top gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent rounded-t-2xl" />
              
              {/* Quote icon */}
              <div className="mb-4">
                <Quote size={28} className="text-sky-800 fill-sky-900/50" />
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-stone-200 mb-6 italic leading-relaxed text-[15px]">"{t(review.textKey)}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0 border border-white/[0.08]">
                  <span className="text-sky-300 font-bold text-sm">
                    {(t(review.nameKey) as string).charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{t(review.nameKey)}</p>
                  <p className="text-xs text-stone-300 uppercase tracking-wide">{t(review.locationKey)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
