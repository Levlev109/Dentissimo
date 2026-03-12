import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const RefundPolicyPage = () => {
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
          {t('refund.title')}
        </h1>

        <div className="space-y-8 text-stone-300 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('refund.rightTitle')}</h2>
            <p>{t('refund.rightText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('refund.conditionsTitle')}</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>{t('refund.condition1')}</li>
              <li>{t('refund.condition2')}</li>
              <li>{t('refund.condition3')}</li>
              <li>{t('refund.condition4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('refund.processTitle')}</h2>
            <p>{t('refund.processText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('refund.refundMethodTitle')}</h2>
            <p>{t('refund.refundMethodText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('refund.cancelTitle')}</h2>
            <p>{t('refund.cancelText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('refund.exceptionsTitle')}</h2>
            <p>{t('refund.exceptionsText')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">{t('refund.contactTitle')}</h2>
            <p>{t('refund.contactText')}</p>
          </section>
        </div>
      </div>
    </main>
  );
};
