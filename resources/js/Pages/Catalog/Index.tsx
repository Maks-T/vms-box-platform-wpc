import React from 'react';
import { Head } from '@inertiajs/react';

import MainLayout from '@/layouts/MainLayout';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { CatalogFilters } from '@/features/catalog/components/CatalogFilters';
import { CatalogSearchInput } from '@/features/catalog/components/CatalogSearchInput';
import { useCatalogParams } from '@/features/catalog/hooks/useCatalogParams';
import { useCatalogApi } from '@/features/catalog/hooks/useCatalogApi';

import { CatalogHeroBlock } from './components/CatalogHeroBlock';
import { CatalogNavigationBlock } from './components/CatalogNavigationBlock';
import { ProductGridBlock } from './components/ProductGridBlock';
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
      <Head title={`${activeFamilyName || 'Каталог'} - VMS-NC Box`} />

      {/* Компактный заголовок каталога */}
      <CatalogHeroBlock />

      {/* Контентная часть (без огромных дыр) */}
      <SectionLayout containerVariant="content" className="pt-2 pb-16">
        <CatalogNavigationBlock
          familiesList={familiesList}
          activeFamily={family}
          setFamily={setFamily}
          typesSchema={typesForActiveFamily}
          productType={productType}
          setProductType={setProductType}
        />

        {/* Строка поиска */}
        <div className="mb-6 w-full flex justify-start">
          <CatalogSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Поиск по названию, коду, артикулу..."
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="hidden lg:block lg:w-[260px] xl:w-[280px] shrink-0">
            <div className="sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto pr-4 custom-scrollbar">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mb-6 text-[11px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest border-b border-border hover:border-primary pb-1 transition-colors cursor-pointer"
                >
                  Сбросить фильтры
                </button>
              )}
              <CatalogFilters filters={filtersSchema} activeFilters={activeFilters} onToggle={toggleFilter} />
            </div>
          </aside>

          <div className="lg:col-span-9 flex-1 relative flex flex-col">
            <div className="relative flex-1 mb-12">
              <ProductGridBlock
                isLoading={isLoading}
                products={products}
                meta={meta}
                setPage={setPage}
                clearFilters={clearFilters}
                bootstrapConfig={bootstrapConfig}
              />
            </div>

            {!isLoading && isDev && (
              <div className="mt-8 border-t border-border pt-10 pb-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Инспектор API запросов</h3>
                <ApiInspector requests={apiRequests} />
              </div>
            )}
          </div>
        </div>
      </SectionLayout>
    </MainLayout>
  );
}

CatalogIndex.layout = (page: any) => page;