// Product-specific data: active ingredients, badges, and key benefits
// Ingredient values are translation keys under 'ingredients.*'

export interface ProductDetails {
  ingredients: string[];  // translation keys (e.g. 'liatris' → t('ingredients.liatris'))
  badges: string[];
  keyBenefits: string[]; // translation keys
}

// Badge types: 'vegan' | 'fluorideFree' | 'alcoholFree' | 'containsFluoride' | 'swissMade' | 'clinicallyTested' | 'noParabens' | 'noSLS'

export const productDetailsMap: Record<string, ProductDetails> = {
  // === TOOTHPASTES ===
  
  'gentle-care': {
    ingredients: ['liatris', 'hydratedSilica', 'xylitol', 'geranium', 'vitaminE', 'hexetidine', 'panthenol', 'eugenol'],
    badges: ['vegan', 'fluorideFree', 'swissMade'],
    keyBenefits: ['products.benefits.antibacterial', 'products.benefits.gumProtection', 'products.benefits.freshBreath']
  },

  'diamond': {
    ingredients: ['diamondPowder', 'hydratedSilica', 'xylitol', 'geranium'],
    badges: ['vegan', 'swissMade', 'clinicallyTested'],
    keyBenefits: ['products.benefits.whitening', 'products.benefits.sensitiveTeeth', 'products.benefits.enamelProtection']
  },

  'whitening-gold': {
    ingredients: ['gold24k', 'sodiumHyaluronate', 'sodiumMonofluorophosphate', 'leuconostoc', 'colloidalSilver'],
    badges: ['vegan', 'swissMade', 'containsFluoride', 'noParabens', 'noSLS'],
    keyBenefits: ['products.benefits.whitening', 'products.benefits.antibacterial', 'products.benefits.gumHealth']
  },

  'whitening-black': {
    ingredients: ['activatedCharcoal', 'hydratedSilica', 'xylitol', 'vitaminE', 'fluoride', 'geranium', 'biosol'],
    badges: ['vegan', 'swissMade'],
    keyBenefits: ['products.benefits.whitening', 'products.benefits.freshBreath', 'products.benefits.tartar']
  },

  'complete-care': {
    ingredients: ['fluoride', 'calcium', 'hydroxyapatite', 'xylitol', 'hydratedSilica', 'geranium', 'eucalyptus'],
    badges: ['swissMade', 'clinicallyTested', 'containsFluoride'],
    keyBenefits: ['products.benefits.remineralization', 'products.benefits.cavityProtection', 'products.benefits.freshBreath']
  },

  'pro-care': {
    ingredients: ['geranium', 'krameria', 'chamomile', 'commiphoraMyrrh', 'panthenol', 'eucalyptus', 'sage', 'hexetidine', 'vitaminE'],
    badges: ['swissMade', 'clinicallyTested'],
    keyBenefits: ['products.benefits.bleedingGums', 'products.benefits.cellRegeneration', 'products.benefits.postOperative']
  },

  'vegan-b12': {
    ingredients: ['vitaminB12', 'hydratedSilica', 'xylitol', 'geranium', 'sage', 'commiphoraMyrrh'],
    badges: ['vegan', 'fluorideFree', 'swissMade'],
    keyBenefits: ['products.benefits.antibacterial', 'products.benefits.gumHealth', 'products.benefits.naturalFormula']
  },

  'pregnant': {
    ingredients: ['folicAcid', 'calcium', 'hydroxyapatite', 'xylitol', 'calendula', 'geranium', 'vitaminB5'],
    badges: ['vegan', 'fluorideFree', 'swissMade'],
    keyBenefits: ['products.benefits.pregnancySafe', 'products.benefits.remineralization', 'products.benefits.gumHealth']
  },

  // === KIDS ===

  'kids-caramel': {
    ingredients: ['calciumGlycerophosphate', 'vitaminE', 'chamomile', 'geranium', 'vitaminB5'],
    badges: ['vegan', 'fluorideFree', 'noParabens', 'noSLS'],
    keyBenefits: ['products.benefits.kidsEnamel', 'products.benefits.gentleCleaning', 'products.benefits.naturalFormula']
  },

  'junior-apple': {
    ingredients: ['calciumGlycerophosphate', 'vitaminE', 'chamomile', 'geranium', 'vitaminB5', 'sodiumMonofluorophosphate'],
    badges: ['swissMade', 'noParabens', 'noSLS', 'containsFluoride'],
    keyBenefits: ['products.benefits.kidsEnamel', 'products.benefits.cavityProtection', 'products.benefits.gentleCleaning']
  },

  // === TOOTHBRUSHES ===
  
  'brush-gold': {
    ingredients: ['gold24kCoating', 'dupontTynex'],
    badges: ['swissMade'],
    keyBenefits: ['products.benefits.plaqueRemoval', 'products.benefits.gumProtection', 'products.benefits.premiumDesign']
  },

  'brush-silver': {
    ingredients: ['silverCoating', 'dupontTynex'],
    badges: ['swissMade'],
    keyBenefits: ['products.benefits.tartar', 'products.benefits.enamelSafe', 'products.benefits.premiumDesign']
  },

  'brush-medium': {
    ingredients: ['dupontTynex'],
    badges: ['swissMade'],
    keyBenefits: ['products.benefits.plaqueRemoval', 'products.benefits.enamelProtection', 'products.benefits.gumProtection']
  },

  'brush-hard': {
    ingredients: ['dupontTynex'],
    badges: ['swissMade'],
    keyBenefits: ['products.benefits.tartar', 'products.benefits.enamelSafe', 'products.benefits.deepCleaning']
  },

  'brush-sensitive': {
    ingredients: ['microThinBristles'],
    badges: ['swissMade'],
    keyBenefits: ['products.benefits.sensitiveTeeth', 'products.benefits.interdental', 'products.benefits.gumMassage']
  },

  'brush-parodontal': {
    ingredients: ['microThinBristles'],
    badges: ['swissMade'],
    keyBenefits: ['products.benefits.gumProtection', 'products.benefits.postOperative', 'products.benefits.gentleCleaning']
  },

  'brush-kids': {
    ingredients: ['softBristles', 'suctionCup'],
    badges: ['swissMade'],
    keyBenefits: ['products.benefits.kidsEnamel', 'products.benefits.ergonomic', 'products.benefits.funDesign']
  },

  'brush-junior': {
    ingredients: ['softBristles', 'rubberHandle'],
    badges: ['swissMade'],
    keyBenefits: ['products.benefits.kidsEnamel', 'products.benefits.gentleCleaning', 'products.benefits.ergonomic']
  },

  // === MOUTHWASHES ===

  'mouthwash-gold': {
    ingredients: ['gold24k', 'xylitol', 'leuconostoc', 'cetrariaIslandica', 'mica', 'geranium'],
    badges: ['alcoholFree', 'swissMade'],
    keyBenefits: ['products.benefits.whitening', 'products.benefits.antibacterial', 'products.benefits.gumHealth']
  },

  'mouthwash-fresh': {
    ingredients: ['geranium', 'cardamomOil', 'peppermintOil', 'hexetidine', 'zincChloride'],
    badges: ['alcoholFree', 'swissMade'],
    keyBenefits: ['products.benefits.freshBreath', 'products.benefits.antibacterial', 'products.benefits.tartar']
  },

  'mouthwash-gum': {
    ingredients: ['chamomile', 'geranium', 'vitaminE', 'hexetidine', 'sage', 'commiphoraMyrrh', 'ratania', 'zincChloride'],
    badges: ['alcoholFree', 'swissMade'],
    keyBenefits: ['products.benefits.bleedingGums', 'products.benefits.antibacterial', 'products.benefits.gumHealth']
  }
};
