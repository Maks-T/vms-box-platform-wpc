import React, { useState, useEffect } from 'react';
import { Menu, ShieldCheck, Heart } from 'lucide-react';
import { siteConfig } from '@/shared/config/site';
import { usePage } from '@inertiajs/react';
import { useFavorites } from '@/store/useFavorites';

import TopBar from './ui/TopBar';
import NavBar from './ui/NavBar';
import MobileMenu from './ui/MobileMenu';
import { checkDevMode } from '@/shared/lib/dev';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [locale, setLocale] = useState(localStorage.getItem('app_locale') || 'ru');

  const { auth } = usePage().props as any;
  const isEmployee = !!auth?.employee;

  const isDev = checkDevMode();
  const { items, setIsOpen } = useFavorites();

  useEffect(() => {
    localStorage.setItem('app_locale', locale);
  }, [locale]);

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale);
    window.location.reload();
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const visibleNavItems = siteConfig.headerNav;

  return (
    <>
      <header role="banner" className="w-full">
        {/* Темный контактный топ-бар OliverDeck */}
        <TopBar
          locale={locale}
          onLanguageChange={handleLanguageChange}
          isDev={isDev}
          isEmployee={isEmployee}
        />

        {/* Навигационная полоса в фирменном стиле */}
        <div className="bg-brand-nav border-t border-brand-border/70 sticky top-0 z-40 shadow-md">
          <div className="mx-auto flex max-w-[1360px] items-center justify-between px-4 sm:px-6">
            <NavBar items={visibleNavItems} />

            <div className="flex items-center gap-2.5 ml-4">
              {(isDev || isEmployee) && (
                <a
                  href="/admin"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-surface hover:bg-brand-border border border-brand-border text-white text-xs font-semibold tracking-wide transition-all"
                >
                  <ShieldCheck className="size-3.5 text-brand-gold" />
                  <span>Админ</span>
                </a>
              )}

              {/* Избранное */}
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Избранное"
                className="relative size-8 rounded bg-brand-surface hover:bg-brand-border border border-brand-border text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <Heart className="size-4 stroke-[2]" />
                {items.length > 0 && (
                  <span className="pointer-events-none absolute -top-1 -right-1 size-4 rounded-full bg-brand-gold text-black text-[9px] font-black flex items-center justify-center shadow-sm">
                    {items.length}
                  </span>
                )}
              </button>

              {/* Мобильный бургер */}
              <button
                type="button"
                className="lg:hidden size-8 rounded bg-brand-surface hover:bg-brand-border border border-brand-border text-white flex items-center justify-center cursor-pointer"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={visibleNavItems}
        isDev={isDev}
      />
    </>
  );
}