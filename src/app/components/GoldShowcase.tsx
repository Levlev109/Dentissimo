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
      <section className={`py-10 md:py-20 bg-gradient-to-b from-stone-950 via-stone-950 to-stone-950 overflow-x-clip relative`}>
        {/* Top gradient fade from Hero */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-stone-950 to-transparent z-[1]" />
        {/* Animated mesh background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-[800px] h-[800px] -top-64 -left-64 rounded-full blur-[160px] opacity-20 transition-all duration-[1500ms]"
            style={{ background: theme.color }}
          />
          <div
            className="absolute w-[500px] h-[500px] -bottom-48 -right-48 rounded-full blur-[130px] opacity-15 transition-all duration-[1500ms]"
            style={{ background: theme.color }}
          />
          {/* Center ambient glow */}
          <div
            className="absolute w-[600px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[200px] opacity-[0.06] transition-all duration-[1500ms]"
            style={{ background: theme.color }}
          />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(${theme.color} 1px, transparent 1px), linear-gradient(90deg, ${theme.color} 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />
        </div>
        {/* Bottom gradient fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-stone-950 to-transparent z-[1]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Category tabs — pill style with glass effect */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex flex-wrap justify-center gap-1 p-1.5 bg-white/[0.03] backdrop-blur-sm border border-white/[0.05]">
              {categoryOrder.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`relative px-3 py-2 md:px-6 md:py-3 text-[10px] md:text-sm font-bold tracking-[0.05em] md:tracking-[0.1em] uppercase transition-all duration-300 ${
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
                      className={`flex-shrink-0 flex flex-col items-center gap-1 w-16 sm:w-20 md:w-28 p-1.5 md:p-2 transition-all duration-300 ${
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
                      <span className={`text-[9px] sm:text-[10px] md:text-xs font-medium text-center leading-tight line-clamp-2 ${
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
              className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12"
            >
              {/* Left — Text & CTA */}
              <div className="order-2 lg:order-1 lg:w-1/2 space-y-3 lg:space-y-5 lg:flex-shrink-0">
                {/* Category + badge row */}
                <div className="flex items-center gap-3">
                  <span
                    className="px-4 py-1.5 text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm"
                    style={{
                      backgroundColor: `${theme.color}18`,
                      color: theme.color,
                      border: `1px solid ${theme.color}25`,
                    }}
                  >
                    {t(`categories.${product.categoryKey}`)}
                  </span>
                  {product.isNew && (
                    <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-white/10 text-white border border-white/10">
                      NEW
                    </span>
                  )}
                  {product.badge && (
                    <span
                      className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase"
                      style={{ backgroundColor: `${theme.color}20`, color: theme.color }}
                    >
                      {t(`badges.${product.badge}`)}
                    </span>
                  )}
                </div>

                {/* Product name — big and bold */}
                <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight">
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
                <div className="p-5 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
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
                        className="px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium backdrop-blur-sm"
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
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
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
                    className="flex items-center gap-2 px-6 py-3 lg:px-8 lg:py-4 text-stone-900 font-bold transition-all duration-300 text-sm lg:text-base tracking-wide"
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
                    className="flex items-center gap-2 px-5 py-3 lg:px-7 lg:py-4 font-semibold text-sm lg:text-base transition-all duration-300 backdrop-blur-sm"
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
              <div className="order-1 lg:order-2 lg:w-1/2 flex justify-center items-center relative min-h-[220px] lg:min-h-[500px]">
                {/* Rotating halo rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="w-52 h-52 md:w-72 md:h-72 lg:w-96 lg:h-96"
                  >
                    <svg viewBox="0 0 200 200" className="w-full h-full transition-colors duration-700">
                      <circle cx="100" cy="100" r="95" fill="none" stroke={theme.color} strokeWidth="0.5" strokeDasharray="40 160" opacity="0.25" />
                      <circle cx="100" cy="100" r="85" fill="none" stroke={theme.color} strokeWidth="0.3" strokeDasharray="20 180" opacity="0.15" />
                    </svg>
                  </motion.div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                    className="w-60 h-60 md:w-80 md:h-80 lg:w-[440px] lg:h-[440px]"
                  >
                    <svg viewBox="0 0 200 200" className="w-full h-full transition-colors duration-700">
                      <circle cx="100" cy="100" r="95" fill="none" stroke={theme.color} strokeWidth="0.3" strokeDasharray="15 185" opacity="0.12" />
                    </svg>
                  </motion.div>
                </div>

                {/* Glow orb */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-full blur-[80px] transition-all duration-700"
                    style={{ background: theme.glow.replace(/[\d.]+\)$/, '0.3)') }}
                  />
                </div>

                {/* Geometric accent dots */}
                <motion.div
                  className="absolute w-1.5 h-1.5 rounded-full transition-colors duration-700"
                  style={{ background: theme.color, top: '15%', right: '20%', opacity: 0.3 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute w-1 h-1 rounded-full transition-colors duration-700"
                  style={{ background: theme.color, bottom: '20%', left: '15%', opacity: 0.2 }}
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />

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
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    src={product.image}
                    alt={product.name}
                    className="relative w-40 md:w-48 lg:w-auto max-h-[220px] md:max-h-[280px] lg:max-h-none lg:h-[450px] object-contain group-hover:scale-[1.04] transition-transform duration-700"
                    style={{ filter: `drop-shadow(0 20px 60px ${theme.glow})` }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom badges — glass style */}
          {details && (
            <div className="flex flex-wrap justify-center gap-2 lg:gap-3 mt-8 lg:mt-12">
              {details.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-3.5 py-1.5 lg:px-5 lg:py-2 text-[11px] lg:text-sm font-medium backdrop-blur-sm"
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
