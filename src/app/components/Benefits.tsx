import { Check } from 'lucide-react';

const benefits = [
  "Термальна вода від Аржантьєра для унікального догляду",
  "Швейцарська алмазна пудра для блиску та здоров'я емалі",
  "Інноваційна золота формула з часточками золота 24 карата",
  "100% веганські та біо-натуральні формули",
  "Без SLS, парабенів, триклозану та фторидів",
  "Клінічно підтверджено Center of Dental Medicine, University of Zurich"
];

export const Benefits = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative h-[600px]">
             <div className="absolute inset-0 bg-stone-200 rounded-t-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1754788358645-d6e6cca12e25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" 
                  alt="Luxury Bathroom" 
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <h2 className="font-serif text-3xl md:text-5xl text-stone-900 mb-6 leading-tight">
              Argentiere Glacier Water<br/> <span className="text-[#D4AF37] italic">Oral Well-Being</span>
            </h2>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              Ми віримо, що догляд за порожниною рота має бути ритуалом, а не рутиною. Наші продукти поєднують клінічну точність з преміальною естетикою та унікальними швейцарськими інгредієнтами.
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-stone-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <button className="mt-10 px-8 py-4 bg-stone-100 text-stone-900 font-medium hover:bg-stone-200 transition-colors">
              Читайте про нашу науку
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
