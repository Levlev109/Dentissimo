import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { useTranslation } from 'react-i18next';
import { convertPrice } from '../../services/currency';
import { CareMethod, Ingredient, ProductOverride, CustomProduct } from '../../services/database';
import { productService } from '../../services/productService';
import { allProducts as baseProducts } from '../../data/allProducts';

const buildProductList = (overrides: ProductOverride[], customs: CustomProduct[]) => {
  const merged = baseProducts
    .map(p => {
      const ov = overrides.find(o => o.id === p.id);
      if (!ov) return p;
      if (ov.hidden) return null;
      return { ...p, price: ov.price ?? p.price, badge: (ov.badge as typeof p.badge) ?? p.badge, name: ov.name ?? p.name };
    })
    .filter(Boolean) as typeof baseProducts;
  const customAsProducts = customs.map(c => ({
    id: c.id, name: c.name, categoryKey: c.categoryKey, price: c.price, descriptionKey: '',
    image: c.image, badge: c.badge as 'bestseller' | 'recommended' | 'topSales' | 'eco' | 'limitedStock' | undefined,
    isNew: c.isNew, _customDesc: c.description,
  }));
  return [...merged, ...customAsProducts];
};

export const AllProducts = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCareMethods, setSelectedCareMethods] = useState<CareMethod[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [overrides, setOverrides] = useState<ProductOverride[]>([]);
  const [customs, setCustoms] = useState<CustomProduct[]>([]);

  useEffect(() => {
    productService.getOverrides().then(setOverrides);
    productService.getCustomProducts().then(setCustoms);
  }, []);

  const allProducts = buildProductList(overrides, customs);

  const categories = [
    { id: 'all', nameKey: 'allProductsSection.all' },
    { id: 'limitedEdition', nameKey: 'nav.limitedEdition' },
    { id: 'toothpaste', nameKey: 'allProductsSection.toothpaste' },
    { id: 'toothbrushes', nameKey: 'allProductsSection.toothbrushes' },
    { id: 'mouthwash', nameKey: 'allProductsSection.mouthwash' },
    { id: 'kids', nameKey: 'allProductsSection.forKids' },
  ];

  const filteredProducts = allProducts.filter(p => {
    if (selectedCategory !== 'all' && p.categoryKey !== selectedCategory) return false;
    if (selectedCareMethods.length > 0) {
      const cm = (p as { careMethod?: CareMethod[] }).careMethod;
      if (!cm || !cm.some(m => selectedCareMethods.includes(m))) return false;
    }
    if (selectedIngredients.length > 0) {
      const ing = (p as { ingredients?: Ingredient[] }).ingredients;
      if (!ing || !ing.some(i => selectedIngredients.includes(i))) return false;
    }
    return true;
  });

  return (
    <section id="products" className="py-14 md:py-24 bg-stone-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_20%,rgba(20,184,166,0.03),transparent)]" />
      {/* Top transition glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-8 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
          <div>
            <p className="text-teal-500/80 uppercase tracking-[0.3em] text-xs font-bold mb-3">{t('allProductsSection.subtitle')}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white">{t('allProductsSection.title')}</h2>
          </div>
          <div className="w-32 h-px bg-gradient-to-r from-white/20 to-transparent hidden md:block" />
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-14">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 text-sm font-medium transition-all duration-300 border ${selectedCategory === cat.id ? 'bg-white text-stone-900 border-white shadow-md' : 'bg-transparent text-stone-500 border-white/[0.08] hover:border-white/[0.2] hover:text-white'}`}>
              {t(cat.nameKey)}
            </button>
          ))}
        </div>
        <ProductFilters selectedCareMethods={selectedCareMethods} selectedIngredients={selectedIngredients} onCareMethodsChange={setSelectedCareMethods} onIngredientsChange={setSelectedIngredients} />
        <motion.div key={selectedCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={{
              ...product,
              price: convertPrice(product.price, i18n.language),
              category: t(`categories.${product.categoryKey}`),
              description: ('_customDesc' in product && (product as { _customDesc?: string })._customDesc) ? (product as { _customDesc: string })._customDesc : t(product.descriptionKey),
            }} />
          ))}
        </motion.div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-400">{t('allProductsSection.notFound')}</p>
          </div>
        )}
      </div>
    </section>
  );
};
