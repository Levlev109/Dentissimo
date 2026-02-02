import { useState } from 'react';
import { Menu, X, Globe, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { CartDrawer } from './CartDrawer';
import { AuthModal } from './AuthModal';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const languages = [
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
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
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-800 hover:text-stone-600 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center md:justify-start w-full md:w-auto absolute md:relative pointer-events-none md:pointer-events-auto">
            <a href="#" className="font-serif text-2xl font-bold tracking-wider text-stone-900 pointer-events-auto">
              DENTISSIMO
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide uppercase"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:block text-stone-600 hover:text-stone-900 transition-colors">
              <Search size={20} />
            </button>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1 text-stone-600 hover:text-stone-900 transition-colors"
              >
                <Globe size={18} />
                <span className="text-xs font-medium">{currentLang.flag}</span>
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-stone-200 py-2 w-48 z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLang(lang.code)}
                      className={`w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2 ${
                        i18n.language === lang.code ? 'bg-stone-50 font-medium' : ''
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
                className="text-stone-600 hover:text-stone-900 transition-colors"
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
            className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-4 text-base font-medium text-stone-800 hover:bg-stone-50 border-b border-stone-50"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </nav>
  );
};
