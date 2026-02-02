import { Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white pt-20 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <a href="#" className="font-serif text-2xl font-bold tracking-wider">DENTISSIMO</a>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Преміальні рішення для догляду за порожниною рота. Швейцарська точність, щоденна розкіш.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Продукція</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Limited Edition</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SPA Expert</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Diamond Series</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bio-Natural & Vegan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Для дітей</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Про бренд</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Наша історія</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Argentiere Glacier Water</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Swiss Quality</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Клінічні дослідження</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Підтримка</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Контакти</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Доставка та повернення</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Часті питання</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Магазини</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>© 2026 Dentissimo. Всі права захищені.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:text-stone-300">Політика конфіденційності</a>
            <a href="#" className="hover:text-stone-300">Умови користування</a>
            <a href="#" className="hover:text-stone-300">Політика cookie</a>
          </div>
        </div>
        
        <div className="mt-8 text-[10px] text-stone-600 text-center max-w-3xl mx-auto leading-relaxed">
          Відповідає регуляції ЄС 1223/2009 про косметичну продукцію. 
          Сертифіковано згідно з технічними регламентами України. 
          Дистриб'ютор: Dentissimo International AG, Цюрих, Швейцарія.
        </div>
      </div>
    </footer>
  );
};
