import React from 'react';
import { Trash2, Image as ImageIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { StoneProduct } from '@/types/catalog';
import { Item, ItemMedia, ItemContent, ItemTitle } from '@/shared/ui/item';
import { Badge } from '@/shared/ui/badge';

interface FavoriteItemRowProps {
  item: StoneProduct;
  onRemove: (id: number) => void;
  onNavigate: () => void;
  currencySymbol: string;
}

export const FavoriteItemRow = ({ item, onRemove, onNavigate, currencySymbol }: FavoriteItemRowProps) => {
  const formatPrice = (price: number) => {
    if (price <= 0) return '';
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <Item
      size="sm"
      variant="outline"
      className="group relative flex items-center gap-3.5 p-3 rounded-2xl bg-card border border-border/80 shadow-xs hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
    >
      {/* Превью картинки */}
      <ItemMedia variant="image" className="size-16 rounded-xl bg-muted/50 p-1 shrink-0 border border-border/60">
        {item.preview_picture ? (
          <img
            src={item.preview_picture}
            alt={item.name}
            className="size-full object-contain mix-blend-multiply"
          />
        ) : (
          <div className="size-full flex items-center justify-center opacity-30">
            <ImageIcon className="size-6 text-muted-foreground" />
          </div>
        )}
      </ItemMedia>

      {/* Описание и цена */}
      <ItemContent className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-bold rounded-md">
            ID {item.id}
          </Badge>
        </div>

        <Link
          href={route('product.show', item.slug)}
          onClick={onNavigate}
          className="font-bold text-sm leading-snug text-foreground hover:text-primary transition-colors line-clamp-2 cursor-pointer"
        >
          {item.name}
        </Link>

        <div className="mt-2 flex items-baseline justify-between">
          <div className="font-extrabold text-base text-foreground flex items-baseline gap-1">
            {item.price_from > 0 ? (
              <>
                <span>{formatPrice(item.price_from)}</span>
                <span className="text-xs font-normal text-muted-foreground">{currencySymbol}</span>
              </>
            ) : (
              <span className="text-xs font-medium text-muted-foreground">По запросу</span>
            )}
          </div>
        </div>
      </ItemContent>

      {/* Кнопка удаления */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        className="size-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer active:scale-90 shrink-0"
        title="Удалить из избранного"
      >
        <Trash2 className="size-4" />
      </button>
    </Item>
  );
};