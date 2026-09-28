import React from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export function CatalogHeroBlock() {
  return (
    <section className="relative bg-brand-charcoal text-white py-16 sm:py-24 lg:py-28 overflow-hidden w-full">
      {/* Фоновый градиент и сетка */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-brand-darkOlive/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#a5c33c_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="max-w-2xl">
          <span className="inline-block bg-brand-lime text-brand-charcoal font-heading font-extrabold text-[11px] uppercase tracking-widest px-3 py-1 rounded-sm mb-4">
            Ведущий поставщик изделий из ДПК в Казахстане
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight leading-none mb-6">
            Террасные системы <br />
            <span className="text-brand-lime">нового поколения</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
            Экспертные решения из древесно-полимерного композита: террасная доска, фасадные панели и ограждения. Адаптированы к суровому климату РК от -50°C до +50°C. Гарантия до 25 лет.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#catalog"
              className="bg-brand-lime hover:bg-brand-limeHover text-brand-charcoal font-heading font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded shadow-lg transition active:scale-95"
            >
              Смотреть каталог
            </a>
            <Link
              href={route('calculator.show')}
              className="bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded border border-white/20 backdrop-blur-sm transition active:scale-95"
            >
              Онлайн-калькулятор
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}