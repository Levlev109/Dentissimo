import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ShoppingBag size={20} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-white dark:bg-stone-900 shadow-2xl z-[60] flex flex-col"
              style={{ height: '100dvh' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 flex-shrink-0">
                <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">
                  {t('cart.title')} ({itemCount})
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag size={64} className="text-stone-300 mb-4" />
                    <p className="text-stone-500 mb-4">{t('cart.empty')}</p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-3 bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                    >
                      {t('cart.continueShopping')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-contain bg-white rounded p-1 flex-shrink-0 border border-stone-100"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-stone-900 mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-stone-500 mb-2">
                            {t('products.currency')}{item.product.price.toFixed(2)} × {item.quantity} = {t('products.currency')}{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-white border border-stone-300 hover:bg-stone-100 transition-colors rounded"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-white border border-stone-300 hover:bg-stone-100 transition-colors rounded"
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="ml-auto text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-stone-200 px-5 py-4 flex-shrink-0">
                  <div className="flex justify-between items-center text-lg font-bold mb-3">
                    <span>{t('cart.total')}:</span>
                    <span>{t('products.currency')}{total.toFixed(2)}</span>
                  </div>
                  <button
                    className="block w-full py-3 bg-[#D4AF37] text-white text-center font-semibold hover:bg-[#C4A037] transition-colors rounded-lg uppercase tracking-wide"
                    onClick={() => { setIsOpen(false); navigate('/checkout'); }}
                  >
                    {t('cart.checkout')}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
