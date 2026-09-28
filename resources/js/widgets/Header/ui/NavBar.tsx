import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { NavItem, siteConfig } from '@/shared/config/site';
import { cn } from '@/shared/lib/utils';
import { MapPin, Menu as MenuIcon } from 'lucide-react';

interface ExtendedNavItem extends NavItem {
  forceRefresh?: boolean;
}

export default function NavBar({ items }: { items: ExtendedNavItem[] }) {
  const { url } = usePage();
  const currentPathname = url.split('?')[0];
  const { company } = siteConfig;

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
    <div className="flex items-center justify-between w-full h-full">
      {/* Пункты навигации */}
      <nav className="flex items-center gap-8 font-heading font-bold text-xs uppercase tracking-wider">
        {items.map((item) => {
          const isCatalog = item.label.toLowerCase().includes('каталог');
          const isHash = item.href.startsWith('#');
          const isActive = !isHash && currentPathname === getPathname(item.href);

          const linkClasses = cn(
            "flex items-center gap-2 py-2 transition-all outline-none cursor-pointer",
            isCatalog
              ? "text-brand-lime hover:text-white"
              : isActive
                ? "text-brand-lime font-extrabold"
                : "text-white/90 hover:text-brand-lime"
          );

          if (isHash) {
            return (
              <a key={item.label} href={item.href} className={linkClasses}>
                {isCatalog && <MenuIcon className="size-4 text-brand-lime" />}
                <span>{item.label}</span>
              </a>
            );
          }

          return (
            <Link key={item.label} href={item.href} className={linkClasses}>
              {isCatalog && <MenuIcon className="size-4 text-brand-lime" />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Индикатор склада */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-white/80 font-medium">
        <MapPin className="size-4 text-brand-lime" />
        <span>Склад: {company.warehouse}</span>
      </div>
    </div>
  );
}