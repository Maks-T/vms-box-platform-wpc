import React from 'react';
import {Link} from '@inertiajs/react';
import {ArrowLeft} from 'lucide-react';
import {route} from 'ziggy-js';
import {IconBox} from '@/shared/components/ui/IconBox';

export function ProductHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href={route('catalog')} className="flex items-center gap-4 group">
          <IconBox variant="light" size="default"
                   className="group-hover:bg-brand-forest group-hover:text-white group-hover:border-brand-forest transition-colors">
            <ArrowLeft className="w-5 h-5"/>
          </IconBox>
          <span
            className="font-bold uppercase tracking-widest text-muted-foreground group-hover:text-brand-forest transition-colors text-[13px]">
            Назад в каталог
          </span>
        </Link>
      </div>
    </header>
  );
}