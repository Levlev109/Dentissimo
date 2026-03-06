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
  bestseller: { icon: TrendingUp, labelKey: 'badges.bestseller', color: 'bg-stone-900' },
  recommended: { icon: Star, labelKey: 'badges.recommended', color: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
  topSales: { icon: Flame, labelKey: 'badges.topSales', color: 'bg-gradient-to-r from-red-500 to-rose-500' },
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
      <div className="group relative cursor-pointer h-full" onClick={handleCardClick}>
        <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-sky-200/30 transition-all duration-500 bg-white border border-stone-200/60 hover:border-sky-300/50 transform hover:-translate-y-2 flex flex-col h-full">
          {/* Premium gold accent bar with animation */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Image area with enhanced gradient */}
          <div className="relative aspect-[3/4] bg-gradient-to-br from-white via-stone-50/20 to-white dark:from-stone-950/20 dark:via-stone-900 dark:to-stone-950 overflow-hidden group-hover:from-stone-50/30 group-hover:to-stone-50/20 dark:group-hover:from-stone-900/40 dark:group-hover:to-stone-900 transition-colors duration-500">
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.isNew && (
                <span className="bg-stone-900 text-white px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-transform duration-300">
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
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-stone-900 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-2xl shadow-stone-900/30 opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 border-2 border-white/30 backdrop-blur-sm hover:bg-stone-800"
              aria-label={t('products.addToCart')}
            >
              <Plus size={22} strokeWidth={3} />
            </motion.button>
          </div>

          {/* Product info */}
          <div className="p-3 md:p-6 text-center border-t border-stone-200/30 dark:border-stone-800/20 bg-white dark:bg-stone-900 flex flex-col flex-1 justify-between">
            <div>
              <p className="text-[10px] md:text-[11px] text-stone-600 dark:text-stone-400 uppercase tracking-widest mb-1 md:mb-2 font-bold">{product.category}</p>
              <h3 className="font-serif text-sm md:text-lg text-stone-900 dark:text-white mb-1 md:mb-2 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors duration-300 leading-tight">
                {product.name}
              </h3>
              {product.description && (
                <p className="hidden md:block text-xs text-stone-500 dark:text-stone-400 mb-3 line-clamp-3 leading-relaxed min-h-[3.75rem]">{product.description}</p>
              )}
            </div>
            <p className="text-stone-900 dark:text-white font-bold text-sm md:text-lg mt-1 md:mt-0">{t('products.currency')}{product.price.toFixed(2)}</p>
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
