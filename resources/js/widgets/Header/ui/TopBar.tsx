import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { siteConfig } from '@/shared/config/site';
import { setDevMode } from '@/shared/lib/dev';
import PillSwitcher, { PillOption } from '@/shared/components/ui/PillSwitcher';

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
    <div className="hidden border-b border-white/[0.06] bg-black/20 text-xs text-white lg:block">
      <div className="mx-auto flex h-8 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <a
            href={contacts.phone.href}
            className="flex items-center gap-1.5 font-medium text-white/50 transition-colors hover:text-white"
          >
            <Phone className="size-3 opacity-60 text-sky-400" />
            <span>{contacts.phone.label}</span>
          </a>
          <a
            href={contacts.email.href}
            className="flex items-center gap-1.5 font-medium text-white/50 transition-colors hover:text-white"
          >
            <Mail className="size-3 opacity-60 text-sky-400" />
            <span>{contacts.email.label}</span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          {(isDev || isEmployee) && (
            <PillSwitcher
              options={modeOptions}
              activeValue={isDev}
              onChange={(val) => setDevMode(val)}
            />
          )}

          <PillSwitcher
            options={languageOptions}
            activeValue={locale}
            onChange={(val) => onLanguageChange(val)}
          />

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
            <span>{company.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}