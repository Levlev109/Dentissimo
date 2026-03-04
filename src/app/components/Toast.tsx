import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShoppingBag } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  productName?: string;
  productImage?: string;
}

let toastId = 0;
const listeners: Array<(toast: Toast) => void> = [];

// Global function to show toast from anywhere
export const showCartToast = (message: string, productName?: string, productImage?: string) => {
  const toast: Toast = { id: ++toastId, message, productName, productImage };
  listeners.forEach(fn => fn(toast));
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Toast) => {
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 2500);
  }, []);

  useEffect(() => {
    listeners.push(addToast);
    return () => {
      const idx = listeners.indexOf(addToast);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, [addToast]);

  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="pointer-events-auto bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-100 dark:border-stone-700 p-4 flex items-center gap-3 min-w-[280px] max-w-[360px]"
          >
            {toast.productImage ? (
              <img src={toast.productImage} alt="" className="w-12 h-12 object-contain bg-stone-50 rounded-lg p-1" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={18} className="text-green-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {toast.productName && (
                <p className="text-sm font-semibold text-stone-900 truncate">{toast.productName}</p>
              )}
              <p className="text-xs text-stone-500 flex items-center gap-1">
                <Check size={12} className="text-green-600" />
                {toast.message}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
