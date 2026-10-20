import React from 'react';
import { cn } from '@/shared/lib/utils';

interface WaveBackgroundProps {
  className?: string;
}

export default function WaveBackground({ className }: WaveBackgroundProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-[24px] lg:rounded-[32px]",
        className
      )}
      aria-hidden="true"
    >
      {/* Очень легкая нейтральная сетка */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Мягкий нейтрально-холодный акцент в углу */}
      <div className="absolute inset-0 filter blur-[90px] opacity-40">
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-slate-200/60 mix-blend-multiply" />
        <div className="absolute -bottom-16 right-0 w-80 h-80 rounded-full bg-sky-100/50 mix-blend-multiply" />
      </div>
    </div>
  );
}