import React from 'react';

interface Props {
  currentType: string;
  className?: string;
}

export default function CalculatorTabs({ currentType, className }: Props) {
  return (
    <div className={`flex justify-center ${className || ''}`}>
      <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 items-center max-w-sm w-full border border-gray-200/50">
        <a
          href="/calculator/terrace"
          className={`flex-1 text-center py-3 rounded-xl text-[14px] font-bold transition-all outline-none ${
            currentType === 'terrace'
              ? "bg-white text-[#F15921] shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Террасы
        </a>
        <a
          href="/calculator/fence"
          className={`flex-1 text-center py-3 rounded-xl text-[14px] font-bold transition-all outline-none ${
            currentType === 'fence'
              ? "bg-white text-[#F15921] shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Ограждения
        </a>
      </div>
    </div>
  );
}
