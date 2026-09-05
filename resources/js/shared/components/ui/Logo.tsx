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
                       imgClassName,
                       href = route('catalog'),
                       onClick
                     }: LogoProps) {
  const getLogoSrc = () => {
    switch (variant) {
      case 'dark-outline':
        return '/images/logo.svg';
      case 'light-solid':
        return '/images/logo.svg';
      case 'orange-dark':
        return '/images/logo.svg';
      case 'dark-solid':
      default:
        return '/images/logo.svg';
    }
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "shrink-0 flex items-center active:scale-[0.98] transition-transform cursor-pointer py-1",
        className
      )}
    >
      <img
        src={getLogoSrc()}
        alt="VISTEGRA"
        className={cn("h-7 md:h-8 w-auto object-contain", imgClassName)}
      />
    </Link>
  );
}