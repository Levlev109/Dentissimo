import { Star } from 'lucide-react';
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
    <section className="py-16 md:py-28 bg-stone-950 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(6, 182, 212,0.02),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_50%,rgba(6, 182, 212,0.015),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="mb-10 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-cyan-500/70 uppercase tracking-[0.3em] text-xs font-bold mb-4">{t('testimonials.subtitle')}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white">{t('testimonials.title')}</h2>
          </div>
          <div className="w-32 h-px bg-gradient-to-r from-white/20 to-transparent hidden md:block" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className={`relative p-5 md:p-10 group transition-all duration-500 border-l border-white/[0.04] md:border-l-0 ${
                index === 1 ? 'md:-translate-y-6' : ''
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: index === 1 ? -24 : 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Editorial number */}
              <span className="absolute -top-4 -left-2 md:-left-4 font-serif text-7xl md:text-8xl text-white/[0.04] font-bold leading-none select-none pointer-events-none">
                0{index + 1}
              </span>

              {/* Vertical accent line */}
              <div className="absolute top-0 left-0 w-px h-12 bg-gradient-to-b from-cyan-400/40 to-transparent" />

              <div className="relative">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-stone-200 mb-5 md:mb-8 italic leading-relaxed text-[15px] md:text-base">
                  "{t(review.textKey)}"
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0 border border-white/[0.08]">
                    <span className="text-cyan-300 font-bold text-sm">
                      {(t(review.nameKey) as string).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t(review.nameKey)}</p>
                    <p className="text-[11px] text-stone-400 uppercase tracking-wider">{t(review.locationKey)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
