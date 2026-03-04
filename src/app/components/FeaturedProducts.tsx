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
    image: '/images/DENTISSIMO_box_Gentle_Care.png',
    isNew: true
  },
  {
    id: 'diamond',
    name: 'Diamond',
    categoryKey: 'limitedEdition',
    price: 199.00,
    descriptionKey: 'products.diamondDesc',
    image: '/images/7640162326834_DENTISSIMO_DIAMOND (1).png',
    isNew: true
  },
  {
    id: 'whitening-gold',
    name: 'Advanced Whitening Gold',
    categoryKey: 'limitedEdition',
    price: 219.00,
    descriptionKey: 'products.goldDesc',
    image: '/images/DENTISSIMO_box_Gold_Italy.png',
    isNew: true
  },
  {
    id: 'whitening-black',
    name: 'Extra-Whitening Black',
    categoryKey: 'limitedEdition',
    price: 189.00,
    descriptionKey: 'products.blackDesc',
    image: '/images/DENTISSIMO_box_EXTRA_whitening (1).png',
    isNew: true
  }
];

export const FeaturedProducts = () => {
  const { t, i18n } = useTranslation();

  return (
    <section id="limited" className="py-24 bg-[#F9F8F6] dark:bg-stone-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-white mb-2">{t('featuredProducts.title')}</h2>
            <p className="text-stone-500 dark:text-stone-400">{t('featuredProducts.subtitle')}</p>
          </div>
          <a href="#products" className="hidden md:inline-block text-stone-900 dark:text-white font-medium hover:text-[#D4AF37] transition-colors pb-1 border-b border-stone-300 dark:border-stone-600 hover:border-[#D4AF37]">
            {t('featuredProducts.viewAll')}
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={{
              ...product,
              price: convertPrice(product.price, i18n.language),
              category: t(`categories.${product.categoryKey}`),
              description: t(product.descriptionKey)
            }} />
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <a href="#products" className="inline-block px-6 py-3 border border-stone-900 dark:border-stone-300 text-stone-900 dark:text-white font-medium">
            {t('featuredProducts.viewAll')}
          </a>
        </div>
      </div>
    </section>
  );
};
