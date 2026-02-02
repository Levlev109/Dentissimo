export const AboutSection = () => {
  return (
    <section className="py-24 bg-stone-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
           <div className="w-full md:w-1/2 order-2 md:order-1">
            <span className="block text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">Dentissimo Premium Oral Care</span>
            <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
              Вода, народжена<br/> в серці Монблану
            </h2>
            <p className="text-stone-300 mb-6 leading-relaxed font-light">
              Серед величних Альп, у серці масиву Монблан, бере початок унікальна льодовикова вода Аржантьєра. Тисячі років його крижана вода пробивала собі шлях крізь кам'яні джунглі гори, збагачуючись цінними мінералами та набуваючи кришталевої прозорості.
            </p>
            <p className="text-stone-300 mb-6 leading-relaxed font-light">
              Саме ця приголомлива енергія стала основою формули преміальних зубних паст Dentissimo. Наш порядок - профілактика та підтримка здоров'я зубів щодня, щоб ваша посмішка залишалася світлою і впевненою.
            </p>
            <p className="text-stone-300 mb-8 leading-relaxed font-light">
              <strong className="text-white">Лінійка Dentissimo SPA Expert</strong> - льодовикова Аржантьєра є ключовим символом спілки та продуманості для здоров'я зубів. Саме він надихнув Dentissimo Premium Oral Care на створення інноваційних продуктів для здоров'я зубів та ясен, щоб наукою підходу і турботі про природну красу усмішки.
            </p>
            
            <img 
               src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Switzerland.svg/512px-Flag_of_Switzerland.svg.png" 
               alt="Swiss Flag" 
               className="h-8 w-auto opacity-80 grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          
          <div className="w-full md:w-1/2 order-1 md:order-2">
             <div className="relative aspect-[4/5] md:aspect-square overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1675526607070-f5cbd71dde92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" 
                  alt="Professional Dentist" 
                  className="w-full h-full object-cover opacity-90"
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
