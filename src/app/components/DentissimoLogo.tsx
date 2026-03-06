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

/** Official Dentissimo swoosh mark — two flowing brushstroke waves */
const LeafIcon = ({ size = 36, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size * 0.45}
    viewBox="0 0 200 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Upper swoosh — larger, flows left to right */}
    <path
      d="M8 38c12-18 32-30 56-32 20-1.5 38 6 54 4 14-1.8 26-8 36-16-6 14-20 24-38 28-16 3.5-34-2-52-2C44 20 26 28 8 38z"
      fill={color}
    />
    {/* Lower swoosh — smaller, slightly below */}
    <path
      d="M30 58c10-12 26-22 46-24 16-1.5 30 4 44 3 12-1 22-6 30-12-5 10-16 18-30 22-14 3-28-1-42-1-14 0-30 4-48 12z"
      fill={color}
      opacity="0.65"
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
