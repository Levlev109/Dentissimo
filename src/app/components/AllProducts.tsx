import { useState } from 'react';
import { ProductCard } from './ProductCard';

const allProducts = [
  // Limited Edition Series
  {
    id: 'spa-expert',
    name: 'SPA Expert',
    category: 'Limited Edition',
    price: 189.00,
    description: 'З термальною водою льодовика Аржантьєра',
    image: 'https://images.unsplash.com/photo-1622583623228-ebcd0c7897b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    isNew: true
  },
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'Limited Edition',
    price: 199.00,
    description: 'Зубна паста з швейцарською алмазною пудрою',
    image: 'https://images.unsplash.com/photo-1674632655437-077f7edbe65c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    isNew: true
  },
  {
    id: 'whitening-gold',
    name: 'Advanced Whitening Gold',
    category: 'Limited Edition',
    price: 219.00,
    description: 'Інноваційна золота формула з часточками золота 24 карата',
    image: 'https://images.unsplash.com/photo-1535332371349-a5d229f49cb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    isNew: true
  },
  {
    id: 'whitening-black',
    name: 'Extra-Whitening Black',
    category: 'Limited Edition',
    price: 189.00,
    description: 'З натуральним 100% активованим вугіллям',
    image: 'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    isNew: true
  },
  
  // Professional Care Series
  {
    id: 'complete-care',
    name: 'Complete Care',
    category: 'Зубна паста',
    price: 159.00,
    description: 'Унікальний комплекс Regera-Pro для повного захисту',
    image: 'https://images.unsplash.com/photo-1622583623228-ebcd0c7897b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  {
    id: 'pro-whitening',
    name: 'Pro-Whitening',
    category: 'Зубна паста',
    price: 159.00,
    description: 'Професійне відбілювання для білосніжної усмішки',
    image: 'https://images.unsplash.com/photo-1622583623228-ebcd0c7897b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  {
    id: 'pro-care-teeth-gums',
    name: 'Pro Care Teeth & Gums',
    category: 'Зубна паста',
    price: 159.00,
    description: 'Ефективна допомога проти запалення і чутливості ясен',
    image: 'https://images.unsplash.com/photo-1622583623228-ebcd0c7897b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  
  // Natural & Special Series
  {
    id: 'bio-natural',
    name: 'Bio-Natural with Herbs',
    category: 'Зубна паста',
    price: 159.00,
    description: 'Створено природою, розроблено наукою',
    image: 'https://images.unsplash.com/photo-1674632655437-077f7edbe65c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  {
    id: 'vegan-b12',
    name: 'Vegan with Vitamin B12',
    category: 'Зубна паста',
    price: 159.00,
    description: '100% веганська формула з вітаміном B12',
    image: 'https://images.unsplash.com/photo-1674632655437-077f7edbe65c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  {
    id: 'perio-care-cbd',
    name: 'Perio Care CBD',
    category: 'Зубна паста',
    price: 179.00,
    description: 'З екстрактом конопель Cannabis Sativa Seed Oil',
    image: 'https://images.unsplash.com/photo-1674632655437-077f7edbe65c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  {
    id: 'pregnant-young-mum',
    name: 'Pregnant & Young Mum',
    category: 'Зубна паста',
    price: 159.00,
    description: 'Спеціальна формула для вагітних і молодих мам',
    image: 'https://images.unsplash.com/photo-1622583623228-ebcd0c7897b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  
  // Kids Series
  {
    id: 'kids-caramel',
    name: 'Kids 2-6 Years',
    category: 'Дитяча зубна паста',
    price: 139.00,
    description: 'Смак карамелі для дітей 2-6 років',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  {
    id: 'junior-apple',
    name: 'Junior 6+ Years',
    category: 'Дитяча зубна паста',
    price: 139.00,
    description: 'Яблучний смак для дітей 6+ років',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  
  // Toothbrushes - Adult
  {
    id: 'brush-medium',
    name: 'Зубна щітка Medium',
    category: 'Зубні щітки',
    price: 89.00,
    description: 'Щетина середньої жорсткості для щоденного догляду',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  {
    id: 'brush-hard',
    name: 'Зубна щітка Hard',
    category: 'Зубні щітки',
    price: 89.00,
    description: 'Жорстка щетина для глибокого очищення',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  {
    id: 'brush-sensitive',
    name: 'Зубна щітка Sensitive',
    category: 'Зубні щітки',
    price: 89.00,
    description: 'М\'яка щетина для чутливих зубів і ясен',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  {
    id: 'brush-parodontal',
    name: 'Зубна щітка Parodontal',
    category: 'Зубні щітки',
    price: 99.00,
    description: 'Спеціальна щетина для пародонтального догляду',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  
  // Limited Edition Brushes
  {
    id: 'brush-gold-medium',
    name: 'Gold Medium Limited Edition',
    category: 'Зубні щітки',
    price: 149.00,
    description: 'Золота щітка середньої жорсткості',
    image: 'https://images.unsplash.com/photo-1535332371349-a5d229f49cb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    isNew: true
  },
  {
    id: 'brush-silver-hard',
    name: 'Silver Hard Limited Edition',
    category: 'Зубні щітки',
    price: 149.00,
    description: 'Срібна щітка жорсткої щетини',
    image: 'https://images.unsplash.com/photo-1674632655437-077f7edbe65c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    isNew: true
  },
  
  // Kids Toothbrushes
  {
    id: 'brush-kids-2-6',
    name: 'Kids Brush 2-6 Years',
    category: 'Дитячі зубні щітки',
    price: 69.00,
    description: 'М\'яка щітка для дітей 2-6 років',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  {
    id: 'brush-junior-6plus',
    name: 'Junior Brush 6+ Years',
    category: 'Дитячі зубні щітки',
    price: 69.00,
    description: 'Щітка для дітей 6+ років',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  },
  
  // Mouthwash
  {
    id: 'mouthwash-professional',
    name: 'Ополіскувач для порожнини рота',
    category: 'Ополіскувачі',
    price: 169.00,
    description: 'Проти зубного каменю і кровоточивості ясен',
    image: 'https://images.unsplash.com/photo-1622583623228-ebcd0c7897b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  }
];

export const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'Всі продукти' },
    { id: 'Limited Edition', name: 'Limited Edition' },
    { id: 'Зубна паста', name: 'Зубні пасти' },
    { id: 'Зубні щітки', name: 'Зубні щітки' },
    { id: 'Дитяча зубна паста', name: 'Для дітей' },
    { id: 'Дитячі зубні щітки', name: 'Дитячі щітки' },
    { id: 'Ополіскувачі', name: 'Ополіскувачі' }
  ];
  
  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">Наш повний асортимент</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            Відкрийте для себе всю колекцію преміальних продуктів Dentissimo
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
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-500">Продукти не знайдено</p>
          </div>
        )}
      </div>
    </section>
  );
};
