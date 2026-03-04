import { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, Search, User, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CartDrawer } from './CartDrawer';
import { AuthModal } from './AuthModal';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const langRef = useRef<HTMLDivElement>(null);

  // Close language menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    if (showLangMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showLangMenu]);

  const languages = [
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('dentissimo_language', code);
    setShowLangMenu(false);
  };

  const navLinks = [
    { name: t('nav.products'), href: '#products' },
    { name: t('nav.limitedEdition'), href: '#limited' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.contacts'), href: '#contacts' },
  ];

  return (
    <>
    <nav className="fixed w-full z-50 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-800 dark:text-stone-200 hover:text-stone-600 dark:hover:text-stone-400 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center md:justify-start w-full md:w-auto absolute md:relative pointer-events-none md:pointer-events-auto">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-serif text-2xl font-bold tracking-wider text-stone-900 dark:text-white pointer-events-auto">
              DENTISSIMO
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors tracking-wide uppercase"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <a href="#products" className="hidden md:block text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors">
              <Search size={20} />
            </a>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                <Globe size={18} />
                <span className="text-xs font-medium">{currentLang.flag}</span>
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-stone-900 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 py-2 w-48 z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLang(lang.code)}
                      className={`w-full px-4 py-2 text-left hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2 ${
                        i18n.language === lang.code ? 'bg-stone-50 dark:bg-stone-800 font-medium' : ''
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-sm text-stone-600">
                  {user.firstName}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-stone-600 hover:text-stone-900"
                >
                  <User size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                <User size={20} />
              </button>
            )}

            {/* Cart */}
            <CartDrawer />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 border-b border-stone-50 dark:border-stone-800"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

      {/* Auth Modal — rendered OUTSIDE nav to avoid stacking context */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
