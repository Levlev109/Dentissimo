import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

const SUPPORTED_LANGS = ['uk', 'en'];

// Map country codes to our supported languages
const countryToLang: Record<string, string> = {
  UA: 'uk',
  GB: 'en', US: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en',
};

// Detect language from browser settings (immediate, synchronous)
const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0];
  // Map 'ua' to 'uk' (Ukrainian language code)
  if (browserLang === 'ua') return 'uk';
  return SUPPORTED_LANGS.includes(browserLang) ? browserLang : 'en';
};

// Detect language from IP geolocation (async, updates after load)
const detectLanguageByIP = async (): Promise<string | null> => {
  try {
    // Try multiple free geolocation APIs with fallback
    const apis = [
      { url: 'https://ipapi.co/json/', getCountry: (d: any) => d.country_code },
      { url: 'https://ip-api.com/json/?fields=countryCode', getCountry: (d: any) => d.countryCode },
    ];

    for (const api of apis) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(api.url, { signal: controller.signal });
        clearTimeout(timeout);
        
        if (res.ok) {
          const data = await res.json();
          const country = api.getCountry(data);
          if (country && countryToLang[country]) {
            return countryToLang[country];
          }
          // Country detected but not in our map — use English
          return 'en';
        }
      } catch {
        continue; // Try next API
      }
    }
  } catch {
    // Geolocation failed entirely — no change
  }
  return null;
};

// Initial language: localStorage > browser language
const getInitialLanguage = (): string => {
  const savedLang = localStorage.getItem('dentissimo_language');
  if (savedLang && SUPPORTED_LANGS.includes(savedLang)) return savedLang;
  return detectBrowserLanguage();
};

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// After init: if user hasn't explicitly chosen a language, try IP geolocation
if (!localStorage.getItem('dentissimo_language')) {
  detectLanguageByIP().then((lang) => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
      // Don't save to localStorage — let geolocation run each time until user picks manually
    }
  });
}

export default i18n;
