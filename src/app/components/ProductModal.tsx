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
  'whitening-gold': '#b8942b', 'whitening-black': '#444', 'diamond': '#1a8a7a',
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

  /* ─── Shared header with logo + tabs + circle arrow ─── */
  const Header = () => (
    <div className="flex items-center px-3 md:px-5 py-2.5 shrink-0" style={{ borderBottom: '1px solid #d8d3cb' }}>
      {/* Logo */}
      <div className="flex items-baseline gap-1.5 shrink-0 mr-3">
        <span className="text-base md:text-lg font-bold italic" style={{ color: accent }}>
          dentissimo<sup className="text-[7px] not-italic">®</sup>
        </span>
        <span className="text-[8px] uppercase tracking-[0.15em] hidden md:inline" style={{ color: '#999' }}>Professional Oral Care</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-px ml-auto mr-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-2.5 md:px-4 py-1.5 text-[11px] md:text-[13px] font-medium transition-all whitespace-nowrap"
            style={{
              backgroundColor: activeTab === tab.key ? '#fff' : 'transparent',
              border: activeTab === tab.key ? '1px solid #c8c3bb' : '1px solid transparent',
              borderRadius: '6px',
              color: activeTab === tab.key ? '#333' : '#999',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Circle arrow → */}
      <button
        onClick={() => {
          const idx = tabs.findIndex(t => t.key === activeTab);
          if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].key); else onClose();
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105"
        style={{ backgroundColor: accent, color: '#fff' }}
      >
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>

      {/* Close */}
      <button onClick={onClose} className="ml-2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5 shrink-0" style={{ color: '#aaa' }}>
        <X size={15} />
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 16 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
            className="max-w-[940px] w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col relative"
            style={{ backgroundColor: '#edeae4', borderRadius: '2px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header />

            {/* ─── Scrollable content ─── */}
            <div className="flex-1 overflow-y-auto">

              {/* ══════════════════ PRODUCT TAB ══════════════════ */}
              {activeTab === 'product' && (
                <motion.div key="product" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex flex-col md:flex-row min-h-[480px]">
                    {/* Left — Image panel */}
                    <div className="md:w-[46%] flex items-center justify-center p-8 md:p-10 relative" style={{ backgroundColor: '#e5e1d9' }}>
                      {product.isNew && (
                        <span className="absolute top-4 left-4 px-3 py-0.5 text-[9px] uppercase tracking-[0.18em] font-bold"
                          style={{ backgroundColor: accent, color: '#fff' }}>
                          {t('products.new')}
                        </span>
                      )}
                      <img src={product.image} alt={product.name}
                        className="w-full max-w-[240px] h-auto max-h-[360px] object-contain"
                        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }} />
                    </div>

                    {/* Right — Info */}
                    <div className="md:w-[54%] p-6 md:p-8 flex flex-col">
                      {/* Type small label */}
                      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: '#aaa' }}>{typeLabel}</p>

                      {/* Product name — BIG bold serif */}
                      <h2 className="font-serif text-[28px] md:text-[36px] font-extrabold leading-[1.1] mb-5" style={{ color: '#1a1a1a' }}>
                        {product.name}
                      </h2>

                      {/* h1 card — cream bg, icon left */}
                      <div className="flex items-start gap-3 rounded-xl p-4 mb-3" style={{ backgroundColor: '#e5e1d9' }}>
                        <img src={product.image} alt="" className="w-14 h-14 object-contain shrink-0 rounded-lg" style={{ backgroundColor: '#d9d5cd' }} />
                        <p className="text-[15px] font-bold leading-snug" style={{ color: '#222' }}>
                          {t(`modal.${product.id}.h1`)}
                        </p>
                      </div>

                      {/* h2 card — cream bg */}
                      <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: '#e5e1d9' }}>
                        <p className="text-[14px] leading-relaxed" style={{ color: '#444' }}>
                          {t(`modal.${product.id}.h2`)}
                        </p>
                      </div>

                      {/* Badges row */}
                      {details?.badges && details.badges.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {details.badges.map((badge) => (
                            <span key={badge} className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full"
                              style={{ color: accent, border: `1.5px solid ${accent}50`, backgroundColor: accent + '0a' }}>
                              {t(`badges.${badge}`)}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Tagline — tooth icon circle */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#ddd9d0' }}>
                          <span className="text-[18px]">🦷</span>
                        </div>
                        <p className="text-[13px] italic leading-snug" style={{ color: '#666' }}>
                          {t(`modal.${product.id}.tagline`)}
                        </p>
                      </div>

                      {/* Gap flexible */}
                      <div className="flex-1" />

                      {/* Buy block */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[26px] font-extrabold" style={{ color: '#1a1a1a' }}>
                            {t('products.currency')}{formatPrice(product.price, i18n.language)}
                          </span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                              className="w-9 h-9 flex items-center justify-center rounded-lg border transition-colors hover:bg-black/5"
                              style={{ borderColor: '#c8c3bb', color: '#555' }}>
                              <Minus size={14} />
                            </button>
                            <span className="w-9 text-center text-sm font-bold" style={{ color: '#222' }}>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg border transition-colors hover:bg-black/5"
                              style={{ borderColor: '#c8c3bb', color: '#555' }}>
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button onClick={handleAddToCart}
                          className="w-full py-3.5 font-bold flex items-center justify-center gap-2 text-white text-[14px] rounded-xl shadow-md hover:shadow-lg transition-all"
                          style={{ backgroundColor: accent }}>
                          <ShoppingCart size={16} />
                          {t('products.addToCart')}
                        </button>
                      </div>

                      {/* Footer: formula + volume */}
                      {details?.volume && (
                        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid #d5d0c8' }}>
                          <span className="text-[12px] italic" style={{ color: '#999' }}>{formulaLabel}</span>
                          <span className="text-[18px] font-extrabold" style={{ color: '#333' }}>{details.volume}{t('modal.ml')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════ BENEFITS TAB ══════════════════ */}
              {activeTab === 'benefits' && (
                <motion.div key="benefits" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex flex-col md:flex-row min-h-[480px]">
                    {/* Left — Image */}
                    <div className="md:w-[42%] flex items-center justify-center p-8 md:p-10" style={{ backgroundColor: '#e5e1d9' }}>
                      <img src={product.image} alt={product.name}
                        className="w-full max-w-[220px] h-auto max-h-[340px] object-contain"
                        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }} />
                    </div>

                    {/* Right — Benefits */}
                    <div className="md:w-[58%] p-6 md:p-8 flex flex-col">
                      {/* Product name */}
                      <h2 className="font-serif text-[28px] md:text-[36px] font-extrabold leading-[1.1] mb-6" style={{ color: '#1a1a1a' }}>
                        {product.name}
                      </h2>

                      {/* Benefit 1 — highlighted accent box (like "Бережно очищает и полирует эмаль") */}
                      <div className="rounded-xl px-5 py-3.5 mb-6" style={{ backgroundColor: accent + '18', border: `2px solid ${accent}35` }}>
                        <p className="text-[15px] font-bold leading-snug" style={{ color: '#1a1a1a' }}>
                          {t(`modal.${product.id}.b1`)}
                        </p>
                      </div>

                      {/* Benefit 2 — "Стимулирует" style: big dot + title, then tree branches */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: '#333' }} />
                          <h3 className="text-[22px] md:text-[26px] font-extrabold" style={{ color: '#1a1a1a' }}>
                            {t(`modal.${product.id}.bt2`)}
                          </h3>
                        </div>
                        {/* Tree branches */}
                        <div className="ml-[6px] pl-5 space-y-2" style={{ borderLeft: `2px solid #bbb` }}>
                          <div className="flex items-start gap-2 relative">
                            <div className="absolute -left-[22px] top-[10px] w-4 h-px" style={{ backgroundColor: '#bbb' }} />
                            <span className="text-[14px] leading-relaxed" style={{ color: '#444' }}>
                              {t(`modal.${product.id}.b2`)}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 relative">
                            <div className="absolute -left-[22px] top-[10px] w-4 h-px" style={{ backgroundColor: '#bbb' }} />
                            <span className="text-[14px] leading-relaxed" style={{ color: '#444' }}>
                              {t(`modal.${product.id}.b3`)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Benefit 3 — Circular element with first letter (like "F" for Фтор) */}
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center shrink-0"
                          style={{
                            background: `linear-gradient(145deg, ${accent}30, ${accent}15)`,
                            border: `3px solid ${accent}50`,
                          }}>
                          <span className="text-[28px] font-extrabold" style={{ color: accent }}>
                            {t(`modal.${product.id}.bt3`).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-[14px] leading-relaxed" style={{ color: '#333' }}>
                            {t(`modal.${product.id}.bt3`)} — {t(`modal.${product.id}.b3`).toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════ INGREDIENTS TAB ══════════════════ */}
              {activeTab === 'ingredients' && (
                <motion.div key="ingredients" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex flex-col md:flex-row min-h-[480px]">
                    {/* Left — Image */}
                    <div className="md:w-[38%] flex items-center justify-center p-8 md:p-10" style={{ backgroundColor: '#e5e1d9' }}>
                      <img src={product.image} alt={product.name}
                        className="w-full max-w-[200px] h-auto max-h-[320px] object-contain"
                        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }} />
                    </div>

                    {/* Right — Ingredients timeline */}
                    <div className="md:w-[62%] p-6 md:p-8">
                      <h2 className="font-serif text-[28px] md:text-[36px] font-extrabold leading-[1.1] mb-8" style={{ color: '#1a1a1a' }}>
                        {t('products.activeIngredients')}
                      </h2>

                      {details?.ingredients && details.ingredients.length > 0 ? (
                        <div className="relative">
                          {/* Vertical line */}
                          <div className="absolute left-[7px] top-[8px] bottom-[8px] w-[2px]" style={{ backgroundColor: '#c8c3bb' }} />

                          <div className="space-y-6">
                            {details.ingredients.map((ingredient, idx) => (
                              <div key={ingredient} className="flex items-start gap-4 relative">
                                {/* Dot */}
                                <div className="w-4 h-4 rounded-full shrink-0 mt-1 relative z-10"
                                  style={{ backgroundColor: '#333', border: '3px solid #edeae4' }} />
                                {/* Text */}
                                <div>
                                  <p className="text-[18px] md:text-[20px] font-extrabold leading-tight mb-1" style={{ color: '#1a1a1a' }}>
                                    {t(`ingredients.${ingredient}`)}
                                  </p>
                                  <p className="text-[13px] leading-relaxed" style={{ color: '#666' }}>
                                    {t(`ingredientDesc.${ingredient}`)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: '#888' }}>{product.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════ EXTRA TAB ══════════════════ */}
              {activeTab === 'extra' && (
                <motion.div key="extra" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex flex-col md:flex-row min-h-[480px]">
                    {/* Left — Info */}
                    <div className="md:w-[58%] p-6 md:p-8">
                      {/* Title — large serif */}
                      <h2 className="font-serif text-[28px] md:text-[34px] font-extrabold leading-[1.1] mb-3" style={{ color: '#1a1a1a' }}>
                        {t(extraKeys.dailyUse)}
                      </h2>

                      {/* Не содержит: comma list */}
                      <p className="text-[14px] leading-relaxed mb-6" style={{ color: '#444' }}>
                        {t('modal.noContainsTitle')}: {noContainsItems.map(key => t(`modal.${key}`)).join(', ')}
                      </p>

                      {/* Способ применения — rounded oval/pill container */}
                      <div className="rounded-[28px] p-5 md:p-6 mb-6" style={{ backgroundColor: '#e5e1d9', border: '1px solid #d0cbc3' }}>
                        <h3 className="font-serif text-[20px] md:text-[22px] font-extrabold italic mb-2" style={{ color: accent }}>
                          {t('goldShowcase.howToUseTitle')}
                        </h3>
                        <p className="text-[14px] leading-relaxed" style={{ color: '#333' }}>
                          {t(extraKeys.howToUse)}
                        </p>
                      </div>

                      {/* Composition */}
                      {details?.composition && (
                        <div className="mb-5">
                          <h3 className="text-[14px] font-extrabold mb-1.5" style={{ color: '#222' }}>
                            {t('goldShowcase.compositionTitle')}
                          </h3>
                          <p className="text-[12px] leading-relaxed" style={{ color: '#777' }}>
                            {details.composition}
                          </p>
                        </div>
                      )}

                      {/* Storage */}
                      <div>
                        <h3 className="text-[14px] font-extrabold mb-1" style={{ color: '#222' }}>
                          {t('goldShowcase.storageTitle')}
                        </h3>
                        <p className="text-[12px]" style={{ color: '#777' }}>
                          {t('goldShowcase.storage')}
                        </p>
                      </div>
                    </div>

                    {/* Right — Product image */}
                    <div className="md:w-[42%] flex items-center justify-center p-8 md:p-10" style={{ backgroundColor: '#e5e1d9' }}>
                      <img src={product.image} alt={product.name}
                        className="w-full max-w-[200px] h-auto max-h-[340px] object-contain"
                        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }} />
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
