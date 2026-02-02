import { ProductCard } from '@/app/components/ProductCard';

const products = [
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
  }
];

export const FeaturedProducts = () => {
  return (
    <section className="py-24 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">Premium Oral Care</h2>
            <p className="text-stone-500">Відкрийте для себе швейцарську якість догляду за зубами</p>
          </div>
          <a href="#" className="hidden md:inline-block text-stone-900 font-medium hover:text-[#D4AF37] transition-colors pb-1 border-b border-stone-300 hover:border-[#D4AF37]">
            Всі продукти
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <a href="#" className="inline-block px-6 py-3 border border-stone-900 text-stone-900 font-medium">
            Всі продукти
          </a>
        </div>
      </div>
    </section>
  );
};
