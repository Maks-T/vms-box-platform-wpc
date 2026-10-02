import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Image as ImageIcon, Heart } from 'lucide-react';
import { StoneProduct, EavValueOption, BootstrapConfig, ProductVariant } from '@/types/catalog';
import { route } from "ziggy-js";
import { cn } from '@/shared/lib/utils';
import { useFavorites } from '@/store/useFavorites';

interface ProductCardProps {
  product: StoneProduct;
  bootstrapConfig?: BootstrapConfig | null;
}

export const ProductCard = ({ product, bootstrapConfig }: ProductCardProps) => {
  const { id, name, slug, price_from, preview_picture, unit, attributes, variants } = product;
  const { toggleItem, hasItem } = useFavorites();
  const isFavorite = hasItem(id);

  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);

  const defaultPriceType = bootstrapConfig?.price_types?.find((pt: any) => pt.is_default)?.slug || 'retail';

  const displayImage = activeVariant?.preview_picture || preview_picture;

  const displayPrice = activeVariant
    ? (activeVariant.prices?.[defaultPriceType] || Object.values(activeVariant.prices || {})[0] || price_from)
    : price_from;

  const currencySymbol = '₽';

  const formattedNumber = displayPrice > 0
    ? new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(displayPrice)
    : '';

  // Расчет примерной цены за погонный метр (если за м²)
  const meterPrice = displayPrice > 0 ? Math.round(displayPrice * 0.15) : 0;
  const formattedMeterNumber = meterPrice > 0
    ? new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(meterPrice)
    : '';

  const brand = attributes?.brand?.value as EavValueOption | undefined;
  const origin = (attributes?.country?.value as EavValueOption | undefined)?.label || 'Россия';
  const dimensions = (attributes?.dimensions?.value || attributes?.size?.value || attributes?.length?.value)
    ? String(attributes?.dimensions?.value || attributes?.size?.value || attributes?.length?.value)
    : '20x150x3000 (4000) мм';

  // Извлечение цветов
  const parentColor = attributes?.color?.value as EavValueOption | undefined;
  const variantColors: EavValueOption[] = [];

  if (variants?.length > 0) {
    const seen = new Set();
    variants.forEach(v => {
      const vColor = v.attributes?.color?.value as EavValueOption | undefined;
      if (vColor && !seen.has(vColor.key)) {
        seen.add(vColor.key);
        variantColors.push(vColor);
      }
    });
  }

  const colorsToShow = variantColors.length > 0 ? variantColors : (parentColor ? [parentColor] : []);

  const activeColorSlug = activeVariant
    ? (activeVariant.attributes?.color?.value as EavValueOption | undefined)?.key
    : (variants?.find(v => v.is_default)?.attributes?.color?.value as EavValueOption | undefined)?.key;

  const handleColorClick = (e: React.MouseEvent, color: EavValueOption) => {
    e.preventDefault();
    e.stopPropagation();

    const match = variants?.find(v => {
      const vColor = v.attributes?.color?.value as EavValueOption | undefined;
      return vColor?.key === color.key;
    });

    if (match) {
      setActiveVariant(match);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const isHit = id === 1 || brand?.label === 'OliverDeck';

  return (
    <article className="bg-white border border-stone-200 hover:border-brand-gold/60 rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition-all group">
      <div>
        {/* Верхняя строка: бейдж статуса/страны + сердечко */}
        <div className="flex items-center justify-between text-xs mb-2">
          {isHit ? (
            <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[10px] font-bold uppercase">
              Хит продаж
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] font-bold">
              {origin}
            </span>
          )}

          <button
            type="button"
            onClick={handleFavoriteClick}
            className="text-stone-300 hover:text-rose-500 transition-colors cursor-pointer"
            title="В избранное"
          >
            <Heart className={cn("size-4 transition-colors", isFavorite ? "fill-rose-500 text-rose-500" : "")} />
          </button>
        </div>

        {/* Главное фото со срезом доски и водяным знаком OliverDeck */}
        <Link href={route('product.show', slug)} className="block w-full h-44 bg-[#f8f9fa] rounded-lg overflow-hidden relative mb-3">
          <img
            src="https://oliverdeck.ru/thumb/2/LCcef9rDO6nWj2bcKBs__w/300c84/d/logox80-svg.svg"
            className="absolute bottom-2 right-2 h-3.5 opacity-25 object-contain"
            alt="Watermark"
          />
          {displayImage ? (
            <img
              src={displayImage}
              alt={name}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-25 text-stone-400">
              <ImageIcon className="size-12" />
            </div>
          )}
        </Link>

        {/* Свотчи цветов (живые образцы) */}
        {colorsToShow.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
            {colorsToShow.slice(0, 6).map((color) => {
              const isSelected = color.key === activeColorSlug;
              return (
                <span
                  key={color.key}
                  title={color.label}
                  onClick={(e) => handleColorClick(e, color)}
                  className={cn(
                    "size-4 rounded-full cursor-pointer shadow-xs transition-transform hover:scale-110 shrink-0",
                    isSelected ? "border-2 border-stone-900 scale-105" : "border border-stone-200"
                  )}
                  style={{ backgroundColor: color.meta?.hex || '#523321' }}
                />
              );
            })}
          </div>
        )}

        <div className="text-[11px] text-stone-400 mb-1">
          Размер: {dimensions}
        </div>

        <Link
          href={route('product.show', slug)}
          className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 hover:text-brand-gold transition-colors mb-3 block"
        >
          {name}
        </Link>
      </div>

      {/* Цены в рублях и парные кнопки Подробнее / Расчет */}
      <div className="pt-3 border-t border-stone-100">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-base font-black text-stone-900">
              {displayPrice > 0 ? `${formattedNumber} ${currencySymbol}` : 'По запросу'}
            </span>
            <span className="text-xs text-stone-500 font-normal">/{unit?.symbol || 'м²'}</span>
          </div>
          {meterPrice > 0 && (
            <div className="text-xs text-stone-500 font-medium">
              {formattedMeterNumber} {currencySymbol}<span className="text-[10px]">/пог.м</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={route('product.show', slug)}
            className="py-2 text-center bg-stone-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            Подробнее
          </Link>
          <Link
            href={route('calculator.show')}
            className="py-2 text-center bg-brand-gold hover:bg-brand-gold-hover text-black text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            Расчет
          </Link>
        </div>
      </div>
    </article>
  );
};