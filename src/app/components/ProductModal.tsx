import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Product } from '../../services/database';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { t } = useTranslation();

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-8 p-8 max-h-[90vh] overflow-y-auto">
              {/* Image Section */}
              <div className="relative">
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-[#D4AF37] text-white px-3 py-1 text-xs uppercase tracking-widest font-bold z-10 rounded-full">
                    {t('products.new')}
                  </span>
                )}
                <div className="aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col">
                <button
                  onClick={onClose}
                  className="self-end text-stone-400 hover:text-stone-900 transition-colors mb-4"
                >
                  <X size={24} />
                </button>

                <div className="flex-1">
                  <p className="text-sm text-stone-500 uppercase tracking-wide mb-2">
                    {product.category}
                  </p>
                  <h2 className="font-serif text-3xl text-stone-900 mb-4">
                    {product.name}
                  </h2>
                  
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold text-stone-900">
                      {t('products.currency')}{product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-stone-500">{t('products.currencyCode')}</span>
                  </div>

                  {product.description && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-2">
                        {t('products.description')}
                      </h3>
                      <p className="text-stone-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-stone-200 pt-6 mb-6">
                    <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-3">
                      {t('products.features')}
                    </h3>
                    <ul className="space-y-2 text-sm text-stone-600">
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] mt-1">✓</span>
                        <span>{t('products.feature1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] mt-1">✓</span>
                        <span>{t('products.feature2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] mt-1">✓</span>
                        <span>{t('products.feature3')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] mt-1">✓</span>
                        <span>{t('products.feature4')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="border-t border-stone-200 pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-semibold text-stone-900 uppercase tracking-wide">
                      {t('products.quantity')}:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={decrementQuantity}
                        className="w-10 h-10 flex items-center justify-center border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="w-10 h-10 flex items-center justify-center border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#D4AF37] text-white py-4 rounded-lg font-semibold uppercase tracking-wide hover:bg-[#C4A037] transition-colors flex items-center justify-center gap-2 group"
                  >
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                    {t('products.addToCart')}
                  </button>

                  <p className="text-xs text-stone-500 text-center mt-4">
                    {t('products.freeDelivery')} {t('products.currency')}1000
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
