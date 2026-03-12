import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'dentissimo_cookie_consent';

export const CookieConsent = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-stone-900 border border-white/10 rounded-xl p-4 md:p-6 shadow-2xl backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <Cookie size={24} className="text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-stone-300 leading-relaxed">
              {t('cookieConsent.message')}{' '}
              <Link
                to="/cookie-policy"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
              >
                {t('cookieConsent.learnMore')}
              </Link>
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={accept}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {t('cookieConsent.accept')}
              </button>
              <button
                onClick={decline}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 text-sm font-medium rounded-lg transition-colors"
              >
                {t('cookieConsent.decline')}
              </button>
            </div>
          </div>
          <button
            onClick={decline}
            className="text-stone-500 hover:text-stone-300 transition-colors shrink-0"
            aria-label={t('common.close')}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
