import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Calculator, ArrowRight } from 'lucide-react';

export function CalculatorTeaserBlock() {
  const [length, setLength] = useState<number>(6);
  const [width, setWidth] = useState<number>(4);

  const area = Math.max(1, length * width);
  const approxBoards = Math.ceil(area / 0.42); // примерный расход досок

  return (
    <section id="calculator" className="py-20 bg-[#273007] text-white relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-[radial-gradient(#a5c33c_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-lime font-bold text-xs uppercase tracking-wider block mb-2">
            Онлайн-калькулятор
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl uppercase tracking-tight">
            Рассчитайте стоимость террасы
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
            Введите габариты настила для экспресс-оценки объема доски и направляющих лаг.
          </p>
        </div>

        <div className="bg-brand-charcoal/90 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-2">
                Длина террасы (метры)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={length}
                onChange={(e) => setLength(Math.max(1, Number(e.target.value)))}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-base font-semibold focus:outline-none focus:border-brand-lime transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-2">
                Ширина террасы (метры)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={width}
                onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-base font-semibold focus:outline-none focus:border-brand-lime transition"
              />
            </div>

            <div>
              <Link
                href={route('calculator.show')}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-lime hover:bg-brand-limeHover text-brand-charcoal font-heading font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition shadow-lg active:scale-95 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Открыть калькулятор</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
            <span>Площадь настила: <strong className="text-white text-sm">{area} м²</strong> (~{approxBoards} шт. доски)</span>
            <span>* Точный расчет лаг, кляймеров и крепежа выполняется в полном конфигураторе</span>
          </div>
        </div>
      </div>
    </section>
  );
}
