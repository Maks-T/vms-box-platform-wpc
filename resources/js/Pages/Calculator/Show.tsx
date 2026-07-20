import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import CalculatorPreloader from './components/CalculatorPreloader';
import CalculatorTabs from './components/CalculatorTabs';

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
    state: any;
    auth: {
      client: any;
      employee: any;
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

export default function CalculatorShow({ assets, initialData, currentType }: Props) {
  const { auth } = usePage<any>().props;
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const unmountFnRef = useRef<(() => void) | null>(null);

  const initialDataStr = JSON.stringify(initialData);

  console.log({assets});


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

        const fullConfig = {
          ...initialData,
          user: auth?.user,
          employee: auth?.employee,
          type: currentType,
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
  }, [assets.js, assets.css, initialDataStr, currentType, auth?.user, auth?.employee]);

  const seoTitle = currentType === 'fence'
    ? 'Онлайн-калькулятор ограждений из ДПК'
    : 'Онлайн-калькулятор террасы из ДПК';

  return (
    <MainLayout headerOverlaps={false}>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content="Рассчитайте точное количество материалов и стоимость ДПК за 2 минуты." />
      </Head>

      <SectionLayout containerVariant="page" className="pt-8 md:pt-12 pb-24 bg-gray-50 min-h-screen">

        <CalculatorTabs currentType={currentType} className="mb-8" />

        <div className="w-full relative z-10 bg-white rounded-2xl border border-border p-4 md:p-8 lg:p-10 shadow-sm">
          <div className="relative w-full min-h-[650px]">
            {!isWidgetReady && (
              <div className="absolute inset-0 z-10 bg-white flex items-center justify-center rounded-2xl">
                <CalculatorPreloader currentType={currentType} />
              </div>
            )}
            <div id={ROOT_CONTAINER_ID} className="w-full min-h-[650px]" />
          </div>
        </div>
      </SectionLayout>
    </MainLayout>
  );
}

CalculatorShow.layout = (page: any) => page;
