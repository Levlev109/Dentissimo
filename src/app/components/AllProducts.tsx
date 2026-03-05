import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { useTranslation } from 'react-i18next';
import { convertPrice } from '../../services/currency';
import { CareMethod, Ingredient } from '../../services/database';

const allProducts = [
  // Limited Edition Series (Premium Line)
  {
    id: 'gentle-care',
    name: 'Gentle Care',
    categoryKey: 'limitedEdition',
    price: 175.00,
    descriptionKey: 'products.gentleCareDesc',
    image: '/images/DENTISSIMO_box_Gentle_Care.png',
    isNew: true,
    careMethod: ['sensitive', 'natural'],
    ingredients: ['liatris', 'xylitol', 'geranium', 'vitaminE', 'hexetidine']
  },
  {
    id: 'diamond',
    name: 'Diamond',
    categoryKey: 'limitedEdition',
    price: 199.00,
    descriptionKey: 'products.diamondDesc',
    image: '/images/7640162326834_DENTISSIMO_DIAMOND (1).png',
    isNew: true,
    badge: 'topSales' as const,
    careMethod: ['whitening', 'premium'],
    ingredients: ['diamondPowder', 'fluoride', 'hydroxyapatite', 'colloidalSilver']
  },
  {
    id: 'whitening-gold',
    name: 'Advanced Whitening Gold',
    categoryKey: 'limitedEdition',
    price: 219.00,
    descriptionKey: 'products.goldDesc',
    image: '/images/DENTISSIMO_box_Gold_Italy.png',
    isNew: true,
    badge: 'bestseller' as const,
    careMethod: ['whitening', 'premium'],
    ingredients: ['gold24k', 'fluoride', 'mica', 'sodiumHyaluronate']
  },
  {
    id: 'whitening-black',
    name: 'Extra-Whitening Black',
    categoryKey: 'limitedEdition',
    price: 189.00,
    descriptionKey: 'products.blackDesc',
    image: '/images/DENTISSIMO_box_EXTRA_whitening (1).png',
    isNew: true,
    careMethod: ['whitening'],
    ingredients: ['activatedCharcoal', 'fluoride', 'xylitol']
  },

  // Professional Care Series (Pro Line)
  {
    id: 'complete-care',
    name: 'Complete Care',
    categoryKey: 'toothpaste',
    price: 159.00,
    descriptionKey: 'products.completeCareDesc',
    image: '/images/DENTISSIMO_box_Complete_care (1).png',
    badge: 'recommended' as const,
    careMethod: ['complete', 'gums'],
    ingredients: ['fluoride', 'hydroxyapatite', 'calcium', 'geranium', 'eucalyptus']
  },
  {
    id: 'pro-care',
    name: 'Pro-Care Teeth & Gums',
    categoryKey: 'toothpaste',
    price: 149.00,
    descriptionKey: 'products.proCareDesc',
    image: '/images/DENTISSIMO_box_PRO_care.png',
    careMethod: ['gums', 'sensitive'],
    ingredients: ['fluoride', 'krameria', 'geranium', 'biosol']
  },

  // Niche Line
  {
    id: 'vegan-b12',
    name: 'Vegan with Vitamin B12',
    categoryKey: 'toothpaste',
    price: 159.00,
    descriptionKey: 'products.veganDesc',
    image: '/images/DENTISSIMO_box_Vegan.png',
    badge: 'eco' as const,
    careMethod: ['natural'],
    ingredients: ['vitaminB12', 'xylitol', 'geranium', 'sage', 'commiphoraMyrrh']
  },
  {
    id: 'pregnant',
    name: 'Pregnant Lady & Young Mum',
    categoryKey: 'toothpaste',
    price: 159.00,
    descriptionKey: 'products.pregnantDesc',
    image: '/images/DENTISSIMO_box_Pregnant.png',
    careMethod: ['pregnant', 'natural'],
    ingredients: ['folicAcid', 'calcium', 'hydroxyapatite', 'calendula', 'geranium', 'xylitol']
  },

  // Kids Series
  {
    id: 'kids-caramel',
    name: 'Kids 2-6 Years',
    categoryKey: 'kids',
    price: 139.00,
    descriptionKey: 'products.kidsDesc',
    image: '/images/DENTISSIMO_box_Kids.png',
    careMethod: ['kids'],
    ingredients: ['calciumGlycerophosphate', 'vitaminE', 'chamomile', 'geranium', 'vitaminB5']
  },
  {
    id: 'junior-apple',
    name: 'Junior 6+ Years',
    categoryKey: 'kids',
    price: 139.00,
    descriptionKey: 'products.juniorDesc',
    image: '/images/DENTISSIMO_box_Junior.png',
    careMethod: ['kids'],
    ingredients: ['fluoride', 'calcium', 'vitaminE', 'chamomile', 'geranium']
  },
  {
    id: 'brush-kids',
    name: 'Kids Brush 2-6 Years',
    categoryKey: 'kids',
    price: 69.00,
    descriptionKey: 'products.kidsBrushDesc',
    image: '/images/7640162322485_DENTISSIMO_kids_brush_blister_pink_2622x4052.png'
  },
  {
    id: 'brush-junior',
    name: 'Junior Brush 6+ Years',
    categoryKey: 'kids',
    price: 69.00,
    descriptionKey: 'products.juniorBrushDesc',
    image: '/images/7640162322508_DENTISSIMO_toothbrush_blister_junior_green_2622x4052.png'
  },

  // Toothbrushes - Premium Line
  {
    id: 'brush-gold',
    name: 'Gold Medium Limited Edition',
    categoryKey: 'toothbrushes',
    price: 149.00,
    descriptionKey: 'products.goldBrushDesc',
    image: '/images/7640162322492_DENTISSIMO_medium_gold_brush_blister_1470\u04451710.png',
    isNew: true
  },
  {
    id: 'brush-silver',
    name: 'Silver Hard Limited Edition',
    categoryKey: 'toothbrushes',
    price: 149.00,
    descriptionKey: 'products.silverBrushDesc',
    image: '/images/7640162320917_DENTISSIMO_hard_silver_brush_blister_1470\u04451710.png',
    isNew: true
  },

  // Toothbrushes - Pro Line
  {
    id: 'brush-medium',
    name: 'Medium',
    categoryKey: 'toothbrushes',
    price: 89.00,
    descriptionKey: 'products.mediumBrushDesc',
    image: '/images/7640162322430_DENTISSIMO_medium_brush_blister_blue_2622x4052.png'
  },
  {
    id: 'brush-hard',
    name: 'Hard',
    categoryKey: 'toothbrushes',
    price: 89.00,
    descriptionKey: 'products.hardBrushDesc',
    image: '/images/7640162322454_DENTISSIMO_toothbrush_blister_hard_2622x4052_black.png'
  },
  {
    id: 'brush-sensitive',
    name: 'Sensitive Soft',
    categoryKey: 'toothbrushes',
    price: 89.00,
    descriptionKey: 'products.sensitiveBrushDesc',
    image: '/images/7640162322461_DENTISSIMO_sensitive_brush_blister_blue_2622x4052.png'
  },
  {
    id: 'brush-parodontal',
    name: 'Parodontal Soft',
    categoryKey: 'toothbrushes',
    price: 89.00,
    descriptionKey: 'products.parodontalBrushDesc',
    image: '/images/7640162322478_DENTISSIMO_parodontal_brush_blister_green_2622x4052.png'
  },

  // Mouthwashes
  {
    id: 'mouthwash-gold',
    name: 'Gold Advanced Whitening',
    categoryKey: 'mouthwash',
    price: 169.00,
    descriptionKey: 'products.goldMouthwashDesc',
    image: '/images/7640162327428_Dentissimo_mouthwash_Advanced_Whitening_704x2953.png',
    isNew: true,
    careMethod: ['whitening', 'premium'],
    ingredients: ['gold24k', 'fluoride', 'cetrariaIslandica']
  },
  {
    id: 'mouthwash-fresh',
    name: 'Fresh Breath',
    categoryKey: 'mouthwash',
    price: 149.00,
    descriptionKey: 'products.freshBreathDesc',
    image: '/images/7640162322416_Dentissimo_mouthwash_Fresh_Breath_704x2953.png',
    careMethod: ['fresh'],
    ingredients: ['cardamomOil', 'peppermintOil', 'zincChloride']
  },
  {
    id: 'mouthwash-gum',
    name: 'Gum Protection',
    categoryKey: 'mouthwash',
    price: 149.00,
    descriptionKey: 'products.gumProtectionDesc',
    image: '/images/7640162322423_Dentissimo_mouthwash_Gum_Protection_704x2953.png',
    careMethod: ['gums'],
    ingredients: ['ratania', 'chamomile', 'fluoride']
  }
];

export const AllProducts = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCareMethods, setSelectedCareMethods] = useState<CareMethod[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  
  const categories = [
    { id: 'all', nameKey: 'allProductsSection.all' },
    { id: 'limitedEdition', nameKey: 'nav.limitedEdition' },
    { id: 'toothpaste', nameKey: 'allProductsSection.toothpaste' },
    { id: 'toothbrushes', nameKey: 'allProductsSection.toothbrushes' },
    { id: 'mouthwash', nameKey: 'allProductsSection.mouthwash' },
    { id: 'kids', nameKey: 'allProductsSection.forKids' }
  ];
  
  const filteredProducts = allProducts.filter(p => {
    // Category filter
    if (selectedCategory !== 'all' && p.categoryKey !== selectedCategory) {
      return false;
    }
    
    // Care method filter
    if (selectedCareMethods.length > 0) {
      if (!p.careMethod || !p.careMethod.some(method => selectedCareMethods.includes(method))) {
        return false;
      }
    }
    
    // Ingredients filter
    if (selectedIngredients.length > 0) {
      if (!p.ingredients || !p.ingredients.some(ingredient => selectedIngredients.includes(ingredient))) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-stone-50/30 via-white to-amber-50/20 dark:from-stone-950 dark:via-amber-950/10 dark:to-stone-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-semibold mb-3">{t('allProductsSection.subtitle')}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-white mb-2">{t('allProductsSection.title')}</h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white border-[#D4AF37] shadow-md shadow-[#D4AF37]/20'
                  : 'bg-white dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] dark:hover:border-[#D4AF37]/40'
              }`}
            >
              {t(cat.nameKey)}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        <ProductFilters
          selectedCareMethods={selectedCareMethods}
          selectedIngredients={selectedIngredients}
          onCareMethodsChange={setSelectedCareMethods}
          onIngredientsChange={setSelectedIngredients}
        />

        {/* Products Grid */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={{
              ...product,
              price: convertPrice(product.price, i18n.language),
              category: t(`categories.${product.categoryKey}`),
              description: t(product.descriptionKey)
            }} />
          ))}
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-500 dark:text-stone-400">{t('allProductsSection.notFound')}</p>
          </div>
        )}
      </div>
    </section>
  );
};
