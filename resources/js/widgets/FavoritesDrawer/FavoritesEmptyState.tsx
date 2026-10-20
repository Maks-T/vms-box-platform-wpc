import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface FavoritesEmptyStateProps {
  onClose: () => void;
}

export const FavoritesEmptyState = ({ onClose }: FavoritesEmptyStateProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 min-h-[350px]">
      <div className="size-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4 border border-border shadow-xs">
        <Heart className="size-7 text-muted-foreground/40" strokeWidth={1.5} />
      </div>
      <h4 className="text-base font-bold text-foreground mb-1.5">
        Список избранного пуст
      </h4>
      <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed mb-6">
        Нажимайте на сердечко у товаров, чтобы быстро вернуться к ним при расчете сметы.
      </p>
      <Button
        onClick={onClose}
        variant="default"
        size="sm"
        className="rounded-xl px-5 font-semibold cursor-pointer"
      >
        Перейти в каталог
      </Button>
    </div>
  );
};