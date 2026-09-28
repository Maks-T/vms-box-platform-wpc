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
      a: 'Наш отдел продаж и склады в Астане (ул. Өндіріс 12/2) и Алматы работают с понедельника по субботу с 09:00 до 18:00. Вы всегда можете получить консультацию или заказать расчет по телефону +7 775 172 07 63 даже в нерабочее время через WhatsApp — мы ответим при первой возможности.',
    },
    {
      q: 'Как осуществляется доставка в отдаленные регионы Казахстана?',
      a: 'Мы поставляем ДПК во все города РК: от Актау до Усть-Каменогорска. Доставка осуществляется проверенными транспортными компаниями (Jet Logistic, ПЭК, АБТ Транс) или попутным автотранспортом для экономии вашего бюджета. Все материалы упаковываются в защитную пленку.',
    },
    {
      q: 'Можно ли забрать товар самостоятельно?',
      a: 'Да! Вы можете оформить заказ и забрать его самовывозом с нашего центрального склада в Астане. Мы бесплатно поможем с погрузкой в ваш автотранспорт. Перед выездом уточните наличие нужного объема у менеджера для предварительной комплектации.',
    },
    {
      q: 'Нужен ли специальный уход за террасой из ДПК?',
      a: 'В отличие от обычного дерева, продукция Greendecks не требует ежегодной покраски или обработки маслом. Достаточно периодически промывать террасу обычной водой под давлением. Наш композит не гниет, не боится грибка и сохраняет эстетичный вид десятилетиями.',
    },
    {
      q: 'Каков срок службы и предоставляется ли гарантия?',
      a: 'Продукция рассчитана на эксплуатацию от 15 до 25 лет. Мы предоставляем официальную гарантию на стойкость к гниению, расслоению и структурным дефектам при соблюдении регламентов монтажа.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200 w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Левая колонка */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-brand-forest font-bold text-xs uppercase tracking-wider block">
              Помощь покупателю
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-gray-900 uppercase tracking-tight leading-tight">
              Часто задаваемые вопросы
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Собрали главные ответы по срокам службы, доставке по городам Казахстана и особенностям эксплуатации древесно-полимерного композита.
            </p>

            <div className="pt-4">
              <a
                href={contacts.whatsapp.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 bg-brand-forest hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-brand-lime" />
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
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/60 transition"
                  >
                    <span className="font-heading font-bold text-sm sm:text-base text-gray-900 flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-brand-forest shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180 text-brand-forest")} />
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
