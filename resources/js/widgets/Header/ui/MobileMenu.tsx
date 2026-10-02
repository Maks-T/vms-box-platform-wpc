import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { X, Phone, Mail, Clock, MapPin, Send } from 'lucide-react';
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
      "fixed inset-0 z-[100] bg-brand-header text-white flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center shrink-0">
        <Logo variant="dark-solid" onClick={onClose} />
        <button
          className="size-9 bg-brand-surface rounded-xl flex items-center justify-center text-white active:scale-90 transition-all border border-brand-border cursor-pointer"
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
            "flex items-center justify-between py-3.5 text-sm uppercase font-bold tracking-wider border-b border-brand-border/60 transition-colors cursor-pointer",
            isActive ? "text-brand-gold font-bold" : "text-stone-200 hover:text-brand-gold"
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
        <div className="mt-8 pt-6 border-t border-brand-border space-y-4 text-xs text-stone-300">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-brand-gold shrink-0" />
            <a href={contacts.phone.href} className="font-bold text-white text-sm hover:text-brand-gold transition-colors">{contacts.phone.label}</a>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-brand-gold shrink-0" />
            <span>{company.schedule}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
            <span>{company.showroom || company.warehouse}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-brand-gold shrink-0" />
            <a href={contacts.email.href} className="hover:text-brand-gold transition-colors">{contacts.email.label}</a>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <a href={contacts.whatsapp.href} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 px-3 bg-brand-surface border border-brand-border rounded text-center text-xs font-semibold text-white flex items-center justify-center gap-2">
              WhatsApp
            </a>
            <a href={contacts.telegram.href} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 px-3 bg-brand-surface border border-brand-border rounded text-center text-xs font-semibold text-white flex items-center justify-center gap-2">
              <Send className="w-3.5 h-3.5 text-[#0088cc]" /> Telegram
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}