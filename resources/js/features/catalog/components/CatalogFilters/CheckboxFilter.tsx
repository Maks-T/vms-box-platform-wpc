import React, { useMemo } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export const CheckboxFilter = ({ options, activeValues, onToggle }: any) => {
  // Дедупликация опций
  const uniqueOptions = useMemo(() => {
    const seen = new Set<string>();
    return options.filter((opt: any) => {
      const label = (opt.label || opt.key || '').trim().toLowerCase();
      if (seen.has(label)) return false;
      seen.add(label);
      return true;
    });
  }, [options]);

  return (
    <div className="space-y-2 text-xs text-stone-700">
      {uniqueOptions.map((opt: any) => {
        const isChecked = activeValues.includes(opt.key);

        return (
          <label
            key={opt.key}
            className="flex items-center gap-2.5 cursor-pointer hover:text-black py-0.5 select-none transition-colors"
          >
            <div className="relative flex items-center justify-center shrink-0">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isChecked}
                onChange={() => onToggle(opt.key)}
              />
              <div className={cn(
                "size-4 rounded border transition-all flex items-center justify-center cursor-pointer",
                isChecked
                  ? "bg-brand-gold border-brand-gold text-black shadow-xs"
                  : "bg-white border-stone-300 group-hover:border-stone-400"
              )}>
                <Check className={cn("size-3 text-black stroke-[3.5px] transition-opacity", isChecked ? "opacity-100" : "opacity-0")} />
              </div>
            </div>

            <span className={cn(
              "text-xs leading-tight transition-colors cursor-pointer",
              isChecked ? "text-black font-medium" : "text-stone-700 hover:text-black"
            )}>
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
};