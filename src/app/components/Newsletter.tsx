import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

export const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setLoading(true);
    
    // Save email to localStorage
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    }, 800);
  };

  return (
    <div className="bg-gradient-to-r from-[#D4AF37]/10 via-amber-50/30 to-white dark:from-amber-950/15 dark:via-stone-850 dark:to-stone-900 py-12 border-t border-stone-100/40 dark:border-amber-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block p-3 bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 rounded-full mb-4">
            <Mail className="text-[#D4AF37]" size={32} />
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 dark:text-white mb-2">
            {t('newsletter.title')}
          </h3>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            {t('newsletter.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              className="flex-1 px-5 py-3 border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
              disabled={loading || subscribed}
            />
            <button
              type="submit"
              disabled={loading || subscribed}
              className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white font-semibold rounded-lg hover:from-[#C4A037] hover:to-[#A8860B] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.span
                    key="success"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={18} />
                    {t('newsletter.success')}
                  </motion.span>
                ) : (
                  <span key="subscribe">{t('newsletter.subscribe')}</span>
                )}
              </AnimatePresence>
            </button>
          </form>

          <p className="text-xs text-stone-500 dark:text-stone-400 mt-4">
            {t('newsletter.discount')}
          </p>
        </div>
      </div>
    </div>
  );
};
