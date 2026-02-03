import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { Product } from '../../services/database';
import { ProductModal } from './ProductModal';

interface ProductProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductProps) => {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="group relative cursor-pointer" onClick={handleCardClick}>
        <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden mb-4">
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-white px-2 py-1 text-[10px] uppercase tracking-widest font-bold text-stone-900 z-10">
              {t('products.new')}
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 bg-white text-stone-900 w-10 h-10 flex items-center justify-center rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            aria-label={t('products.addToCart')}
          >
            <Plus size={20} />
          </motion.button>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">{product.category}</p>
          <h3 className="font-serif text-lg text-stone-900 mb-1 group-hover:text-[#D4AF37] transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-stone-500 mb-2 line-clamp-2">{product.description}</p>
          )}
          <p className="text-stone-600 font-medium">{t('products.currency')}{product.price.toFixed(2)}</p>
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
