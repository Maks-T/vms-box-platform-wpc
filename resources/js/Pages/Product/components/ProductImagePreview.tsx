import React from 'react';
import {Image as ImageIcon} from 'lucide-react';
import GlassPanel from '@/shared/components/ui/GlassPanel';
import StatusBadge from '@/shared/components/ui/StatusBadge';

interface Props {
  image: string | null;
  name: string;
  externalCode: string | null;
  id: number;
}

export function ProductImagePreview({image, name, externalCode, id}: Props) {
  return (
    <GlassPanel variant="glow" padding="none"
                className="relative aspect-square overflow-hidden flex items-center justify-center p-8 bg-slate-50/50">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      ) : (
        <div className="flex flex-col items-center text-muted-foreground/50">
          <ImageIcon className="w-24 h-24 mb-4"/>
          <span className="text-sm font-medium uppercase tracking-widest">Нет фото</span>
        </div>
      )}

      <div className="absolute top-6 left-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-lightBg border border-green-200 text-brand-forest text-xs font-bold shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-forest" />
          <span>Артикул: {externalCode || id}</span>
        </div>
      </div>
    </GlassPanel>
  );
}