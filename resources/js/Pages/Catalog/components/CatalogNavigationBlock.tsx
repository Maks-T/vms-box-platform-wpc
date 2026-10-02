import React from 'react';
import {cn} from '@/shared/lib/utils';
import {CatalogPills} from '@/features/catalog/components/CatalogPills';
import {BootstrapFamily} from '@/types/catalog';

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
                                         setProductType,
                                       }: Props) {
  return (
    <div className="flex flex-col w-full relative z-10">
      {/* Главные семейства (Террасный настил, Комплектующие и крепеж) */}
      <CatalogPills
        families={familiesList}
        activeFamily={activeFamily}
        onChange={setFamily}
      />

      {/* Чипсы подкатегорий продукции */}
      {typesSchema.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-6 text-xs">
          <button
            type="button"
            onClick={() => setProductType('')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer select-none",
              productType === ''
                ? "bg-stone-900 text-white shadow-xs font-semibold"
                : "bg-stone-100 hover:bg-stone-200 text-stone-700"
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
                "px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer select-none",
                productType === t.code
                  ? "bg-stone-900 text-white shadow-xs font-semibold"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-700"
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