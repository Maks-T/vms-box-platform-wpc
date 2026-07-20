import React from 'react';

interface Props {
  currentType: string;
  className?: string;
}

export default function CalculatorPreloader({ currentType, className }: Props) {
  const typeText = currentType === 'fence' ? 'ограждений' : 'террас';

  return (
    <div className={`flex flex-col items-center justify-center h-[600px] text-center p-6 ${className || ''}`}>
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#F15921] rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium text-lg">
        Загрузка модулей калькулятора {typeText}...
      </p>
    </div>
  );
}
