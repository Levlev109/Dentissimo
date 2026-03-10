import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { convertPrice } from '../../services/currency';
import { showCartToast } from './Toast';
import { ProductModal } from './ProductModal';
import { allProducts as baseProducts, type ProductEntry } from '../../data/allProducts';
import { productDetailsMap } from './productData';
import { productService } from '../../services/productService';
import { type ProductOverride, type CustomProduct } from '../../services/database';

const themes: Record<string, { color: string; glow: string; gradient: string }> = {
  'whitening-gold':   { color: '#d4a934', glow: 'rgba(212,169,52,0.18)', gradient: 'from-amber-950/40 via-stone-950 to-stone-950' },
  'whitening-black':  { color: '#9ca3af', glow: 'rgba(156,163,175,0.15)', gradient: 'from-slate-950/60 via-stone-950 to-stone-950' },
  'diamond':          { color: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  gradient: 'from-sky-950/40 via-stone-950 to-stone-950' },
  'gentle-care':      { color: '#34d399', glow: 'rgba(52,211,153,0.15)', gradient: 'from-emerald-950/40 via-stone-950 to-stone-950' },
  'complete-care':    { color: '#38bdf8', glow: 'rgba(56,189,248,0.15)', gradient: 'from-cyan-950/40 via-stone-950 to-stone-950' },
  'pro-care':         { color: '#2dd4bf', glow: 'rgba(45,212,191,0.15)', gradient: 'from-teal-950/40 via-stone-950 to-stone-950' },
  'vegan-b12':        { color: '#4ade80', glow: 'rgba(74,222,128,0.15)', gradient: 'from-green-950/40 via-stone-950 to-stone-950' },
  'pregnant':         { color: '#f472b6', glow: 'rgba(244,114,182,0.15)',gradient: 'from-pink-950/40 via-stone-950 to-stone-950' },
  'kids-caramel':     { color: '#fb923c', glow: 'rgba(251,146,60,0.15)', gradient: 'from-orange-950/40 via-stone-950 to-stone-950' },
  'junior-apple':     { color: '#a3e635', glow: 'rgba(163,230,53,0.15)', gradient: 'from-lime-950/40 via-stone-950 to-stone-950' },
  'brush-gold':       { color: '#d4a934', glow: 'rgba(212,169,52,0.15)', gradient: 'from-amber-950/40 via-stone-950 to-stone-950' },
  'brush-silver':     { color: '#94a3b8', glow: 'rgba(148,163,184,0.15)',gradient: 'from-slate-950/40 via-stone-950 to-stone-950' },
  'brush-medium':     { color: '#60a5fa', glow: 'rgba(96,165,250,0.15)', gradient: 'from-sky-950/40 via-stone-950 to-stone-950' },
  'brush-hard':       { color: '#64748b', glow: 'rgba(100,116,139,0.15)',gradient: 'from-slate-950/50 via-stone-950 to-stone-950' },
  'brush-sensitive':  { color: '#38bdf8', glow: 'rgba(56,189,248,0.15)', gradient: 'from-cyan-950/40 via-stone-950 to-stone-950' },
  'brush-parodontal': { color: '#4ade80', glow: 'rgba(74,222,128,0.15)', gradient: 'from-green-950/40 via-stone-950 to-stone-950' },
  'brush-kids':       { color: '#f472b6', glow: 'rgba(244,114,182,0.15)',gradient: 'from-pink-950/40 via-stone-950 to-stone-950' },
  'brush-junior':     { color: '#4ade80', glow: 'rgba(74,222,128,0.15)', gradient: 'from-green-950/40 via-stone-950 to-stone-950' },
  'mouthwash-gold':   { color: '#d4a934', glow: 'rgba(212,169,52,0.15)', gradient: 'from-amber-950/40 via-stone-950 to-stone-950' },
  'mouthwash-fresh':  { color: '#2dd4bf', glow: 'rgba(45,212,191,0.15)', gradient: 'from-teal-950/40 via-stone-950 to-stone-950' },
  'mouthwash-gum':    { color: '#34d399', glow: 'rgba(52,211,153,0.15)', gradient: 'from-emerald-950/40 via-stone-950 to-stone-950' },
};

const defaultTheme = { color: '#d4a934', glow: 'rgba(212,169,52,0.15)', gradient: 'from-amber-950/40 via-stone-950 to-stone-950' };

const categoryOrder = ['limitedEdition', 'toothpaste', 'kids', 'toothbrushes', 'mouthwash'] as const;

const buildProducts = (overrides: ProductOverride[], customs: CustomProduct[]) => {
  const merged = baseProducts
    .map(p => {
      const ov = overrides.find(o => o.id === p.id);
      if (!ov) return p;
      if (ov.hidden) return null;
      return { ...p, price: ov.price ?? p.price, badge: (ov.badge as typeof p.badge) ?? p.badge, name: ov.name ?? p.name };
    })
    .filter(Boolean) as ProductEntry[];
  const customAsProducts: ProductEntry[] = customs.map(c => ({
    id: c.id, name: c.name, categoryKey: c.categoryKey, price: c.price,
    descriptionKey: '', image: c.image,
    badge: c.badge as ProductEntry['badge'],
    isNew: c.isNew, _customDesc: c.description,
  } as ProductEntry));
  return [...merged, ...customAsProducts];
};

export const GoldShowcase = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('limitedEdition');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [overrides, setOverrides] = useState<ProductOverride[]>([]);
  const [customs, setCustoms] = useState<CustomProduct[]>([]);

  useEffect(() => {
    productService.getOverrides().then(setOverrides);
    productService.getCustomProducts().then(setCustoms);
  }, []);

  const allProducts = useMemo(() => buildProducts(overrides, customs), [overrides, customs]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof allProducts> = {};
    for (const p of allProducts) {
      (map[p.categoryKey] ??= []).push(p);
    }
    return map;
  }, [allProducts]);

  const categoryProducts = grouped[selectedCategory] || [];
  const product = categoryProducts[selectedIndex] || categoryProducts[0];
  const theme = themes[product?.id] || defaultTheme;
  const details = product ? productDetailsMap[product.id] : undefined;
  const price = product ? convertPrice(product.price, i18n.language) : 0;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedIndex(0);
  };

  const navigateProduct = (dir: 1 | -1) => {
    setSelectedIndex(i => {
      const next = i + dir;
      if (next < 0) return categoryProducts.length - 1;
      if (next >= categoryProducts.length) return 0;
      return next;
    });
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;
    const desc = (product as any)._customDesc || t(product.descriptionKey);
    addToCart({
      id: product.id,
      name: product.name,
      category: t(`categories.${product.categoryKey}`),
      price,
      description: desc,
      image: product.image,
      isNew: product.isNew,
    });
    showCartToast(t('cart.addedToCart'), product.name, product.image);
  };

  if (!product) return null;

  const desc = (product as any)._customDesc || t(product.descriptionKey);

  const modalProduct = {
    id: product.id,
    name: product.name,
    category: t(`categories.${product.categoryKey}`),
    price,
    description: desc,
    image: product.image,
    isNew: product.isNew,
  };

  return (
    <>
      <section className={`py-10 md:py-14 bg-gradient-to-br ${theme.gradient} overflow-x-clip relative`}>
        {/* Animated mesh background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-[600px] h-[600px] -top-48 -left-48 rounded-full blur-[120px] opacity-30 transition-all duration-1000"
            style={{ background: theme.color }}
          />
          <div
            className="absolute w-[400px] h-[400px] -bottom-32 -right-32 rounded-full blur-[100px] opacity-20 transition-all duration-1000"
            style={{ background: theme.color }}
          />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(${theme.color} 1px, transparent 1px), linear-gradient(90deg, ${theme.color} 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Category tabs — pill style with glass effect */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex flex-wrap justify-center gap-1 p-1 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06]">
              {categoryOrder.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`relative px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold tracking-[0.05em] md:tracking-[0.1em] uppercase transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'text-stone-900 shadow-lg'
                      : 'text-stone-500 hover:text-stone-300 hover:bg-white/[0.04]'
                  }`}
                  style={
                    selectedCategory === cat
                      ? { backgroundColor: theme.color, boxShadow: `0 4px 20px ${theme.glow}` }
                      : undefined
                  }
                >
                  {t(`categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Product selector — moved up so user can see & pick products immediately */}
          {categoryProducts.length > 1 && (
            <div className="mb-6">
              <div className="flex justify-center">
                <div className="flex items-stretch gap-1.5 md:gap-3 overflow-x-auto py-2 px-2 max-w-full">
                  {categoryProducts.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedIndex(i)}
                      className={`flex-shrink-0 flex flex-col items-center gap-1 w-16 sm:w-20 md:w-28 rounded-lg md:rounded-xl p-1.5 md:p-2 transition-all duration-300 ${
                        i === selectedIndex
                          ? 'bg-white/[0.08] scale-[1.05]'
                          : 'bg-white/[0.03] hover:bg-white/[0.06]'
                      }`}
                      style={{
                        border: `1.5px solid ${i === selectedIndex ? theme.color + '60' : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: i === selectedIndex ? `0 4px 24px ${theme.glow}` : undefined,
                      }}
                    >
                      <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-medium text-center leading-tight line-clamp-2 ${
                        i === selectedIndex ? 'text-white' : 'text-stone-500'
                      }`}>
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid lg:grid-cols-[1fr,1fr] gap-4 lg:gap-10 items-start"
            >
              {/* Left — Text & CTA */}
              <div className="order-2 lg:order-1 space-y-3">
                {/* Category + badge row */}
                <div className="flex items-center gap-3">
                  <span
                    className="px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase backdrop-blur-sm"
                    style={{
                      backgroundColor: `${theme.color}18`,
                      color: theme.color,
                      border: `1px solid ${theme.color}25`,
                    }}
                  >
                    {t(`categories.${product.categoryKey}`)}
                  </span>
                  {product.isNew && (
                    <span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase bg-white/10 text-white border border-white/10">
                      NEW
                    </span>
                  )}
                  {product.badge && (
                    <span
                      className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase"
                      style={{ backgroundColor: `${theme.color}20`, color: theme.color }}
                    >
                      {t(`badges.${product.badge}`)}
                    </span>
                  )}
                </div>

                {/* Product name — big and bold */}
                <h2 className="font-serif text-2xl md:text-4xl leading-[1.05] tracking-tight">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${theme.color}, white 50%, ${theme.color}aa)`,
                    }}
                  >
                    {product.name}
                  </span>
                </h2>

                {/* Description in a glass card */}
                <div className="p-3 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] max-w-lg">
                  <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                    {desc}
                  </p>
                </div>

                {/* Ingredients as horizontal chips */}
                {details && details.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {details.ingredients.slice(0, 4).map((ing) => (
                      <span
                        key={ing}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm"
                        style={{
                          backgroundColor: `${theme.color}10`,
                          color: theme.color,
                          border: `1px solid ${theme.color}20`,
                        }}
                      >
                        {t(`ingredients.${ing}`)}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price tag */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {t('products.currency')}{price.toFixed(0)}
                  </span>
                  <span className="text-stone-400 text-sm">/ шт</span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <motion.button
                    onClick={handleBuy}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-3 text-stone-900 font-bold rounded-xl transition-all duration-300 text-sm tracking-wide"
                    style={{
                      background: `linear-gradient(135deg, ${theme.color}, ${theme.color}cc)`,
                      boxShadow: `0 8px 32px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    }}
                  >
                    <ShoppingCart size={18} />
                    {t('products.addToCart')}
                  </motion.button>

                  <motion.button
                    onClick={() => setIsModalOpen(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-xl transition-all duration-300 backdrop-blur-sm"
                    style={{
                      color: theme.color,
                      border: `1px solid ${theme.color}30`,
                      backgroundColor: `${theme.color}08`,
                    }}
                  >
                    {t('goldShowcase.tabExtra')}
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Right — Product Image with effects */}
              <div className="order-1 lg:order-2 flex justify-center relative pt-4">
                {/* Pulsing ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.15, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-48 h-48 md:w-64 md:h-64 rounded-full transition-colors duration-700"
                    style={{ border: `2px solid ${theme.color}30` }}
                  />
                </div>
                {/* Glow orb */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-40 h-40 md:w-56 md:h-56 rounded-full blur-[80px] transition-all duration-700"
                    style={{ background: theme.glow.replace(/[\d.]+\)$/, '0.3)') }}
                  />
                </div>

                {/* Nav arrows */}
                {categoryProducts.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateProduct(-1)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => navigateProduct(1)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                <div
                  className="relative cursor-pointer group"
                  onClick={() => setIsModalOpen(true)}
                >
                  <motion.img
                    key={product.image}
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    src={product.image}
                    alt={product.name}
                    className="relative w-40 md:w-48 max-h-[220px] md:max-h-[280px] h-auto object-contain group-hover:scale-[1.06] transition-transform duration-500"
                    style={{ filter: `drop-shadow(0 20px 60px ${theme.glow})` }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom badges — glass style */}
          {details && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {details.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-3.5 py-1.5 rounded-lg text-[11px] font-medium backdrop-blur-sm"
                  style={{
                    backgroundColor: `${theme.color}08`,
                    color: `${theme.color}cc`,
                    border: `1px solid ${theme.color}15`,
                  }}
                >
                  {t(`badges.${badge}`)}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductModal
        product={modalProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
