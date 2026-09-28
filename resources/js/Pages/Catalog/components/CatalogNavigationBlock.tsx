import React from 'react';
import { cn } from '@/shared/lib/utils';
import { CatalogPills } from '@/features/catalog/components/CatalogPills';
import { BootstrapFamily } from '@/types/catalog';

interface Props {
  familiesList: BootstrapFamily[];
  activeFamily: string;
  setFamily: (family: string) => void;
  typesSchema: { code: string; name: string }[];
  productType: string;
  setProductType: (type: string) => void;
}

export function CatalogNavigationBlock({
                                         familiesList,
                                         activeFamily,
                                         setFamily,
                                         typesSchema,
                                         productType,
                                         setProductType
                                       }: Props) {
  return (
    <div className="flex flex-col w-full mb-6 relative z-10">
      {/* Главные семейства (Террасный настил, Ограждения и т.д.) */}
      <CatalogPills
        families={familiesList}
        activeFamily={activeFamily}
        onChange={setFamily}
      />

      {/* Подтипы продукции */}
      {typesSchema.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/60">
          <button
            type="button"
            onClick={() => setProductType('')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer outline-none",
              productType === ''
                ? "bg-brand-forest text-white border-brand-forest shadow-xs font-bold"
                : "bg-white border-gray-200 text-gray-700 hover:border-brand-forest/40 hover:text-brand-forest shadow-2xs"
            )}
          >
            Все типы
          </button>
          {typesSchema.map((t) => (
            <button
              key={t.code}
              type="button"
              onClick={() => setProductType(t.code)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer outline-none",
                productType === t.code
                  ? "bg-brand-forest text-white border-brand-forest shadow-xs font-bold"
                  : "bg-white border-gray-200 text-gray-700 hover:border-brand-forest/40 hover:text-brand-forest shadow-2xs"
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}