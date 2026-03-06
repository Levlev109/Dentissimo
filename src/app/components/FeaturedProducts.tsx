import { ProductCard } from '@/app/components/ProductCard';
import { useTranslation } from 'react-i18next';
import { convertPrice } from '../../services/currency';

const products = [
  // Limited Edition Series
  {
    id: 'gentle-care',
    name: 'Gentle Care',
    categoryKey: 'limitedEdition',
    price: 175.00,
    descriptionKey: 'products.gentleCareDesc',
    image: '/images/DENTISSIMO_box_Gentle_Care.webp',
    isNew: true
  },
  {
    id: 'diamond',
    name: 'Diamond',
    categoryKey: 'limitedEdition',
    price: 199.00,
    descriptionKey: 'products.diamondDesc',
    image: '/images/7640162326834_DENTISSIMO_DIAMOND (1).webp',
    isNew: true
  },
  {
    id: 'whitening-gold',
    name: 'Advanced Whitening Gold',
    categoryKey: 'limitedEdition',
    price: 219.00,
    descriptionKey: 'products.goldDesc',
    image: '/images/DENTISSIMO_box_Gold_Italy.webp',
    isNew: true
  },
  {
    id: 'whitening-black',
    name: 'Extra-Whitening Black',
    categoryKey: 'limitedEdition',
    price: 189.00,
    descriptionKey: 'products.blackDesc',
    image: '/images/DENTISSIMO_box_EXTRA_whitening (1).webp',
    isNew: true
  }
];

export const FeaturedProducts = () => {
  const { t, i18n } = useTranslation();

  return (
    <section id="limited" className="py-28 bg-white dark:bg-stone-950 transition-colors duration-500 relative overflow-hidden">
      {/* Enhanced premium pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,153,220,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(56,153,220,0.03),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-end mb-16">
          <div className="max-w-xl">
            <p className="text-stone-700 dark:text-stone-400 uppercase tracking-[0.3em] text-xs font-bold mb-3 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-gradient-to-r from-sky-400 to-transparent"></span>
              {t('featuredProducts.subtitle')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-3 leading-tight">{t('featuredProducts.title')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-sky-400 via-sky-300 to-transparent mt-4 rounded-full" />
          </div>
          <a href="#products" className="hidden md:inline-flex items-center gap-2 text-stone-800 dark:text-stone-200 font-semibold hover:text-stone-600 dark:hover:text-stone-400 transition-all duration-300 pb-2 border-b-2 border-stone-400/40 hover:border-stone-800 dark:hover:border-white group hover:gap-3">
            {t('featuredProducts.viewAll')}
            <span className="text-stone-800 dark:text-stone-200">→</span>
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={{
              ...product,
              price: convertPrice(product.price, i18n.language),
              category: t(`categories.${product.categoryKey}`),
              description: t(product.descriptionKey)
            }} />
          ))}
        </div>
        
        <div className="mt-16 text-center md:hidden">
          <a href="#products" className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            {t('featuredProducts.viewAll')}
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
