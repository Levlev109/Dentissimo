import { ShieldCheck, Stethoscope, Leaf, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TrustBadges = () => {
  const { t } = useTranslation();
  
  const badges = [
    {
      icon: Stethoscope,
      titleKey: "trustBadges.dentistApproved",
      descKey: "trustBadges.dentistApprovedDesc"
    },
    {
      icon: ShieldCheck,
      titleKey: "trustBadges.glacierWater",
      descKey: "trustBadges.glacierWaterDesc"
    },
    {
      icon: Leaf,
      titleKey: "trustBadges.ecoFriendly",
      descKey: "trustBadges.ecoFriendlyDesc"
    },
    {
      icon: Award,
      titleKey: "trustBadges.swissMade",
      descKey: "trustBadges.swissMadeDesc"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-stone-950 border-b border-stone-50 dark:border-stone-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center group cursor-default">
              <div className="mb-4 p-3 rounded-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300">
                <badge.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide mb-1">{t(badge.titleKey)}</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">{t(badge.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
