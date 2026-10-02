import React from 'react';
import { siteConfig } from '@/shared/config/site';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export function ContactsBlock() {
  const { company, contacts } = siteConfig;

  return (
    <section id="contacts" className="py-16 sm:py-20 bg-white border-t border-stone-200 w-full">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        
        <div className="mb-12">
          <span className="text-stone-500 font-bold text-xs uppercase tracking-wider block mb-1">
            Связь с нами
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-gray-900 uppercase tracking-tight">
            Контакты и шоурум в Москве
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Карточка реквизитов компании */}
          <div className="lg:col-span-5 bg-stone-50 p-6 sm:p-8 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">
                  {company.legalName || 'ООО «Оливердек»'}
                </h3>
                <div className="text-xs text-gray-500 font-mono">ИНН: {company.inn || '7716936058'} / ОГРН: {company.ogrn || '1197746290521'}</div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Шоурум и склад:</strong> {company.showroom || 'ул. Космонавта Волкова, 20'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand-gold shrink-0" />
                  <span><strong>Режим работы:</strong> {company.schedule}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                  <a href={contacts.phone.href} className="font-bold text-gray-900 hover:text-brand-gold transition">
                    {contacts.phone.label}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                  <a href={contacts.email.href} className="hover:text-brand-gold transition">
                    {contacts.email.label}
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-200">
              <a
                href={contacts.whatsapp.href}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-hover text-black text-xs font-heading font-extrabold uppercase tracking-wider py-3.5 rounded-xl transition shadow-sm active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Написать в WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Блок самовывоза и адреса склада */}
          <div className="lg:col-span-7 bg-stone-50 rounded-2xl p-8 border border-stone-200 flex flex-col justify-center items-center text-center shadow-xs">
            <MapPin className="w-12 h-12 text-brand-gold mb-3" />
            <h4 className="font-heading font-bold text-lg text-gray-900 mb-2">Шоурум и склад в Москве</h4>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md leading-relaxed mb-4">
              г. Москва, ул. Космонавта Волкова, 20. Образцы всех линеек террасной доски ДПК и МПК, ступеней и фасадных панелей. Консультация инженера и расчет проекта.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
