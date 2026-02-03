import { useTranslation } from 'react-i18next';

export const AboutSection = () => {
  const { t } = useTranslation();
  
  return (
    <section id="about" className="py-24 bg-stone-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
           <div className="w-full md:w-1/2 order-2 md:order-1">
            <span className="block text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">Dentissimo Premium Oral Care</span>
            <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
              {t('about.glacierTitle')}
            </h2>
            <p className="text-stone-300 mb-6 leading-relaxed font-light">
              {t('about.glacierText1')}
            </p>
            <p className="text-stone-300 mb-6 leading-relaxed font-light">
              {t('about.glacierText2')}
            </p>
            <p className="text-stone-300 mb-8 leading-relaxed font-light">
              {t('about.glacierText3')}
            </p>
            
            <img 
               src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Switzerland.svg/512px-Flag_of_Switzerland.svg.png" 
               alt="Swiss Flag" 
               className="h-8 w-auto opacity-80 grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
