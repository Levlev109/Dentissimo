import { Plus, TrendingUp, Star, Flame, Leaf, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../services/currency';
import { Product } from '../../services/database';
import { ProductModal } from './ProductModal';
import { showCartToast } from './Toast';

interface ProductProps {
  product: Product;
}

const badgeConfig = {
  bestseller: { icon: TrendingUp, labelKey: 'badges.bestseller', color: 'bg-stone-900' },
  recommended: { icon: Star, labelKey: 'badges.recommended', color: 'bg-teal-600' },
  topSales: { icon: Flame, labelKey: 'badges.topSales', color: 'bg-teal-700' },
  eco: { icon: Leaf, labelKey: 'badges.eco', color: 'bg-teal-600' },
};

const cardAccents: Record<string, string> = {
  'whitening-gold': '#b8942b', 'whitening-black': '#444', 'diamond': '#1a8a7a',
  'gentle-care': '#1a8a5a', 'complete-care': '#1a8a7a', 'pro-care': '#1a8a7a',
  'vegan-b12': '#2a7a40', 'pregnant': '#c0508a', 'kids-caramel': '#c07030',
  'junior-apple': '#6a9020', 'brush-gold': '#b8942b', 'brush-silver': '#6a7585',
  'brush-medium': '#1a8a7a', 'brush-hard': '#4a5565', 'brush-sensitive': '#1a8a7a',
  'brush-parodontal': '#2a7a40', 'brush-kids': '#c0508a', 'brush-junior': '#2a7a40',
  'mouthwash-gold': '#b8942b', 'mouthwash-fresh': '#1a8a7a', 'mouthwash-gum': '#1a8a5a',
};

export const ProductCard = ({ product }: ProductProps) => {
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showCartToast(t('cart.addedToCart'), product.name, product.image);
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const accent = cardAccents[product.id] || '#1a8a7a';

  return (
    <>
      <div className="group relative cursor-pointer h-full" onClick={handleCardClick}>
        <div className="overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] transform hover:-translate-y-1 flex flex-col h-full">

          {/* Image area */}
          <div className="relative aspect-[3/4] bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden">
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.isNew && (
                <span className="bg-white text-stone-900 px-3 py-1 text-[10px] uppercase tracking-widest font-bold shadow-md">
                  {t('products.new')}
                </span>
              )}
              {product.badge && badgeConfig[product.badge] && (
                <span className={`${badgeConfig[product.badge].color} text-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold shadow-md flex items-center gap-1`}>
                  {(() => {
                    const Icon = badgeConfig[product.badge!].icon;
                    return <Icon size={12} />;
                  })()}
                  {t(badgeConfig[product.badge].labelKey)}
                </span>
              )}
            </div>

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
              style={{ imageRendering: 'auto' }}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-11 h-11 flex items-center justify-center opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 bg-white text-stone-900 shadow-lg hover:bg-stone-200"
              aria-label={t('products.addToCart')}
            >
              <Plus size={20} strokeWidth={2.5} />
            </motion.button>

            {/* Trust badge */}
            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex items-center gap-1.5 px-2 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: accent }}>
                <ShieldCheck size={11} color="#fff" strokeWidth={2.2} />
              </div>
              <span className="text-[9px] font-semibold text-white tracking-wide uppercase whitespace-nowrap">Swiss Quality</span>
            </div>
          </div>

          {/* Product info */}
          <div className="p-4 md:p-5 border-t border-white/[0.05] flex flex-col flex-1 justify-between">
            <div>
              <p className="text-[10px] md:text-[11px] text-stone-400 uppercase tracking-[0.2em] mb-1.5 font-semibold">{product.category}</p>
              <h3 className="font-serif text-sm md:text-lg text-white mb-1 md:mb-2 leading-tight">
                {product.name}
              </h3>
              {product.description && (
                <p className="hidden md:block text-sm text-stone-400 mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
              )}
            </div>
            <p className="text-white font-bold text-sm md:text-lg mt-1 md:mt-0">{t('products.currency')}{formatPrice(product.price, i18n.language)}</p>
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
