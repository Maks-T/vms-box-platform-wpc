import React from 'react';
import { siteConfig } from '@/shared/config/site';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export function ContactsBlock() {
  const { company, contacts } = siteConfig;

  return (
    <section id="contacts" className="py-20 bg-white border-t border-gray-200 w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        
        <div className="mb-12">
          <span className="text-brand-forest font-bold text-xs uppercase tracking-wider block mb-1">
            Связь с нами
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-gray-900 uppercase tracking-tight">
            Контакты и склад в Астане
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Карточка реквизитов компании */}
          <div className="lg:col-span-5 bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">
                  ТОО «GREENDECKS»
                </h3>
                <div className="text-xs text-gray-500 font-mono">БИН: {company.bin}</div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                  <span><strong>Склад:</strong> {company.warehouse}, индекс Z10D8C5</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand-forest shrink-0" />
                  <span><strong>Режим работы:</strong> {company.schedule}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-forest shrink-0" />
                  <a href={contacts.phone.href} className="font-bold text-gray-900 hover:text-brand-forest transition">
                    {contacts.phone.label}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-forest shrink-0" />
                  <a href={contacts.email.href} className="hover:text-brand-forest transition">
                    {contacts.email.label}
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href={contacts.whatsapp.href}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-forest hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider py-3.5 rounded-xl transition shadow-sm active:scale-95"
              >
                <MessageSquare className="w-4 h-4 text-brand-lime" />
                <span>Написать в WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Блок самовывоза и адреса склада */}
          <div className="lg:col-span-7 bg-brand-lightBg rounded-2xl p-8 border border-green-100 flex flex-col justify-center items-center text-center">
            <MapPin className="w-12 h-12 text-brand-forest mb-3" />
            <h4 className="font-heading font-bold text-lg text-gray-900 mb-2">Центральный пункт самовывоза</h4>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md leading-relaxed mb-4">
              Республика Казахстан, г. Астана, район Байконыр, Ж/м Өндіріс, ул. Өндіріс 12/2. Удобный заезд для грузового транспорта, помощь с погрузкой.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
