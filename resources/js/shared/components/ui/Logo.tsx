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
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "shrink-0 flex items-center group active:scale-[0.98] transition-transform cursor-pointer select-none",
        className
      )}
    >
      <img
        src="https://oliverdeck.ru/thumb/2/LCcef9rDO6nWj2bcKBs__w/300c84/d/logox80-svg.svg"
        alt="OliverDeck"
        className={cn(
          "h-9 sm:h-11 w-auto object-contain transition-all",
          imgClassName
        )}
      />
    </Link>
  );
}