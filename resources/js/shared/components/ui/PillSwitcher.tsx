import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface PillOption<T> {
  value: T;
  label: string;
  title?: string;
}

interface PillSwitcherProps<T> {
  options: PillOption<T>[];
  activeValue: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function PillSwitcher<T extends string | number | boolean>({
                                                                            options,
                                                                            activeValue,
                                                                            onChange,
                                                                            className,
                                                                          }: PillSwitcherProps<T>) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-0.5 select-none",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === activeValue;

        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 outline-none",
              isActive
                ? "bg-white/15 text-white shadow-xs"
                : "text-white/50 hover:text-white"
            )}
            title={option.title}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}