import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

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
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-stone-200">
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  {t('cart.title')}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
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
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-4 bg-stone-50 rounded-lg"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-stone-900 mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-stone-500 mb-2">
                            €{item.product.price.toFixed(2)}
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
                <div className="border-t border-stone-200 p-6 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{t('cart.total')}:</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <a
                    href="/checkout"
                    className="block w-full py-4 bg-stone-900 text-white text-center font-medium hover:bg-stone-800 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('cart.checkout')}
                  </a>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
