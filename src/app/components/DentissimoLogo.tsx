/**
 * Dentissimo brand logo — text-based logo matching the official brand identity
 */

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  /** When true the logo renders in white for dark backgrounds */
  light?: boolean;
  className?: string;
}

const config = {
  sm: { height: 'h-10', text: 'text-lg', sub: 'text-[5px]', gap: 'gap-0.5', line: 'w-4' },
  md: { height: 'h-14', text: 'text-2xl', sub: 'text-[6px]', gap: 'gap-1', line: 'w-5' },
  lg: { height: 'h-20', text: 'text-3xl', sub: 'text-[7px]', gap: 'gap-1', line: 'w-6' },
};

export const DentissimoLogo = ({ size = 'md', className = '' }: LogoProps) => {
  const c = config[size];
  return (
    <div className={`${c.height} flex flex-col items-center justify-center select-none ${className}`}>
      <span
        className={`font-serif ${c.text} text-white tracking-[0.12em] font-bold leading-none`}
      >
        dentissimo
      </span>
      <div className={`flex items-center ${c.gap} mt-0.5`}>
        <span className={`${c.line} h-px bg-white/30`} />
        <span className={`${c.sub} text-stone-400 tracking-[0.35em] uppercase font-semibold whitespace-nowrap`}>
          Swiss Premium Care
        </span>
        <span className={`${c.line} h-px bg-white/30`} />
      </div>
    </div>
  );
};
