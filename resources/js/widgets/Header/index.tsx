import React, { useState, useEffect } from 'react';
import { Menu, BookOpen, ShieldCheck, Heart } from 'lucide-react';
import { Logo } from '@/shared/components/ui/Logo';
import { siteConfig } from '@/shared/config/site';
import { usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
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

  const visibleNavItems = siteConfig.headerNav.filter(item => {
    if (item.href === route('bootstrap') || item.href === route('services')) {
      return isDev;
    }
    return true;
  });

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0B0F19]/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <TopBar
          locale={locale}
          onLanguageChange={handleLanguageChange}
          isDev={isDev}
          isEmployee={isEmployee}
        />

        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
          <Logo variant="dark-solid" />

          <NavBar items={visibleNavItems} />

          <div className="flex items-center gap-2.5">
            {(isDev || isEmployee) && (
              <a
                href="/admin"
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white/90 hover:text-white text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
              >
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>Админ-панель</span>
              </a>
            )}

            {isDev && (
              <a
                href="/docs/api"
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white/90 hover:text-white text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
              >
                <BookOpen className="size-3.5 text-sky-400" />
                <span>API Docs</span>
              </a>
            )}

            {/* Изящная кнопка Избранного */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Избранное"
                className="size-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <Heart className="size-4 stroke-[2]" />
              </button>
              {items.length > 0 && (
                <span className="pointer-events-none absolute -top-1 -right-1 size-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border border-[#0B0F19] shadow-sm">
                  {items.length}
                </span>
              )}
            </div>

            {/* Мобильное меню */}
            <button
              type="button"
              className="lg:hidden size-9 rounded-xl bg-white/[0.04] border border-white/10 text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </button>
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