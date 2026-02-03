import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { useTranslation } from 'react-i18next';
import { convertPrice } from '../../services/currency';

const allProducts = [
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
  },
  
  // Professional Care Series
  {
    id: 'complete-care',
    name: 'Complete Care',
    categoryKey: 'toothpaste',
    price: 159.00,
    descriptionKey: 'products.completeCareDesc',
    image: '/images/DENTISSIMO_box_Complete_care (1).png'
  },
  {
    id: 'vegan-b12',
    name: 'Vegan with Vitamin B12',
    categoryKey: 'toothpaste',
    price: 159.00,
    descriptionKey: 'products.veganDesc',
    image: '/images/DENTISSIMO_box_Vegan.png'
  },
  
  // Kids Series
  {
    id: 'kids-caramel',
    name: 'Kids 2-6 Years',
    categoryKey: 'kids',
    price: 139.00,
    descriptionKey: 'products.kidsDesc',
    image: '/images/DENTISSIMO_box_Kids.png'
  },
  {
    id: 'junior-apple',
    name: 'Junior 6+ Years',
    categoryKey: 'kids',
    price: 139.00,
    descriptionKey: 'products.juniorDesc',
    image: '/images/DENTISSIMO_box_Junior.png'
  }
];

export const AllProducts = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', nameKey: 'allProductsSection.all' },
    { id: 'limitedEdition', nameKey: 'nav.limitedEdition' },
    { id: 'toothpaste', nameKey: 'allProductsSection.toothpaste' },
    { id: 'kids', nameKey: 'allProductsSection.forKids' }
  ];
  
  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.categoryKey === selectedCategory);

  return (
    <section id="products" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">{t('allProductsSection.title')}</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            {t('allProductsSection.subtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {t(cat.nameKey)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={{
              ...product,
              price: convertPrice(product.price, i18n.language),
              category: t(`categories.${product.categoryKey}`),
              description: t(product.descriptionKey)
            }} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-500">{t('allProductsSection.notFound')}</p>
          </div>
        )}
      </div>
    </section>
  );
};
