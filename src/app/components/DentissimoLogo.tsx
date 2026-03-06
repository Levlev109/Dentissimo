/**
 * Dentissimo brand logo — tooth/leaf icon + "dentissimo" wordmark.
 * Matches the official packaging: graphite color, elegant serif font.
 */

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  /** When true the logo renders in white (for dark backgrounds like footer) */
  light?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 28, text: 'text-lg',  gap: 'gap-1.5' },
  md: { icon: 36, text: 'text-xl',  gap: 'gap-2'   },
  lg: { icon: 44, text: 'text-2xl', gap: 'gap-2.5'  },
};

/** Official Dentissimo leaf/wave mark — two flowing curves */
const LeafIcon = ({ size = 36, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size * 0.5}
    viewBox="0 0 120 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Upper leaf/wave — curves right and tapers */}
    <path
      d="M58 6C46 6 34 10 26 18c-6 6-10 13-8 18 1.5 4 6 5 12 3 8-3 18-10 28-10 8 0 14 3 20 3 5 0 9-2 12-6 4-5 4-12 0-16C86 4 72 6 58 6z"
      fill={color}
      opacity="0.7"
    />
    {/* Lower leaf/wave — curves left, overlapping */}
    <path
      d="M62 46c12 0 24-4 32-12 6-6 10-13 8-18-1.5-4-6-5-12-3-8 3-18 10-28 10-8 0-14-3-20-3-5 0-9 2-12 6-4 5-4 12 0 16C34 48 48 46 62 46z"
      fill={color}
      opacity="0.45"
    />
  </svg>
);

export const DentissimoLogo = ({ size = 'md', light = false, className = '' }: LogoProps) => {
  const s = sizes[size];
  const color = light
    ? 'text-white'
    : 'text-stone-700 dark:text-stone-200';

  return (
    <span className={`inline-flex items-center ${s.gap} ${color} ${className}`}>
      <LeafIcon size={s.icon} />
      <span
        className={`${s.text} tracking-[0.18em] font-light`}
        style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
      >
        dentissimo
      </span>
    </span>
  );
};
