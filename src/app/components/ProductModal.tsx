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

const productAccents: Record<string, string> = {
  'whitening-gold': '#d4a934', 'whitening-black': '#9ca3af', 'diamond': '#60a5fa',
  'gentle-care': '#34d399', 'complete-care': '#38bdf8', 'pro-care': '#2dd4bf',
  'vegan-b12': '#4ade80', 'pregnant': '#f472b6', 'kids-caramel': '#fb923c',
  'junior-apple': '#a3e635', 'brush-gold': '#d4a934', 'brush-silver': '#94a3b8',
  'brush-medium': '#60a5fa', 'brush-hard': '#64748b', 'brush-sensitive': '#38bdf8',
  'brush-parodontal': '#4ade80', 'brush-kids': '#f472b6', 'brush-junior': '#4ade80',
  'mouthwash-gold': '#d4a934', 'mouthwash-fresh': '#2dd4bf', 'mouthwash-gum': '#34d399',
};

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
  const accent = productAccents[product.id] || '#d4a934';

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="bg-stone-950 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/[0.08] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent glow at top */}
            <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{
              background: `radial-gradient(ellipse 60% 100% at 50% 0%, ${accent}15, transparent)`,
            }} />

            {/* Tab bar */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.06] relative z-10">
              <div className="flex bg-white/[0.04] rounded-xl p-1 backdrop-blur-sm border border-white/[0.06]">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'text-stone-900 shadow-sm'
                        : 'text-stone-500 hover:text-stone-300'
                    }`}
                    style={activeTab === tab.key ? { backgroundColor: accent } : undefined}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 max-h-[calc(90vh-52px)] overflow-y-auto">
              {/* Left — Image + Buy */}
              <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-stone-900/50 relative">
                {/* Subtle glow behind image */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 rounded-full blur-[60px] opacity-30" style={{ background: accent }} />
                </div>

                {product.isNew && (
                  <span className="absolute top-3 left-3 px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold rounded-lg text-stone-900"
                    style={{ backgroundColor: accent }}>
                    {t('products.new')}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="relative w-full max-w-[220px] h-auto max-h-[320px] object-contain"
                  style={{ filter: `drop-shadow(0 10px 40px ${accent}30)` }}
                />
                {/* Buy */}
                <div className="w-full max-w-xs mt-6 space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      {t('products.currency')}{product.price.toFixed(0)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-stone-300 hover:bg-white/[0.06] transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-stone-300 hover:bg-white/[0.06] transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-stone-900 shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                      boxShadow: `0 8px 24px ${accent}30`,
                    }}
                  >
                    <ShoppingCart size={16} />
                    {t('products.addToCart')}
                  </button>
                </div>
              </div>

              {/* Right — Content */}
              <div className="p-6 md:p-8 overflow-y-auto bg-stone-950">
                {/* ── Product tab ── */}
                {activeTab === 'product' && (
                  <motion.div key="product" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: accent }}>{product.category}</p>
                      <h2 className="font-serif text-3xl font-bold text-white">{product.name}</h2>
                    </div>

                    {product.description && (
                      <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]" style={{ borderLeftColor: accent + '40', borderLeftWidth: '3px' }}>
                        <p className="text-stone-300 text-sm leading-relaxed">{product.description}</p>
                      </div>
                    )}

                    {/* Badges as small pills */}
                    {details?.badges && details.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {details.badges.map((badge) => (
                          <span key={badge} className="px-3 py-1 text-[10px] font-semibold rounded-lg bg-white/[0.06] text-stone-300 border border-white/[0.08]">
                            {t(`badges.${badge}`)}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Benefits tab ── */}
                {activeTab === 'benefits' && (
                  <motion.div key="benefits" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
                    <h2 className="font-serif text-2xl font-bold text-white">
                      {product.name}
                    </h2>

                    {product.description && (
                      <p className="text-sm text-stone-400 leading-relaxed">{product.description}</p>
                    )}

                    {/* Badges as benefit items */}
                    {details?.badges && details.badges.length > 0 && (
                      <div className="space-y-2">
                        {details.badges.map((badge) => (
                          <div key={badge} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                            <p className="text-sm font-medium text-stone-200">{t(`badges.${badge}`)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Ingredients tab ── */}
                {activeTab === 'ingredients' && (
                  <motion.div key="ingredients" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                    <h2 className="font-serif text-2xl font-bold text-white">{t('products.activeIngredients')}</h2>
                    {details?.ingredients && details.ingredients.length > 0 ? (
                      <div className="space-y-2.5">
                        {details.ingredients.map((ingredient, idx) => {
                          const Icon = ingredientIcons[idx % ingredientIcons.length];
                          return (
                            <div key={ingredient} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]" style={{ borderLeftColor: accent + '50', borderLeftWidth: '3px' }}>
                              <div className="flex items-start gap-3">
                                <Icon size={15} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
                                <div>
                                  <p className="text-sm font-bold text-white">{t(`ingredients.${ingredient}`)}</p>
                                  <p className="text-xs text-stone-500 leading-relaxed mt-0.5">{t(`ingredientDesc.${ingredient}`)}</p>
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
                  <motion.div key="extra" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
                    <h2 className="font-serif text-2xl font-bold text-white">{t('goldShowcase.dailyUseTitle')}</h2>

                    <p className="text-sm text-stone-400 leading-relaxed">{t('goldShowcase.noHarmful')}</p>

                    <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]" style={{ borderLeftColor: accent + '40', borderLeftWidth: '3px' }}>
                      <h3 className="font-bold text-white text-sm mb-1">{t('goldShowcase.howToUseTitle')}</h3>
                      <p className="text-stone-400 text-sm leading-relaxed">{t('goldShowcase.howToUse')}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-sm mb-1">{t('goldShowcase.storageTitle')}</h3>
                      <p className="text-xs text-stone-500">{t('goldShowcase.storage')}</p>
                    </div>

                    <p className="text-xs text-stone-500 text-center mt-6">
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
