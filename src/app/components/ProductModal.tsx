import { X, Plus, Minus, ShoppingCart, Sparkles, Droplets, Shield, FlaskConical, Atom, Leaf, Heart, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
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

type ModalTab = 'product' | 'benefits' | 'ingredients' | 'extra';

const ingredientIcons = [Sparkles, Droplets, Shield, FlaskConical, Atom, Leaf, Heart, Gem] as const;

const ingredientAccents = [
  'border-amber-500/40', 'border-sky-500/40', 'border-emerald-500/40',
  'border-violet-500/40', 'border-rose-500/40', 'border-teal-500/40',
  'border-orange-500/40', 'border-stone-500/40',
];

const ingredientIconColors = [
  'text-amber-500', 'text-sky-500', 'text-emerald-500',
  'text-violet-500', 'text-rose-500', 'text-teal-500',
  'text-orange-500', 'text-stone-500',
];

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<ModalTab>('product');
  const { addToCart } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      setActiveTab('product');
      setQuantity(1);
    }
  }, [isOpen]);

  if (!product) return null;

  const details = productDetailsMap[product.id];

  const tabs: { key: ModalTab; label: string }[] = [
    { key: 'product', label: t('goldShowcase.tabProduct') },
    { key: 'benefits', label: t('goldShowcase.tabBenefits') },
    { key: 'ingredients', label: t('goldShowcase.tabIngredients') },
    { key: 'extra', label: t('goldShowcase.tabExtra') },
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    showCartToast(
      quantity > 1 ? `${quantity} × ${t('cart.addedToCart')}` : t('cart.addedToCart'),
      product.name, product.image
    );
    setQuantity(1);
    onClose();
  };

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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-stone-50 dark:bg-stone-950 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tab bar */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-stone-200/60 dark:border-stone-800/60">
              <div className="flex bg-stone-200/60 dark:bg-stone-800/80 rounded-full p-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 max-h-[calc(90vh-52px)] overflow-y-auto">
              {/* Left — Image + Buy */}
              <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-white dark:bg-stone-900 relative">
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold rounded-full">
                    {t('products.new')}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-w-[240px] h-auto max-h-[340px] object-contain drop-shadow-lg"
                />
                {/* Buy */}
                <div className="w-full max-w-xs mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-stone-900 dark:text-white">
                      {t('products.currency')}{product.price.toFixed(0)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-7 h-7 flex items-center justify-center rounded-md border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold text-stone-900 dark:text-white">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 flex items-center justify-center rounded-md border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-900 shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                  >
                    <ShoppingCart size={16} />
                    {t('products.addToCart')}
                  </button>
                </div>
              </div>

              {/* Right — Content */}
              <div className="p-6 md:p-8 overflow-y-auto bg-stone-50 dark:bg-stone-950">
                {/* ── Product tab ── */}
                {activeTab === 'product' && (
                  <motion.div key="product" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div>
                      <p className="text-[10px] text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em] font-semibold mb-1">{product.category}</p>
                      <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">{product.name}</h2>
                    </div>

                    {product.description && (
                      <div className="inline-block px-4 py-2 bg-amber-100/80 dark:bg-amber-900/20 rounded-lg border border-amber-200/60 dark:border-amber-800/30">
                        <p className="text-amber-800 dark:text-amber-300 font-medium text-sm">{product.description}</p>
                      </div>
                    )}

                    {/* Badges as small pills */}
                    {details?.badges && details.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {details.badges.map((badge) => (
                          <span key={badge} className="px-3 py-1 text-[10px] font-semibold rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300/50 dark:border-stone-700/50">
                            {t(`badges.${badge}`)}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Benefits tab ── */}
                {activeTab === 'benefits' && (
                  <motion.div key="benefits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
                      {product.name}
                    </h2>

                    {product.description && (
                      <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{product.description}</p>
                    )}

                    {/* Badges as benefit items */}
                    {details?.badges && details.badges.length > 0 && (
                      <div className="space-y-2">
                        {details.badges.map((badge) => (
                          <div key={badge} className="flex items-center gap-3 p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200/60 dark:border-stone-800/60">
                            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                            <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{t(`badges.${badge}`)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Ingredients tab ── */}
                {activeTab === 'ingredients' && (
                  <motion.div key="ingredients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">{t('products.activeIngredients')}</h2>
                    {details?.ingredients && details.ingredients.length > 0 ? (
                      <div className="space-y-3">
                        {details.ingredients.map((ingredient, idx) => {
                          const Icon = ingredientIcons[idx % ingredientIcons.length];
                          const accent = ingredientAccents[idx % ingredientAccents.length];
                          const iconColor = ingredientIconColors[idx % ingredientIconColors.length];
                          return (
                            <div key={ingredient} className={`p-4 rounded-xl bg-white dark:bg-stone-900 border-l-4 ${accent} border border-stone-200/40 dark:border-stone-800/40`}>
                              <div className="flex items-start gap-3">
                                <Icon size={16} className={`${iconColor} mt-0.5 flex-shrink-0`} />
                                <div>
                                  <p className="text-sm font-bold text-stone-900 dark:text-white">{t(`ingredients.${ingredient}`)}</p>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mt-1">{t(`ingredientDesc.${ingredient}`)}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-stone-500">{product.description}</p>
                    )}
                  </motion.div>
                )}

                {/* ── Extra tab ── */}
                {activeTab === 'extra' && (
                  <motion.div key="extra" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">{t('goldShowcase.dailyUseTitle')}</h2>

                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{t('goldShowcase.noHarmful')}</p>

                    <div className="p-4 bg-amber-50/80 dark:bg-amber-900/10 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                      <h3 className="font-bold text-stone-900 dark:text-white text-sm mb-1">{t('goldShowcase.howToUseTitle')}</h3>
                      <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{t('goldShowcase.howToUse')}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-stone-900 dark:text-white text-sm mb-1">{t('goldShowcase.storageTitle')}</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-500">{t('goldShowcase.storage')}</p>
                    </div>

                    <p className="text-xs text-stone-400 text-center mt-6">
                      {t('products.freeDelivery')} {t('products.currency')}1000
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
