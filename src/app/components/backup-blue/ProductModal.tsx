import { X, Plus, Minus, ShoppingCart, ChevronRight, ShieldCheck, Award, BadgeCheck } from 'lucide-react';
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

/* sans-serif font stack for body text — override global Cormorant Garamond */
const sans = { fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif" } as const;

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

  const nextTab = () => {
    const idx = tabs.findIndex(t => t.key === activeTab);
    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].key); else onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
            className="w-full max-h-[92vh] overflow-hidden flex flex-col relative"
            style={{ maxWidth: 960, backgroundColor: '#f0ece5', borderRadius: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ═══ TOP BAR ═══ */}
            <div className="flex items-center h-[52px] px-4 md:px-6 shrink-0" style={{ borderBottom: '1px solid #d6d1c8', ...sans }}>
              {/* Logo */}
              <span className="text-[17px] md:text-[19px] tracking-[-0.02em] shrink-0"
                style={{ color: accent, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontStyle: 'italic' }}>
                dentissimo<sup style={{ fontSize: 8, fontStyle: 'normal' }}>®</sup>
              </span>
              <span className="ml-1.5 text-[8px] tracking-[0.18em] uppercase hidden md:inline" style={{ color: '#777' }}>
                Premium Oral Care
              </span>

              {/* Tabs */}
              <div className="flex items-center ml-auto gap-[2px] overflow-x-auto">
                {tabs.map((tab) => {
                  const active = activeTab === tab.key;
                  return (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className="px-3 md:px-4 py-[6px] text-[11px] md:text-[12px] tracking-[0.04em] transition-all whitespace-nowrap"
                      style={{
                        fontWeight: active ? 600 : 500,
                        backgroundColor: active ? '#fff' : 'transparent',
                        border: active ? '1px solid #c5c0b6' : '1px solid transparent',
                        borderRadius: 5,
                        color: active ? '#222' : '#777',
                        ...sans,
                      }}>
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Arrow circle */}
              <button onClick={nextTab}
                className="ml-2 w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: accent, color: '#fff' }}>
                <ChevronRight size={15} strokeWidth={2.5} />
              </button>

              {/* Close */}
              <button onClick={onClose}
                className="ml-2 w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-black/5 shrink-0"
                style={{ color: '#888' }}>
                <X size={14} />
              </button>
            </div>

            {/* ═══ CONTENT ═══ */}
            <div className="flex-1 overflow-y-auto">

              {/* ═══════════════ PRODUCT TAB ═══════════════ */}
              {activeTab === 'product' && (
                <motion.div key="product" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  <div className="flex flex-col md:flex-row" style={{ minHeight: 520 }}>
                    {/* LEFT — image panel with badge */}
                    <div className="md:w-[45%] flex flex-col items-center justify-center p-10 md:p-12 relative"
                      style={{ backgroundColor: '#e7e3db' }}>
                      {/* "INNOVATIVE DENTAL FORMULA" badge */}
                      <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                        <span className="text-[8px] tracking-[0.22em] uppercase font-semibold" style={{ color: '#777', ...sans }}>
                          Innovative Dental Formula
                        </span>
                        {product.isNew && (
                          <span className="px-2 py-0.5 text-[8px] uppercase tracking-[0.15em] font-bold"
                            style={{ backgroundColor: accent, color: '#fff', ...sans }}>
                            {t('products.new')}
                          </span>
                        )}
                      </div>
                      <img src={product.image} alt={product.name}
                        className="w-full max-w-[230px] h-auto object-contain"
                        style={{ maxHeight: 380, filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.18))' }} />
                    </div>

                    {/* RIGHT — product info */}
                    <div className="md:w-[55%] p-7 md:p-10 flex flex-col">
                      {/* Type label */}
                      <p className="text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: '#7a7268', ...sans, fontWeight: 600 }}>
                        {typeLabel}
                      </p>

                      {/* Product name — large Cormorant Garamond */}
                      <h2 className="font-serif mb-6" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.08, color: '#111', letterSpacing: '-0.01em' }}>
                        {product.name}
                      </h2>

                      {/* h1 card with product thumbnail */}
                      <div className="flex items-start gap-3.5 p-4 mb-3"
                        style={{ backgroundColor: '#e7e3db', borderRadius: 14 }}>
                        <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                          style={{ backgroundColor: '#dcd8cf' }}>
                          <img src={product.image} alt="" className="w-10 h-10 object-contain" />
                        </div>
                        <p className="text-[14px] leading-[1.45] pt-0.5" style={{ color: '#1a1a1a', fontWeight: 700, ...sans }}>
                          {t(`modal.${product.id}.h1`)}
                        </p>
                      </div>

                      {/* h2 card */}
                      <div className="p-4 mb-5" style={{ backgroundColor: '#e7e3db', borderRadius: 14 }}>
                        <p className="text-[13px] leading-[1.6]" style={{ color: '#555', ...sans }}>
                          {t(`modal.${product.id}.h2`)}
                        </p>
                      </div>

                      {/* Badges */}
                      {details?.badges && details.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {details.badges.map((badge) => (
                            <span key={badge} className="px-2.5 py-1 rounded-full"
                              style={{
                                fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                                color: accent, border: `1.5px solid ${accent}40`, backgroundColor: `${accent}08`,
                                ...sans,
                              }}>
                              {t(`badges.${badge}`)}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Tagline with tooth */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: '#dcd8cf' }}>
                          <span style={{ fontSize: 17 }}>🦷</span>
                        </div>
                        <p className="text-[12px] leading-[1.5]"
                          style={{ color: '#666', fontStyle: 'italic', ...sans }}>
                          {t(`modal.${product.id}.tagline`)}
                        </p>
                      </div>

                      <div className="flex-1" />

                      {/* Buy section */}
                      <div className="pt-3 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-serif" style={{ fontSize: 28, fontWeight: 700, color: '#111' }}>
                            {t('products.currency')}{formatPrice(product.price, i18n.language)}
                          </span>
                          <div className="flex items-center gap-1" style={sans}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                              className="w-8 h-8 flex items-center justify-center rounded-lg"
                              style={{ border: '1px solid #c8c2b8', color: '#666' }}>
                              <Minus size={13} />
                            </button>
                            <span className="w-8 text-center text-[13px]" style={{ fontWeight: 700, color: '#222' }}>
                              {quantity}
                            </span>
                            <button onClick={() => setQuantity(q => q + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg"
                              style={{ border: '1px solid #c8c2b8', color: '#666' }}>
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                        <button onClick={handleAddToCart}
                          className="w-full py-3 flex items-center justify-center gap-2 text-white"
                          style={{ backgroundColor: accent, borderRadius: 12, fontSize: 13, fontWeight: 700, ...sans }}>
                          <ShoppingCart size={15} />
                          {t('products.addToCart')}
                        </button>
                      </div>

                      {/* Footer bar */}
                      {details?.volume && (
                        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid #d8d3ca' }}>
                          <span className="text-[11px]" style={{ color: '#777', fontStyle: 'italic', ...sans }}>
                            {formulaLabel}
                          </span>
                          <span className="font-serif" style={{ fontSize: 20, fontWeight: 700, color: '#222' }}>
                            {details.volume}{t('modal.ml')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══════════════ BENEFITS TAB ═══════════════ */}
              {activeTab === 'benefits' && (
                <motion.div key="benefits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  <div className="flex flex-col md:flex-row" style={{ minHeight: 520 }}>
                    {/* LEFT — image */}
                    <div className="md:w-[42%] flex items-center justify-center p-10 md:p-12 relative"
                      style={{ backgroundColor: '#e7e3db' }}>
                      <img src={product.image} alt={product.name}
                        className="w-full max-w-[210px] h-auto object-contain"
                        style={{ maxHeight: 360, filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.18))' }} />
                    </div>

                    {/* RIGHT — benefits content */}
                    <div className="md:w-[58%] p-7 md:p-10 flex flex-col">
                      {/* Product name */}
                      <h2 className="font-serif mb-7" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.08, color: '#111' }}>
                        {product.name}
                      </h2>

                      {/* b1 — highlighted accent box */}
                      <div className="px-5 py-4 mb-7" style={{
                        backgroundColor: `${accent}12`,
                        border: `2px solid ${accent}28`,
                        borderRadius: 14,
                      }}>
                        <p className="text-[14px] leading-[1.55]" style={{ color: '#1a1a1a', fontWeight: 700, ...sans }}>
                          {t(`modal.${product.id}.b1`)}
                        </p>
                      </div>

                      {/* bt2 — large heading with dot, then tree branches for b2, b3 */}
                      <div className="mb-7">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-[10px] h-[10px] rounded-full shrink-0" style={{ backgroundColor: '#222' }} />
                          <h3 className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: '#111', lineHeight: 1.1 }}>
                            {t(`modal.${product.id}.bt2`)}
                          </h3>
                        </div>
                        {/* Tree branch items */}
                        <div className="ml-[5px]" style={{ borderLeft: '2px solid #c5c0b6', paddingLeft: 20 }}>
                          <div className="relative py-1.5">
                            <div className="absolute -left-[21px] top-[13px]" style={{ width: 16, height: 0, borderTop: '2px solid #c5c0b6' }} />
                            <p className="text-[13px] leading-[1.6]" style={{ color: '#444', ...sans }}>
                              {t(`modal.${product.id}.b2`)}
                            </p>
                          </div>
                          <div className="relative py-1.5">
                            <div className="absolute -left-[21px] top-[13px]" style={{ width: 16, height: 0, borderTop: '2px solid #c5c0b6' }} />
                            <p className="text-[13px] leading-[1.6]" style={{ color: '#444', ...sans }}>
                              {t(`modal.${product.id}.b3`)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* bt3 — trust badge */}
                      <div className="flex items-center gap-4 mt-auto p-4" style={{
                        backgroundColor: `${accent}0a`,
                        border: `1.5px solid ${accent}25`,
                        borderRadius: 16,
                      }}>
                        <div className="shrink-0 flex items-center justify-center" style={{
                          width: 56, height: 56, borderRadius: '50%',
                          backgroundColor: `${accent}15`,
                          border: `2px solid ${accent}30`,
                        }}>
                          <ShieldCheck size={26} style={{ color: accent }} strokeWidth={1.8} />
                        </div>
                        <div>
                          <p className="text-[13px] leading-[1.2] mb-1" style={{ fontWeight: 700, color: '#222', ...sans }}>
                            {t(`modal.${product.id}.bt3`)}
                          </p>
                          <p className="text-[12px] leading-[1.5]" style={{ color: '#555', ...sans }}>
                            {t(`modal.${product.id}.b3`)}
                          </p>
                        </div>
                      </div>

                      {/* Global Swiss GROUP logo text */}
                      <div className="mt-6 pt-4" style={{ borderTop: '1px solid #d8d3ca' }}>
                        <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: '#888', ...sans, fontWeight: 600 }}>
                          Global Swiss Group
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══════════════ INGREDIENTS TAB ═══════════════ */}
              {activeTab === 'ingredients' && (
                <motion.div key="ingredients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  <div className="flex flex-col md:flex-row" style={{ minHeight: 520 }}>
                    {/* LEFT — image */}
                    <div className="md:w-[38%] flex items-center justify-center p-10 md:p-12"
                      style={{ backgroundColor: '#e7e3db' }}>
                      <img src={product.image} alt={product.name}
                        className="w-full max-w-[190px] h-auto object-contain"
                        style={{ maxHeight: 340, filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.18))' }} />
                    </div>

                    {/* RIGHT — ingredients timeline */}
                    <div className="md:w-[62%] p-7 md:p-10">
                      <h2 className="font-serif mb-8" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.08, color: '#111' }}>
                        {t('products.activeIngredients')}
                      </h2>

                      {details?.ingredients && details.ingredients.length > 0 ? (
                        <div className="relative" style={{ paddingLeft: 2 }}>
                          {/* Vertical connecting line */}
                          <div className="absolute" style={{ left: 9, top: 12, bottom: 12, width: 2, backgroundColor: '#cdc8bf' }} />

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                            {details.ingredients.map((ingredient) => (
                              <div key={ingredient} className="flex items-start gap-5 relative">
                                {/* Large dot */}
                                <div className="shrink-0 relative z-10" style={{
                                  width: 20, height: 20, borderRadius: '50%',
                                  backgroundColor: '#2a2a2a', marginTop: 3,
                                  border: '4px solid #f0ece5',
                                  boxShadow: '0 0 0 1px #cdc8bf',
                                }} />
                                <div style={{ flex: 1 }}>
                                  <p className="font-serif" style={{ fontSize: 22, fontWeight: 700, color: '#111', lineHeight: 1.15, marginBottom: 4 }}>
                                    {t(`ingredients.${ingredient}`)}
                                  </p>
                                  <p className="text-[12px] leading-[1.65]" style={{ color: '#555', ...sans }}>
                                    {t(`ingredientDesc.${ingredient}`)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[13px]" style={{ color: '#555', ...sans }}>{product.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══════════════ EXTRA TAB ═══════════════ */}
              {activeTab === 'extra' && (
                <motion.div key="extra" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  <div className="flex flex-col md:flex-row" style={{ minHeight: 520 }}>
                    {/* LEFT — text content */}
                    <div className="md:w-[58%] p-7 md:p-10">
                      {/* Title */}
                      <h2 className="font-serif mb-4" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.08, color: '#111' }}>
                        {t(extraKeys.dailyUse)}
                      </h2>

                      {/* Не содержит: flowing comma list */}
                      <p className="text-[13px] leading-[1.65] mb-7" style={{ color: '#555', ...sans }}>
                        <span style={{ fontWeight: 700, color: '#333' }}>{t('modal.noContainsTitle')}:</span>{' '}
                        {noContainsItems.map(key => t(`modal.${key}`)).join(', ')}
                      </p>

                      {/* Способ применения — oval/pill shape */}
                      <div className="p-6 mb-7" style={{
                        backgroundColor: '#e7e3db',
                        borderRadius: 32,
                        border: '1px solid #d4cfC5',
                      }}>
                        <h3 className="font-serif mb-2" style={{ fontSize: 22, fontWeight: 700, fontStyle: 'italic', color: accent }}>
                          {t('goldShowcase.howToUseTitle')}
                        </h3>
                        <p className="text-[13px] leading-[1.65]" style={{ color: '#444', ...sans }}>
                          {t(extraKeys.howToUse)}
                        </p>
                      </div>

                      {/* Composition */}
                      {details?.composition && (
                        <div className="mb-5">
                          <h3 className="mb-1.5" style={{ fontSize: 14, fontWeight: 700, color: '#222', ...sans }}>
                            {t('goldShowcase.compositionTitle')}
                          </h3>
                          <p className="text-[11px] leading-[1.7]" style={{ color: '#666', ...sans }}>
                            {details.composition}
                          </p>
                        </div>
                      )}

                      {/* Storage */}
                      <div>
                        <h3 className="mb-1" style={{ fontSize: 14, fontWeight: 700, color: '#222', ...sans }}>
                          {t('goldShowcase.storageTitle')}
                        </h3>
                        <p className="text-[11px] leading-[1.6]" style={{ color: '#666', ...sans }}>
                          {t('goldShowcase.storage')}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT — product image */}
                    <div className="md:w-[42%] flex items-center justify-center p-10 md:p-12"
                      style={{ backgroundColor: '#e7e3db' }}>
                      <img src={product.image} alt={product.name}
                        className="w-full max-w-[190px] h-auto object-contain"
                        style={{ maxHeight: 340, filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.18))' }} />
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
