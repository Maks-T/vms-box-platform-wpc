import React from 'react';
import {Image as ImageIcon} from 'lucide-react';
import {ProductVariant, BootstrapConfig} from '@/types/catalog';

interface Props {
  variants: ProductVariant[];
  bootstrapConfig?: BootstrapConfig | null;
}

export function ProductVariantsList({variants, bootstrapConfig}: Props) {
  if (!variants || variants.length === 0) return null;

  const defaultPriceType = bootstrapConfig?.price_types?.find((pt: any) => pt.is_default)?.slug || 'retail';
  const currencySymbol = '₽';

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
    <div className="space-y-3 pt-4 border-t border-stone-100">
      <div className="inline-block px-2.5 py-1 bg-[#fffceb] border border-[#f5e18c] text-[10px] font-bold uppercase tracking-wider text-stone-800 rounded">
        ≈ Торговые предложения (SKU)
      </div>

      <div className="flex flex-col gap-3">
        {variants.map((variant) => {
          const hasFriendlyName = variant.name && variant.name !== variant.sku;

          return (
            <div
              key={variant.id}
              className="border border-stone-200 rounded-xl p-4 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs hover:border-brand-gold/60 transition"
            >
              <div className="flex items-center gap-4 overflow-hidden w-full">
                <div className="w-14 h-14 bg-stone-100 border border-stone-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                  {variant.preview_picture ? (
                    <img
                      src={variant.preview_picture}
                      alt={variant.sku}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400"/>
                  )}
                </div>

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
                className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                {(() => {
                  const displayPrice = variant.prices?.[defaultPriceType] || Object.values(variant.prices || {})[0] || 0;
                  const formattedNumber = displayPrice > 0
                    ? new Intl.NumberFormat('ru-RU', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(displayPrice)
                    : '';

                  return displayPrice > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <div className="px-3.5 py-1 border border-stone-800 rounded font-black text-sm text-stone-900">
                        {formattedNumber} {currencySymbol}
                      </div>
                      <span className="text-xs font-normal text-gray-500 lowercase">{currencySymbol}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-500">По запросу</span>
                  );
                })()}

                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${variant.stock > 0 ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${variant.stock > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>{variant.stock > 0 ? 'В наличии' : 'Под заказ'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductVariantsList;