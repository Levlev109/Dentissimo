import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Олена К.",
    location: "Київ, Україна",
    text: "SPA Expert з термальною водою льодовика - це просто диво! Зуби стали білішими, а десна здоровішими. Відчуваю справжній швейцарський догляд!",
    rating: 5
  },
  {
    id: 2,
    name: "Марко Р.",
    location: "Львів, Україна",
    text: "Паста Diamond з алмазною пудрою - найкраща для чутливих зубів. Ніжна, але ефективна. Ціна виправдовує себе на 100%.",
    rating: 5
  },
  {
    id: 3,
    name: "Анастасія М.",
    location: "Одеса, Україна",
    text: "Золота паста Advanced Whitening Gold - це розкіш у кожному використанні. Зуби світяться здоров'ям. Рекомендую всім!",
    rating: 5
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">Відгуки клієнтів</h2>
          <p className="text-stone-500">Приєднуйтесь до тисяч задоволених клієнтів в Україні та Європі.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow border border-stone-100">
              <div className="flex gap-1 text-[#D4AF37] mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-stone-700 mb-6 italic leading-relaxed">"{review.text}"</p>
              <div>
                <p className="font-bold text-stone-900 text-sm">{review.name}</p>
                <p className="text-xs text-stone-400 uppercase tracking-wide">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
