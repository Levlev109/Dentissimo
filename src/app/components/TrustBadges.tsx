import { Truck, Users, Lock, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TrustBadges = () => {
  const { t } = useTranslation();
  
  const badges = [
    {
      icon: Truck,
      titleKey: "trustBadges.freeDelivery",
      descKey: "trustBadges.freeDeliveryDesc"
    },
    {
      icon: Lock,
      titleKey: "trustBadges.securePayment",
      descKey: "trustBadges.securePaymentDesc"
    },
    {
      icon: RotateCcw,
      titleKey: "trustBadges.moneyBack",
      descKey: "trustBadges.moneyBackDesc"
    },
    {
      icon: Users,
      titleKey: "trustBadges.happyCustomers",
      descKey: "trustBadges.happyCustomersDesc"
    }
  ];

  return (
    <section className="py-8 bg-stone-50/30 dark:bg-stone-950 border-b border-stone-200/40 dark:border-stone-800/20 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3 group cursor-default">
              <div className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white group-hover:border-sky-400 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/30 transition-all duration-300 flex-shrink-0">
                <badge.icon size={20} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-tight mb-0.5">{t(badge.titleKey)}</h3>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight truncate">{t(badge.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
