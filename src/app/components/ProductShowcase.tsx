import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Droplets, Atom, FlaskConical, Leaf, Heart, Gem, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { allProducts } from '../../data/allProducts';
import { productDetailsMap } from './productData';

// Cycle through icons for ingredients
const iconPool = [Sparkles, Droplets, Shield, FlaskConical, Atom, Leaf, Heart, Gem] as const;

const colorPool = [
  { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-300 dark:ring-amber-700', glow: 'shadow-amber-200/50 dark:shadow-amber-800/30' },
  { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-600 dark:text-sky-400', ring: 'ring-sky-300 dark:ring-sky-700', glow: 'shadow-sky-200/50 dark:shadow-sky-800/30' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-300 dark:ring-emerald-700', glow: 'shadow-emerald-200/50 dark:shadow-emerald-800/30' },
  { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-300 dark:ring-violet-700', glow: 'shadow-violet-200/50 dark:shadow-violet-800/30' },
  { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-300 dark:ring-rose-700', glow: 'shadow-rose-200/50 dark:shadow-rose-800/30' },
  { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400', ring: 'ring-teal-300 dark:ring-teal-700', glow: 'shadow-teal-200/50 dark:shadow-teal-800/30' },
  { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-300 dark:ring-orange-700', glow: 'shadow-orange-200/50 dark:shadow-orange-800/30' },
  { bg: 'bg-stone-100 dark:bg-stone-800/50', text: 'text-stone-600 dark:text-stone-400', ring: 'ring-stone-300 dark:ring-stone-600', glow: 'shadow-stone-200/50 dark:shadow-stone-800/30' },
];

// Only show products that have ingredients in productDetailsMap
const showcaseProducts = allProducts.filter(p => productDetailsMap[p.id]?.ingredients?.length > 0);

export const ProductShowcase = () => {
  const { t } = useTranslation();
  const [selectedProductId, setSelectedProductId] = useState(showcaseProducts[2]?.id || showcaseProducts[0]?.id); // Default to Gold
  const [activeIngredient, setActiveIngredient] = useState<number | null>(null);

  const selectedProduct = useMemo(
    () => showcaseProducts.find(p => p.id === selectedProductId) || showcaseProducts[0],
    [selectedProductId]
  );

  const details = productDetailsMap[selectedProduct.id];
  const ingredients = details?.ingredients || [];
  const keyBenefits = details?.keyBenefits || [];

  return (
    <section className="py-24 bg-gradient-to-b from-stone-50 via-white to-stone-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 overflow-hidden transition-colors duration-500 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(56,189,248,0.05),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(56,189,248,0.03),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-stone-700 dark:text-stone-400 uppercase tracking-[0.3em] text-xs font-bold mb-4">
            {t('productShowcase.subtitle')}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-4">
            {t('productShowcase.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Product Selector — horizontal scroll */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory px-1">
            {showcaseProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProductId(product.id);
                  setActiveIngredient(null);
                }}
                className={`flex-shrink-0 snap-start flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 min-w-[160px] ${
                  selectedProductId === product.id
                    ? 'bg-white dark:bg-stone-800 border-sky-300 dark:border-sky-700 shadow-lg ring-1 ring-sky-200 dark:ring-sky-800'
                    : 'bg-white/50 dark:bg-stone-800/30 border-stone-200/50 dark:border-stone-700/30 hover:bg-white dark:hover:bg-stone-800 hover:shadow-md'
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-12 object-contain flex-shrink-0"
                />
                <span className={`text-sm font-semibold text-left leading-tight ${
                  selectedProductId === product.id
                    ? 'text-stone-900 dark:text-white'
                    : 'text-stone-600 dark:text-stone-400'
                }`}>
                  {product.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProduct.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16"
          >
            {/* Left — Product Image & Benefits */}
            <div className="w-full lg:w-5/12 flex flex-col items-center lg:sticky lg:top-24">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100/30 via-white/10 to-sky-100/30 dark:from-sky-900/10 dark:via-transparent dark:to-sky-900/10 rounded-3xl blur-2xl scale-110" />
                <div className="relative bg-gradient-to-br from-stone-50 via-white to-stone-50 dark:from-stone-800/80 dark:via-stone-850 dark:to-stone-800/80 rounded-3xl p-8 border border-stone-200/50 dark:border-stone-700/50 shadow-xl">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-auto max-h-72 object-contain mx-auto drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Product name and benefits */}
              <div className="mt-6 w-full max-w-sm">
                <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white text-center mb-4">
                  {selectedProduct.name}
                </h3>

                {keyBenefits.length > 0 && (
                  <div className="bg-white/60 dark:bg-stone-800/40 rounded-2xl p-5 border border-stone-200/50 dark:border-stone-700/50 backdrop-blur-sm">
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-3">
                      {t('productShowcase.keyBenefits')}
                    </p>
                    <ul className="space-y-2">
                      {keyBenefits.map((benefitKey, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm text-stone-600 dark:text-stone-400">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                            <Check size={11} strokeWidth={3} className="text-sky-600 dark:text-sky-400" />
                          </div>
                          {t(benefitKey)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Badges */}
                {details?.badges?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {details.badges.map((badge, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-semibold border border-stone-200 dark:border-stone-700"
                      >
                        {t(`badges.${badge}`)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right — Ingredients list */}
            <div className="w-full lg:w-7/12">
              <p className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-5">
                {t('products.activeIngredients')} ({ingredients.length})
              </p>
              <div className="space-y-3">
                {ingredients.map((ingredientKey, index) => {
                  const Icon = iconPool[index % iconPool.length];
                  const color = colorPool[index % colorPool.length];
                  const isActive = activeIngredient === index;

                  return (
                    <motion.div
                      key={ingredientKey}
                      className={`group relative rounded-2xl p-4 cursor-pointer transition-all duration-300 border ${
                        isActive
                          ? `bg-white dark:bg-stone-800 shadow-lg ${color.glow} border-stone-200 dark:border-stone-600 ring-1 ${color.ring}`
                          : 'bg-white/50 dark:bg-stone-800/30 border-stone-200/50 dark:border-stone-700/30 hover:bg-white dark:hover:bg-stone-800 hover:shadow-md'
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      onClick={() => setActiveIngredient(isActive ? null : index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                          <Icon size={18} className={color.text} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                            {t(`ingredients.${ingredientKey}`)}
                          </h4>
                          <p className={`text-sm leading-relaxed transition-all duration-300 overflow-hidden ${
                            isActive
                              ? 'text-stone-700 dark:text-stone-300 max-h-40 opacity-100 mt-1'
                              : 'text-stone-500 dark:text-stone-400 max-h-0 opacity-0 md:max-h-40 md:opacity-100 md:mt-1'
                          }`}>
                            {t(`ingredientDesc.${ingredientKey}`)}
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
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
