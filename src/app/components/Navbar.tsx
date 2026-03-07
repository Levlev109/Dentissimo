import { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, Search, User, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CartDrawer } from './CartDrawer';
import { AuthModal } from './AuthModal';
import { DentissimoLogo } from './DentissimoLogo';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
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
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.contacts'), href: '#contacts' },
  ];

  return (
    <>
    <nav className="fixed w-full z-50 bg-white/95 dark:bg-stone-950/95 backdrop-blur-xl border-b border-stone-200/50 dark:border-stone-800/50 transition-all duration-300 shadow-lg shadow-stone-900/5 dark:shadow-stone-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Mobile: Left — hamburger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-800 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white focus:outline-none transition-colors duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center md:justify-start absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:scale-105 transition-transform duration-300"
            >
              <DentissimoLogo size="md" className="md:h-20" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-all duration-300 tracking-wide uppercase relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stone-900 dark:bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop only: Search */}
            <a href="#products" className="hidden md:block text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-all duration-300 hover:scale-110 transform">
              <Search size={20} />
            </a>

            {/* Desktop only: Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="hidden md:block text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-all duration-300 hover:scale-110 transform"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Desktop only: Language Selector */}
            <div className="relative hidden md:block" ref={langRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-all duration-300 hover:scale-110 transform"
              >
                <Globe size={18} />
                <span className="text-sm font-medium">{currentLang.flag}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 top-full mt-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-stone-200/50 dark:border-stone-700/50 py-2 w-52 z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLang(lang.code)}
                      className={`w-full px-4 py-2.5 text-left hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-3 transition-all duration-300 ${
                        i18n.language === lang.code ? 'bg-stone-100 dark:bg-stone-800 font-semibold border-l-4 border-stone-900 dark:border-white' : ''
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop only: User */}
            <div className="hidden md:block">
              {user ? (
                <button onClick={() => navigate('/profile')} className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors" title={t('profile.title')}>
                  <User size={20} />
                </button>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors">
                  <User size={20} />
                </button>
              )}
            </div>

            {/* Cart — always visible */}
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
              {/* Nav links */}
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 border-b border-stone-100 dark:border-stone-800"
                >
                  {link.name}
                </a>
              ))}

              {/* User / Profile */}
              <div className="px-3 py-4 border-b border-stone-100 dark:border-stone-800">
                {user ? (
                  <button
                    onClick={() => { navigate('/profile'); setIsOpen(false); }}
                    className="flex items-center gap-3 text-base font-medium text-stone-800 dark:text-stone-200 w-full"
                  >
                    <User size={18} className="text-stone-700 dark:text-stone-300" />
                    {t('profile.title')}
                  </button>
                ) : (
                  <button
                    onClick={() => { setShowAuthModal(true); setIsOpen(false); }}
                    className="flex items-center gap-3 text-base font-medium text-stone-800 dark:text-stone-200 w-full"
                  >
                    <User size={18} className="text-stone-700 dark:text-stone-300" />
                    {t('auth.login')}
                  </button>
                )}
              </div>

              {/* Theme toggle */}
              <div className="flex items-center justify-between px-3 py-4 border-b border-stone-100 dark:border-stone-800">
                <span className="text-base font-medium text-stone-800 dark:text-stone-200">
                  {isDark ? 'Світла тема' : 'Темна тема'}
                </span>
                <button
                  onClick={() => { toggleTheme(); setIsOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-medium text-sm transition-all duration-300"
                >
                  {isDark ? <Sun size={18} className="text-stone-700 dark:text-stone-300" /> : <Moon size={18} />}
                  {isDark ? 'Світла' : 'Темна'}
                </button>
              </div>

              {/* Language selector */}
              <div className="px-3 py-3">
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-3 font-semibold">Мова</p>
                <div className="grid grid-cols-4 gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { changeLang(lang.code); setIsOpen(false); }}
                      className={`py-2 px-1 rounded-lg text-center text-xs font-medium transition-all ${
                        i18n.language === lang.code
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="text-lg">{lang.flag}</div>
                      <div className="text-[10px] mt-0.5">{lang.code.toUpperCase()}</div>
                    </button>
                  ))}
                </div>
              </div>
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