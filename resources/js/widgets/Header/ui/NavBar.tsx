import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { NavItem } from '@/shared/config/site';
import { cn } from '@/shared/lib/utils';
import { ExternalLink } from 'lucide-react';

interface ExtendedNavItem extends NavItem {
  forceRefresh?: boolean;
}

export default function NavBar({ items }: { items: ExtendedNavItem[] }) {
  const { url } = usePage();
  const currentPathname = url.split('?')[0];

  const getPathname = (urlStr: string) => {
    if (!urlStr || urlStr.startsWith('#') || urlStr.startsWith('http')) return '';
    try {
      const parsed = new URL(urlStr, window.location.origin);
      return parsed.pathname;
    } catch {
      return urlStr.split('?')[0];
    }
  };

  return (
    <nav className="hidden h-full items-center gap-8 lg:flex">
      {items.map((item) => {
        if (item.disabled) {
          return (
            <span
              key={item.label}
              className="cursor-not-allowed py-2 text-[14px] font-medium text-white/20 select-none"
            >
              {item.label}
            </span>
          );
        }

        const isExternal = Boolean(item.isExternal);
        const isActive = !isExternal && currentPathname === getPathname(item.href);

        const linkClasses = cn(
          "relative flex items-center gap-1.5 py-2 text-[15px] font-medium transition-all duration-200 outline-none cursor-pointer group",
          isActive
            ? "font-bold text-white after:absolute after:bottom-[-8px] after:left-0 after:h-[2.5px] after:w-full after:rounded-full after:bg-[#3D98FF] after:shadow-[0_0_12px_rgba(61,152,255,1)]"
            : "text-slate-300 hover:text-white"
        );

        // Внешняя ссылка («О компании») с иконкой
        if (isExternal) {
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              <span>{item.label}</span>
              <ExternalLink className="size-3.5 text-white/50 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          );
        }

        // Принудительная перезагрузка страницы
        if (item.forceRefresh) {
          return (
            <a key={item.label} href={item.href} className={linkClasses}>
              {item.label}
            </a>
          );
        }

        // Стандартный Inertia SPA Link
        return (
          <Link key={item.label} href={item.href} className={linkClasses}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}