import React from 'react';
import { Heart } from 'lucide-react';
import { SheetHeader, SheetTitle, SheetDescription } from '@/shared/ui/sheet';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

interface FavoritesHeaderProps {
  count: number;
  onClear: () => void;
}

export const FavoritesHeader = ({ count, onClear }: FavoritesHeaderProps) => {
  return (
    <SheetHeader className="p-5 pr-14 border-b border-border bg-card flex flex-row items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/40 flex items-center justify-center">
          <Heart className="size-4 text-red-500 fill-red-500" />
        </div>
        <SheetTitle className="text-base font-bold tracking-tight text-foreground m-0 flex items-center gap-2">
          <span>Избранное</span>
          <Badge variant="secondary" className="px-2 py-0.5 text-xs font-bold rounded-full">
            {count}
          </Badge>
        </SheetTitle>
      </div>

      {count > 0 && (
        <Button
          variant="ghost"
          size="xs"
          onClick={onClear}
          className="text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer rounded-lg px-2"
        >
          Очистить всё
        </Button>
      )}
      <SheetDescription className="sr-only">
        Список избранных товаров и материалов
      </SheetDescription>
    </SheetHeader>
  );
};