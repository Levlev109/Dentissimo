import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Building } from 'lucide-react';

export const ContactInfoPage = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-stone-950 text-white pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          {t('common.back', 'На головну')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          {t('contactInfo.title')}
        </h1>

        <div className="space-y-8 text-stone-300 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">{t('contactInfo.contactsTitle')}</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-cyan-400 shrink-0" />
                <a
                  href="mailto:info@blasspharma.com"
                  className="hover:text-cyan-400 transition-colors"
                >
                  {t('contactInfo.email')}
                </a>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Власник</h2>
            <div className="flex items-start gap-3">
              <Building size={20} className="text-cyan-400 mt-0.5 shrink-0" />
              <p className="text-white font-medium">Blass Polska Sp. z o.o.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
