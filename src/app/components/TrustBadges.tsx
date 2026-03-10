import { Truck, Users, Lock, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export const TrustBadges = () => {
  const { t } = useTranslation();
  
  const badges = [
    {
      icon: Truck,
      titleKey: "trustBadges.swissMade",
      descKey: "trustBadges.swissMadeDesc"
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
    <section className="py-10 bg-stone-950 border-b border-stone-800/30 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center gap-3 group cursor-default"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="p-3.5 bg-teal-900/20 border border-teal-800/30 text-teal-400 group-hover:bg-teal-800/30 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <badge.icon size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-100 leading-tight mb-0.5">{t(badge.titleKey)}</h3>
                <p className="text-xs text-stone-300 leading-tight">{t(badge.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
