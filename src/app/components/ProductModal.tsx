import { X, Plus, Minus, ShoppingCart, Sparkles, Droplets, Shield, FlaskConical, Atom, Leaf, Heart, Gem, ChevronRight } from 'lucide-react';
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
  'whitening-gold': '#b8942b', 'whitening-black': '#555555', 'diamond': '#1a8a7a',
  'gentle-care': '#1a8a5a', 'complete-care': '#1a8a7a', 'pro-care': '#1a8a7a',
  'vegan-b12': '#2a7a40', 'pregnant': '#c0508a', 'kids-caramel': '#c07030',
  'junior-apple': '#6a9020', 'brush-gold': '#b8942b', 'brush-silver': '#6a7585',
  'brush-medium': '#1a8a7a', 'brush-hard': '#4a5565', 'brush-sensitive': '#1a8a7a',
  'brush-parodontal': '#2a7a40', 'brush-kids': '#c0508a', 'brush-junior': '#2a7a40',
  'mouthwash-gold': '#b8942b', 'mouthwash-fresh': '#1a8a7a', 'mouthwash-gum': '#1a8a5a',
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
  const accent = productAccents[product.id] || '#b8942b';

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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl relative flex flex-col"
            style={{ backgroundColor: '#f0ede8' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ─── Header: Logo + Tabs + Arrow ─── */}
            <div className="flex items-center gap-4 px-4 md:px-6 py-3 border-b" style={{ borderColor: '#d5d0c8' }}>
              <span className="text-sm md:text-base font-bold italic tracking-tight" style={{ color: accent }}>
                dentissimo<span className="text-[8px] align-super">®</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider hidden md:inline" style={{ color: '#888' }}>Premium Oral Care</span>
              <div className="flex items-center gap-0 ml-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="px-3 md:px-5 py-1.5 text-xs md:text-sm font-medium transition-all duration-200 border"
                    style={{
                      backgroundColor: activeTab === tab.key ? '#fff' : 'transparent',
                      borderColor: activeTab === tab.key ? '#c5c0b8' : 'transparent',
                      color: activeTab === tab.key ? '#222' : '#888',
                      borderRadius: '4px',
                      margin: '0 1px',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    const idx = tabs.findIndex(t => t.key === activeTab);
                    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].key);
                    else onClose();
                  }}
                  className="ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: accent, color: '#fff' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <button onClick={onClose} className="ml-1 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors" style={{ color: '#888' }}>
                <X size={16} />
              </button>
            </div>

            {/* ─── Content area ─── */}
            <div className="flex-1 overflow-y-auto">
              {/* ══ PRODUCT TAB ══ */}
              {activeTab === 'product' && (
                <motion.div key="product" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <div className="grid md:grid-cols-2 min-h-[500px]">
                    {/* Left: product image */}
                    <div className="flex items-center justify-center p-6 md:p-10 relative" style={{ backgroundColor: '#e8e4dd' }}>
                      {product.isNew && (
                        <span className="absolute top-4 left-4 px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-white rounded-sm"
                          style={{ backgroundColor: accent }}>
                          {t('products.new')}
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full max-w-[260px] h-auto max-h-[380px] object-contain drop-shadow-lg"
                      />
                    </div>

                    {/* Right: product info */}
                    <div className="p-6 md:p-8 flex flex-col justify-between">
                      <div className="space-y-5">
                        {/* Type + name */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#999' }}>{typeLabel}</p>
                          <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight" style={{ color: '#222' }}>
                            {product.name}
                          </h2>
                        </div>

                        {/* Highlight cards — like in screenshot */}
                        <div className="space-y-3">
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#e8e4dd' }}>
                            <p className="text-sm font-semibold leading-relaxed" style={{ color: '#333' }}>
                              {t(`modal.${product.id}.h1`)}
                            </p>
                          </div>
                          <div className="rounded-lg p-4" style={{ backgroundColor: '#e8e4dd' }}>
                            <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
                              {t(`modal.${product.id}.h2`)}
                            </p>
                          </div>
                        </div>

                        {/* Badges */}
                        {details?.badges && details.badges.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {details.badges.map((badge) => (
                              <span key={badge} className="px-3 py-1 text-[10px] font-semibold tracking-wide rounded-full" style={{
                                color: accent,
                                border: `1px solid ${accent}40`,
                                backgroundColor: accent + '10',
                              }}>
                                {t(`badges.${badge}`)}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Tagline with tooth icon */}
                        <div className="flex items-center gap-3 pt-2">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e0ddd6' }}>
                            <span className="text-lg">🦷</span>
                          </div>
                          <p className="text-xs italic leading-relaxed" style={{ color: '#777' }}>
                            {t(`modal.${product.id}.tagline`)}
                          </p>
                        </div>
                      </div>

                      {/* Buy section */}
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold" style={{ color: '#222' }}>
                            {t('products.currency')}{formatPrice(product.price, i18n.language)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center rounded border transition-colors" style={{ borderColor: '#ccc', color: '#555' }}>
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold" style={{ color: '#222' }}>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center rounded border transition-colors" style={{ borderColor: '#ccc', color: '#555' }}>
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handleAddToCart}
                          className="w-full py-3 font-semibold flex items-center justify-center gap-2 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                          style={{ backgroundColor: accent }}
                        >
                          <ShoppingCart size={16} />
                          {t('products.addToCart')}
                        </button>
                      </div>

                      {/* Footer bar */}
                      {details?.volume && (
                        <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: '#d5d0c8' }}>
                          <span className="text-xs" style={{ color: '#888' }}>{formulaLabel}</span>
                          <span className="text-base font-bold" style={{ color: '#333' }}>{details.volume}{t('modal.ml')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ BENEFITS TAB ══ */}
              {activeTab === 'benefits' && (
                <motion.div key="benefits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <div className="grid md:grid-cols-2 min-h-[500px]">
                    {/* Left: product image */}
                    <div className="flex items-center justify-center p-6 md:p-10" style={{ backgroundColor: '#e8e4dd' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full max-w-[240px] h-auto max-h-[360px] object-contain drop-shadow-lg"
                      />
                    </div>

                    {/* Right: benefits */}
                    <div className="p-6 md:p-8 flex flex-col">
                      <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6" style={{ color: '#222' }}>
                        {product.name}
                      </h2>

                      <div className="space-y-5 flex-1">
                        {/* Benefit 1 — highlighted box */}
                        <div className="rounded-lg px-5 py-3" style={{ backgroundColor: accent + '15', border: `1px solid ${accent}30` }}>
                          <p className="text-sm font-bold" style={{ color: '#222' }}>
                            {t(`modal.${product.id}.bt1`)}
                          </p>
                        </div>

                        {/* Benefit 2 — title + sub-items style */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                            <p className="text-xl font-bold" style={{ color: '#222' }}>
                              {t(`modal.${product.id}.bt2`)}
                            </p>
                          </div>
                          <div className="ml-4 pl-4 space-y-1.5" style={{ borderLeft: `2px solid ${accent}30` }}>
                            <p className="text-sm" style={{ color: '#555' }}>{t(`modal.${product.id}.b1`)}</p>
                            <p className="text-sm" style={{ color: '#555' }}>{t(`modal.${product.id}.b2`)}</p>
                          </div>
                        </div>

                        {/* Benefit 3 — circular element */}
                        <div className="flex items-center gap-4 mt-4">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl" style={{
                            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                            boxShadow: `0 4px 16px ${accent}40`,
                          }}>
                            {t(`modal.${product.id}.bt3`).charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm leading-relaxed" style={{ color: '#444' }}>
                              {t(`modal.${product.id}.b3`)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ INGREDIENTS TAB ══ */}
              {activeTab === 'ingredients' && (
                <motion.div key="ingredients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <div className="grid md:grid-cols-2 min-h-[500px]">
                    {/* Left: product image */}
                    <div className="flex items-center justify-center p-6 md:p-10" style={{ backgroundColor: '#e8e4dd' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full max-w-[220px] h-auto max-h-[340px] object-contain drop-shadow-lg"
                      />
                    </div>

                    {/* Right: ingredients list */}
                    <div className="p-6 md:p-8">
                      <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6" style={{ color: '#222' }}>
                        {t('products.activeIngredients')}
                      </h2>

                      {details?.ingredients && details.ingredients.length > 0 ? (
                        <div className="space-y-5">
                          {details.ingredients.map((ingredient, idx) => {
                            const Icon = ingredientIcons[idx % ingredientIcons.length];
                            return (
                              <div key={ingredient} className="flex items-start gap-3">
                                <div className="flex flex-col items-center flex-shrink-0 mt-1">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
                                  {idx < (details.ingredients?.length ?? 0) - 1 && (
                                    <div className="w-px flex-1 mt-1 min-h-[20px]" style={{ backgroundColor: '#ccc' }} />
                                  )}
                                </div>
                                <div className="pb-2">
                                  <p className="text-base font-bold mb-1" style={{ color: '#222' }}>
                                    {t(`ingredients.${ingredient}`)}
                                  </p>
                                  <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
                                    {t(`ingredientDesc.${ingredient}`)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: '#888' }}>{product.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ EXTRA TAB ══ */}
              {activeTab === 'extra' && (
                <motion.div key="extra" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <div className="p-6 md:p-8 max-w-4xl mx-auto">
                    {/* Title */}
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2" style={{ color: '#222' }}>
                      {t(extraKeys.dailyUse)}
                    </h2>

                    {/* No-contains list */}
                    <p className="text-sm mb-6" style={{ color: '#555' }}>
                      {t('modal.noContainsTitle')}: {noContainsItems.map(key => t(`modal.${key}`)).join(', ')}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left column: usage + composition */}
                      <div className="space-y-6">
                        {/* How to use — circular styled element */}
                        <div className="rounded-2xl p-5" style={{ backgroundColor: '#e8e4dd' }}>
                          <h3 className="font-serif text-xl font-bold italic mb-3" style={{ color: accent }}>
                            {t('goldShowcase.howToUseTitle')}
                          </h3>
                          <p className="text-sm leading-relaxed" style={{ color: '#444' }}>
                            {t(extraKeys.howToUse)}
                          </p>
                        </div>

                        {/* Composition */}
                        {details?.composition && (
                          <div>
                            <h3 className="font-bold text-sm mb-2" style={{ color: '#222' }}>
                              {t('goldShowcase.compositionTitle')}
                            </h3>
                            <p className="text-xs leading-relaxed" style={{ color: '#777' }}>
                              {details.composition}
                            </p>
                          </div>
                        )}

                        {/* Storage */}
                        <div>
                          <h3 className="font-bold text-sm mb-1" style={{ color: '#222' }}>
                            {t('goldShowcase.storageTitle')}
                          </h3>
                          <p className="text-xs" style={{ color: '#777' }}>
                            {t('goldShowcase.storage')}
                          </p>
                        </div>
                      </div>

                      {/* Right column: product image */}
                      <div className="flex items-start justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full max-w-[200px] h-auto object-contain drop-shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
