import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { convertPrice } from '../../services/currency';
import { showCartToast } from './Toast';
import { ProductModal } from './ProductModal';
import { allProducts } from '../../data/allProducts';
import { productDetailsMap } from './productData';

const themes: Record<string, { color: string; glow: string }> = {
  'whitening-gold': { color: '#d4a934', glow: 'rgba(212,169,52,0.15)' },
  'whitening-black': { color: '#9ca3af', glow: 'rgba(156,163,175,0.12)' },
  'diamond': { color: '#60a5fa', glow: 'rgba(96,165,250,0.12)' },
  'gentle-care': { color: '#34d399', glow: 'rgba(52,211,153,0.12)' },
  'complete-care': { color: '#38bdf8', glow: 'rgba(56,189,248,0.12)' },
  'pro-care': { color: '#2dd4bf', glow: 'rgba(45,212,191,0.12)' },
  'vegan-b12': { color: '#4ade80', glow: 'rgba(74,222,128,0.12)' },
  'pregnant': { color: '#f472b6', glow: 'rgba(244,114,182,0.12)' },
  'kids-caramel': { color: '#fb923c', glow: 'rgba(251,146,60,0.12)' },
  'junior-apple': { color: '#a3e635', glow: 'rgba(163,230,53,0.12)' },
  'brush-gold': { color: '#d4a934', glow: 'rgba(212,169,52,0.12)' },
  'brush-silver': { color: '#94a3b8', glow: 'rgba(148,163,184,0.12)' },
  'brush-medium': { color: '#60a5fa', glow: 'rgba(96,165,250,0.12)' },
  'brush-hard': { color: '#64748b', glow: 'rgba(100,116,139,0.12)' },
  'brush-sensitive': { color: '#38bdf8', glow: 'rgba(56,189,248,0.12)' },
  'brush-parodontal': { color: '#4ade80', glow: 'rgba(74,222,128,0.12)' },
  'brush-kids': { color: '#f472b6', glow: 'rgba(244,114,182,0.12)' },
  'brush-junior': { color: '#4ade80', glow: 'rgba(74,222,128,0.12)' },
  'mouthwash-gold': { color: '#d4a934', glow: 'rgba(212,169,52,0.12)' },
  'mouthwash-fresh': { color: '#2dd4bf', glow: 'rgba(45,212,191,0.12)' },
  'mouthwash-gum': { color: '#34d399', glow: 'rgba(52,211,153,0.12)' },
};

const defaultTheme = { color: '#d4a934', glow: 'rgba(212,169,52,0.12)' };

const categoryOrder = ['limitedEdition', 'toothpaste', 'kids', 'toothbrushes', 'mouthwash'] as const;

export const GoldShowcase = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('limitedEdition');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const grouped = useMemo(() => {
    const map: Record<string, typeof allProducts> = {};
    for (const p of allProducts) {
      (map[p.categoryKey] ??= []).push(p);
    }
    return map;
  }, []);

  const categoryProducts = grouped[selectedCategory] || [];
  const product = categoryProducts[selectedIndex] || categoryProducts[0];
  const theme = themes[product?.id] || defaultTheme;
  const details = product ? productDetailsMap[product.id] : undefined;
  const price = product ? convertPrice(product.price, i18n.language) : 0;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedIndex(0);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      category: t(`categories.${product.categoryKey}`),
      price,
      description: t(product.descriptionKey),
      image: product.image,
      isNew: product.isNew,
    });
    showCartToast(t('cart.addedToCart'), product.name, product.image);
  };

  if (!product) return null;

  const modalProduct = {
    id: product.id,
    name: product.name,
    category: t(`categories.${product.categoryKey}`),
    price,
    description: t(product.descriptionKey),
    image: product.image,
    isNew: product.isNew,
  };

  return (
    <>
      <section className="py-16 md:py-24 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 overflow-x-clip relative">
        {/* Dynamic ambient glow */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 30% 50%, ${theme.glow}, transparent)`,
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse 40% 60% at 80% 30%, ${theme.glow.replace(/[\d.]+\)$/, m => `${parseFloat(m) * 0.5})`)}, transparent)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categoryOrder.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'text-stone-900'
                    : 'text-stone-400 border border-white/10 hover:border-white/20 hover:text-stone-300'
                }`}
                style={
                  selectedCategory === cat
                    ? { backgroundColor: theme.color }
                    : undefined
                }
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>

          {/* Main content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              {/* Left — Text & CTA */}
              <div className="order-2 lg:order-1">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-6"
                  style={{
                    backgroundColor: `${theme.color}15`,
                    color: theme.color,
                    border: `1px solid ${theme.color}30`,
                  }}
                >
                  {t(`categories.${product.categoryKey}`)}
                </span>

                <h2 className="font-serif text-3xl md:text-5xl leading-[1.1] mb-4">
                  <span
                    style={{
                      backgroundImage: `linear-gradient(to right, ${theme.color}, ${theme.color}cc)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {product.name}
                  </span>
                </h2>

                <p className="text-stone-400 text-base md:text-lg mb-8 max-w-md leading-relaxed">
                  {t(product.descriptionKey)}
                </p>

                {/* Top ingredients preview */}
                {details && details.ingredients.length > 0 && (
                  <div className="space-y-2.5 mb-8">
                    {details.ingredients.slice(0, 3).map((ing) => (
                      <div key={ing} className="flex items-center gap-3">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: theme.color }}
                        />
                        <p className="text-white/80 text-sm font-medium">
                          {t(`ingredients.${ing}`)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={handleBuy}
                    className="flex items-center gap-3 px-7 py-3 text-stone-900 font-bold rounded-full transition-all duration-300 text-sm tracking-wide hover:brightness-110"
                    style={{
                      background: `linear-gradient(to right, ${theme.color}, ${theme.color}dd)`,
                      boxShadow: `0 0 30px ${theme.glow}`,
                    }}
                  >
                    <ShoppingCart size={18} />
                    {t('products.addToCart')} — {t('products.currency')}{price.toFixed(0)}
                  </button>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-full transition-all duration-300 hover:brightness-125"
                    style={{
                      color: theme.color,
                      border: `1px solid ${theme.color}40`,
                    }}
                  >
                    {t('goldShowcase.tabExtra')}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Right — Product Image */}
              <div className="order-1 lg:order-2 flex justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-72 h-72 md:w-96 md:h-96 rounded-full blur-2xl transition-all duration-700"
                    style={{
                      background: `radial-gradient(circle, ${theme.glow}, transparent)`,
                    }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-56 h-56 md:w-72 md:h-72 rounded-full transition-all duration-700"
                    style={{ border: `1px solid ${theme.color}20` }}
                  />
                </div>

                <div
                  className="relative cursor-pointer group"
                  onClick={() => setIsModalOpen(true)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative w-56 md:w-72 max-h-[340px] md:max-h-[420px] h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    style={{ filter: `drop-shadow(0 0 40px ${theme.glow})` }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Product selector thumbnails */}
          <div className="mt-14 flex justify-center">
            <div className="flex items-center gap-4 md:gap-5 overflow-x-auto py-4 px-4 max-w-full scrollbar-thin">
              {categoryProducts.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedIndex(i)}
                  className={`flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl p-3 md:p-4 transition-all duration-300 ${
                    i === selectedIndex
                      ? 'bg-white/10 scale-[1.08] shadow-lg'
                      : 'bg-white/5 hover:bg-white/[0.08] hover:scale-[1.04]'
                  }`}
                  style={{
                    border: `2px solid ${i === selectedIndex ? theme.color : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: i === selectedIndex ? `0 4px 20px ${theme.glow}` : undefined,
                  }}
                  title={p.name}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Bottom badges */}
          {details && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {details.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full bg-white/5 text-stone-400 text-xs font-medium border border-white/10 tracking-wide"
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
