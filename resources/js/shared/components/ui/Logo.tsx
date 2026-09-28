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
  const isLight = variant === 'light-solid' || variant === 'dark-outline';

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "shrink-0 flex items-center group active:scale-[0.98] transition-transform cursor-pointer py-1 select-none",
        className
      )}
    >
      <img
        src="/images/logo_black.png"
        alt="GreenDECKS"
        className={cn(
          "h-10 sm:h-11 md:h-12 lg:h-[50px] w-auto object-contain transition-all",
          !isLight && "brightness-0 invert opacity-95",
          imgClassName
        )}
      />
    </Link>
  );
}