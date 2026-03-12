import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsPage = () => {
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
          {t('terms.title')}
        </h1>

        <div className="space-y-8 text-stone-300 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('terms.generalTitle')}</h2>
            <p>{t('terms.generalText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('terms.orderTitle')}</h2>
            <p>{t('terms.orderText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('terms.paymentTitle')}</h2>
            <p>{t('terms.paymentText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('terms.deliveryTitle')}</h2>
            <p>{t('terms.deliveryText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('terms.warrantyTitle')}</h2>
            <p>{t('terms.warrantyText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('terms.liabilityTitle')}</h2>
            <p>{t('terms.liabilityText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('terms.changesTitle')}</h2>
            <p>{t('terms.changesText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('terms.contactTitle')}</h2>
            <p>{t('terms.contactText')}</p>
          </section>
        </div>
      </div>
    </main>
  );
};
