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
    name: "GreenDECKS",
    subName: "Composite WPC",
    status: "Склад в Астане",
    warehouse: "г. Астана, ул. Өндіріс, 12/2",
    schedule: "Пн-Сб: 09:00 - 18:00",
    bin: "240440006864",
    copyright: `© 2014–${new Date().getFullYear()} GREENDECKS. Все права защищены.`,
  },

  contacts: {
    phone: { label: "+7 775 172 07 63", href: "tel:+77751720763" },
    email: { label: "info@greendecks.kz", href: "mailto:info@greendecks.kz" },
    whatsapp: { label: "+7 775 172 07 63", href: "https://wa.me/77751720763" },
  },

  socials: [
    { id: 'instagram', href: "https://www.instagram.com/greendecks_kz/", label: "Instagram" },
    { id: 'youtube', href: "https://www.youtube.com/@greendeckS_kz", label: "YouTube" },
    { id: 'tiktok', href: "https://tiktok.com", label: "TikTok" },
    { id: 'telegram', href: "https://t.me/greendecksKZ", label: "Telegram" },
  ] as SocialItem[],

  headerNav: [
    { label: 'Каталог', href: route('catalog'), disabled: false },
    { label: 'Калькулятор', href: route('calculator.show'), disabled: false, forceRefresh: true },
    { label: 'Контакты', href: '#contacts', disabled: false },
  ] as (NavItem & { forceRefresh?: boolean })[],
};