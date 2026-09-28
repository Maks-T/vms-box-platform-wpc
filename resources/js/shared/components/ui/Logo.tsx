import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/shared/lib/utils';
import { route } from 'ziggy-js';

type LogoVariant = 'dark-outline' | 'light-solid' | 'dark-solid' | 'orange-dark';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  imgClassName?: string;
  href?: string;
  onClick?: () => void;
}

export function Logo({
                       variant = 'dark-solid',
                       className,
                       href = route('catalog'),
                       onClick
                     }: LogoProps) {
  const isLight = variant === 'light-solid' || variant === 'dark-outline';

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "shrink-0 flex items-center gap-2 group active:scale-[0.98] transition-transform cursor-pointer py-1 select-none",
        className
      )}
    >
      <div className={cn(
        "font-heading font-extrabold text-xl sm:text-2xl tracking-tight leading-none",
        isLight ? "text-gray-900" : "text-white"
      )}>
        Green<span className="text-brand-lime">DECKS</span>
      </div>
      <span className={cn(
        "text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold border-l pl-2 leading-tight hidden xs:inline-block",
        isLight ? "text-gray-400 border-gray-300" : "text-white/40 border-white/20"
      )}>
        Composite WPC
      </span>
    </Link>
  );
}