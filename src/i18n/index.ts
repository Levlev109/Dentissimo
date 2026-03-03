import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

// Detect user's language from browser or geolocation
const detectUserLanguage = (): string => {
  // First check localStorage
  const savedLang = localStorage.getItem('dentissimo_language');
  if (savedLang) return savedLang;

  // Then check browser language
  const browserLang = navigator.language.split('-')[0];
  
  // Supported languages
  const supportedLangs = ['uk', 'en', 'de', 'fr', 'es', 'it', 'pl'];
  
  return supportedLangs.includes(browserLang) ? browserLang : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: detectUserLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
