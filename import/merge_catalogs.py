#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VMS-NC / OliverDeck Master Import Merge Tool
Точная синхронизация с oliver-deck/src/entities/bootstrap/config/families.ts
+ Автоматическая генерация связей fixing для всех лаг
"""

import json
import argparse
import sys
from typing import Dict, List, Any

# Карта распределения типов строго по src/entities/bootstrap/config/families.ts:
# 1. decking_system: 8 типов
# 2. fence_system: 5 типов (включая fenceProfile)
# 3. hardware_accessory: 5 типов (включая accessories)
CANONICAL_FAMILY_MAP = {
    # fam_decking_systems (8 типов)
    'terraceBoard': 'fam_decking_systems',
    'stepBoard': 'fam_decking_systems',
    'board': 'fam_decking_systems',
    'joist': 'fam_decking_systems',
    'adjustable_pedestal': 'fam_decking_systems',
    'screw_pile': 'fam_decking_systems',
    'foundation_beam': 'fam_decking_systems',
    'rebar': 'fam_decking_systems',

    # fam_fence_systems (5 типов)
    'pillar': 'fam_fence_systems',
    'rail': 'fam_fence_systems',
    'baluster': 'fam_fence_systems',
    'lath': 'fam_fence_systems',
    'fenceProfile': 'fam_fence_systems',

    # fam_hardware_accessories (5 типов)
    'brackets': 'fam_hardware_accessories',
    'decorProducts': 'fam_hardware_accessories',
    'fasteners': 'fam_hardware_accessories',
    'pile_cap': 'fam_hardware_accessories',
    'accessories': 'fam_hardware_accessories',
}

TYPE_NAME_TRANSLATIONS = {
    'terraceBoard': {'ru': 'Террасная доска', 'en': 'Terrace Board'},
    'stepBoard': {'ru': 'Ступень', 'en': 'Step Board'},
    'board': {'ru': 'Доска универсальная (зашивка)', 'en': 'Universal Board'},
    'joist': {'ru': 'Лага монтажная (подконструкция)', 'en': 'Substructure Joist'},
    'adjustable_pedestal': {'ru': 'Регулируемые винтовые опоры', 'en': 'Adjustable Pedestals'},
    'screw_pile': {'ru': 'Винтовые сваи', 'en': 'Screw Piles'},
    'foundation_beam': {'ru': 'Балка обвязки металлокаркаса', 'en': 'Foundation Beam'},
    'rebar': {'ru': 'Арматура монтажная', 'en': 'Rebar'},
    'pillar': {'ru': 'Столб', 'en': 'Pillar'},
    'rail': {'ru': 'Перила', 'en': 'Railing'},
    'baluster': {'ru': 'Балясина', 'en': 'Baluster'},
    'lath': {'ru': 'Рейка', 'en': 'Lath'},
    'fenceProfile': {'ru': 'Заборный профиль', 'en': 'Fence Profile'},
    'brackets': {'ru': 'Кляймеры и кронштейны', 'en': 'Clips and Brackets'},
    'decorProducts': {'ru': 'Декоративные изделия (уголки)', 'en': 'Decorative Corners'},
    'fasteners': {'ru': 'Крепеж и саморезы', 'en': 'Fasteners and Screws'},
    'pile_cap': {'ru': 'Оголовки свай', 'en': 'Pile Caps'},
    'accessories': {'ru': 'Аксессуары столба (крышки, юбки)', 'en': 'Pillar Accessories'},
}

COLOR_SLUG_CANONICAL = {
    'venge': 'wenge',
    'wenge': 'wenge',
    'dub': 'oak',
    'oak': 'oak',
    'seryi': 'grey',
    'seryj': 'grey',
    'grey': 'grey',
    'grafit': 'graphite',
    'graphite': 'graphite',
    'belyi': 'white',
    'white': 'white',
    'shokolad': 'chocolate',
    'chocolate': 'chocolate',
    'shkolad': 'chocolate',
    'koricnevyi': 'brown',
    'brown': 'brown',
    'temno_korichn_': 'dark_brown',
    'dark_brown': 'dark_brown',
    'natural': 'natural',
    'natur': 'natural',
    'sand': 'sand',
    'bronze': 'bronze',
    'beige': 'beige',
    'anthracite': 'anthracite',
    'antracit': 'anthracite',
    'terracotta': 'terracotta',
    'teak': 'teak',
    'tik': 'teak',
    'walnut': 'walnut',
    'maple': 'maple',
    'basalt': 'basalt',
    'chestnut': 'chestnut',
    'light_brown': 'light_brown',
    'suar_mix': 'suar_mix',
    'snow_mix': 'snow_mix',
    'barnwood': 'barnwood',
    'silver': 'silver',
    'serebristyy': 'silver',
    'black_wood': 'black_wood',
    'cherny': 'black_wood',
    'chernyj': 'black_wood',
    'derevo': 'derevo',
    'olivkovyy': 'olivkovyy',
    'vud': 'vud',
}

DEFAULT_COLOR_META = {
    'wenge': {'ru': 'Венге', 'en': 'Wenge', 'hex': '#3B2219'},
    'oak': {'ru': 'Дуб', 'en': 'Oak', 'hex': '#C4A77D'},
    'grey': {'ru': 'Серый', 'en': 'Grey', 'hex': '#808080'},
    'graphite': {'ru': 'Графит', 'en': 'Graphite', 'hex': '#4A5568'},
    'black_wood': {'ru': 'Черное дерево', 'en': 'Black Wood', 'hex': '#1A1A1A'},
    'brown': {'ru': 'Коричневый', 'en': 'Brown', 'hex': '#654321'},
    'dark_brown': {'ru': 'Темно-коричневый', 'en': 'Dark Brown', 'hex': '#3B2219'},
    'natural': {'ru': 'Натураль', 'en': 'Natural', 'hex': '#C4A77D'},
    'silver': {'ru': 'Серебристый', 'en': 'Silver', 'hex': '#C0C0C0'},
    'white': {'ru': 'Белый', 'en': 'White', 'hex': '#F0EBE0'},
    'chocolate': {'ru': 'Шоколад', 'en': 'Chocolate', 'hex': '#3B2219'},
    'sand': {'ru': 'Песочный', 'en': 'Sand', 'hex': '#A07855'},
    'bronze': {'ru': 'Бронза', 'en': 'Bronze', 'hex': '#8B5A2B'},
    'beige': {'ru': 'Бежевый', 'en': 'Beige', 'hex': '#C4A77D'},
    'anthracite': {'ru': 'Антрацит', 'en': 'Anthracite', 'hex': '#2D3748'},
    'terracotta': {'ru': 'Терракот', 'en': 'Terracotta', 'hex': '#8C3B2B'},
    'teak': {'ru': 'Тик', 'en': 'Teak', 'hex': '#B57C48'},
    'walnut': {'ru': 'Грецкий Орех (Walnut)', 'en': 'Walnut', 'hex': '#5A3D28'},
    'maple': {'ru': 'Клен (Maple)', 'en': 'Maple', 'hex': '#CDB286'},
    'basalt': {'ru': 'Базальт (Basalt)', 'en': 'Basalt', 'hex': '#3E3E3E'},
    'chestnut': {'ru': 'Каштан / Старый амбар', 'en': 'Chestnut', 'hex': '#8B4513'},
    'light_brown': {'ru': 'светло коричневый микс', 'en': 'Light Brown Mix', 'hex': '#8B5A2B'},
    'suar_mix': {'ru': 'suar mix', 'en': 'Suar Mix', 'hex': '#A07855'},
    'snow_mix': {'ru': 'snow mix', 'en': 'Snow Mix', 'hex': '#A07855'},
    'barnwood': {'ru': 'Дрифтвуд', 'en': 'Barnwood', 'hex': '#696969'},
}

DEFAULT_SETTINGS = {
    "channels": {
        "widget": {"is_public": True, "is_settings_public": True},
        "catalog": {"is_public": True, "is_settings_public": True}
    }
}


def load_json(path: str) -> Dict[str, Any]:
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(data: Dict[str, Any], path: str) -> None:
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def normalize_type_code(raw_code: str) -> str:
    cleaned = raw_code.replace('type_', '')
    if cleaned in ('fence_profile', 'fenceProfile'):
        return 'fenceProfile'
    if cleaned in ('pillar_accessories', 'accessories'):
        return 'accessories'
    return cleaned


def get_canonical_color_code(code_or_slug: str) -> str:
    cleaned = str(code_or_slug).lower().replace('opt_', '').replace('opt-', '')
    canon_slug = COLOR_SLUG_CANONICAL.get(cleaned, cleaned)
    return f"opt_{canon_slug}"


def deduce_color_from_variant(sku: str, name: str) -> str:
    text = f"{sku}_{name}".lower()
    for raw_key, canon_slug in COLOR_SLUG_CANONICAL.items():
        if f"_{raw_key}" in text or f"({raw_key}" in text or f" {raw_key}" in text or f"/{raw_key}" in text:
            return f"opt_{canon_slug}"
    return None


def main():
    parser = argparse.ArgumentParser(description="Слияние каталогов VMS-NC с гарантией связей fixing для всех лаг.")
    parser.add_argument("file1", help="Файл 1 (например, import_data2.json с OliverDeck)")
    parser.add_argument("file2", help="Файл 2 (например, import_data.json с Greendecks)")
    parser.add_argument("-o", "--output", default="import_data.json", help="Выходной JSON-файл")
    args = parser.parse_args()

    d1 = load_json(args.file1)
    d2 = load_json(args.file2)

    # 1. Валюты (RUB - базовая)
    currencies = [
        {
            "code": "RUB",
            "symbol": "₽",
            "symbol_native": {"ru": "руб.", "en": "rub."},
            "name": {"ru": "Российский рубль", "en": "Russian Ruble"},
            "rate": 1,
            "is_default": True,
            "is_active": True
        },
        {
            "code": "KZT",
            "symbol": "₸",
            "symbol_native": {"ru": "тенге", "en": "₸"},
            "name": {"ru": "Казахстанский тенге", "en": "Kazakhstani Tenge"},
            "rate": 0.18,
            "is_default": False,
            "is_active": True
        }
    ]

    price_types = [
        {
            "slug": "retail",
            "currency_code": "RUB",
            "is_default": True,
            "name": {"ru": "Цена продажи", "en": "Retail"},
            "description": {"ru": "Розничная цена продажи OliverDeck", "en": "Retail price OliverDeck"}
        }
    ]

    # 2. Семейства (строго 3 семейства)
    families = [
        {"external_code": "fam_decking_systems", "code": "decking_system", "name": {"ru": "Террасный настил", "en": "Terrace Decking Systems"}, "settings": DEFAULT_SETTINGS},
        {"external_code": "fam_fence_systems", "code": "fence_system", "name": {"ru": "Системы ограждений", "en": "Fence and Railing Systems"}, "settings": DEFAULT_SETTINGS},
        {"external_code": "fam_hardware_accessories", "code": "hardware_accessory", "name": {"ru": "Комплектующие и крепеж", "en": "Hardware & Accessories"}, "settings": DEFAULT_SETTINGS}
    ]

    # 3. Сборка и канонизация типов товаров
    merged_types = {}
    for t in d1.get('types', []) + d2.get('types', []):
        raw_code = t.get('code') or t.get('external_code', '')
        code = normalize_type_code(raw_code)

        if code not in CANONICAL_FAMILY_MAP:
            continue

        item = dict(t)
        item['code'] = code
        item['external_code'] = f"type_{code}"
        item['family_external_code'] = CANONICAL_FAMILY_MAP[code]
        if code in TYPE_NAME_TRANSLATIONS:
            item['name'] = TYPE_NAME_TRANSLATIONS[code]
        item['settings'] = DEFAULT_SETTINGS

        if code not in merged_types:
            merged_types[code] = item
        else:
            attrs = {a['code']: a for a in merged_types[code].get('attached_attributes', [])}
            for a in item.get('attached_attributes', []):
                attrs[a['code']] = a
            merged_types[code]['attached_attributes'] = list(attrs.values())

    # Гарантируем обязательные 18 типов
    for required_code, fam_ext in CANONICAL_FAMILY_MAP.items():
        if required_code not in merged_types:
            merged_types[required_code] = {
                "external_code": f"type_{required_code}",
                "family_external_code": fam_ext,
                "code": required_code,
                "name": TYPE_NAME_TRANSLATIONS.get(required_code, {"ru": required_code, "en": required_code}),
                "attached_attributes": [
                    {"code": "brand", "is_variant_only": False},
                    {"code": "source_url", "is_variant_only": False},
                    {"code": "color", "is_variant_only": True}
                ],
                "settings": DEFAULT_SETTINGS
            }

    # 4. Атрибуты и опции цветов
    merged_attrs = {a['code']: dict(a) for a in d1.get('attributes', [])}
    for a in d2.get('attributes', []):
        code = a['code']
        if code not in merged_attrs:
            merged_attrs[code] = dict(a)
        else:
            opts = {opt.get('slug'): opt for opt in merged_attrs[code].get('options', [])}
            for opt in a.get('options', []):
                slug = opt.get('slug')
                if slug not in opts:
                    opts[slug] = opt
            merged_attrs[code]['options'] = list(opts.values())

    if 'color' in merged_attrs:
        color_opts = {opt.get('slug'): opt for opt in merged_attrs['color'].get('options', [])}
        for slug, meta in DEFAULT_COLOR_META.items():
            if slug not in color_opts:
                color_opts[slug] = {
                    "external_code": f"opt_{slug}",
                    "slug": slug,
                    "value": {"ru": meta['ru'], "en": meta['en']},
                    "param": slug,
                    "meta": {"hex": meta['hex'], "icon": None, "image": None}
                }
            else:
                color_opts[slug]['external_code'] = f"opt_{slug}"
                if 'meta' not in color_opts[slug] or not color_opts[slug]['meta']:
                    color_opts[slug]['meta'] = {"hex": meta['hex']}
        merged_attrs['color']['options'] = list(color_opts.values())

    # 5. Умные справочники
    dicts_map = {}
    for d in d1.get('complex_dictionaries', []) + d2.get('complex_dictionaries', []):
        code = d['code']
        if code not in dicts_map:
            dicts_map[code] = {
                "external_code": d.get('external_code', f"dict_{code}"),
                "code": code,
                "name": d.get('name', {}),
                "meta_schema": d.get('meta_schema', []),
                "is_active": True,
                "records": {}
            }

        for r in d.get('records', []):
            r_key = r.get('slug') or r.get('key') or r.get('external_code')
            if r_key and r_key not in dicts_map[code]['records']:
                dicts_map[code]['records'][r_key] = r

    final_dictionaries = []
    for code, d_data in dicts_map.items():
        d_data['records'] = list(d_data['records'].values())
        final_dictionaries.append(d_data)

    # 6. Товары, пересчет валюты KZT -> RUB и выравнивание кодов типов
    products_map = {}
    kzt_converted_count = 0
    all_joist_variant_codes = set()

    for prod in d1.get('products', []) + d2.get('products', []):
        key = prod.get('external_code') or prod.get('code') or prod.get('slug')
        p = dict(prod)

        raw_pt = p.get('product_type_external_code', '')
        normalized_pt = normalize_type_code(raw_pt)
        p['product_type_external_code'] = f"type_{normalized_pt}"
        p['unit_code'] = 'pcs'
        p['is_active'] = True
        p['settings'] = DEFAULT_SETTINGS

        if not isinstance(p.get('eav'), dict):
            p['eav'] = {}

        if p.get('source_url') == 'https:':
            p['source_url'] = ''
        if p['eav'].get('source_url') == 'https:':
            p['eav']['source_url'] = ''

        fixed_variants = []
        for var in p.get('variants', []):
            v = dict(var)
            v['settings'] = DEFAULT_SETTINGS
            v['is_active'] = True

            # Конвертация KZT в рубли
            if v.get('currency') == 'KZT':
                price_kzt = float(v.get('price', 0) or 0)
                cost_kzt = float(v.get('cost_price', 0) or 0)
                v['price'] = round(price_kzt * 0.18)
                v['cost_price'] = round(cost_kzt * 0.18) if cost_kzt > 0 else round(v['price'] * 0.7)
                v['currency'] = 'RUB'
                kzt_converted_count += 1

            if not isinstance(v.get('eav'), dict):
                v['eav'] = {}

            var_color = v['eav'].get('color')
            sku_name = f"{v.get('sku', '')} {v.get('name', {}).get('ru', '')}"
            deduced = deduce_color_from_variant(v.get('sku', ''), sku_name)

            if deduced:
                v['eav']['color'] = deduced
            elif var_color:
                v['eav']['color'] = get_canonical_color_code(var_color)
            elif p['eav'].get('color'):
                v['eav']['color'] = get_canonical_color_code(p['eav']['color'])
            else:
                v['eav']['color'] = 'opt_natural'

            fixed_variants.append(v)

            # Сохраняем все модификации лаг для автоматического создания связей fixing
            if normalized_pt == 'joist':
                v_code = v.get('external_code') or v.get('sku')
                if v_code:
                    all_joist_variant_codes.add(v_code)

        p['variants'] = fixed_variants
        products_map[key] = p

    # Гарантируем наличие самореза prod_00124 с кодом варианта "00124"
    if 'prod_00124' not in products_map:
        products_map['prod_00124'] = {
            "external_code": "prod_00124",
            "product_type_external_code": "type_fasteners",
            "category_external_code": None,
            "catalog_type": "product",
            "unit_code": "pcs",
            "slug": "samorez-5-120",
            "name": {"ru": "Саморез 5*120 (крепление лаг)", "en": "Screw 5*120"},
            "code": "00124",
            "is_active": True,
            "settings": DEFAULT_SETTINGS,
            "eav": {"brand": "opt_brand_oliverdeck", "material": "Металл"},
            "variants": [{
                "external_code": "00124",
                "sku": "00124",
                "name": {"ru": "Саморез 5*120 (крепление лаг)", "en": "Screw 5*120"},
                "price_group_external_code": None,
                "stock": 1000,
                "is_default": True,
                "is_manual_pricing": True,
                "cost_price": 35,
                "currency": "RUB",
                "price": 60,
                "eav": {},
                "is_active": True,
                "settings": DEFAULT_SETTINGS
            }],
            "preview_picture": None,
            "source_url": ""
        }
    else:
        # Убедимся, что у prod_00124 есть вариант "00124"
        v_codes = [v.get('external_code') for v in products_map['prod_00124']['variants']]
        if '00124' not in v_codes:
            products_map['prod_00124']['variants'].append({
                "external_code": "00124",
                "sku": "00124",
                "name": {"ru": "Саморез 5*120 (крепление лаг)", "en": "Screw 5*120"},
                "price_group_external_code": None,
                "stock": 1000,
                "is_default": True,
                "is_manual_pricing": True,
                "cost_price": 35,
                "currency": "RUB",
                "price": 60,
                "eav": {},
                "is_active": True,
                "settings": DEFAULT_SETTINGS
            })

    # 7. Пайплайны
    pipelines_map = {p['code']: dict(p) for p in d1.get('pipelines', [])}
    for p in d2.get('pipelines', []):
        code = p['code']
        if code not in pipelines_map:
            pipelines_map[code] = dict(p)
        else:
            s1 = pipelines_map[code].get('schema', {})
            s2 = p.get('schema', {})
            for parent_type, slots in s2.items():
                if parent_type not in s1:
                    s1[parent_type] = slots
                else:
                    s1[parent_type].update(slots)
            pipelines_map[code]['schema'] = s1

    # Синхронизация target_code слотов pl_fence
    if 'pl_fence' in pipelines_map:
        f_schema = pipelines_map['pl_fence'].get('schema', {})
        if 'pillar' in f_schema:
            p_slots = f_schema['pillar']
            if 'fenceProfile' in p_slots:
                p_slots['fenceProfile']['target_code'] = 'fenceProfile'
            if 'accessories' in p_slots:
                p_slots['accessories']['target_code'] = 'accessories'

    # 8. Правила комплектации (binding_rules)
    binding_rules_map = {}
    for r in d1.get('binding_rules', []) + d2.get('binding_rules', []):
        ext = r.get('external_code')
        if not ext:
            continue
        rule = dict(r)
        # Нормализуем устаревший артикул самореза "124" на "00124"
        if rule.get('child_external_code') in ('124', 'sku_00124'):
            rule['child_external_code'] = '00124'
        binding_rules_map[ext] = rule

    # 9. КРИТИЧЕСКИ ВАЖНО: Гарантируем наличие правила pl_joist -> fixing для КАЖДОЙ лаги
    joists_linked_count = 0
    for joist_code in all_joist_variant_codes:
        clean_name = joist_code.replace('-', '_').replace('.', '_')
        rule_key = f"rule_fixing_{clean_name}_00124"

        # Проверяем, есть ли уже связь fixing для этой лаги
        has_existing_fixing = any(
            r.get('pipeline_external_code') == 'pl_joist' and
            r.get('role') == 'fixing' and
            r.get('parent_external_code') == joist_code
            for r in binding_rules_map.values()
        )

        if not has_existing_fixing:
            binding_rules_map[rule_key] = {
                "pipeline_external_code": "pl_joist",
                "external_code": rule_key,
                "name": f"Крепление лаги (саморез): {joist_code}",
                "role": "fixing",
                "parent_type_key": "product_variant",
                "parent_external_code": joist_code,
                "child_type_key": "product_variant",
                "child_external_code": "00124",
                "conditions": None,
                "static_meta": None,
                "quantity_formula": "1",
                "is_required": True,
                "sort_order": 10
            }
            joists_linked_count += 1

    result = {
        "languages": list(dict.fromkeys(d1.get('languages', []) + d2.get('languages', []))),
        "currencies": currencies,
        "price_types": price_types,
        "families": families,
        "types": list(merged_types.values()),
        "attributes": list(merged_attrs.values()),
        "complex_dictionaries": final_dictionaries,
        "products": list(products_map.values()),
        "pipelines": list(pipelines_map.values()),
        "binding_rules": list(binding_rules_map.values())
    }

    save_json(result, args.output)

    fam_summary = {}
    for t in result['types']:
        fam_code = next((f['code'] for f in families if f['external_code'] == t['family_external_code']), t['family_external_code'])
        fam_summary.setdefault(fam_code, []).append(t['code'])

    print("\n" + "=" * 65)
    print("      ИТОГИ СЛИЯНИЯ С АВТО-ПРИВЯЗКОЙ КРЕПЕЖА ЛАГ (pl_joist)")
    print("=" * 65)
    for f_code, t_list in fam_summary.items():
        print(f"• {f_code} ({len(t_list)} типов):")
        print(f"  -> {', '.join(t_list)}")
    print("-" * 65)
    print(f"• Всего товаров в базе:         {len(result['products'])}")
    print(f"• Всего модификаций лаг:        {len(all_joist_variant_codes)} шт.")
    print(f"• Добавлено недостающих fixing: {joists_linked_count} связей")
    print(f"• Итого правил связей (BOM):    {len(result['binding_rules'])}")
    print(f"[✓] Итоговый файл сохранен в:     {args.output}\n")


if __name__ == "__main__":
    main()