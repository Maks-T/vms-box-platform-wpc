import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { FilterSwatch } from './FilterSwatch';

export const CheckboxFilter = ({ options, activeValues, onToggle }: any) => (
  <div className="flex flex-col gap-2.5">
    {options.map((opt: any) => {
      const isChecked = activeValues.includes(opt.key);
      const { hex, image } = opt.meta || {};

      const hasVisual = (typeof image === 'string' && image.trim() !== '') ||
        (typeof hex === 'string' && hex.trim() !== '');

      return (
        <label
          key={opt.key}
          className="flex items-center gap-3 cursor-pointer group select-none py-1 hover:text-foreground transition-colors"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={isChecked}
              onChange={() => onToggle(opt.key)}
            />
            <div className={cn(
              "size-4 rounded-[5px] border transition-all flex items-center justify-center cursor-pointer",
              isChecked
                ? "bg-primary border-primary text-primary-foreground shadow-xs"
                : "bg-input/80 border-border group-hover:border-foreground/40"
            )}>
              <Check className={cn("size-3 text-white stroke-[3.5px] transition-opacity", isChecked ? "opacity-100" : "opacity-0")} />
            </div>
          </div>

          <div className="flex items-center gap-2.5 cursor-pointer">
            {hasVisual && <FilterSwatch image={image} hex={hex} size="sm" className="cursor-pointer" />}

            <span className={cn(
              "text-sm leading-tight transition-colors cursor-pointer",
              isChecked ? "text-foreground font-bold" : "text-muted-foreground font-medium group-hover:text-foreground"
            )}>
              {opt.label}
            </span>
          </div>
        </label>
      );
    })}
  </div>
);