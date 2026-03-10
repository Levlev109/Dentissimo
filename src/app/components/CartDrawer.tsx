import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../services/currency';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative text-stone-300 hover:text-white transition-all duration-300 hover:scale-110"
      >
        <ShoppingBag size={22} strokeWidth={1.8} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-br from-stone-800 to-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg border border-white/20 animate-pulse">
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
              className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-stone-900 shadow-2xl z-[60] flex flex-col"
              style={{ height: '100dvh' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone-700 flex-shrink-0">
                <h2 className="text-xl font-serif font-bold text-white">
                  {t('cart.title')} ({itemCount})
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag size={64} className="text-stone-600 mb-4" />
                    <p className="text-stone-400 mb-4">{t('cart.empty')}</p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-3 bg-stone-800 border border-stone-600 text-white hover:bg-stone-700 transition-colors"
                    >
                      {t('cart.continueShopping')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-4 bg-stone-800 border border-stone-700"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-contain bg-stone-900 p-1 flex-shrink-0 border border-stone-700"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-white mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-stone-400 mb-2">
                            {t('products.currency')}{formatPrice(item.product.price, i18n.language)} × {item.quantity} = {t('products.currency')}{formatPrice(item.product.price * item.quantity, i18n.language)}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-9 h-9 flex items-center justify-center bg-stone-700 border border-stone-600 text-white hover:bg-stone-600 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-medium text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-9 h-9 flex items-center justify-center bg-stone-700 border border-stone-600 text-white hover:bg-stone-600 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="ml-auto p-2 text-red-600 hover:text-red-700 hover:bg-red-900/20 transition-colors"
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
                <div className="border-t border-stone-700 px-5 py-4 flex-shrink-0">
                  <div className="flex justify-between items-center text-lg font-bold mb-3 text-white">
                    <span>{t('cart.total')}:</span>
                    <span>{t('products.currency')}{formatPrice(total, i18n.language)}</span>
                  </div>
                  <button
                    className="group relative block w-full py-4 text-white text-center font-semibold uppercase tracking-widest overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 shadow-[0_6px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.01]"
                    onClick={() => { setIsOpen(false); navigate('/checkout'); }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10">{t('cart.checkout')}</span>
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
