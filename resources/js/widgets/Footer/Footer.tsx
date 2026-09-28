import React from 'react';
import { Logo } from '@/shared/components/ui/Logo';
import { siteConfig } from '@/shared/config/site';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

export default function Footer() {
  const { company, contacts, headerNav } = siteConfig;

  return (
    <footer className="w-full bg-brand-charcoal text-white pt-16 pb-8 mt-auto border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-white/10">
          
          {/* Колонка 1: Компания */}
          <div className="space-y-4">
            <Logo variant="dark-solid" />
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Композитные решения для комфортной жизни на природе и в городе. Производство и поставка террасной доски, ступеней и фасадных панелей из ДПК.
            </p>
            <div className="pt-2">
              <a
                href={contacts.whatsapp.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-brand-forest text-white border border-white/15 text-xs font-heading font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition shadow-xs active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-brand-lime" />
              </a>
            </div>
          </div>

          {/* Колонка 2: Навигация */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-4 text-white">
              Навигация
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {headerNav.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-brand-lime transition">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Колонка 3: Контакты и склад */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-4 text-white">
              Контакты
            </h3>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                <span>{company.warehouse}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-lime shrink-0" />
                <a href={contacts.phone.href} className="hover:text-white font-bold text-white transition">
                  {contacts.phone.label}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-lime shrink-0" />
                <a href={contacts.email.href} className="hover:text-white transition">
                  {contacts.email.label}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Копирайт */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>{company.copyright}</div>
          <div className="text-[11px] font-mono">БИН: {company.bin}</div>
        </div>
      </div>
    </footer>
  );
}