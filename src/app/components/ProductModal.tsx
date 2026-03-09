import { X, Plus, Minus, ShoppingCart, Leaf, Droplets, Shield, FlaskConical, Award, ChevronDown, ChevronUp, Sparkles, Atom, Heart, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Product } from '../../services/database';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { showCartToast } from './Toast';
import { productDetailsMap } from './productData';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const badgeConfig: Record<string, { icon: typeof Leaf; color: string; bg: string }> = {
  vegan: { icon: Leaf, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  fluorideFree: { icon: Shield, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  alcoholFree: { icon: Droplets, color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200' },
  swissMade: { icon: Award, color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  clinicallyTested: { icon: FlaskConical, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  containsFluoride: { icon: Shield, color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  noParabens: { icon: Leaf, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  noSLS: { icon: Droplets, color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
};

const ingredientIconPool = [Sparkles, Droplets, Shield, FlaskConical, Atom, Leaf, Heart, Gem] as const;

const ingredientColorPool = [
  { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/40' },
  { bg: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800/40' },
  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/40' },
  { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800/40' },
  { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800/40' },
  { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800/40' },
  { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800/40' },
  { bg: 'bg-stone-50 dark:bg-stone-800/40', text: 'text-stone-600 dark:text-stone-400', border: 'border-stone-200 dark:border-stone-700/40' },
];

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { addToCart } = useCart();
  const { t } = useTranslation();

  if (!product) return null;

  const details = productDetailsMap[product.id];
  const DESC_LIMIT = 180;
  const isLongDesc = (product.description?.length ?? 0) > DESC_LIMIT;
  const displayDesc = isLongDesc && !showFullDesc
    ? product.description!.slice(0, DESC_LIMIT).replace(/\s+\S*$/, '') + '…'
    : product.description;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    showCartToast(
      quantity > 1 ? `${quantity} × ${t('cart.addedToCart')}` : t('cart.addedToCart'),
      product.name,
      product.image
    );
    setQuantity(1);
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white dark:bg-stone-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200/50 dark:border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-0 max-h-[90vh] overflow-y-auto">
              {/* Image Section */}
              <div className="relative bg-gradient-to-b from-stone-50 to-white dark:from-stone-900 dark:to-stone-950 p-6 md:p-8">
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 text-xs uppercase tracking-widest font-bold z-10 rounded-full">
                    {t('products.new')}
                  </span>
                )}
                <div className="aspect-[3/4] overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-6"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col p-6 md:p-8">
                <button
                  onClick={onClose}
                  className="self-end text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors mb-2"
                >
                  <X size={24} />
                </button>

                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">
                      {product.category}
                    </p>
                    <h2 className="font-serif text-2xl md:text-3xl text-stone-900 dark:text-white mb-3">
                      {product.name}
                    </h2>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white">
                        {t('products.currency')}{product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-stone-500 dark:text-stone-400">{t('products.currencyCode')}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  {details?.badges && details.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {details.badges.map((badge) => {
                        const config = badgeConfig[badge];
                        if (!config) return null;
                        const Icon = config.icon;
                        return (
                          <span
                            key={badge}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.color}`}
                          >
                            <Icon size={12} />
                            {t(`badges.${badge}`)}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Description */}
                  {product.description && (
                    <div className="bg-stone-50 dark:bg-stone-800 rounded-xl p-4 border border-stone-100 dark:border-stone-700">
                      <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wide mb-2">
                        {t('products.description')}
                      </h3>
                      <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                        {displayDesc}
                      </p>
                      {isLongDesc && (
                        <button
                          onClick={() => setShowFullDesc(!showFullDesc)}
                          className="mt-2 text-xs text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white font-medium flex items-center gap-1 transition-colors"
                        >
                          {showFullDesc ? (
                            <><ChevronUp size={14} />{t('products.showLess')}</>
                          ) : (
                            <><ChevronDown size={14} />{t('products.showMore')}</>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Active Ingredients with descriptions */}
                  {details?.ingredients && details.ingredients.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wide mb-3">
                        {t('products.activeIngredients')}
                      </h3>
                      <div className="space-y-2">
                        {details.ingredients.map((ingredient, idx) => {
                          const Icon = ingredientIconPool[idx % ingredientIconPool.length];
                          const color = ingredientColorPool[idx % ingredientColorPool.length];
                          return (
                            <div
                              key={ingredient}
                              className={`flex items-start gap-3 p-3 rounded-xl border ${color.border} ${color.bg} transition-all duration-200`}
                            >
                              <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-white/80 dark:bg-stone-800/60 flex items-center justify-center`}>
                                <Icon size={15} className={color.text} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-stone-900 dark:text-white leading-tight">
                                  {t(`ingredients.${ingredient}`)}
                                </p>
                                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mt-0.5">
                                  {t(`ingredientDesc.${ingredient}`)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity and Add to Cart */}
                <div className="border-t border-stone-200 dark:border-stone-700 pt-4 mt-4">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wide">
                      {t('products.quantity')}:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={decrementQuantity}
                        className="w-9 h-9 flex items-center justify-center border border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-semibold text-lg text-stone-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="w-9 h-9 flex items-center justify-center border border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 rounded-xl font-semibold uppercase tracking-widest flex items-center justify-center gap-3 group relative overflow-hidden bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-lg hover:bg-amber-500 dark:hover:bg-amber-400 hover:shadow-xl transition-all duration-300"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <ShoppingCart size={18} className="relative z-10 group-hover:scale-110 transition-transform" />
                    <span className="relative z-10">{t('products.addToCart')}</span>
                  </button>

                  <p className="text-xs text-stone-500 dark:text-stone-400 text-center mt-3">
                    {t('products.freeDelivery')} {t('products.currency')}1000
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
