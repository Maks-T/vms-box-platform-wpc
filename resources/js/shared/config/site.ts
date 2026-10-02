import { route } from 'ziggy-js';

export interface NavItem {
  label: string;
  href: string;
  disabled?: boolean;
  isExternal?: boolean;
}

export interface SocialItem {
  id: string;
  src?: string;
  icon?: any;
  href: string;
  label: string;
}

export const siteConfig = {
  company: {
    name: "OliverDeck",
    subName: "ДПК и МПК покрытия",
    legalName: "ООО «Оливердек»",
    status: "Шоурум открыт",
    showroom: "ул. Космонавта Волкова, 20",
    warehouse: "г. Москва, ул. Космонавта Волкова, 20",
    schedule: "ПН-ПТ: 10:00–19:00, СБ-ВС: 10:00–14:00",
    scheduleWeekdays: "ПН-ПТ: 10:00–19:00",
    scheduleWeekend: "СБ-ВС: 10:00–14:00",
    inn: "7716936058",
    ogrn: "1197746290521",
    copyright: `© 2017–${new Date().getFullYear()} Продажа террасной доски и изделий из ДПК`,
  },

  contacts: {
    phone: { label: "+7 495 255-13-70", href: "tel:+74952551370" },
    email: { label: "info@oliverdeck.ru", href: "mailto:info@oliverdeck.ru" },
    whatsapp: { label: "+7 985 331-14-64", href: "https://wa.me/79853311464" },
    telegram: { label: "@oliverdeck_company", href: "https://t.me/oliverdeck_company" },
  },

  socials: [
    { id: 'whatsapp', href: "https://wa.me/79853311464", label: "WhatsApp" },
    { id: 'telegram', href: "https://t.me/oliverdeck_company", label: "Telegram" },
    { id: 'youtube', href: "https://www.youtube.com/channel/UCXrTLdoPRG3PXq9ptrkaa6A", label: "YouTube" },
    { id: 'vk', href: "https://vk.com/oliverdeck", label: "ВКонтакте" },
  ] as SocialItem[],

  headerNav: [
    { label: 'Каталог', href: route('catalog'), disabled: false },
    { label: 'Калькулятор', href: route('calculator.show'), disabled: false, forceRefresh: true },
    { label: 'Контакты', href: '#contacts', disabled: false },
  ] as (NavItem & { forceRefresh?: boolean })[],
};