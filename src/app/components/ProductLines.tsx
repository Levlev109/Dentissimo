import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LineProduct {
  nameKey: string;
  typeKey: string;
  point1: string;
  point2: string;
  image: string;
}

const proLineProducts: LineProduct[] = [
  {
    nameKey: 'productLines.completeCare',
    typeKey: 'productLines.toothpaste',
    point1: 'productLines.completeCareP1',
    point2: 'productLines.completeCareP2',
    image: '/images/DENTISSIMO_box_Complete_care (1).webp',
  },
  {
    nameKey: 'productLines.proWhitening',
    typeKey: 'productLines.toothpaste',
    point1: 'productLines.proWhiteningP1',
    point2: 'productLines.proWhiteningP2',
    image: '/images/DENTISSIMO_box_Vegan.webp',
  },
  {
    nameKey: 'productLines.proCare',
    typeKey: 'productLines.toothpaste',
    point1: 'productLines.proCareP1',
    point2: 'productLines.proCareP2',
    image: '/images/DENTISSIMO_box_PRO_care.webp',
  },
];

const premiumLineProducts: LineProduct[] = [
  {
    nameKey: 'productLines.extraBlack',
    typeKey: 'productLines.toothpaste',
    point1: 'productLines.extraBlackP1',
    point2: 'productLines.extraBlackP2',
    image: '/images/DENTISSIMO_box_EXTRA_whitening (1).webp',
  },
  {
    nameKey: 'productLines.goldWhitening',
    typeKey: 'productLines.toothpasteGel',
    point1: 'productLines.goldWhiteningP1',
    point2: 'productLines.goldWhiteningP2',
    image: '/images/DENTISSIMO_box_Gold_Italy.webp',
  },
  {
    nameKey: 'productLines.diamondSensitive',
    typeKey: 'productLines.toothpaste',
    point1: 'productLines.diamondSensitiveP1',
    point2: 'productLines.diamondSensitiveP2',
    image: '/images/7640162326834_DENTISSIMO_DIAMOND (1).webp',
  },
];

const ProductCard = ({ product, index, accent }: { product: LineProduct; index: number; accent: 'pro' | 'premium' }) => {
  const { t } = useTranslation();
  const gradients = {
    pro: 'from-teal-50 via-white to-teal-50/30 dark:from-stone-800/60 dark:via-stone-800 dark:to-stone-800/60',
    premium: 'from-amber-50/50 via-white to-amber-50/30 dark:from-stone-800/60 dark:via-stone-800 dark:to-stone-800/60',
  };
  const borderColors = {
    pro: 'border-teal-200/50 dark:border-teal-800/30 hover:border-teal-300 dark:hover:border-teal-700',
    premium: 'border-amber-200/50 dark:border-amber-800/30 hover:border-amber-300 dark:hover:border-amber-700',
  };
  const badgeBg = {
    pro: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/40',
    premium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
  };
  const bulletColor = {
    pro: 'bg-teal-500',
    premium: 'bg-amber-500',
  };

  return (
    <motion.div
      className={`group relative bg-gradient-to-br ${gradients[accent]} rounded-2xl border ${borderColors[accent]} shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 p-5">
        {/* Product image */}
        <div className="w-24 h-28 sm:w-20 sm:h-24 flex-shrink-0 flex items-center justify-center">
          <img
            src={product.image}
            alt={t(product.nameKey)}
            className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-1.5 border ${badgeBg[accent]}`}>
            {t(product.typeKey)}
          </span>
          <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-white mb-2">
            {t(product.nameKey)}
          </h4>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <span className={`w-1.5 h-1.5 rounded-full ${bulletColor[accent]} flex-shrink-0`} />
              {t(product.point1)}
            </li>
            <li className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <span className={`w-1.5 h-1.5 rounded-full ${bulletColor[accent]} flex-shrink-0`} />
              {t(product.point2)}
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export const ProductLines = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white dark:bg-stone-950 overflow-hidden transition-colors duration-500 relative">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.04),transparent),radial-gradient(circle_at_30%_70%,rgba(217,169,56,0.04),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-stone-700 dark:text-stone-400 uppercase tracking-[0.3em] text-xs font-bold mb-4">
            {t('productLines.subtitle')}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-4">
            {t('productLines.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-stone-400 to-transparent mx-auto mt-6" />
        </motion.div>

        {/* Two columns for Pro and Premium */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Pro Line */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-1 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full" />
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 dark:text-white">
                {t('productLines.proLine')}
              </h3>
            </div>
            <p className="text-stone-500 dark:text-stone-400 mb-6 pl-[52px]">
              {t('productLines.proLineDesc')}
            </p>
            <div className="space-y-4">
              {proLineProducts.map((product, index) => (
                <ProductCard key={index} product={product} index={index} accent="pro" />
              ))}
            </div>
          </motion.div>

          {/* Premium Line */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 dark:text-white">
                {t('productLines.premiumLine')}
              </h3>
            </div>
            <p className="text-stone-500 dark:text-stone-400 mb-6 pl-[52px]">
              {t('productLines.premiumLineDesc')}
            </p>
            <div className="space-y-4">
              {premiumLineProducts.map((product, index) => (
                <ProductCard key={index} product={product} index={index} accent="premium" />
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="#products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 hover:bg-stone-800 dark:hover:bg-stone-100"
          >
            {t('productLines.viewAll')}
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
