import { X, Plus, Minus, ShoppingCart, Leaf, Droplets, Shield, FlaskConical, Award, Sparkles, Atom, Heart, Gem } from 'lucide-react';
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

const badgeConfig: Record<string, { icon: typeof Leaf; color: string; bg: string }> = {
  vegan: { icon: Leaf, color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' },
  fluorideFree: { icon: Shield, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' },
  alcoholFree: { icon: Droplets, color: 'text-cyan-700 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800' },
  swissMade: { icon: Award, color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800' },
  clinicallyTested: { icon: FlaskConical, color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800' },
  containsFluoride: { icon: Shield, color: 'text-indigo-700 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800' },
  noParabens: { icon: Leaf, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800' },
  noSLS: { icon: Droplets, color: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800' },
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
            className="bg-white dark:bg-stone-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200/50 dark:border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tab navigation */}
            <div className="flex items-center justify-between px-6 pt-5 pb-0">
              <div className="flex bg-stone-100 dark:bg-stone-800 rounded-full p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                      activeTab === tab.key
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors p-1"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-0 max-h-[calc(90vh-56px)] overflow-y-auto">
              {/* Left — Product Image */}
              <div className="relative bg-gradient-to-b from-stone-50 to-white dark:from-stone-900 dark:to-stone-950 p-6 md:p-8 flex flex-col items-center justify-center">
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 text-xs uppercase tracking-widest font-bold z-10 rounded-full">
                    {t('products.new')}
                  </span>
                )}
                <div className="relative w-full max-w-xs mx-auto">
                  <div className="absolute -inset-8 bg-gradient-to-br from-amber-200/20 via-transparent to-amber-200/10 dark:from-amber-800/10 dark:to-amber-800/5 rounded-full blur-3xl" />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative w-full h-auto max-h-[400px] object-contain mx-auto drop-shadow-lg"
                  />
                </div>

                {/* Buy section under image */}
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-stone-900 dark:text-white">
                      {t('products.currency')}{product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={decrementQuantity} className="w-8 h-8 flex items-center justify-center border border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold text-stone-900 dark:text-white">{quantity}</span>
                      <button onClick={incrementQuantity} className="w-8 h-8 flex items-center justify-center border border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-900 shadow-lg hover:shadow-xl transition-all duration-300 text-sm tracking-wide"
                  >
                    <ShoppingCart size={18} />
                    {t('products.addToCart')}
                  </motion.button>
                </div>
              </div>

              {/* Right — Tab Content */}
              <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
                {/* Product tab */}
                {activeTab === 'product' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-5">
                    <div>
                      <p className="text-xs text-amber-600 dark:text-amber-500 uppercase tracking-[0.15em] font-semibold mb-1">{product.category}</p>
                      <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-white leading-tight">{product.name}</h2>
                    </div>

                    {product.description && (
                      <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">{product.description}</p>
                    )}

                    {/* Badges */}
                    {details?.badges && details.badges.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {details.badges.map((badge) => {
                          const config = badgeConfig[badge];
                          if (!config) return null;
                          const Icon = config.icon;
                          return (
                            <span key={badge} className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.color}`}>
                              <Icon size={12} />
                              {t(`badges.${badge}`)}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Key benefits */}
                    {details?.keyBenefits && details.keyBenefits.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wide">{t('goldShowcase.tabBenefits')}</h3>
                        <ul className="space-y-2">
                          {details.keyBenefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-3 text-stone-700 dark:text-stone-300">
                              <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                              <span className="text-sm">{t(b)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Benefits tab */}
                {activeTab === 'benefits' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-5">
                    <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">{product.name}</h2>

                    {details?.badges && details.badges.length > 0 && (
                      <div className="space-y-3">
                        {details.badges.map((badge) => {
                          const config = badgeConfig[badge];
                          if (!config) return null;
                          const Icon = config.icon;
                          return (
                            <div key={badge} className={`flex items-center gap-3 p-4 rounded-xl border ${config.bg}`}>
                              <div className="w-10 h-10 rounded-lg bg-white/80 dark:bg-stone-800/60 flex items-center justify-center flex-shrink-0">
                                <Icon size={18} className={config.color} />
                              </div>
                              <p className={`font-semibold text-sm ${config.color}`}>{t(`badges.${badge}`)}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {details?.keyBenefits && details.keyBenefits.length > 0 && (
                      <div className="space-y-2 mt-4">
                        {details.keyBenefits.map((b, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl">
                            <span className="mt-0.5 w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                            <span className="text-sm text-stone-700 dark:text-stone-300">{t(b)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-stone-500 text-xs mt-4">{t('goldShowcase.volume')} — {t('goldShowcase.innovativeFormula')}</p>
                  </motion.div>
                )}

                {/* Ingredients tab */}
                {activeTab === 'ingredients' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-4">
                    <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mb-4">{t('products.activeIngredients')}</h2>
                    {details?.ingredients && details.ingredients.length > 0 ? (
                      <div className="space-y-3">
                        {details.ingredients.map((ingredient, idx) => {
                          const Icon = ingredientIconPool[idx % ingredientIconPool.length];
                          const color = ingredientColorPool[idx % ingredientColorPool.length];
                          return (
                            <div key={ingredient} className={`flex items-start gap-3 p-3 rounded-xl border ${color.border} ${color.bg}`}>
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/80 dark:bg-stone-800/60 flex items-center justify-center">
                                <Icon size={15} className={color.text} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-stone-900 dark:text-white leading-tight">{t(`ingredients.${ingredient}`)}</p>
                                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mt-0.5">{t(`ingredientDesc.${ingredient}`)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-stone-500 dark:text-stone-400">{t('products.description')}</p>
                    )}
                  </motion.div>
                )}

                {/* Extra tab */}
                {activeTab === 'extra' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-5">
                    <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">{t('goldShowcase.dailyUseTitle')}</h2>

                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{t('goldShowcase.noHarmful')}</p>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/15 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                      <h3 className="font-bold text-stone-900 dark:text-white text-sm mb-1">{t('goldShowcase.howToUseTitle')}</h3>
                      <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{t('goldShowcase.howToUse')}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-stone-900 dark:text-white text-sm mb-1">{t('goldShowcase.storageTitle')}</h3>
                      <p className="text-xs text-stone-500">{t('goldShowcase.storage')}</p>
                    </div>

                    <p className="text-xs text-stone-500 dark:text-stone-400 text-center mt-4">
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
