import React from 'react';
import { Link } from '@inertiajs/react';
import { Calculator } from 'lucide-react';
import { route } from 'ziggy-js';

interface Props {
  name: string;
  priceFrom: number;
  bootstrapConfig?: any;
  shortDescription?: string | null; // Добавили краткое описание
  description?: string | null;      // Добавили полное описание
}

export function ProductMainInfo({name, priceFrom, bootstrapConfig, shortDescription, description}: Props) {
  const currencySymbol = '₽';

  const formattedNumber = priceFrom > 0
    ? new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceFrom)
    : '';

  const meterPrice = priceFrom > 0 ? Math.round(priceFrom * 0.15) : 0;
  const formattedMeterNumber = meterPrice > 0
    ? new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(meterPrice)
    : '';

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs text-brand-gold font-bold uppercase tracking-wider block mb-1">
          Собственное производство (Россия)
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
          {name}
        </h1>
      </div>

      {/* Блок цен строго в рублях */}
      <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
            Базовая цена от
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">
              {priceFrom > 0 ? `${formattedNumber} ${currencySymbol}` : 'По запросу'}
            </span>
            <span className="text-sm font-normal text-stone-500">/м²</span>
          </div>
          {meterPrice > 0 && (
            <span className="text-xs text-stone-500 font-medium">
              или {formattedMeterNumber} ₽ за пог.м
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={route('calculator.show')}
            className="px-6 py-3 bg-brand-gold hover:bg-brand-gold-hover text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95 inline-flex items-center gap-2"
          >
            <Calculator className="size-4" />
            <span>Рассчитать в конфигураторе</span>
          </Link>
        </div>
      </div>

      {/* Рендеринг краткого описания товара (анонса) */}
      {shortDescription && (
        <div className="text-sm text-slate-500 leading-relaxed max-w-2xl mb-6 italic">
          {shortDescription}
        </div>
      )}

      {/* Рендеринг полного описания товара с поддержкой HTML */}
      {description && (
        <div
          className="text-sm text-stone-600 leading-relaxed max-w-2xl border-t border-stone-100 pt-4 prose prose-stone"
          dangerouslySetInnerHTML={{__html: description}}
        />
      )}
    </div>
  );
}
