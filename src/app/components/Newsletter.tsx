import { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';
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
    <section className="py-20 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_-20%,rgba(20,184,166,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_80%_100%,rgba(20,184,166,0.06),transparent)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
            <Sparkles size={14} className="text-teal-400" />
            <span className="text-teal-300 text-xs font-bold tracking-wider uppercase">
              {t('newsletter.discount', '10% off your first order')}
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            {t('newsletter.title')}
          </h3>
          <p className="text-stone-300 mb-8 text-lg">
            {t('newsletter.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              className="flex-1 px-5 py-4 border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder-stone-500 focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-300"
              disabled={loading || subscribed}
            />
            <button
              type="submit"
              disabled={loading || subscribed}
              className="px-8 py-4 bg-teal-500 text-white font-bold hover:bg-teal-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-400/30 hover:scale-105 transform flex items-center justify-center gap-2 whitespace-nowrap"
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
        </motion.div>
      </div>
    </section>
  );
};
