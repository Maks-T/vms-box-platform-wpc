import React from 'react';
import { Phone, Mail, Clock } from 'lucide-react';
import { siteConfig } from '@/shared/config/site';
import { setDevMode } from '@/shared/lib/dev';
import PillSwitcher, { PillOption } from '@/shared/components/ui/PillSwitcher';
import { Logo } from '@/shared/components/ui/Logo';
import { route } from 'ziggy-js';
import { Link } from '@inertiajs/react';

interface TopBarProps {
  locale: string;
  onLanguageChange: (lang: string) => void;
  isDev: boolean;
  isEmployee: boolean;
}

export default function TopBar({ locale, onLanguageChange, isDev, isEmployee }: TopBarProps) {
  const { contacts, company } = siteConfig;

  const languageOptions: PillOption<string>[] = [
    { value: 'ru', label: 'RU' },
    { value: 'en', label: 'EN' },
  ];

  const modeOptions: PillOption<boolean>[] = [
    { value: false, label: 'PROD', title: 'Переключить в обычный режим' },
    { value: true, label: 'DEV', title: 'Переключить в режим разработчика' },
  ];

  return (
    <div className="w-full bg-brand-lightBg border-b border-green-100 py-3 px-4 sm:px-8 transition-colors">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        
        {/* Логотип */}
        <Logo variant="light-solid" />

        {/* Блок контактов */}
        <div className="hidden md:flex items-center gap-8 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest shrink-0">
              <Phone className="w-4 h-4" />
            </span>
            <div>
              <div className="text-gray-500 uppercase tracking-wider text-[10px] font-semibold">Заказать звонок</div>
              <a href={contacts.phone.href} className="font-bold text-gray-900 text-sm hover:text-brand-forest transition">
                {contacts.phone.label}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest shrink-0">
              <Clock className="w-4 h-4" />
            </span>
            <div>
              <div className="text-gray-500 uppercase tracking-wider text-[10px] font-semibold">График работы</div>
              <div className="font-bold text-gray-900 text-sm">{company.schedule}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest shrink-0">
              <Mail className="w-4 h-4" />
            </span>
            <div>
              <div className="text-gray-500 uppercase tracking-wider text-[10px] font-semibold">Почта для заявок</div>
              <a href={contacts.email.href} className="font-bold text-gray-900 text-sm hover:text-brand-forest transition">
                {contacts.email.label}
              </a>
            </div>
          </div>
        </div>

        {/* Действия: Switchers + Кнопка быстрого расчета */}
        <div className="flex items-center gap-3">
          {(isDev || isEmployee) && (
            <PillSwitcher
              options={modeOptions}
              activeValue={isDev}
              onChange={(val) => setDevMode(val)}
              className="hidden xl:inline-flex !bg-black/5 !border-black/10 !text-gray-700"
            />
          )}

          <Link
            href={route('calculator.show')}
            className="inline-flex items-center justify-center bg-brand-forest hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition shadow-sm active:scale-95"
          >
            Быстрый расчет
          </Link>
        </div>
      </div>
    </div>
  );
}