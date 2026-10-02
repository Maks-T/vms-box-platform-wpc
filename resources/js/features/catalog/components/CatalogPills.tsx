import React from 'react';
import { cn } from '@/shared/lib/utils';
import { ProductFamily } from '@/types/catalog';

interface Props {
  families: ProductFamily[];
  activeFamily: string;
  onChange: (code: string) => void;
}

export const CatalogPills = ({ families, activeFamily, onChange }: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-3 pb-6">
      {families.map((family) => {
        const isActive = activeFamily === family.code;

        return (
          <button
            key={family.code}
            type="button"
            onClick={() => onChange(family.code)}
            className={cn(
              "px-6 py-2.5 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs select-none",
              isActive
                ? "bg-brand-gold hover:bg-brand-gold-hover text-black"
                : "bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
            )}
          >
            {family.name}
          </button>
        );
      })}
    </div>
  );
};