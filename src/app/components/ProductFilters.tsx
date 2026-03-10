import { useState } from 'react';
import { ChevronDown, X, Sparkles, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { CareMethod, Ingredient } from '../../services/database';

interface ProductFiltersProps {
  selectedCareMethods: CareMethod[];
  selectedIngredients: Ingredient[];
  onCareMethodsChange: (methods: CareMethod[]) => void;
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export const ProductFilters = ({
  selectedCareMethods,
  selectedIngredients,
  onCareMethodsChange,
  onIngredientsChange
}: ProductFiltersProps) => {
  const { t } = useTranslation();
  const [careMethodsOpen, setCareMethodsOpen] = useState(false);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);

  const careMethods: { value: CareMethod; icon: typeof Sparkles }[] = [
    { value: 'whitening', icon: Sparkles },
    { value: 'sensitive', icon: Leaf },
    { value: 'gums', icon: Leaf },
    { value: 'natural', icon: Leaf },
    { value: 'kids', icon: Sparkles },
    { value: 'pregnant', icon: Leaf },
    { value: 'premium', icon: Sparkles },
    { value: 'complete', icon: Sparkles },
    { value: 'fresh', icon: Leaf },
  ];

  const ingredients: Ingredient[] = [
    'fluoride', 'hydroxyapatite', 'xylitol', 'calcium', 'vitaminE',
    'diamondPowder', 'gold24k', 'activatedCharcoal', 'vitaminB12',
    'folicAcid', 'geranium', 'chamomile', 'sage', 'eucalyptus'
  ];

  const toggleCareMethod = (method: CareMethod) => {
    if (selectedCareMethods.includes(method)) {
      onCareMethodsChange(selectedCareMethods.filter(m => m !== method));
    } else {
      onCareMethodsChange([...selectedCareMethods, method]);
    }
  };

  const toggleIngredient = (ingredient: Ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      onIngredientsChange(selectedIngredients.filter(i => i !== ingredient));
    } else {
      onIngredientsChange([...selectedIngredients, ingredient]);
    }
  };

  const clearAll = () => {
    onCareMethodsChange([]);
    onIngredientsChange([]);
  };

  const hasActiveFilters = selectedCareMethods.length > 0 || selectedIngredients.length > 0;

  return (
    <div className="mb-8 bg-stone-900 rounded-2xl border border-stone-800/40 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-teal-400 to-teal-500 rounded-full"></span>
          {t('filters.title')}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-stone-500 hover:text-white transition-all duration-300 flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-full font-medium shadow-sm hover:shadow-md"
          >
            <X size={16} />
            {t('filters.clearAll')}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Care Methods Filter */}
        <div>
          <button
            onClick={() => setCareMethodsOpen(!careMethodsOpen)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-stone-900 hover:bg-stone-800 transition-all duration-300 shadow-sm hover:shadow-md border border-stone-800/30"
          >
            <span className="font-semibold text-white flex items-center gap-2.5">
              <Sparkles size={20} className="text-stone-300 drop-shadow-sm" />
              {t('filters.careMethods')}
              {selectedCareMethods.length > 0 && (
                <span className="ml-2 px-2.5 py-1 bg-stone-900 text-white text-xs rounded-full font-bold shadow-md">
                  {selectedCareMethods.length}
                </span>
              )}
            </span>
            <motion.div
              animate={{ rotate: careMethodsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={20} className="text-stone-400" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {careMethodsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mt-4 px-1">
                  {careMethods.map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => toggleCareMethod(value)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 ${
                        selectedCareMethods.includes(value)
                          ? 'bg-white text-stone-900 shadow-lg border-2 border-white'
                          : 'bg-stone-800 text-stone-300 border-2 border-stone-700 hover:border-stone-500 hover:shadow-md'
                      }`}
                    >
                      <Icon size={16} />
                      {t(`filters.methods.${value}`)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ingredients Filter */}
        <div>
          <button
            onClick={() => setIngredientsOpen(!ingredientsOpen)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-stone-900 hover:bg-stone-800 transition-all duration-300 shadow-sm hover:shadow-md border border-stone-800/30"
          >
            <span className="font-semibold text-white flex items-center gap-2.5">
              <Leaf size={20} className="text-stone-300 drop-shadow-sm" />
              {t('filters.ingredients')}
              {selectedIngredients.length > 0 && (
                <span className="ml-2 px-2.5 py-1 bg-stone-900 text-white text-xs rounded-full font-bold shadow-md">
                  {selectedIngredients.length}
                </span>
              )}
            </span>
            <motion.div
              animate={{ rotate: ingredientsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={20} className="text-stone-400" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {ingredientsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2.5 mt-4 px-1">
                  {ingredients.map((ingredient) => (
                    <button
                      key={ingredient}
                      onClick={() => toggleIngredient(ingredient)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-110 ${
                        selectedIngredients.includes(ingredient)
                          ? 'bg-white text-stone-900 shadow-lg border-2 border-white'
                          : 'bg-stone-800 text-stone-400 border-2 border-stone-700 hover:border-stone-500 hover:shadow-md hover:text-white'
                      }`}
                    >
                      {t(`ingredients.${ingredient}`)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
