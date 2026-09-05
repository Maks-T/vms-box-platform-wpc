import React, { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
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
    auth: {
      employee: {
        id: number | null;
        name: string;
        email: string;
        roles: string[];
      };
    };
    orderCode?: string;
    state?: Record<string, unknown>;
  };
}

declare global {
  interface Window {
    initCalculator?: (containerId: string, initialData?: Props['initialData']) => () => void;
  }
}

const ROOT_CONTAINER_ID = 'calcAppRoot';

export default function CalculatorShow({ assets, initialData }: Props) {
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const unmountFnRef = useRef<(() => void) | null>(null);

  const initialDataStr = JSON.stringify(initialData);

  useEffect(() => {
    if (!assets.js) {
      console.error('[Калькулятор] JS-файл точки входа не найден в manifest.json');
      return;
    }

    setIsWidgetReady(false);

    const initWidget = () => {
      if (typeof window.initCalculator === 'function') {
        if (unmountFnRef.current) {
          unmountFnRef.current();
          unmountFnRef.current = null;
        }

        const container = document.getElementById(ROOT_CONTAINER_ID);
        if (!container) {
          console.error(`[Калькулятор] Контейнер #${ROOT_CONTAINER_ID} не найден в DOM`);
          return;
        }

        try {
          const unmount = window.initCalculator(ROOT_CONTAINER_ID, initialData);
          unmountFnRef.current = unmount || null;
          setIsWidgetReady(true);
        } catch (err) {
          console.error('[Калькулятор] Ошибка при вызове window.initCalculator:', err);
        }
      }
    };

    // Подключение CSS виджета
    if (assets.css && !document.getElementById('external-calc-css')) {
      const link = document.createElement('link');
      link.id = 'external-calc-css';
      link.rel = 'stylesheet';
      link.href = assets.css;
      document.head.appendChild(link);
    }

    // Подключение JS скрипта виджета
    const existingScript = document.getElementById('external-calc-js') as HTMLScriptElement | null;

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'external-calc-js';
      script.src = assets.js;
      script.type = 'module';
      script.async = true;
      script.onload = initWidget;
      script.onerror = () => console.error('[Калькулятор] Ошибка загрузки скрипта:', assets.js);
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
  }, [assets.js, assets.css, initialDataStr]);

  return (
    <MainLayout headerOverlaps={false}>
      <Head>
        <title>Онлайн-калькулятор террасы из ДПК</title>
        <meta
          name="description"
          content="Рассчитайте точное количество материалов и стоимость террасы из ДПК за 2 минуты."
        />
      </Head>

      <SectionLayout containerVariant="page" className="min-h-screen bg-gray-50 pt-6 pb-24 md:pt-8">
        <div className="relative z-10 w-full rounded-2xl border border-border bg-white p-4 shadow-sm md:p-8 lg:p-10">
          <div className="relative min-h-[650px] w-full">
            {!isWidgetReady && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white">
                <CalculatorPreloader currentType="terrace" />
              </div>
            )}
            <div id={ROOT_CONTAINER_ID} className="min-h-[650px] w-full" />
          </div>
        </div>
      </SectionLayout>
    </MainLayout>
  );
}

CalculatorShow.layout = (page: React.ReactNode) => page;