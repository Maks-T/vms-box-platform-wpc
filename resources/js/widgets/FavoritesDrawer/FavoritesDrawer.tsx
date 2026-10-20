import React, { useEffect, useState } from 'react';
import { useFavorites } from '@/store/useFavorites';
import { bootstrapApi } from '@/shared/api/bootstrap.api';
import { BootstrapConfig } from '@/types/catalog';
import { Sheet, SheetContent } from '@/shared/ui/sheet';
import { FavoritesHeader } from './FavoritesHeader';
import { FavoritesEmptyState } from './FavoritesEmptyState';
import { FavoriteItemRow } from './FavoriteItemRow';

export const FavoritesDrawer = () => {
  const { isOpen, setIsOpen, items, removeItem, clearFavorites } = useFavorites();
  const [bootstrapConfig, setBootstrapConfig] = useState<BootstrapConfig | null>(null);

  useEffect(() => {
    if (isOpen) {
      bootstrapApi.getConfig().then(setBootstrapConfig);
    }
  }, [isOpen]);

  const currencySymbol = bootstrapConfig?.base_currency?.symbol_native || bootstrapConfig?.base_currency?.symbol || 'руб.';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[460px] p-0 flex flex-col gap-0 border-l border-border bg-popover text-foreground shadow-2xl rounded-l-3xl overflow-hidden"
      >
        <FavoritesHeader count={items.length} onClear={clearFavorites} />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
          {items.length === 0 ? (
            <FavoritesEmptyState onClose={() => setIsOpen(false)} />
          ) : (
            items.map((item) => (
              <FavoriteItemRow
                key={item.id}
                item={item}
                onRemove={removeItem}
                onNavigate={() => setIsOpen(false)}
                currencySymbol={currencySymbol}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-border bg-muted/30 shrink-0 flex items-center justify-between text-xs text-muted-foreground">
            <span>Всего товаров: <strong className="text-foreground">{items.length}</strong></span>
            <span className="text-[11px] font-mono uppercase tracking-wider">VISTEGRA DECK</span>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};