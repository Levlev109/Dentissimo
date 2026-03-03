import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer id="contacts" className="bg-stone-900 text-white pt-20 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-serif text-2xl font-bold tracking-wider">DENTISSIMO</a>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/dentissimo_official/" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="https://www.facebook.com/dentissimo.toothpaste/" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="https://twitter.com/dentissimo" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">{t('footer.products')}</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><a href="#limited" className="hover:text-white transition-colors">{t('footer.limitedEdition')}</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">{t('footer.spaExpert')}</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">{t('footer.diamondSeries')}</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">{t('footer.bioNatural')}</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">{t('footer.forKids')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">{t('footer.aboutBrand')}</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><a href="#about" className="hover:text-white transition-colors">{t('footer.ourStory')}</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">{t('footer.glacierWater')}</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">{t('footer.swissQuality')}</a></li>
              <li><a href="https://dentissimo.ua/certificates/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('footer.clinicalStudies')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">{t('footer.support')}</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><a href="mailto:info@blasspharma.com" className="hover:text-white transition-colors">{t('footer.contacts')}</a></li>
              <li><a href="#contacts" className="hover:text-white transition-colors">{t('footer.delivery')}</a></li>
              <li><a href="#contacts" className="hover:text-white transition-colors">{t('footer.faq')}</a></li>
              <li><a href="https://dentissimo.ua/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('footer.stores')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>{t('footer.copyright')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contacts" className="hover:text-stone-300">{t('footer.privacy')}</a>
            <a href="#contacts" className="hover:text-stone-300">{t('footer.terms')}</a>
            <a href="#contacts" className="hover:text-stone-300">{t('footer.cookies')}</a>
          </div>
        </div>
        
        <div className="mt-8 text-[10px] text-stone-600 text-center max-w-3xl mx-auto leading-relaxed">
          {t('footer.disclaimer')}
        </div>
      </div>
    </footer>
  );
};
