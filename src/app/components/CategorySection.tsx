import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 1,
    title: 'Limited Edition',
    description: 'Ексклюзивні пасти з унікальними інгредієнтами',
    image: 'https://images.unsplash.com/photo-1535332371349-a5d229f49cb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    link: '#'
  },
  {
    id: 2,
    title: 'Професійний догляд',
    description: 'Complete Care та Pro Care серії',
    image: 'https://images.unsplash.com/photo-1622583623228-ebcd0c7897b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    link: '#'
  },
  {
    id: 3,
    title: 'Натуральні формули',
    description: 'Bio-Natural, Vegan та CBD',
    image: 'https://images.unsplash.com/photo-1674632655437-077f7edbe65c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    link: '#'
  },
  {
    id: 4,
    title: 'Для дітей',
    description: 'Kids та Junior серії',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    link: '#'
  }
];

export const CategorySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">Ваш щоденний догляд</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">Швейцарська якість для здоров'я ваших зубів</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <motion.a
              href={cat.link}
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group block relative overflow-hidden aspect-[3/4] bg-stone-100"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <h3 className="font-serif text-xl mb-1">{cat.title}</h3>
                <p className="text-sm text-white/80 mb-2">{cat.description}</p>
                <div className="flex items-center gap-2 text-xs font-medium tracking-wide opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span>ДІЗНАТИСЬ БІЛЬШЕ</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
