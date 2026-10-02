import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { NavItem } from '@/shared/config/site';
import { cn } from '@/shared/lib/utils';
import { bootstrapApi } from '@/shared/api/bootstrap.api';
import { BootstrapFamily } from '@/types/catalog';
import { route } from 'ziggy-js';
import { Calculator, ArrowRight } from 'lucide-react';

interface ExtendedNavItem extends NavItem {
  forceRefresh?: boolean;
}

export default function NavBar({ items }: { items: ExtendedNavItem[] }) {
  const { url } = usePage();
  const currentPathname = url.split('?')[0];
  const [isOpen, setIsOpen] = useState(false);
  const [families, setFamilies] = useState<BootstrapFamily[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bootstrapApi.getConfig().then((cfg) => {
      if (cfg?.families) {
        setFamilies(cfg.families);
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getPathname = (urlStr: string) => {
    if (!urlStr || urlStr.startsWith('#') || urlStr.startsWith('http')) return '';
    try {
      const parsed = new URL(urlStr, window.location.origin);
      return parsed.pathname;
    } catch {
      return urlStr.split('?')[0];
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Интерактивная золотая плашка Каталога OliverDeck */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "flex items-center gap-2.5 bg-brand-gold hover:bg-brand-gold-hover text-black px-4 py-2.5 font-bold text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer select-none",
              isOpen && "bg-brand-gold-hover shadow-inner"
            )}
            aria-expanded={isOpen}
          >
            <div className="flex flex-col gap-1 w-3.5">
              <span className="block h-0.5 w-full bg-black"></span>
              <span className="block h-0.5 w-full bg-black"></span>
              <span className="block h-0.5 w-full bg-black"></span>
            </div>
            <span>Каталог</span>
          </button>

          {/* Выпадающее меню каталога */}
          {isOpen && (
            <div className="absolute top-full left-0 z-50 bg-brand-nav border border-brand-border text-white shadow-2xl rounded-b-xl min-w-[560px] lg:min-w-[640px] p-5 lg:p-6 animate-in fade-in-0 duration-150">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pb-4 border-b border-brand-border/60">
                {families.length > 0 ? (
                  families.map((family) => (
                    <div key={family.code} className="flex flex-col">
                      <Link
                        href={`${route('catalog')}?family=${family.code}`}
                        onClick={() => setIsOpen(false)}
                        className="font-bold text-xs uppercase text-brand-gold hover:text-white tracking-wider pb-1.5 border-b border-brand-border/40 mb-2 block transition-colors"
                      >
                        {family.name}
                      </Link>
                      {family.types && family.types.length > 0 && (
                        <ul className="flex flex-col gap-1 text-[13px] text-stone-300">
                          {family.types.map((t) => (
                            <li key={t.code}>
                              <Link
                                href={`${route('catalog')}?family=${family.code}&product_type=${t.code}`}
                                onClick={() => setIsOpen(false)}
                                className="hover:text-brand-gold hover:translate-x-0.5 transition-all block py-0.5"
                              >
                                {t.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-stone-400 italic py-2 col-span-full">
                    Загрузка категорий...
                  </div>
                )}
              </div>

              <div className="pt-3.5 flex items-center justify-between text-xs">
                <Link
                  href={route('catalog')}
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-stone-200 hover:text-brand-gold flex items-center gap-1.5 uppercase tracking-wider transition-colors"
                >
                  <span>Смотреть весь каталог</span>
                  <ArrowRight className="size-3.5 text-brand-gold" />
                </Link>
                <Link
                  href={route('calculator.show')}
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-brand-gold hover:text-white flex items-center gap-1.5 uppercase tracking-wider transition-colors"
                >
                  <Calculator className="size-3.5" />
                  <span>Онлайн-калькулятор террасы</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Основные ссылки навигации */}
        <nav className="flex items-center text-xs tracking-wide">
          {items.map((item) => {
            const isHash = item.href.startsWith('#');
            const isActive = !isHash && currentPathname === getPathname(item.href);
            const isCatalogLink = item.label.toLowerCase() === 'каталог';

            const linkClasses = cn(
              "px-3.5 py-2.5 transition-colors font-medium whitespace-nowrap",
              isActive || isCatalogLink
                ? "text-brand-gold font-semibold"
                : "text-stone-200 hover:text-brand-gold"
            );

            if (isHash) {
              return (
                <a key={item.label} href={item.href} className={linkClasses}>
                  {item.label}
                </a>
              );
            }

            return (
              <Link key={item.label} href={item.href} className={linkClasses}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Правая часть: Соцсети (YouTube, VK) и Вход */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 border-r border-brand-border pr-4">
          <a href="https://www.youtube.com/channel/UCXrTLdoPRG3PXq9ptrkaa6A" target="_blank" rel="noopener noreferrer" className="opacity-75 hover:opacity-100 transition-opacity" title="YouTube">
            <img src="https://oliverdeck.ru/thumb/2/4DHX_5PqqidL01_CRufcHg/30c30/d/yit.png" alt="YouTube" className="w-5 h-5" />
          </a>
          <a href="https://vk.com/oliverdeck" target="_blank" rel="noopener noreferrer" className="opacity-75 hover:opacity-100 transition-opacity" title="VK">
            <img src="https://oliverdeck.ru/thumb/2/K7ChdRCJIE5W4ijKUO5w8Q/30c30/d/fgs16_vk_square.svg" alt="VK" className="w-5 h-5" />
          </a>
        </div>
        <button
          type="button"
          onClick={() => window.location.href = '/login'}
          className="text-xs text-stone-300 hover:text-brand-gold flex items-center gap-1.5 cursor-pointer font-medium"
        >
          Вход
        </button>
      </div>
    </div>
  );
}