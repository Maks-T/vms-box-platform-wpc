import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { X, BookOpen, ExternalLink } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Logo } from '@/shared/components/ui/Logo';
import { NavItem } from '@/shared/config/site';

interface ExtendedNavItem extends NavItem {
  forceRefresh?: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: ExtendedNavItem[];
  isDev: boolean;
}

export default function MobileMenu({ isOpen, onClose, items, isDev }: MobileMenuProps) {
  if (!isOpen) return null;

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
    <div className={cn(
      "fixed inset-0 z-[100] bg-[#0B0F19] flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center shrink-0">
        <Logo variant="dark-solid" onClick={onClose} />
        <button
          className="size-9 bg-white/5 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/10 cursor-pointer"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex flex-col px-6 py-4 flex-1 overflow-y-auto">
        {items.map((item) => {
          if (item.disabled) {
            return (
              <span key={item.label} className="py-4 text-base text-white/30 font-medium border-b border-white/5 cursor-not-allowed select-none">
                {item.label}
              </span>
            );
          }

          const isExternal = Boolean(item.isExternal);
          const isActive = !isExternal && currentPathname === getPathname(item.href);

          const classes = cn(
            "flex items-center justify-between py-4 text-base border-b border-white/5 transition-colors cursor-pointer",
            isActive ? "text-[#3D98FF] font-bold" : "text-white font-medium hover:text-white/80"
          );

          if (isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={classes}
                onClick={onClose}
              >
                <span>{item.label}</span>
                <ExternalLink className="size-4 text-white/50" />
              </a>
            );
          }

          if (item.forceRefresh) {
            return (
              <a key={item.label} href={item.href} className={classes}>
                {item.label}
              </a>
            );
          }

          return (
            <Link key={item.label} href={item.href} className={classes} onClick={onClose}>
              {item.label}
            </Link>
          );
        })}

        {isDev && (
          <a
            href="/docs/api"
            target="_blank"
            rel="noreferrer"
            className="mt-8 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#005ECA] hover:bg-[#005ECA]/90 text-white font-bold tracking-wider uppercase text-xs shadow-md transition-all active:scale-95"
          >
            <BookOpen className="size-4" />
            <span>Swagger API</span>
          </a>
        )}
      </nav>
    </div>
  );
}