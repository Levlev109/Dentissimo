import { Plus, TrendingUp, Star, Flame, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { Product } from '../../services/database';
import { ProductModal } from './ProductModal';
import { showCartToast } from './Toast';

interface ProductProps {
  product: Product;
}

const badgeConfig = {
  bestseller: { icon: TrendingUp, labelKey: 'badges.bestseller', color: 'bg-gradient-to-r from-amber-500 to-yellow-500' },
  recommended: { icon: Star, labelKey: 'badges.recommended', color: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
  topSales: { icon: Flame, labelKey: 'badges.topSales', color: 'bg-gradient-to-r from-red-500 to-orange-500' },
  eco: { icon: Leaf, labelKey: 'badges.eco', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
};

export const ProductCard = ({ product }: ProductProps) => {
  const { addToCart } = useCart();
  const { t } = useTranslation();
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

  return (
    <>
      <div className="group relative cursor-pointer" onClick={handleCardClick}>
        <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-500 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-700/40 hover:border-[#D4AF37]/30 dark:hover:border-[#D4AF37]/30 transform hover:-translate-y-2">
          {/* Premium gold accent bar with animation */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Image area with enhanced gradient */}
          <div className="relative aspect-[3/4] bg-gradient-to-br from-white via-amber-50/30 to-stone-50/20 dark:from-amber-950/20 dark:via-stone-900 dark:to-stone-950 overflow-hidden group-hover:from-amber-50/40 group-hover:to-amber-50/30 dark:group-hover:from-amber-900/30 dark:group-hover:to-stone-900 transition-colors duration-500">
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.isNew && (
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-transform duration-300">
                  {t('products.new')}
                </span>
              )}
              {product.badge && badgeConfig[product.badge] && (
                <span className={`${badgeConfig[product.badge].color} text-white px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-transform duration-300 flex items-center gap-1`}>
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
              className="w-full h-full object-contain p-6 transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 filter group-hover:drop-shadow-2xl"
              style={{ imageRendering: 'auto' }}
            />
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="absolute bottom-4 right-4 bg-gradient-to-br from-[#D4AF37] via-[#C4A037] to-[#B8960C] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-2xl shadow-[#D4AF37]/50 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 border-2 border-white/30 backdrop-blur-sm hover:shadow-xl hover:shadow-[#D4AF37]/70"
              aria-label={t('products.addToCart')}
            >
              <Plus size={22} strokeWidth={3} />
            </motion.button>
          </div>

          {/* Product info */}
          <div className="p-6 text-center border-t border-amber-100/40 dark:border-amber-900/20 bg-gradient-to-b from-white via-stone-50/20 to-white dark:from-stone-900 dark:via-stone-900/50 dark:to-stone-900">
            <p className="text-[11px] text-[#D4AF37] dark:text-[#D4AF37] uppercase tracking-widest mb-2 font-bold">{product.category}</p>
            <h3 className="font-serif text-lg text-stone-900 dark:text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
            )}
            <p className="text-stone-900 dark:text-white font-bold text-lg bg-gradient-to-r from-[#D4AF37] to-[#B8960C] bg-clip-text text-transparent group-hover:from-[#C4A037] group-hover:to-[#A8860C] transition-all duration-300">{t('products.currency')}{product.price.toFixed(2)}</p>
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
