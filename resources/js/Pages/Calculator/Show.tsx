import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import CalculatorPreloader from './components/CalculatorPreloader';

interface Props {
  assets: {
    js: string | null;
    css: string | null;
  };
  initialData: {
    apiUrl: string;
    assetsUrl: string;
    baseUrl: string;
    policyLink?: string;
    ofertaLink?: string;
    orderCode?: string;
    state?: any;
    auth: {
      client: any;
      employee: {
        id: number | null;
        name: string;
        email: string;
        roles: string[];
      };
    };
    type: string | null;
  };
  currentType: string;
}

declare global {
  interface Window {
    initCalculator?: (containerId: string, config: any) => () => void;
  }
}

const ROOT_CONTAINER_ID = 'calcAppRoot';

/**
 * Нормализация ролей: преобразует массив объектов ролей [{name: 'admin'}] в массив чистых строк ['admin']
 */
function normalizeRoles(roles: any): string[] {
  if (!Array.isArray(roles)) {
    return [];
  }
  return roles
    .map((r) => (typeof r === 'string' ? r : r?.name))
    .filter((r): r is string => typeof r === 'string' && r.length > 0);
}

export default function CalculatorShow({ assets, initialData, currentType }: Props) {
  const { auth } = usePage<any>().props;
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const unmountFnRef = useRef<(() => void) | null>(null);

  const initialDataStr = JSON.stringify(initialData);

  useEffect(() => {
    if (!assets.js) {
      console.error('Калькулятор: JS-файл точки входа не найден в manifest.json');
      return;
    }

    setIsWidgetReady(false);

    const initWidget = () => {
      if (window.initCalculator) {
        if (unmountFnRef.current) {
          unmountFnRef.current();
          unmountFnRef.current = null;
        }

        const container = document.getElementById(ROOT_CONTAINER_ID);
        if (container) {
          container.innerHTML = '';
        }

        // Преобразуем данные авторизованного сотрудника в строгий формат Zod (roles: string[])
        const rawRoles = auth?.user?.roles ?? auth?.user?.role_names ?? initialData?.auth?.employee?.roles ?? [];

        const employee = auth?.user ? {
          id: typeof auth.user.id === 'number' ? auth.user.id : null,
          name: String(auth.user.name || 'Сотрудник'),
          email: String(auth.user.email || ''),
          roles: normalizeRoles(rawRoles),
        } : (initialData?.auth?.employee ?? {
          id: null,
          name: 'Гость',
          email: '',
          roles: [],
        });

        const fullConfig = {
          ...initialData,
          auth: {
            ...initialData?.auth,
            employee,
          },
          type: 'terrace',
        };

        unmountFnRef.current = window.initCalculator(ROOT_CONTAINER_ID, fullConfig);
        setIsWidgetReady(true);
      }
    };

    const existingScript = document.getElementById('external-calc-js');

    if (!existingScript) {
      if (assets.css && !document.getElementById('external-calc-css')) {
        const link = document.createElement('link');
        link.id = 'external-calc-css';
        link.rel = 'stylesheet';
        link.href = assets.css;
        document.head.appendChild(link);
      }

      const script = document.createElement('script');
      script.id = 'external-calc-js';
      script.src = assets.js;
      script.type = 'module';
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else {
      initWidget();
    }

    return () => {
      if (unmountFnRef.current) {
        unmountFnRef.current();
        unmountFnRef.current = null;
      }
    };
  }, [assets.js, assets.css, initialDataStr, currentType, auth?.user]);

  const seoTitle = 'Онлайн-калькулятор террасы из ДПК';

  return (
    <MainLayout headerOverlaps={false}>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content="Рассчитайте точное количество материалов и стоимость террасы из ДПК за 2 минуты." />
      </Head>

      <SectionLayout containerVariant="page" className="pt-4 md:pt-6 pb-8 md:pb-12 bg-gray-50">

        <div className="w-full relative z-10 bg-white rounded-2xl border border-border p-2 sm:p-4 md:p-6 shadow-sm">
          <div className="relative w-full">
            {!isWidgetReady && (
              <div className="absolute inset-0 z-10 bg-white flex items-center justify-center rounded-2xl min-h-[500px]">
                <CalculatorPreloader currentType="terrace" />
              </div>
            )}
            <div id={ROOT_CONTAINER_ID} className="w-full h-auto" />
          </div>
        </div>
      </SectionLayout>
    </MainLayout>
  );
}