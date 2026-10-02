import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/shared/config/site';
import { cn } from '@/shared/lib/utils';

export function FaqBlock() {
  const { contacts } = siteConfig;
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Какой режим работы складов и консультантов?',
      a: 'Наш отдел продаж и шоурум в Москве (ул. Космонавта Волкова, 20) работают с понедельника по пятницу с 10:00 до 19:00, в субботу и воскресенье с 10:00 до 14:00. Вы всегда можете получить консультацию или заказать расчет по телефону +7 495 255-13-70 или через WhatsApp.',
    },
    {
      q: 'Как осуществляется доставка по Москве и регионам России?',
      a: 'Мы поставляем террасную доску ДПК и МПК по Москве и Московской области собственным транспортом. В регионы РФ доставка осуществляется проверенными транспортными компаниями (Деловые Линии, ПЭК) с бережной упаковкой всех профилей в защитную пленку.',
    },
    {
      q: 'Можно ли забрать товар самостоятельно?',
      a: 'Да! Вы можете забрать заказ самовывозом с нашего склада в Москве. Перед выездом согласуйте готовность заказа с менеджером для оперативной комплектации.',
    },
    {
      q: 'Нужен ли специальный уход за террасой из ДПК?',
      a: 'В отличие от натурального дерева, террасная доска OliverDeck не нуждается в ежегодной покраске и обработке защитными маслами. Поверхность 3D Wood не скользит, не боится влаги и легко очищается обычной водой.',
    },
    {
      q: 'Каков срок службы и предоставляется ли гарантия?',
      a: 'На всю продукцию OliverDeck предоставляется официальная заводская гарантия 5 лет. Расчетный срок службы композита составляет до 25 лет.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#eceef1] border-t border-stone-200 w-full">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Левая колонка */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-stone-500 font-bold text-xs uppercase tracking-wider block">
              Помощь покупателю
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-gray-900 uppercase tracking-tight leading-tight">
              Часто задаваемые вопросы
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Собрали главные ответы по срокам службы, доставке по Москве и городам РФ и особенностям эксплуатации древесно-полимерного композита.
            </p>

            <div className="pt-4">
              <a
                href={contacts.whatsapp.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 bg-brand-gold hover:bg-brand-gold-hover text-black text-xs font-heading font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Задать вопрос в WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Правая колонка: Аккордеон */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/60 transition"
                  >
                    <span className="font-heading font-bold text-sm sm:text-base text-gray-900 flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-brand-gold shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180 text-brand-gold")} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
