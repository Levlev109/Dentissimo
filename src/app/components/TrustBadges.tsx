import { ShieldCheck, Stethoscope, Leaf, Award } from 'lucide-react';

const badges = [
  {
    icon: Stethoscope,
    title: "Dentist Approved",
    desc: "University of Zurich"
  },
  {
    icon: ShieldCheck,
    title: "Argentiere Water",
    desc: "Glacier mineral formula"
  },
  {
    icon: Leaf,
    title: "Vegan Formulas",
    desc: "Bio-active ingredients"
  },
  {
    icon: Award,
    title: "Swiss Quality",
    desc: "Premium oral care"
  }
];

export const TrustBadges = () => {
  return (
    <section className="py-16 bg-white border-b border-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center group cursor-default">
              <div className="mb-4 p-3 rounded-full bg-stone-50 text-stone-900 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300">
                <badge.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-1">{badge.title}</h3>
              <p className="text-xs text-stone-500 font-medium">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
