import { motion } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { convertPrice } from '../../services/currency';
import { showCartToast } from './Toast';

type Tab = 'product' | 'benefits' | 'ingredients' | 'extra';

export const GoldShowcase = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>('product');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'product', label: t('goldShowcase.tabProduct') },
    { key: 'benefits', label: t('goldShowcase.tabBenefits') },
    { key: 'ingredients', label: t('goldShowcase.tabIngredients') },
    { key: 'extra', label: t('goldShowcase.tabExtra') },
  ];

  const ingredients = [
    { nameKey: 'goldShowcase.gold24k', descKey: 'goldShowcase.gold24kDesc' },
    { nameKey: 'goldShowcase.hyaluronate', descKey: 'goldShowcase.hyaluronateDesc' },
    { nameKey: 'goldShowcase.monofluorophosphate', descKey: 'goldShowcase.monofluorophosphateDesc' },
    { nameKey: 'goldShowcase.leuconostoc', descKey: 'goldShowcase.leuconostocDesc' },
    { nameKey: 'goldShowcase.colloidalSilver', descKey: 'goldShowcase.colloidalSilverDesc' },
  ];

  const handleBuy = () => {
    const price = convertPrice(219, i18n.language);
    addToCart({
      id: 'whitening-gold',
      name: 'Advanced Whitening Gold',
      category: t('categories.limitedEdition'),
      price,
      description: t('products.goldDesc'),
      image: '/images/DENTISSIMO_box_Gold_Italy.webp',
      isNew: true,
    });
    showCartToast(t('cart.addedToCart'), 'Advanced Whitening Gold', '/images/DENTISSIMO_box_Gold_Italy.webp');
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-stone-100 via-stone-50 to-white dark:from-stone-900 dark:via-stone-950 dark:to-stone-950 overflow-hidden transition-colors duration-500 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Tab navigation */}
        <motion.div
          className="flex items-center justify-center gap-1 mb-12"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex bg-white dark:bg-stone-800 rounded-full p-1 shadow-lg border border-stone-200 dark:border-stone-700">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left — Product Image */}
          <motion.div
            className="w-full lg:w-5/12 flex flex-col items-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full max-w-xs">
              <div className="absolute -inset-8 bg-gradient-to-br from-amber-200/30 via-yellow-100/10 to-amber-200/20 dark:from-amber-800/15 dark:via-transparent dark:to-amber-800/10 rounded-full blur-3xl" />
              <img
                src="/images/DENTISSIMO_box_Gold_Italy.webp"
                alt="Dentissimo Advanced Whitening Gold"
                className="relative w-full h-auto max-h-[420px] object-contain mx-auto drop-shadow-[0_20px_50px_rgba(180,140,30,0.15)]"
              />
            </div>

            {/* Buy button */}
            <motion.button
              onClick={handleBuy}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-900 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm tracking-wide"
            >
              <ShoppingCart size={18} />
              {t('products.addToCart')} — {t('products.currency')}{convertPrice(219, i18n.language).toFixed(0)}
            </motion.button>
          </motion.div>

          {/* Right — Tab Content */}
          <motion.div
            className="w-full lg:w-7/12"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Product tab */}
            {activeTab === 'product' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div>
                  <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 dark:text-white leading-tight">
                    Advanced Whitening Gold
                  </h2>
                  <div className="mt-4 inline-block px-5 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800/40">
                    <p className="text-amber-800 dark:text-amber-300 font-semibold text-sm">{t('goldShowcase.gentleClean')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {t('goldShowcase.stimulates')}
                    </h3>
                    <ul className="mt-2 ml-4 space-y-2">
                      <li className="flex items-start gap-3 text-stone-700 dark:text-stone-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-400 flex-shrink-0" />
                        <span className="text-lg">{t('goldShowcase.softTissue')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-stone-700 dark:text-stone-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-400 flex-shrink-0" />
                        <span className="text-lg">{t('goldShowcase.gumHealing')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-4 mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      F
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">{t('goldShowcase.fluorideNote')}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Benefits tab */}
            {activeTab === 'benefits' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 dark:text-white">
                  {t('goldShowcase.toothpasteGel')}
                  <br />
                  <span className="text-amber-600 dark:text-amber-400">Advanced Whitening Gold</span>
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-5 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-200/60 dark:border-stone-700/60">
                    <div className="w-16 h-16 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src="/images/DENTISSIMO_box_Gold_Italy.webp" alt="" className="w-12 h-12 object-contain" />
                    </div>
                    <p className="text-stone-800 dark:text-stone-200 font-semibold text-lg leading-snug">{t('goldShowcase.exclusiveShine')}</p>
                  </div>

                  <div className="p-5 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-200/60 dark:border-stone-700/60">
                    <p className="text-stone-800 dark:text-stone-200 font-semibold text-lg">{t('goldShowcase.aesthetics')}</p>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/40 dark:border-stone-700/40">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-stone-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-stone-600 dark:text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8 2 4 6 4 12c0 4 2 8 8 10 6-2 8-6 8-10 0-6-4-10-8-10z" /></svg>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 text-sm italic leading-relaxed">{t('goldShowcase.fantasticSmile')}</p>
                  </div>
                </div>

                <p className="text-stone-500 dark:text-stone-500 text-sm mt-4">{t('goldShowcase.volume')} — {t('goldShowcase.innovativeFormula')}</p>
              </motion.div>
            )}

            {/* Ingredients tab */}
            {activeTab === 'ingredients' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-6">
                  {t('products.activeIngredients')}
                </h2>
                <div className="space-y-4">
                  {ingredients.map((ing, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 group"
                    >
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-amber-500 mt-2 shadow-sm shadow-amber-300" />
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                          {t(ing.nameKey)}
                        </h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mt-1">
                          {t(ing.descKey)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Extra tab */}
            {activeTab === 'extra' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-2">
                    {t('goldShowcase.dailyUseTitle')}
                  </h2>
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{t('goldShowcase.noHarmful')}</p>
                </div>

                <div className="p-5 bg-amber-50 dark:bg-amber-900/15 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                  <h3 className="font-bold text-stone-900 dark:text-white mb-2">{t('goldShowcase.howToUseTitle')}</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{t('goldShowcase.howToUse')}</p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white mb-2">{t('goldShowcase.compositionTitle')}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500 leading-relaxed">{t('goldShowcase.composition')}</p>
                </div>

                <div className="p-4 bg-stone-100 dark:bg-stone-800/60 rounded-xl">
                  <h3 className="font-bold text-stone-900 dark:text-white text-sm mb-1">{t('goldShowcase.storageTitle')}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-500">{t('goldShowcase.storage')}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
