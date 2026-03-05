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
    <section className="py-8 bg-gradient-to-b from-stone-50/40 to-white dark:from-stone-950 dark:to-amber-950/10 border-b border-stone-100/40 dark:border-amber-900/20 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3 group cursor-default">
              <div className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all duration-300 flex-shrink-0">
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
