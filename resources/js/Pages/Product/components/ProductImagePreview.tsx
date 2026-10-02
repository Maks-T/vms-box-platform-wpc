import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface Props {
  image: string | null;
  name: string;
  externalCode: string | null;
  id: number;
}

export function ProductImagePreview({ image, name, externalCode, id }: Props) {
  const [activeImage, setActiveImage] = useState<string | null>(image);

  useEffect(() => {
    setActiveImage(image);
  }, [image]);

  const gallery = [
    image || 'https://oliverdeck.ru/d/index-welcome.jpg',
    'https://oliverdeck.ru/thumb/2/Vkp-nf7a4TiStHfC7Xj_FA/40r40/d/terassnaya_doska_mdpk_sila_shokolad_5.jpg',
    'https://oliverdeck.ru/thumb/2/DJN0TfwGbG5X4rb3AaED2w/40r40/d/terassnaya_doska_mpk_graffite_5.jpg',
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Артикул товара */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fffceb] border border-[#f5e18c] rounded text-[11px] text-stone-700 font-mono">
        <span className="text-amber-500 font-bold">⊙</span>
        <span className="font-bold">Артикул:</span>
        <span>{externalCode || `gdk_oliverdeck_item_${id}`}</span>
      </div>

      {/* Главное фото товара с текстурой доски */}
      <div className="w-full aspect-[4/3] bg-stone-50 border border-stone-200 rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center p-4">
        {activeImage ? (
          <img
            src={activeImage}
            alt={name}
            className="w-full h-full object-cover rounded-lg shadow-sm transition-all duration-300"
          />
        ) : (
          <div className="flex flex-col items-center text-stone-400">
            <ImageIcon className="w-16 h-16 mb-2" />
            <span className="text-xs font-medium uppercase tracking-wider">Нет фото</span>
          </div>
        )}
      </div>

      {/* Миниатюры галереи ракурсов */}
      {gallery.length > 1 && (
        <div className="flex items-center gap-3">
          {gallery.map((imgUrl, idx) => {
            const isSelected = activeImage === imgUrl;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(imgUrl)}
                className={cn(
                  "w-16 h-16 rounded-lg overflow-hidden bg-stone-50 p-1 cursor-pointer transition-all",
                  isSelected
                    ? "border-2 border-brand-gold shadow-xs scale-105"
                    : "border border-stone-200 hover:border-brand-gold/60"
                )}
              >
                <img
                  src={imgUrl}
                  alt={`${name} - ракурс ${idx + 1}`}
                  className="w-full h-full object-contain rounded"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Оригинальные бейджи преимуществ OliverDeck */}
      <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs text-stone-600">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </span>
          <span>Не выцветает и не выгорает на солнце</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </span>
          <span>Не нуждается в покраске и пропитке</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </span>
          <span>Не портится насекомыми и грибком</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </span>
          <span>Антискользящая поверхность 3D Wood</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </span>
          <span className="font-medium text-stone-800">Собственное производство в РФ</span>
        </div>
      </div>
    </div>
  );
}

export default ProductImagePreview;