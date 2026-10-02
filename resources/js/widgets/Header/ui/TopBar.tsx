import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { siteConfig } from '@/shared/config/site';
import { setDevMode } from '@/shared/lib/dev';
import PillSwitcher, { PillOption } from '@/shared/components/ui/PillSwitcher';
import { Logo } from '@/shared/components/ui/Logo';
import { router } from '@inertiajs/react';

interface TopBarProps {
  locale: string;
  onLanguageChange: (lang: string) => void;
  isDev: boolean;
  isEmployee: boolean;
}

export default function TopBar({ locale, onLanguageChange, isDev, isEmployee }: TopBarProps) {
  const { contacts, company } = siteConfig;
  const [searchQuery, setSearchQuery] = useState('');

  const modeOptions: PillOption<boolean>[] = [
    { value: false, label: 'PROD', title: 'Переключить в обычный режим' },
    { value: true, label: 'DEV', title: 'Переключить в режим разработчика' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.visit(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full bg-brand-header text-white border-b border-brand-border shadow-md">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Логотип + Поиск */}
        <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-[260px] max-w-xl">
          <Logo variant="light-solid" />

          <form onSubmit={handleSearchSubmit} className="relative hidden sm:flex items-center flex-1 max-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ключевое слово"
              className="w-full h-9 pl-3.5 pr-8 bg-brand-surface border border-brand-border rounded-full text-xs text-stone-200 placeholder-brand-muted/70 focus:outline-none focus:border-brand-gold transition-colors"
            />
            <button type="submit" className="absolute right-2.5 text-brand-muted hover:text-white transition-colors cursor-pointer" aria-label="Поиск">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* График и Шоурум */}
        <div className="hidden xl:flex items-center gap-8 text-[12px] leading-snug border-l border-brand-border pl-6 text-stone-300">
          <div>
            <span className="text-brand-muted block text-[11px]">Время работы:</span>
            <span>{company.scheduleWeekdays || 'ПН-ПТ: 10:00–19:00'}</span><br />
            <span className="text-stone-400">{company.scheduleWeekend || 'СБ-ВС: 10:00–14:00'}</span>
          </div>

          <div>
            <span className="text-brand-gold font-medium block text-[11px]">Шоурум в Москве</span>
            <span>{company.showroom || 'ул. Космонавта Волкова, 20'}</span>
          </div>
        </div>

        {/* Мессенджеры, телефон и действия */}
        <div className="flex items-center gap-3 sm:gap-5 ml-auto">
          <div className="flex items-center gap-2">
            <a href={contacts.whatsapp.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-85 transition-opacity" title="WhatsApp">
              <img src="https://oliverdeck.ru/thumb/2/vOhBSGdb8t0LmG8dQ7Wd6A/r/d/whatsapp_1.svg" alt="WhatsApp" className="w-7 h-7 sm:w-8 sm:h-8" />
            </a>
            <a href={contacts.telegram.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-85 transition-opacity" title="Telegram">
              <img src="https://oliverdeck.ru/thumb/2/hv0LcXwHfeXEsfpYpLYtTg/r/d/telegram_1.svg" alt="Telegram" className="w-7 h-7 sm:w-8 sm:h-8" />
            </a>
          </div>

          <div className="text-right">
            <a href={contacts.phone.href} className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-white hover:text-brand-gold transition-colors block whitespace-nowrap">
              {contacts.phone.label}
            </a>
            <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {company.status}
            </span>
          </div>

          <a
            href={contacts.phone.href}
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full bg-brand-surface hover:bg-brand-border border border-brand-border text-xs text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Заказать звонок
          </a>

          {(isDev || isEmployee) && (
            <PillSwitcher
              options={modeOptions}
              activeValue={isDev}
              onChange={(val) => setDevMode(val)}
              className="hidden 2xl:inline-flex !bg-white/10 !border-white/15 !text-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}