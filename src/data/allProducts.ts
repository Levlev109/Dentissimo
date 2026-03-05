import { CareMethod, Ingredient } from '../services/database';

export interface ProductEntry {
  id: string;
  name: string;
  categoryKey: string;
  price: number;
  descriptionKey: string;
  image: string;
  isNew?: boolean;
  badge?: 'bestseller' | 'recommended' | 'topSales' | 'eco' | 'limitedStock';
  careMethod?: CareMethod[];
  ingredients?: Ingredient[];
}

export const allProducts: ProductEntry[] = [
  // Limited Edition Series (Premium Line)
  {
    id: 'gentle-care',
    name: 'Gentle Care',
    categoryKey: 'limitedEdition',
    price: 175.00,
    descriptionKey: 'products.gentleCareDesc',
    image: '/images/DENTISSIMO_box_Gentle_Care.webp',
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
    image: '/images/7640162326834_DENTISSIMO_DIAMOND (1).webp',
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
    image: '/images/DENTISSIMO_box_Gold_Italy.webp',
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
    image: '/images/DENTISSIMO_box_EXTRA_whitening (1).webp',
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
    image: '/images/DENTISSIMO_box_Complete_care (1).webp',
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
    image: '/images/DENTISSIMO_box_PRO_care.webp',
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
    image: '/images/DENTISSIMO_box_Vegan.webp',
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
    image: '/images/DENTISSIMO_box_Pregnant.webp',
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
    image: '/images/DENTISSIMO_box_Kids.webp',
    careMethod: ['kids'],
    ingredients: ['calciumGlycerophosphate', 'vitaminE', 'chamomile', 'geranium', 'vitaminB5']
  },
  {
    id: 'junior-apple',
    name: 'Junior 6+ Years',
    categoryKey: 'kids',
    price: 139.00,
    descriptionKey: 'products.juniorDesc',
    image: '/images/DENTISSIMO_box_Junior.webp',
    careMethod: ['kids'],
    ingredients: ['fluoride', 'calcium', 'vitaminE', 'chamomile', 'geranium']
  },
  {
    id: 'brush-kids',
    name: 'Kids Brush 2-6 Years',
    categoryKey: 'kids',
    price: 69.00,
    descriptionKey: 'products.kidsBrushDesc',
    image: '/images/7640162322485_DENTISSIMO_kids_brush_blister_pink_2622x4052.webp'
  },
  {
    id: 'brush-junior',
    name: 'Junior Brush 6+ Years',
    categoryKey: 'kids',
    price: 69.00,
    descriptionKey: 'products.juniorBrushDesc',
    image: '/images/7640162322508_DENTISSIMO_toothbrush_blister_junior_green_2622x4052.webp'
  },
  // Toothbrushes - Premium Line
  {
    id: 'brush-gold',
    name: 'Gold Medium Limited Edition',
    categoryKey: 'toothbrushes',
    price: 149.00,
    descriptionKey: 'products.goldBrushDesc',
    image: '/images/7640162322492_DENTISSIMO_medium_gold_brush_blister_1470х1710.webp',
    isNew: true
  },
  {
    id: 'brush-silver',
    name: 'Silver Hard Limited Edition',
    categoryKey: 'toothbrushes',
    price: 149.00,
    descriptionKey: 'products.silverBrushDesc',
    image: '/images/7640162320917_DENTISSIMO_hard_silver_brush_blister_1470х1710.webp',
    isNew: true
  },
  // Toothbrushes - Pro Line
  {
    id: 'brush-medium',
    name: 'Medium',
    categoryKey: 'toothbrushes',
    price: 89.00,
    descriptionKey: 'products.mediumBrushDesc',
    image: '/images/7640162322430_DENTISSIMO_medium_brush_blister_blue_2622x4052.webp'
  },
  {
    id: 'brush-hard',
    name: 'Hard',
    categoryKey: 'toothbrushes',
    price: 89.00,
    descriptionKey: 'products.hardBrushDesc',
    image: '/images/7640162322454_DENTISSIMO_toothbrush_blister_hard_2622x4052_black.webp'
  },
  {
    id: 'brush-sensitive',
    name: 'Sensitive Soft',
    categoryKey: 'toothbrushes',
    price: 89.00,
    descriptionKey: 'products.sensitiveBrushDesc',
    image: '/images/7640162322461_DENTISSIMO_sensitive_brush_blister_blue_2622x4052.webp'
  },
  {
    id: 'brush-parodontal',
    name: 'Parodontal Soft',
    categoryKey: 'toothbrushes',
    price: 89.00,
    descriptionKey: 'products.parodontalBrushDesc',
    image: '/images/7640162322478_DENTISSIMO_parodontal_brush_blister_green_2622x4052.webp'
  },
  // Mouthwashes
  {
    id: 'mouthwash-gold',
    name: 'Gold Advanced Whitening',
    categoryKey: 'mouthwash',
    price: 169.00,
    descriptionKey: 'products.goldMouthwashDesc',
    image: '/images/7640162327428_Dentissimo_mouthwash_Advanced_Whitening_704x2953.webp',
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
    image: '/images/7640162322416_Dentissimo_mouthwash_Fresh_Breath_704x2953.webp',
    careMethod: ['fresh'],
    ingredients: ['cardamomOil', 'peppermintOil', 'zincChloride']
  },
  {
    id: 'mouthwash-gum',
    name: 'Gum Protection',
    categoryKey: 'mouthwash',
    price: 149.00,
    descriptionKey: 'products.gumProtectionDesc',
    image: '/images/7640162322423_Dentissimo_mouthwash_Gum_Protection_704x2953.webp',
    careMethod: ['gums'],
    ingredients: ['ratania', 'chamomile', 'fluoride']
  }
];
