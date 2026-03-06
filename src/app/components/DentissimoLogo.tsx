/**
 * Dentissimo brand logo — official logo image from dentissimo.ua
 */

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  /** When true the logo renders with brightness filter for dark backgrounds */
  light?: boolean;
  className?: string;
}

const heights = {
  sm: 'h-10',
  md: 'h-14',
  lg: 'h-20',
};

export const DentissimoLogo = ({ size = 'md', light = false, className = '' }: LogoProps) => {
  return (
    <img
      src="/images/dentissimo-logo.png"
      alt="Dentissimo"
      className={`${heights[size]} w-auto object-contain ${light ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert'} ${className}`}
    />
  );
};
