import React from 'react';
import {Layers, Image as ImageIcon} from 'lucide-react';
import {H3} from '@/shared/components/ui/Typography';
import {IconBox} from '@/shared/components/ui/IconBox';
import {ProductVariant, BootstrapConfig} from '@/types/catalog';
import {Badge} from "@/shared/ui/badge";
import {cn} from '@/shared/lib/utils';

interface Props {
  variants: ProductVariant[];
  bootstrapConfig?: BootstrapConfig | null;
}

export function ProductVariantsList({variants, bootstrapConfig}: Props) {
  if (!variants || variants.length === 0) return null;

  const defaultPriceType = bootstrapConfig?.price_types?.find((pt: any) => pt.is_default)?.slug || 'retail';
  const currencySymbol = bootstrapConfig?.base_currency?.symbol_native || bootstrapConfig?.base_currency?.symbol || 'тенге';

  const renderAttributeValue = (data: any) => {
    if (typeof data === 'object' && data !== null) {
      return (
        <div className="flex items-center gap-2">
          {data.meta?.hex && (
            <div
              className="w-3.5 h-3.5 rounded-full border border-border shrink-0 shadow-2xs"
              style={{backgroundColor: data.meta.hex}}
            />
          )}
          {data.meta?.image && (
            <img
              src={data.meta.image}
              alt=""
              className="w-4 h-4 rounded-full object-cover border border-border shrink-0"
            />
          )}
          <span className="truncate">{data.label}</span>
        </div>
      );
    }
    return <span>{data}</span>;
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <IconBox variant="glass" size="sm" className="bg-brand-lightBg text-brand-forest border-green-200">
          <Layers className="w-4 h-4"/>
        </IconBox>
        <H3 className="!text-brand-forest !text-[13px] uppercase font-bold tracking-[0.15em] m-0">
          Торговые предложения (SKU)
        </H3>
      </div>

      <div className="flex flex-col gap-3">
        {variants.map((variant) => {
          const hasFriendlyName = variant.name && variant.name !== variant.sku;

          return (
            <div
              key={variant.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-200 hover:border-brand-forest/40 transition shadow-xs"
            >
              <div className="flex items-center gap-4 overflow-hidden w-full">
                <IconBox variant="light"
                         className="w-14 h-14 shrink-0 rounded-xl overflow-hidden p-0 border-gray-200 bg-gray-50">
                  {variant.preview_picture ? (
                    <img
                      src={variant.preview_picture}
                      alt={variant.sku}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400"/>
                  )}
                </IconBox>

                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-900 tracking-tight text-[15px]">
                    {hasFriendlyName ? variant.name : variant.sku}
                  </div>

                  {hasFriendlyName && (
                    <div className="text-[11px] font-mono text-gray-400 mt-0.5 lowercase">
                      Код: {variant.sku}
                    </div>
                  )}

                  <div className="flex flex-col gap-1 mt-1.5">
                    {Object.entries(variant.attributes || {}).map(([code, attr]) => {
                      if (attr.value === null || attr.value === undefined || attr.value === '') return null;

                      return (
                        <div
                          key={code}
                          className="text-[13px] text-gray-600 flex items-center gap-1.5 truncate"
                        >
                          <span className="font-semibold text-gray-500">{attr.name}:</span>
                          <span className="text-gray-800">{renderAttributeValue(attr.value)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div
                className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto border-t sm:border-0 border-gray-100 pt-4 sm:pt-0 shrink-0">
                {(() => {
                  const displayPrice = variant.prices?.[defaultPriceType] || Object.values(variant.prices || {})[0] || 0;
                  const formattedNumber = displayPrice > 0
                    ? new Intl.NumberFormat('ru-RU', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                    }).format(displayPrice)
                    : '';

                  return displayPrice > 0 ? (
                    <div className="font-black text-gray-900 text-[18px] flex items-baseline gap-1">
                      <span>{formattedNumber}</span>
                      <span className="text-xs font-normal text-gray-500 lowercase">{currencySymbol}</span>
                    </div>
                  ) : (
                    <Badge
                      variant="gray"
                      className="!bg-gray-100 !border-gray-200 !text-gray-600 !shadow-none !px-2.5 !py-1 text-[11px] uppercase tracking-wider"
                    >
                      По запросу
                    </Badge>
                  );
                })()}

                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5",
                  variant.stock > 0
                    ? "bg-brand-lightBg border-green-200 text-brand-forest"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                )}>
                  <span
                    className={cn("w-1.5 h-1.5 rounded-full", variant.stock > 0 ? "bg-brand-forest" : "bg-amber-500")}/>
                  <span>{variant.stock > 0 ? `В наличии: ${variant.stock} шт` : 'Под заказ'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductVariantsList;