import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [usePhone, setUsePhone] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      usePhone ? undefined : formData.email,
      usePhone ? formData.phone : undefined,
      formData.firstName,
      formData.lastName
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-2xl z-50 p-8"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-600"
            >
              <X size={24} />
            </button>

            <h2 className="font-serif text-3xl text-stone-900 mb-2">
              {t('auth.welcome')}
            </h2>
            <p className="text-stone-500 mb-6">{t('auth.loginToContinue')}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t('auth.firstName')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                  placeholder={t('auth.firstName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t('auth.lastName')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                  placeholder={t('auth.lastName')}
                />
              </div>

              {!usePhone ? (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t('auth.email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                    placeholder={t('auth.emailPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setUsePhone(true)}
                    className="text-sm text-[#D4AF37] hover:underline mt-2"
                  >
                    {t('auth.orUsePhone')}
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t('auth.phoneOrEmail')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                    placeholder={t('auth.phonePlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setUsePhone(false)}
                    className="text-sm text-[#D4AF37] hover:underline mt-2"
                  >
                    {t('auth.orUseEmail')}
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors rounded-lg"
              >
                {t('auth.submit')}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
