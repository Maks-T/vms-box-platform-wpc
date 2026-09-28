import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { X, Phone, Mail, Clock, MapPin } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Logo } from '@/shared/components/ui/Logo';
import { NavItem, siteConfig } from '@/shared/config/site';

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
  const { contacts, company } = siteConfig;

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
      "fixed inset-0 z-[100] bg-brand-charcoal text-white flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center shrink-0">
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
          const isHash = item.href.startsWith('#');
          const isActive = !isHash && currentPathname === getPathname(item.href);

          const classes = cn(
            "flex items-center justify-between py-4 text-base font-heading uppercase tracking-wider border-b border-white/10 transition-colors cursor-pointer",
            isActive ? "text-brand-lime font-bold" : "text-white hover:text-brand-lime"
          );

          if (isHash) {
            return (
              <a key={item.label} href={item.href} className={classes} onClick={onClose}>
                <span>{item.label}</span>
              </a>
            );
          }

          return (
            <Link key={item.label} href={item.href} className={classes} onClick={onClose}>
              {item.label}
            </Link>
          );
        })}

        {/* Блок контактов в мобильном меню */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-4 text-xs text-gray-300">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-brand-lime" />
            <a href={contacts.phone.href} className="font-bold text-white text-sm">{contacts.phone.label}</a>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-brand-lime" />
            <span>{company.schedule}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-brand-lime" />
            <a href={contacts.email.href}>{contacts.email.label}</a>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-brand-lime" />
            <span>{company.warehouse}</span>
          </div>
        </div>
      </nav>
    </div>
  );
}