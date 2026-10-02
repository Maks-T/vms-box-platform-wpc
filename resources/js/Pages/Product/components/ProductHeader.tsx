import React from 'react';
import {Link} from '@inertiajs/react';
import {route} from 'ziggy-js';

export function ProductHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs text-stone-500">
      <Link
        href={route('catalog')}
        className="inline-flex items-center gap-1.5 font-bold text-stone-800 hover:text-brand-gold uppercase tracking-wider transition-colors"
      >
        <span>← Назад в каталог</span>
      </Link>

      <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
        <Link href="/" className="hover:underline">Главная</Link>
        <span>/</span>
        <Link href={route('catalog')} className="hover:underline">Террасная доска ДПК</Link>
        <span>/</span>
        <span className="text-stone-800 font-medium">Карточка товара</span>
      </div>
    </div>
  );
}