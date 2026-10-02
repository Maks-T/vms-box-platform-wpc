import React from 'react';
import { Head } from '@inertiajs/react';

import MainLayout from '@/layouts/MainLayout';
import { CatalogFilters } from '@/features/catalog/components/CatalogFilters';
import { CatalogSearchInput } from '@/features/catalog/components/CatalogSearchInput';
import { useCatalogParams } from '@/features/catalog/hooks/useCatalogParams';
import { useCatalogApi } from '@/features/catalog/hooks/useCatalogApi';

import { CatalogHeroBlock } from './components/CatalogHeroBlock';
import { CatalogNavigationBlock } from './components/CatalogNavigationBlock';
import { ProductGridBlock } from './components/ProductGridBlock';
import { ValuesBlock } from './components/ValuesBlock';
import { CalculatorTeaserBlock } from './components/CalculatorTeaserBlock';
import { FaqBlock } from './components/FaqBlock';
import { ContactsBlock } from './components/ContactsBlock';
import { ApiInspector } from '@widgets/ApiInspector';
import { useDevMode } from '@/shared/hooks/useDevMode';

export default function CatalogIndex() {
  const isDev = useDevMode();

  const {
    family, productType, search, page, filters: activeFilters,
    setFamily, setProductType, setSearch, setPage, toggleFilter, clearFilters
  } = useCatalogParams('decking_system');

  const {
    products, meta, filtersSchema, bootstrapConfig, isLoading, apiUrl
  } = useCatalogApi({ family, productType, search, page, filters: activeFilters });

  const familiesList = bootstrapConfig?.families || [];

  const activeFamilyData = familiesList.find(f => f.code === family);
  const typesForActiveFamily = activeFamilyData?.types || [];
  const activeFamilyName = activeFamilyData?.name;

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || Boolean(search);

  const apiRequests = [
    {
      label: 'Данные Каталога (Товары / Услуги)',
      endpoint: apiUrl,
      data: { data: products, meta: meta }
    },
    {
      label: 'Схема Фильтров Каталога',
      endpoint: `/api/v1/${family}/filters`,
      data: filtersSchema
    },
    {
      label: 'Глобальная Конфигурация (Bootstrap)',
      endpoint: '/api/v1/bootstrap',
      data: bootstrapConfig
    }
  ];

  return (
    <MainLayout headerOverlaps={false}>
      <Head title="Каталог террасной доски ДПК и МПК — OliverDeck" />

      {/* Основной белый контейнер каталога на фоне #eceef1 */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <CatalogNavigationBlock
            familiesList={familiesList}
            activeFamily={family}
            setFamily={setFamily}
            typesSchema={typesForActiveFamily}
            productType={productType}
            setProductType={setProductType}
          />

        {/* Строка поиска */}
          <div className="relative mb-8">
          <CatalogSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Поиск по названию, коду, артикулу..."
          />
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-3 space-y-7 border-r border-stone-100 pr-0 lg:pr-6">
              <div className="sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 custom-scrollbar">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mb-4 text-[11px] font-bold text-stone-500 hover:text-black uppercase tracking-wider border-b border-stone-200 pb-0.5 transition-colors cursor-pointer"
                  >
                    Сбросить фильтры
                  </button>
                )}
                <CatalogFilters filters={filtersSchema} activeFilters={activeFilters} onToggle={toggleFilter} />
              </div>
            </aside>

            <section className="lg:col-span-9">
              <ProductGridBlock
                isLoading={isLoading}
                products={products}
                meta={meta}
                setPage={setPage}
                clearFilters={clearFilters}
                bootstrapConfig={bootstrapConfig}
              />
            </section>

            {!isLoading && isDev && (
              <div className="mt-8 border-t border-border pt-10 pb-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Инспектор API запросов</h3>
                <ApiInspector requests={apiRequests} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Ценности и возможности */}
      <ValuesBlock />

      {/* Тизер калькулятора */}
      <CalculatorTeaserBlock />

      {/* Часто задаваемые вопросы */}
      <FaqBlock />

      {/* Контакты и реквизиты */}
      <ContactsBlock />
    </MainLayout>
  );
}

CatalogIndex.layout = (page: any) => page;