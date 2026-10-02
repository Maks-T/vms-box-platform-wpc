import React, { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface Props {
  options: any[];
  activeValues: string[];
  onToggle: (key: string) => void;
}

export const ColorFilter = ({ options, activeValues, onToggle }: Props) => {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  // Дедупликация повторяющихся оттенков по названию
  const uniqueOptions = useMemo(() => {
    const seen = new Set<string>();
    return options.filter((opt) => {
      const label = (opt.label || opt.key || '').trim().toLowerCase();
      if (seen.has(label)) return false;
      seen.add(label);
      return true;
    });
  }, [options]);

  // Список активных названий для подсказки
  const activeLabels = useMemo(() => {
    return uniqueOptions
      .filter((opt) => activeValues.includes(opt.key))
      .map((opt) => opt.label);
  }, [uniqueOptions, activeValues]);

  return (
    <div className="flex flex-col gap-2">
      {/* Компактная сетка свотчей-кружков */}
      <div className="flex flex-wrap gap-2 items-center">
        {uniqueOptions.map((opt) => {
          const isChecked = activeValues.includes(opt.key);
          const hex = opt.meta?.hex || '#3a2319';
          const image = opt.meta?.image;

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onToggle(opt.key)}
              onMouseEnter={() => setHoveredLabel(opt.label)}
              onMouseLeave={() => setHoveredLabel(null)}
              title={opt.label}
              className={cn(
                "relative size-7 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0",
                isChecked
                  ? "ring-2 ring-brand-gold ring-offset-2 scale-105 shadow-xs"
                  : "border border-stone-300 hover:scale-110 hover:border-stone-400 opacity-90 hover:opacity-100"
              )}
              style={{ backgroundColor: image ? undefined : hex }}
            >
              {image && (
                <img
                  src={image}
                  alt={opt.label}
                  className="size-full rounded-full object-cover"
                />
              )}

              {/* Галочка при выборе */}
              {isChecked && (
                <div className="absolute inset-0 rounded-full bg-black/35 flex items-center justify-center">
                  <Check className="size-3.5 text-white stroke-[3.5px]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Подсказка текущего наведения или выбранных цветов */}
      <div className="text-[11px] text-stone-500 min-h-[16px] truncate pt-0.5">
        {hoveredLabel ? (
          <span className="text-stone-900 font-medium">{hoveredLabel}</span>
        ) : activeLabels.length > 0 ? (
          <span>
            Выбрано: <strong className="text-stone-900 font-medium">{activeLabels.join(', ')}</strong>
          </span>
        ) : (
          <span className="text-stone-400">Наведите для подсказки</span>
        )}
      </div>
    </div>
  );
};
