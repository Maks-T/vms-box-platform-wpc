import React from 'react';
import { ShieldCheck, Sun, Leaf, CheckCircle2, Truck, BadgePercent, Gift, Headphones } from 'lucide-react';

export function ValuesBlock() {
  const values = [
    {
      icon: ShieldCheck,
      title: 'Безопасность',
      description: 'Наш ДПК не оставляет заноз и не скользит даже после дождя. Идеально для детей и домашних животных.',
    },
    {
      icon: Sun,
      title: 'Стойкость',
      description: 'Материалы адаптированы к климату Казахстана: от -50°C в Астане до +50°C на солнце в Алматы.',
    },
    {
      icon: Leaf,
      title: 'Экологичность',
      description: 'Используем только безопасные полимеры и натуральную древесную муку без вредных испарений.',
    },
    {
      icon: CheckCircle2,
      title: 'Честность',
      description: 'Рассчитываем реальный расход материалов. Никаких навязанных лишних метров и скрытых платежей.',
    },
  ];

  const perks = [
    {
      icon: Truck,
      title: 'Быстрая доставка',
      desc: 'Отгрузка в день оплаты со складов в Астане (ул. Өндіріс) и Алматы',
    },
    {
      icon: BadgePercent,
      title: 'Прямые цены',
      desc: 'Поставки от проверенных брендов без лишних посреднических наценок',
    },
    {
      icon: Gift,
      title: 'Бонусы к заказам',
      desc: 'Комплектующие и крепежные элементы при заказе террасы под ключ',
    },
    {
      icon: Headphones,
      title: 'Инженерная поддержка',
      desc: 'Профессиональный расчет проекта и консультации монтажников 24/7',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100 w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-forest font-bold text-xs uppercase tracking-wider block mb-2">
            Надежность и стандарты
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-gray-900 uppercase tracking-tight">
            Ценности Greendecks
          </h2>
          <div className="w-16 h-1 bg-brand-lime mx-auto mt-4 rounded-full" />
        </div>

        {/* Сетка 4 ценностей */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="bg-[#f9fbf9] p-6 rounded-2xl border-b-4 border-brand-lime text-center shadow-xs hover:shadow-md transition">
                <div className="w-12 h-12 mx-auto rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">{v.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{v.description}</p>
              </div>
            );
          })}
        </div>

        {/* 4 преимущества поставки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-gray-100">
          {perks.map((p) => (
            <div key={p.title} className="flex items-start gap-4">
              <p.icon className="w-6 h-6 text-brand-forest shrink-0 mt-1" />
              <div>
                <h4 className="font-heading font-bold text-sm text-gray-900 mb-1">{p.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
