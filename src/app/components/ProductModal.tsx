import { X, Plus, Minus, ShoppingCart, Leaf, Droplets, Shield, FlaskConical, Award, ChevronDown, ChevronUp } from 'lucide-react';
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
            className="bg-white dark:bg-stone-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
              {/* Image Section */}
              <div className="relative">
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-stone-900 text-white px-3 py-1 text-xs uppercase tracking-widest font-bold z-10 rounded-full">
                    {t('products.new')}
                  </span>
                )}
                <div className="aspect-[3/4] bg-gradient-to-b from-white via-stone-50/10 to-white dark:from-stone-950/20 dark:via-stone-900 dark:to-stone-950 rounded-xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-6"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col">
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

                  {/* Active Ingredients */}
                  {details?.ingredients && details.ingredients.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wide mb-2">
                        {t('products.activeIngredients')}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {details.ingredients.map((ingredient) => (
                          <span
                            key={ingredient}
                            className="px-2.5 py-1 bg-sky-50 text-stone-700 text-xs rounded-full border border-sky-200 font-medium"
                          >
                            {t(`ingredients.${ingredient}`)}
                          </span>
                        ))}
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
                    className="w-full bg-stone-900 text-white py-3.5 rounded-lg font-semibold uppercase tracking-wide hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 group"
                  >
                    <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                    {t('products.addToCart')}
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
