/**
 * Dentissimo brand logo — official logo image from dentissimo.ua
 */

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const heights = {
  sm: 'h-10',
  md: 'h-14',
  lg: 'h-20',
};

export const DentissimoLogo = ({ size = 'md', className = '' }: LogoProps) => {
  return (
    <img
      src="/images/dentissimo-logo.png"
      alt="Dentissimo"
      className={`${heights[size]} w-auto object-contain brightness-0 invert ${className}`}
    />
  );
};
