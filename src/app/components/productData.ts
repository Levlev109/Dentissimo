// Product-specific data: active ingredients, badges, and key benefits
// Ingredient values are translation keys under 'ingredients.*'

export interface ProductDetails {
  ingredients: string[];  // translation keys (e.g. 'liatris' → t('ingredients.liatris'))
  badges: string[];
  keyBenefits: string[]; // translation keys
  composition?: string;  // INCI composition text
  volume?: number;       // volume in ml
}

// Badge types: 'vegan' | 'fluorideFree' | 'alcoholFree' | 'containsFluoride' | 'swissMade' | 'clinicallyTested' | 'noParabens' | 'noSLS'

export const productDetailsMap: Record<string, ProductDetails> = {
  // === TOOTHPASTES ===
  
  'gentle-care': {
    ingredients: ['liatris', 'hydratedSilica', 'xylitol', 'geranium', 'vitaminE', 'hexetidine', 'panthenol', 'eugenol'],
    badges: ['vegan', 'fluorideFree', 'swissMade'],
    keyBenefits: ['products.benefits.antibacterial', 'products.benefits.gumProtection', 'products.benefits.freshBreath'],
    composition: 'Aqua, Sorbitol, Hydrated Silica, Glycerin, Xylitol, Cellulose Gum, Aroma, Sodium Methyl Cocoyl Taurate, Liatris Odoratissima Extract, Pelargonium Graveolens Extract, Tocopherol, Hexetidine, Panthenol, Eugenol, Sodium Saccharin, Limonene.',
    volume: 75
  },

  'diamond': {
    ingredients: ['diamondPowder', 'hydratedSilica', 'xylitol', 'geranium'],
    badges: ['vegan', 'swissMade', 'clinicallyTested'],
    keyBenefits: ['products.benefits.whitening', 'products.benefits.sensitiveTeeth', 'products.benefits.enamelProtection'],
    composition: 'Aqua, Sorbitol, Hydrated Silica, Glycerin, Xylitol, Cellulose Gum, Aroma, Sodium Methyl Cocoyl Taurate, Diamond Powder, Pelargonium Graveolens Extract, Sodium Saccharin, Limonene.',
    volume: 75
  },

  'whitening-gold': {
    ingredients: ['gold24k', 'sodiumHyaluronate', 'sodiumMonofluorophosphate', 'leuconostoc', 'colloidalSilver'],
    badges: ['vegan', 'swissMade', 'containsFluoride', 'noParabens', 'noSLS'],
    keyBenefits: ['products.benefits.whitening', 'products.benefits.antibacterial', 'products.benefits.gumHealth'],
    composition: 'Aqua, Sorbitol, Hydrated Silica, Glycerin, PEG-32, Sodium Monofluorophosphate, Cellulose Gum, Aroma, Sodium Methyl Cocoyl Taurate, Titanium Dioxide, Sodium Saccharin, Gold, Sodium Hyaluronate, Leuconostoc/Radish Root Ferment Filtrate, Colloidal Silver, Limonene.',
    volume: 75
  },

  'whitening-black': {
    ingredients: ['activatedCharcoal', 'hydratedSilica', 'xylitol', 'vitaminE', 'fluoride', 'geranium', 'biosol'],
    badges: ['vegan', 'swissMade'],
    keyBenefits: ['products.benefits.whitening', 'products.benefits.freshBreath', 'products.benefits.tartar'],
    composition: 'Aqua, Sorbitol, Hydrated Silica, Glycerin, PEG-32, Sodium Monofluorophosphate, Cellulose Gum, Aroma, Sodium Methyl Cocoyl Taurate, Charcoal Powder, Xylitol, Tocopherol, Pelargonium Graveolens Extract, Biosol, Sodium Saccharin, Limonene.',
    volume: 75
  },

  'complete-care': {
    ingredients: ['fluoride', 'calcium', 'hydroxyapatite', 'xylitol', 'hydratedSilica', 'geranium', 'eucalyptus'],
    badges: ['swissMade', 'clinicallyTested', 'containsFluoride'],
    keyBenefits: ['products.benefits.remineralization', 'products.benefits.cavityProtection', 'products.benefits.freshBreath'],
    composition: 'Aqua, Sorbitol, Hydrated Silica, Glycerin, PEG-32, Sodium Monofluorophosphate, Calcium Carbonate, Hydroxyapatite, Cellulose Gum, Aroma, Sodium Methyl Cocoyl Taurate, Xylitol, Pelargonium Graveolens Extract, Eucalyptus Globulus Oil, Mentha Piperita Oil, Sodium Saccharin, Limonene.',
    volume: 75
  },

  'pro-care': {
    ingredients: ['geranium', 'krameria', 'chamomile', 'commiphoraMyrrh', 'panthenol', 'eucalyptus', 'sage', 'hexetidine', 'vitaminE'],
    badges: ['swissMade', 'clinicallyTested'],
    keyBenefits: ['products.benefits.bleedingGums', 'products.benefits.cellRegeneration', 'products.benefits.postOperative'],
    composition: 'Aqua, Sorbitol, Hydrated Silica, Glycerin, PEG-32, Cellulose Gum, Aroma, Sodium Methyl Cocoyl Taurate, Pelargonium Graveolens Extract, Krameria Triandra Extract, Chamomilla Recutita Extract, Commiphora Myrrha Oil, Panthenol, Eucalyptus Globulus Oil, Salvia Officinalis Extract, Hexetidine, Tocopherol, Sodium Saccharin, Limonene.',
    volume: 75
  },

  'vegan-b12': {
    ingredients: ['vitaminB12', 'hydratedSilica', 'xylitol', 'geranium', 'sage', 'commiphoraMyrrh'],
    badges: ['vegan', 'fluorideFree', 'swissMade'],
    keyBenefits: ['products.benefits.antibacterial', 'products.benefits.gumHealth', 'products.benefits.naturalFormula'],
    composition: 'Aqua, Sorbitol, Hydrated Silica, Glycerin, Xylitol, Cellulose Gum, Aroma, Sodium Methyl Cocoyl Taurate, Cyanocobalamin, Pelargonium Graveolens Extract, Salvia Officinalis Extract, Commiphora Myrrha Oil, Sodium Saccharin, Limonene.',
    volume: 75
  },

  'pregnant': {
    ingredients: ['folicAcid', 'calcium', 'hydroxyapatite', 'xylitol', 'calendula', 'geranium', 'vitaminB5'],
    badges: ['vegan', 'fluorideFree', 'swissMade'],
    keyBenefits: ['products.benefits.pregnancySafe', 'products.benefits.remineralization', 'products.benefits.gumHealth'],
    composition: 'Aqua, Sorbitol, Hydrated Silica, Glycerin, Xylitol, Calcium Carbonate, Hydroxyapatite, Cellulose Gum, Aroma, Sodium Methyl Cocoyl Taurate, Folic Acid, Calendula Officinalis Extract, Pelargonium Graveolens Extract, Panthenol, Sodium Saccharin, Limonene.',
    volume: 75
  },

  // === KIDS ===

  'kids-caramel': {
    ingredients: ['calciumGlycerophosphate', 'vitaminE', 'chamomile', 'geranium', 'vitaminB5'],
    badges: ['vegan', 'fluorideFree', 'noParabens', 'noSLS'],
    keyBenefits: ['products.benefits.kidsEnamel', 'products.benefits.gentleCleaning', 'products.benefits.naturalFormula'],
    composition: 'Aqua, Sorbitol, Hydrated Silica, Glycerin, Cellulose Gum, Aroma, Sodium Methyl Cocoyl Taurate, Calcium Glycerophosphate, Tocopherol, Chamomilla Recutita Extract, Pelargonium Graveolens Extract, Panthenol, Sodium Saccharin.',
    volume: 50
  },

  'junior-apple': {
    ingredients: ['calciumGlycerophosphate', 'vitaminE', 'chamomile', 'geranium', 'vitaminB5', 'sodiumMonofluorophosphate'],
    badges: ['swissMade', 'noParabens', 'noSLS', 'containsFluoride'],
    keyBenefits: ['products.benefits.kidsEnamel', 'products.benefits.cavityProtection', 'products.benefits.gentleCleaning'],
    composition: 'Aqua, Sorbitol, Hydrated Silica, Glycerin, Sodium Monofluorophosphate, Cellulose Gum, Aroma, Sodium Methyl Cocoyl Taurate, Calcium Glycerophosphate, Tocopherol, Chamomilla Recutita Extract, Pelargonium Graveolens Extract, Panthenol, Sodium Saccharin.',
    volume: 50
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
    keyBenefits: ['products.benefits.whitening', 'products.benefits.antibacterial', 'products.benefits.gumHealth'],
    composition: 'Aqua, Glycerin, Xylitol, PEG-40 Hydrogenated Castor Oil, Aroma, Sodium Saccharin, Gold, Leuconostoc/Radish Root Ferment Filtrate, Cetraria Islandica Extract, Mica, Pelargonium Graveolens Extract, Citric Acid, Sodium Benzoate, Limonene.',
    volume: 250
  },

  'mouthwash-fresh': {
    ingredients: ['geranium', 'cardamomOil', 'peppermintOil', 'hexetidine', 'zincChloride'],
    badges: ['alcoholFree', 'swissMade'],
    keyBenefits: ['products.benefits.freshBreath', 'products.benefits.antibacterial', 'products.benefits.tartar'],
    composition: 'Aqua, Glycerin, PEG-40 Hydrogenated Castor Oil, Aroma, Pelargonium Graveolens Extract, Elettaria Cardamomum Oil, Mentha Piperita Oil, Hexetidine, Zinc Chloride, Sodium Saccharin, Citric Acid, Sodium Benzoate, Limonene.',
    volume: 250
  },

  'mouthwash-gum': {
    ingredients: ['chamomile', 'geranium', 'vitaminE', 'hexetidine', 'sage', 'commiphoraMyrrh', 'ratania', 'zincChloride'],
    badges: ['alcoholFree', 'swissMade'],
    keyBenefits: ['products.benefits.bleedingGums', 'products.benefits.antibacterial', 'products.benefits.gumHealth'],
    composition: 'Aqua, Glycerin, PEG-40 Hydrogenated Castor Oil, Aroma, Chamomilla Recutita Extract, Pelargonium Graveolens Extract, Tocopherol, Hexetidine, Salvia Officinalis Extract, Commiphora Myrrha Oil, Krameria Triandra Extract, Zinc Chloride, Sodium Saccharin, Citric Acid, Sodium Benzoate, Limonene.',
    volume: 250
  }
};
