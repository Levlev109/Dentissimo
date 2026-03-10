import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DentissimoLogo } from './DentissimoLogo';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer id="contacts" className="bg-stone-950 text-white pt-16 md:pt-24 pb-10 relative overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-10 md:mb-16">
          <div className="space-y-6">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <DentissimoLogo size="lg" light />
            </a>
            <p className="text-stone-300 text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-3">
              <a href="https://www.instagram.com/dentissimo_official/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"><Instagram size={18} /></a>
              <a href="https://www.facebook.com/dentissimo.toothpaste/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"><Facebook size={18} /></a>
              <a href="https://twitter.com/dentissimo" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"><Twitter size={18} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">{t('footer.products')}</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><a href="#limited" className="hover:text-teal-400 transition-colors duration-200">{t('footer.limitedEdition')}</a></li>
              <li><a href="#products" className="hover:text-teal-400 transition-colors duration-200">{t('footer.spaExpert')}</a></li>
              <li><a href="#products" className="hover:text-teal-400 transition-colors duration-200">{t('footer.diamondSeries')}</a></li>
              <li><a href="#products" className="hover:text-teal-400 transition-colors duration-200">{t('footer.bioNatural')}</a></li>
              <li><a href="#products" className="hover:text-teal-400 transition-colors duration-200">{t('footer.forKids')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">{t('footer.aboutBrand')}</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><a href="#about" className="hover:text-teal-400 transition-colors duration-200">{t('footer.ourStory')}</a></li>
              <li><a href="#about" className="hover:text-teal-400 transition-colors duration-200">{t('footer.glacierWater')}</a></li>
              <li><a href="#about" className="hover:text-teal-400 transition-colors duration-200">{t('footer.swissQuality')}</a></li>
              <li><a href="https://dentissimo.ua/certificates/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors duration-200">{t('footer.clinicalStudies')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">{t('footer.support')}</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><a href="mailto:info@blasspharma.com" className="hover:text-teal-400 transition-colors duration-200">{t('footer.contacts')}</a></li>
              <li><a href="#contacts" className="hover:text-teal-400 transition-colors duration-200">{t('footer.delivery')}</a></li>
              <li><a href="#contacts" className="hover:text-teal-400 transition-colors duration-200">{t('footer.faq')}</a></li>
              <li><a href="https://dentissimo.ua/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors duration-200">{t('footer.stores')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400">
          <p>{t('footer.copyright')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contacts" className="hover:text-stone-300 transition-colors">{t('footer.privacy')}</a>
            <a href="#contacts" className="hover:text-stone-300 transition-colors">{t('footer.terms')}</a>
            <a href="#contacts" className="hover:text-stone-300 transition-colors">{t('footer.cookies')}</a>
          </div>
        </div>
        
        <div className="mt-8 text-xs text-stone-500 text-center max-w-3xl mx-auto leading-relaxed">
          {t('footer.disclaimer')}
        </div>
      </div>
    </footer>
  );
};
