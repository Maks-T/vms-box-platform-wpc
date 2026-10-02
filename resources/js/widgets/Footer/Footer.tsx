import React, { useState } from 'react';
import { Logo } from '@/shared/components/ui/Logo';
import { siteConfig } from '@/shared/config/site';
import { toast } from 'sonner';

export default function Footer() {
  const { company, contacts } = siteConfig;
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(true);

  const handleMeasurementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Пожалуйста, укажите контактный телефон');
      return;
    }
    toast.success('Заявка на выезд замерщика принята! Менеджер свяжется с вами.');
    setAddress('');
    setPhone('');
  };

  return (
    <footer role="contentinfo" className="bg-brand-header text-white border-t border-brand-border mt-auto w-full">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Колонка 1: Компания */}
          <div className="lg:col-span-4 space-y-5">
            <Logo variant="dark-solid" />
            <p className="text-xs text-brand-muted leading-relaxed max-w-sm">
              Продажа террасной доски из ДПК и МПК, фасадных панелей и комплектующих от производителя по первым ценам в Москве и МО.
            </p>
            <div className="pt-2">
              <img
                src="https://oliverdeck.ru/thumb/2/uC6XSVMoLz7T9wBKPrcPhg/150r/d/photo-output.png"
                alt="Гарантия производителя 5 лет"
                className="h-14 w-auto opacity-90"
              />
            </div>
          </div>

          {/* Колонка 2: Форма заявки на выезд замерщика */}
          <div className="lg:col-span-5 bg-brand-surface border border-brand-border rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-1">
              Оставьте заявку на выезд замерщика
            </h3>
            <p className="text-xs text-brand-muted mb-4">Мы подберем удобную для Вас дату</p>

            <form className="space-y-3" onSubmit={handleMeasurementSubmit}>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ваш адрес"
                className="w-full px-3 py-2 bg-brand-header border border-brand-border rounded text-xs text-white placeholder-brand-muted/70 focus:outline-none focus:border-brand-gold transition-colors"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Номер Вашего телефона *"
                className="w-full px-3 py-2 bg-brand-header border border-brand-border rounded text-xs text-white placeholder-brand-muted/70 focus:outline-none focus:border-brand-gold transition-colors"
              />
              <label className="flex items-start gap-2 text-[11px] text-brand-muted cursor-pointer pt-0.5 select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded bg-brand-header border-brand-border accent-brand-gold cursor-pointer"
                />
                <span>Я согласен(на) на обработку моих персональных данных</span>
              </label>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded bg-brand-gold hover:bg-brand-gold-hover text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Отправить
              </button>
            </form>
          </div>

          {/* Колонка 3: Контакты и реквизиты */}
          <div className="lg:col-span-3 space-y-4 text-xs text-stone-300">
            <div>
              <span className="text-brand-muted block text-[11px] uppercase tracking-wider mb-1">Контакты</span>
              <a href={contacts.phone.href} className="text-base font-bold text-white hover:text-brand-gold transition-colors block">
                {contacts.phone.label}
              </a>
            </div>
            <div>
              <span className="text-brand-muted block text-[11px] uppercase tracking-wider mb-0.5">Шоурум в Москве</span>
              <p className="text-stone-300">{company.showroom || 'ул. Космонавта Волкова, 20'}</p>
            </div>
            <div className="pt-2 text-[11px] text-brand-muted border-t border-brand-border/60">
              <p className="text-stone-300 font-medium">{company.legalName || 'ООО «Оливердек»'}</p>
              <p>ИНН {company.inn || '7716936058'} / ОГРН {company.ogrn || '1197746290521'}</p>
            </div>
          </div>
        </div>

        {/* Нижняя полоса копирайта */}
        <div className="border-t border-brand-border mt-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-brand-muted">
          <div>{company.copyright || '© 2017–2026 Продажа террасной доски и изделий из ДПК'}</div>
          <a href="#" className="hover:text-stone-300 transition-colors">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}