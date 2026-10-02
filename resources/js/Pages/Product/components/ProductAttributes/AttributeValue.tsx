import React from 'react';
import { ExternalLink } from 'lucide-react';
import { EavAttribute, EavValueOption } from '@/types/catalog';
import {ValueMultiple} from './ValueMultiple';
import {ValueSingleOption} from './ValueSingleOption';

interface Props {
  attribute: EavAttribute;
}

export function AttributeValue({attribute}: Props) {
  const val = attribute.value;

  if (val === null || val === undefined || val === '') {
    return <span className="text-muted-foreground">—</span>;
  }

  if (attribute.is_multiple && Array.isArray(val)) {
    return <ValueMultiple values={val}/>;
  }

  // ЗАМЕНИЛИ 'name' на 'label' в проверке:
  if (typeof val === 'object' && !Array.isArray(val) && val !== null && 'label' in val) {
    return <ValueSingleOption option={val as EavValueOption}/>;
  }

  if (typeof val === 'boolean') {
    return <span className="font-semibold text-foreground">{val ? 'Да' : 'Нет'}</span>;
  }

  // Преобразование веб-ссылок в кнопку перехода в магазин
  if (typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'))) {
    return (
      <a
        href={val}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-brand-gold hover:text-black text-stone-800 text-xs font-semibold rounded border border-stone-300 transition-colors shadow-2xs"
      >
        <span>В магазин</span>
        <ExternalLink className="size-3" />
      </a>
    );
  }

  return <span className="font-semibold text-foreground">{String(val)}</span>;
}
