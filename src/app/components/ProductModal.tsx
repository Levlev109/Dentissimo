import { X, Plus, Minus, ShoppingCart, Sparkles, Droplets, Shield, FlaskConical, Atom, Leaf, Heart, Gem, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Product } from '../../services/database';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../services/currency';
import { showCartToast } from './Toast';
import { productDetailsMap } from './productData';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

type ModalTab = 'product' | 'benefits' | 'ingredients' | 'extra';

const ingredientIcons = [Sparkles, Droplets, Shield, FlaskConical, Atom, Leaf, Heart, Gem] as const;

const noContainsMap: Record<string, string[]> = {
  toothpaste: ['nc_sls', 'nc_chlorhexidine', 'nc_peroxides', 'nc_parabens', 'nc_gluten', 'nc_triclosan'],
  toothbrush: ['nc_bpa', 'nc_phthalates', 'nc_harmfulDyes'],
  mouthwash: ['nc_alcohol', 'nc_chlorhexidine', 'nc_peroxides', 'nc_parabens', 'nc_triclosan'],
  kids: ['nc_sls', 'nc_parabens', 'nc_artificialDyes'],
};

const productAccents: Record<string, string> = {
  'whitening-gold': '#d4a934', 'whitening-black': '#9ca3af', 'diamond': '#2dd4bf',
  'gentle-care': '#34d399', 'complete-care': '#2dd4bf', 'pro-care': '#2dd4bf',
  'vegan-b12': '#4ade80', 'pregnant': '#f472b6', 'kids-caramel': '#fb923c',
  'junior-apple': '#a3e635', 'brush-gold': '#d4a934', 'brush-silver': '#94a3b8',
  'brush-medium': '#2dd4bf', 'brush-hard': '#64748b', 'brush-sensitive': '#2dd4bf',
  'brush-parodontal': '#4ade80', 'brush-kids': '#f472b6', 'brush-junior': '#4ade80',
  'mouthwash-gold': '#d4a934', 'mouthwash-fresh': '#2dd4bf', 'mouthwash-gum': '#34d399',
};

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<ModalTab>('product');
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      setActiveTab('product');
      setQuantity(1);
      const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!product) return null;

  const details = productDetailsMap[product.id];
  const accent = productAccents[product.id] || '#d4a934';

  // Determine product type for context-specific extra tab
  const productType: 'toothbrush' | 'mouthwash' | 'kids' | 'toothpaste' =
    product.id.startsWith('brush-') ? 'toothbrush' :
    product.id.startsWith('mouthwash-') ? 'mouthwash' :
    (product.id === 'kids-caramel' || product.id === 'junior-apple') ? 'kids' :
    'toothpaste';

  const extraKeys = {
    toothpaste: { howToUse: 'goldShowcase.howToUsePaste', dailyUse: 'goldShowcase.dailyUsePaste' },
    toothbrush: { howToUse: 'goldShowcase.howToUseBrush', dailyUse: 'goldShowcase.dailyUseBrush' },
    mouthwash:  { howToUse: 'goldShowcase.howToUseMouthwash', dailyUse: 'goldShowcase.dailyUseMouthwash' },
    kids:       { howToUse: 'goldShowcase.howToUseKids', dailyUse: 'goldShowcase.dailyUseKids' },
  }[productType];

  const noContainsItems = noContainsMap[productType];

  const isGelProduct = ['whitening-gold', 'diamond'].includes(product.id);
  const typeLabel = productType === 'toothbrush' ? t('modal.typeToothbrush') :
    productType === 'mouthwash' ? t('modal.typeMouthwash') :
    productType === 'kids' ? t('modal.typeKids') :
    isGelProduct ? t('productLines.toothpasteGel') :
    t('productLines.toothpaste');

  const formulaLabel = productType === 'toothbrush' ? t('modal.formulaBrush') :
    productType === 'mouthwash' ? t('modal.formulaMouthwash') :
    productType === 'kids' ? t('modal.formulaKids') :
    t('modal.formulaPaste');

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
            className="bg-stone-950 max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/[0.08] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent glow at top */}
            <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{
              background: `radial-gradient(ellipse 60% 100% at 50% 0%, ${accent}15, transparent)`,
            }} />

            {/* Tab bar */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.06] relative z-10">
              <div className="flex bg-white/[0.04] p-1 backdrop-blur-sm border border-white/[0.06]">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
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
              <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors w-8 h-8 hover:bg-white/[0.06] flex items-center justify-center">
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
                  <span className="absolute top-3 left-3 px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold text-stone-900"
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
                      {t('products.currency')}{formatPrice(product.price, i18n.language)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center border border-white/10 text-stone-300 hover:bg-white/[0.06] transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center border border-white/10 text-stone-300 hover:bg-white/[0.06] transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 font-semibold flex items-center justify-center gap-2 text-stone-900 shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
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
                      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: accent }}>{typeLabel}</p>
                      <h2 className="font-serif text-3xl font-bold text-white">{product.name}</h2>
                    </div>

                    {/* Highlight cards */}
                    <div className="space-y-3">
                      {[1, 2].map(i => (
                        <div key={i} className="relative p-4 overflow-hidden" style={{
                          background: `linear-gradient(135deg, ${accent}08, ${accent}04)`,
                          border: `1px solid ${accent}25`,
                        }}>
                          <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: accent + '80' }} />
                          <div className="flex items-start gap-3.5 pl-2">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{
                              background: `linear-gradient(135deg, ${accent}25, ${accent}10)`,
                              border: `1px solid ${accent}30`,
                            }}>
                              {i === 1 ? <Sparkles size={15} style={{ color: accent }} /> : <Heart size={15} style={{ color: accent }} />}
                            </div>
                            <p className="text-sm text-stone-200 leading-relaxed pt-1.5">{t(`modal.${product.id}.h${i}`)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Badges */}
                    {details?.badges && details.badges.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {details.badges.map((badge) => (
                          <span key={badge} className="px-3 py-1.5 text-[10px] font-semibold tracking-wide border" style={{
                            color: accent,
                            borderColor: accent + '30',
                            backgroundColor: accent + '08',
                          }}>
                            {t(`badges.${badge}`)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tagline */}
                    <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{
                        background: `linear-gradient(135deg, ${accent}20, ${accent}08)`,
                        border: `1px solid ${accent}25`,
                      }}>
                        <Star size={15} style={{ color: accent }} />
                      </div>
                      <p className="text-sm text-stone-400 italic leading-relaxed">{t(`modal.${product.id}.tagline`)}</p>
                    </div>

                    {/* Footer bar */}
                    {details?.volume && (
                      <div className="flex items-center justify-between px-4 py-3 mt-2" style={{
                        background: `linear-gradient(135deg, ${accent}06, transparent)`,
                        border: `1px solid ${accent}15`,
                      }}>
                        <span className="text-xs text-stone-400 font-medium">{formulaLabel}</span>
                        <span className="text-xs font-bold tracking-wide" style={{ color: accent }}>{details.volume} {t('modal.ml')}</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Benefits tab ── */}
                {activeTab === 'benefits' && (
                  <motion.div key="benefits" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: accent }}>{t('goldShowcase.tabBenefits')}</p>
                      <h2 className="font-serif text-2xl font-bold text-white">{product.name}</h2>
                    </div>

                    <div className="space-y-3.5">
                      {[1, 2, 3].map(i => {
                        const icons = [Shield, Leaf, Atom];
                        const Icon = icons[(i - 1) % icons.length];
                        return (
                          <div key={i} className="relative p-4 overflow-hidden" style={{
                            background: `linear-gradient(135deg, ${accent}06, transparent)`,
                            border: `1px solid ${accent}15`,
                          }}>
                            <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: accent + '60' }} />
                            <div className="flex items-start gap-3.5 pl-2">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                                background: `linear-gradient(135deg, ${accent}20, ${accent}08)`,
                                border: `1px solid ${accent}25`,
                              }}>
                                <Icon size={14} style={{ color: accent }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white mb-1">{t(`modal.${product.id}.bt${i}`)}</p>
                                <p className="text-xs text-stone-400 leading-relaxed">{t(`modal.${product.id}.b${i}`)}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {details?.badges && details.badges.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {details.badges.map((badge) => (
                          <span key={badge} className="px-3 py-1.5 text-[10px] font-semibold tracking-wide border" style={{
                            color: accent,
                            borderColor: accent + '30',
                            backgroundColor: accent + '08',
                          }}>
                            {t(`badges.${badge}`)}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Ingredients tab ── */}
                {activeTab === 'ingredients' && (
                  <motion.div key="ingredients" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: accent }}>{t('goldShowcase.tabIngredients')}</p>
                      <h2 className="font-serif text-2xl font-bold text-white">{t('products.activeIngredients')}</h2>
                    </div>

                    {details?.ingredients && details.ingredients.length > 0 ? (
                      <div className="space-y-3">
                        {details.ingredients.map((ingredient, idx) => {
                          const Icon = ingredientIcons[idx % ingredientIcons.length];
                          return (
                            <div key={ingredient} className="relative p-4 overflow-hidden" style={{
                              background: `linear-gradient(135deg, ${accent}06, transparent)`,
                              border: `1px solid ${accent}15`,
                            }}>
                              <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: accent + '50' }} />
                              <div className="flex items-start gap-3.5 pl-2">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{
                                  background: `linear-gradient(135deg, ${accent}20, ${accent}08)`,
                                  border: `1px solid ${accent}25`,
                                }}>
                                  <Icon size={14} style={{ color: accent }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-white mb-0.5">{t(`ingredients.${ingredient}`)}</p>
                                  <p className="text-xs text-stone-400 leading-relaxed">{t(`ingredientDesc.${ingredient}`)}</p>
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
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: accent }}>{t(extraKeys.dailyUse)}</p>
                      <h2 className="font-serif text-2xl font-bold text-white">{t('modal.noContainsTitle')}</h2>
                    </div>

                    {/* No-contains grid */}
                    {noContainsItems.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {noContainsItems.map((key) => (
                          <div key={key} className="flex items-center gap-2 p-2.5" style={{
                            background: `linear-gradient(135deg, ${accent}06, transparent)`,
                            border: `1px solid ${accent}12`,
                          }}>
                            <X size={12} className="flex-shrink-0 text-red-400/70" />
                            <span className="text-xs text-stone-300">{t(`modal.${key}`)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* How to use — circular element */}
                    <div className="relative p-4 overflow-hidden" style={{
                      background: `linear-gradient(135deg, ${accent}08, ${accent}03)`,
                      border: `1px solid ${accent}20`,
                    }}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{
                          background: `linear-gradient(135deg, ${accent}25, ${accent}10)`,
                          border: `1px solid ${accent}30`,
                        }}>
                          <Check size={18} style={{ color: accent }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-sm mb-1">{t('goldShowcase.howToUseTitle')}</h3>
                          <p className="text-stone-400 text-sm leading-relaxed">{t(extraKeys.howToUse)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Composition */}
                    {details?.composition && (
                      <div className="relative p-4 overflow-hidden" style={{
                        background: `linear-gradient(135deg, ${accent}06, transparent)`,
                        border: `1px solid ${accent}15`,
                      }}>
                        <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: accent + '40' }} />
                        <div className="pl-2">
                          <h3 className="font-bold text-white text-sm mb-1.5">{t('goldShowcase.compositionTitle')}</h3>
                          <p className="text-xs text-stone-500 leading-relaxed">{details.composition}</p>
                        </div>
                      </div>
                    )}

                    {/* Storage */}
                    <div className="relative p-3.5 overflow-hidden" style={{
                      background: `linear-gradient(135deg, ${accent}04, transparent)`,
                      border: `1px solid ${accent}10`,
                    }}>
                      <div className="pl-1">
                        <h3 className="font-bold text-white text-sm mb-0.5">{t('goldShowcase.storageTitle')}</h3>
                        <p className="text-xs text-stone-500">{t('goldShowcase.storage')}</p>
                      </div>
                    </div>
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
