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
  sm: { icon: 20, text: 'text-lg',  gap: 'gap-1.5' },
  md: { icon: 26, text: 'text-xl',  gap: 'gap-2'   },
  lg: { icon: 32, text: 'text-2xl', gap: 'gap-2.5'  },
};

/** Stylised tooth / leaf mark inspired by the Dentissimo packaging */
const ToothIcon = ({ size = 26, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Outer tooth silhouette */}
    <path
      d="M24 4C17.5 4 13 8.5 11 13c-2.5 5.5-1 12.5 1 17 1.5 3.5 3.5 8 5.5 10.5 1.5 2 3 2.5 4 2.5 1.5 0 2.2-1.5 3.5-5 .8-2.2 1.5-2.2 2.3 0 1.3 3.5 2 5 3.5 5 1 0 2.5-.5 4-2.5 2-2.5 4-7 5.5-10.5 2-4.5 3.5-11.5 1-17C39 8.5 30.5 4 24 4z"
      fill={color}
      opacity="0.12"
    />
    {/* Leaf / wave accent */}
    <path
      d="M16 18c3-4 7-5 10-4 3.5 1.2 5 4.5 4 8-1 3-4 5.5-8 5.5S15.5 25.5 15 22c-.3-2 .2-3.2 1-4z"
      fill={color}
      opacity="0.35"
    />
    {/* Refined outline */}
    <path
      d="M24 6c-6 0-10 4-12 8.5-2 5-.8 11.5 1 16 1.3 3.2 3.2 7.5 5 9.5 1 1.2 2 1.5 2.5 1.5 1 0 1.5-1 2.8-4.5 1.2-3.2 2.2-3.2 3.4 0 1.3 3.5 1.8 4.5 2.8 4.5.5 0 1.5-.3 2.5-1.5 1.8-2 3.7-6.3 5-9.5 1.8-4.5 3-11 1-16C36 10 30 6 24 6z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
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
      <ToothIcon size={s.icon} />
      <span
        className={`${s.text} tracking-[0.18em] font-light`}
        style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
      >
        dentissimo
      </span>
    </span>
  );
};
