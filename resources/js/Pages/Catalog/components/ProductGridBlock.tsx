import React from 'react';
import { Loader2, Layers } from 'lucide-react';
import { ProductCard } from '@/entities/product/ui/ProductCard';
import { BasePagination } from '@/shared/components/ui/BasePagination';
import { StoneProduct, BootstrapConfig } from '@/types/catalog';
import { cn } from '@/shared/lib/utils';

interface Props {
  isLoading: boolean;
  products: StoneProduct[];
  meta: any;
  setPage: (page: number) => void;
  clearFilters: () => void;
  bootstrapConfig: BootstrapConfig | null; 
}

export function ProductGridBlock({ isLoading, products, meta, setPage, clearFilters, bootstrapConfig }: Props) {
  return (
    <div className="relative min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-stone-100">
        <h2 className="text-base font-bold text-stone-900">Террасная доска и лаги (в наличии)</h2>
        <span className="text-xs text-stone-400">
          {meta?.total || products.length} товаров
        </span>
      </div>

      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-start pt-32 bg-white/70 backdrop-blur-2xs transition-all duration-300">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-brand-gold animate-spin stroke-[2.5px]" />
              <span className="text-stone-700 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
                 Загрузка...
               </span>
            </div>
          </div>
        )}

        <div className={cn(
          "transition-all duration-500",
          isLoading ? "opacity-30 scale-[0.99] grayscale-[0.5]" : "opacity-100 scale-100"
        )}>
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    bootstrapConfig={bootstrapConfig} 
                  />
                ))}
              </div>
              <BasePagination meta={meta} onPageChange={setPage} />
            </>
          ) : !isLoading && (
            <div className="py-16 sm:py-20 flex flex-col items-center justify-center bg-stone-50/70 rounded-2xl border border-dashed border-stone-200 text-center p-6">
              <div className="w-14 h-14 bg-[#fffceb] border border-[#f5e18c] rounded-2xl flex items-center justify-center mb-4 shadow-2xs">
                <Layers className="w-6 h-6 text-brand-gold" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">Ничего не найдено</h3>
              <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">
                По выбранным параметрам фильтрации не найдено подходящих позиций. Попробуйте сбросить фильтры.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-hover text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
