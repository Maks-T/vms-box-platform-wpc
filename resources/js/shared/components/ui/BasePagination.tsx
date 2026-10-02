import React from 'react';
import {cn} from '@/shared/lib/utils';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
  links: PaginationLink[];
}

interface BasePaginationProps {
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}

export function BasePagination({
                                 meta,
                                 onPageChange,
                                 prevLabel = '< Назад',
                                 nextLabel = 'Вперед >',
                                 className = ''
                               }: BasePaginationProps) {
  if (!meta || !meta.last_page || meta.last_page <= 1) {
    return null;
  }

  return (
    <div
      className={cn("flex items-center justify-center gap-2 pt-10 mt-8 border-t border-stone-100 text-xs select-none", className)}>
      {meta.links.map((link, idx) => {
        let label = link.label;

        if (label.includes('&laquo;')) label = prevLabel;
        if (label.includes('&raquo;')) label = nextLabel;

        const isNav = label === prevLabel || label === nextLabel;

        if (!link.url) {
          return (
            <span
              key={idx}
              className={cn(
                isNav
                  ? "px-3 py-1.5 text-stone-300 cursor-not-allowed select-none"
                  : "w-8 h-8 flex items-center justify-center text-stone-400 select-none"
              )}
            >
              {label}
            </span>
          );
        }

        const urlObj = new URL(link.url, 'http://localhost');
        const pageNum = Number(urlObj.searchParams.get('page'));

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={cn(
              "transition-colors",
              isNav
                ? "px-3 py-1.5 text-stone-500 hover:text-stone-900 cursor-pointer"
                : cn(
                    "w-8 h-8 rounded flex items-center justify-center cursor-pointer",
                    link.active
                      ? "bg-brand-gold text-black font-bold cursor-default pointer-events-none"
                      : "hover:bg-stone-100 text-stone-700"
                  )
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}