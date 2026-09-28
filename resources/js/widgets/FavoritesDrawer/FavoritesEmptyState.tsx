import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface FavoritesEmptyStateProps {
  onClose: () => void;
}

export const FavoritesEmptyState = ({ onClose }: FavoritesEmptyStateProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 min-h-[350px]">
      <div className="size-16 rounded-2xl bg-brand-lightBg flex items-center justify-center mb-4 border border-green-200 shadow-xs">
        <Heart className="size-7 text-brand-forest/60" strokeWidth={1.5} />
      </div>
      <h4 className="text-base font-bold text-foreground mb-1.5">
        Список избранного пуст
      </h4>
      <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed mb-6">
        Нажимайте на сердечко у товаров, чтобы быстро вернуться к ним при расчете сметы.
      </p>
      <button
        onClick={onClose}
        type="button"
        className="bg-brand-forest hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
      >
        Перейти в каталог
      </button>
    </div>
  );
};