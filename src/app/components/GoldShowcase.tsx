import { motion } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { convertPrice } from '../../services/currency';
import { showCartToast } from './Toast';
import { ProductModal } from './ProductModal';

export const GoldShowcase = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const price = convertPrice(219, i18n.language);

  const goldProduct = {
    id: 'whitening-gold',
    name: 'Advanced Whitening Gold',
    category: t('categories.limitedEdition'),
    price,
    description: t('products.goldDesc'),
    image: '/images/DENTISSIMO_box_Gold_Italy.webp',
    isNew: true,
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(goldProduct);
    showCartToast(t('cart.addedToCart'), 'Advanced Whitening Gold', '/images/DENTISSIMO_box_Gold_Italy.webp');
  };

  const features = [
    { key: 'gold24k', icon: '✦' },
    { key: 'hyaluronate', icon: '◈' },
    { key: 'colloidalSilver', icon: '◉' },
  ];

  return (
    <>
      <section className="py-20 md:py-32 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 overflow-hidden relative">
        {/* Ambient gold glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_50%,rgba(217,169,56,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_80%_30%,rgba(217,169,56,0.04),transparent)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Text & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-amber-500/20">
                {t('goldShowcase.badge')}
              </span>

              <h2 className="font-serif text-4xl md:text-6xl text-white leading-[1.1] mb-4">
                Advanced
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  Whitening Gold
                </span>
              </h2>

              <p className="text-stone-400 text-lg md:text-xl mb-8 max-w-md leading-relaxed">
                {t('goldShowcase.subtitle')}
              </p>

              {/* 3 key ingredients */}
              <div className="space-y-3 mb-10">
                {features.map((f, i) => (
                  <motion.div
                    key={f.key}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4 group"
                  >
                    <span className="text-amber-400 text-lg w-6 text-center">{f.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{t(`goldShowcase.${f.key}`)}</p>
                      <p className="text-stone-500 text-xs">{t(`goldShowcase.${f.key}Desc`).slice(0, 80)}…</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <motion.button
                  onClick={handleBuy}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-900 font-bold rounded-full shadow-[0_0_30px_rgba(217,169,56,0.3)] hover:shadow-[0_0_50px_rgba(217,169,56,0.4)] transition-all duration-300 text-sm tracking-wide"
                >
                  <ShoppingCart size={18} />
                  {t('products.addToCart')} — {t('products.currency')}{price.toFixed(0)}
                </motion.button>

                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3.5 text-amber-400 font-semibold text-sm border border-amber-500/30 rounded-full hover:bg-amber-500/10 transition-all duration-300"
                >
                  {t('goldShowcase.tabExtra')}
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>

            {/* Right — Product Image */}
            <motion.div
              className="order-1 lg:order-2 flex justify-center relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {/* Glow rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/10 blur-2xl" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border border-amber-500/10" />
              </div>

              <div
                className="relative cursor-pointer group"
                onClick={() => setIsModalOpen(true)}
              >
                <img
                  src="/images/DENTISSIMO_box_Gold_Italy.webp"
                  alt="Dentissimo Advanced Whitening Gold"
                  className="relative w-64 md:w-80 h-auto object-contain drop-shadow-[0_0_60px_rgba(217,169,56,0.2)] group-hover:scale-105 transition-transform duration-500"
                />
                {/* Hover hint */}
                <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-amber-400/80 font-medium tracking-wide bg-stone-900/80 px-3 py-1 rounded-full backdrop-blur-sm">
                    {t('goldShowcase.tabProduct')} →
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom chips */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {['swissMade', 'vegan', 'containsFluoride', 'noParabens', 'noSLS'].map((badge) => (
              <span key={badge} className="px-4 py-1.5 rounded-full bg-white/5 text-stone-400 text-xs font-medium border border-white/10 tracking-wide">
                {t(`badges.${badge}`)}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <ProductModal
        product={goldProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
