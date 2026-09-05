import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Image as ImageIcon, Heart } from 'lucide-react';
import { StoneProduct, EavValueOption, BootstrapConfig, ProductVariant } from '@/types/catalog';
import { route } from "ziggy-js";
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
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

  const currencySymbol = bootstrapConfig?.base_currency?.symbol_native || bootstrapConfig?.base_currency?.symbol || 'руб.';

  const formattedNumber = displayPrice > 0
    ? new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(displayPrice)
    : '';

  const brand = attributes?.brand?.value as EavValueOption | undefined;
  const collection = attributes?.collection?.value as EavValueOption | undefined;
  const subtitle = brand?.label || collection?.label || (unit ? `Ед. изм: ${unit.symbol || unit.name}` : 'ДПК Профиль');

  // Извлечение уникальных цветов
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

  return (
    <Card
      size="sm"
      className="group relative flex flex-col h-full bg-card rounded-2xl border border-border/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Превью картинки */}
      <div className="relative aspect-4/3 w-full bg-muted/40 overflow-hidden flex items-center justify-center p-6 border-b border-border/60">
        <Link href={route('product.show', slug)} className="block w-full h-full cursor-pointer">
          {displayImage ? (
            <img
              src={displayImage}
              alt={name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full opacity-25 text-muted-foreground">
              <ImageIcon className="size-12" />
            </div>
          )}
        </Link>

        {/* Бейдж ID */}
        <Badge variant="secondary" className="absolute top-3 left-3 bg-background/90 backdrop-blur-xs border border-border text-[10px] font-bold px-2 py-0.5 shadow-xs">
          ID {id}
        </Badge>

        {/* Кнопка избранного */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label="В избранное"
          className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 hover:bg-background border border-border text-muted-foreground hover:text-red-500 shadow-xs transition-all cursor-pointer active:scale-90"
        >
          <Heart className={cn("size-4 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "")} />
        </button>
      </div>

      {/* Тело карточки */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase truncate">
          {subtitle}
        </div>

        <Link href={route('product.show', slug)} className="cursor-pointer">
          <h3 className="text-base font-bold text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[40px]">
            {name}
          </h3>
        </Link>

        {/* Палитра цветов (Свотчи) */}
        {colorsToShow.length > 0 && (
          <div className="flex items-center gap-1.5 my-auto flex-wrap pt-1">
            {colorsToShow.slice(0, 6).map((color) => {
              const isSelected = color.key === activeColorSlug;
              return (
                <div
                  key={color.key}
                  title={color.label}
                  onClick={(e) => handleColorClick(e, color)}
                  className={cn(
                    "size-5 rounded-full border border-black/15 shadow-xs cursor-pointer transition-transform hover:scale-110 shrink-0",
                    isSelected ? "ring-2 ring-primary ring-offset-1 scale-105" : "opacity-75 hover:opacity-100"
                  )}
                  style={{ backgroundColor: color.meta?.hex || '#ccc' }}
                >
                  {color.meta?.image && (
                    <img src={color.meta.image} alt={color.label} className="size-full rounded-full object-cover" />
                  )}
                </div>
              );
            })}
            {colorsToShow.length > 6 && (
              <span className="text-[11px] font-medium text-muted-foreground ml-1">
                +{colorsToShow.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Футер карточки: Цена + Кнопка */}
        <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Цена</span>
            <div className="text-lg font-black text-foreground flex items-baseline gap-1">
              {displayPrice > 0 ? (
                <>
                  <span>{formattedNumber}</span>
                  <span className="text-xs font-medium text-muted-foreground">{currencySymbol}</span>
                </>
              ) : (
                <span className="text-xs font-semibold text-muted-foreground">По запросу</span>
              )}
            </div>
          </div>

          <Button
            size="sm"
            variant="default"
            className="cursor-pointer font-semibold rounded-xl px-4"
            asChild
          >
            <Link href={route('product.show', slug)}>
              Подробнее
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};