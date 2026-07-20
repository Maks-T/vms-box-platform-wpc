#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys

# ==============================================================================
# НАСТРОЙКИ КОНВЕРТАЦИИ И ИМПОРТА
# ==============================================================================
INPUT_RAW_DATA_PATH = "./import/import_data_raw.json"
INPUT_RAW_PIPELINES_PATH = "./import/import_pipelines.json"

OUTPUT_DATA_PATH = "./import/import_data.json"

# Базовые валюты платформы (RUB — по умолчанию)
STATIC_CURRENCIES = [
    {
      "code": "RUB",
      "symbol": "₽",
      "symbol_native": {
        "ru": "руб.",
        "en": "rub."
      },
      "name": {
        "ru": "Российский рубль",
        "en": "Russian Ruble"
      },
      "rate": 1.0,
      "is_default": True,
      "is_active": True
    },
    {
      "code": "USD",
      "symbol": "$",
      "symbol_native": {
        "ru": "долл.",
        "en": "$"
      },
      "name": {
        "ru": "Доллар США",
        "en": "US Dollar"
      },
      "rate": 90.0,
      "is_default": False,
      "is_active": True
    }
]

# Настройка типов цен (розничная по умолчанию)
STATIC_PRICE_TYPES = [
    {
      "slug": "retail",
      "currency_code": "RUB",
      "is_default": True,
      "name": {
        "ru": "Цена продажи",
        "en": "Retail"
      },
      "description": {
        "ru": "Базовая розничная цена в системе",
        "en": "Base retail price in the system"
      }
    }
]

# Две системные цепочки (pipelines) ДПК для ядра
STATIC_PIPELINES = [
    {
        "external_code": "pl_terrace",
        "name": {
            "ru": "Террасный настил",
            "en": "Terrace Decking"
        },
        "industry": "wpc",
        "description": {
            "ru": "Универсальный пайплайн подбора комплектующих для террасных систем",
            "en": "Universal terrace decking BOM builder pipeline"
        },
        "is_active": True,
        "sort_order": 10
    },
    {
        "external_code": "pl_fence",
        "name": {
            "ru": "Системы ограждений",
            "en": "Fence and Railing Systems"
        },
        "industry": "wpc",
        "description": {
            "ru": "Универсальный пайплайн подбора комплектующих для ограждений и балюстрад",
            "en": "Universal fence and railing BOM builder pipeline"
        },
        "is_active": True,
        "sort_order": 20
    }
]

NUMERIC_EAV_ATTRIBUTES = {
    "length_mm", "width_mm", "height_mm", "thickness_mm", "wall_thickness_mm"
}


def cast_numeric_eav(eav_dict):
    if not isinstance(eav_dict, dict):
        return eav_dict

    cleaned_eav = {}
    for key, value in eav_dict.items():
        if key in NUMERIC_EAV_ATTRIBUTES:
            try:
                cleaned_eav[key] = float(value)
            except (ValueError, TypeError):
                cleaned_eav[key] = value
        else:
            cleaned_eav[key] = value
    return cleaned_eav


def main():
    if not os.path.exists(INPUT_RAW_DATA_PATH):
        print(f"[-] Ошибка: Файл '{INPUT_RAW_DATA_PATH}' не найден.")
        sys.exit(1)

    if not os.path.exists(INPUT_RAW_PIPELINES_PATH):
        print(f"[-] Ошибка: Файл привязок '{INPUT_RAW_PIPELINES_PATH}' не найден.")
        sys.exit(1)

    print("[+] Шаг 1: Загрузка исходных JSON файлов ДПК...")
    with open(INPUT_RAW_DATA_PATH, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    with open(INPUT_RAW_PIPELINES_PATH, "r", encoding="utf-8") as f:
        raw_pipelines = json.load(f)

    # Индексируем варианты для строгой валидации внешних связей
    print("[+] Шаг 2: Индексация модификаций каталога...")
    valid_variant_codes = set()
    variant_names = {}

    for product in raw_data.get("products", []):
        if "eav" in product:
            product["eav"] = cast_numeric_eav(product["eav"])

        for variant in product.get("variants", []):
            code = variant.get("external_code")
            if code:
                valid_variant_codes.add(code)
                # Сохраняем имя для генерации читаемых названий связей в админке
                variant_names[code] = variant.get("name") or product.get("name", {}).get("ru", "SKU")

            if "eav" in variant:
                variant["eav"] = cast_numeric_eav(variant["eav"])

    print(f"    - Проиндексировано {len(valid_variant_codes)} модификаций (SKU).")

    # Преобразуем плоские правила во внутреннюю структуру связей (binding_rules) ядра
    print("[+] Шаг 3: Конвертация и валидация правил подбора ДПК...")
    binding_rules = []
    skipped_count = 0

    for rule in raw_pipelines:
        parent_code = rule.get("parent_external_code")
        child_code = rule.get("child_external_code")
        role = rule.get("role")
        is_required = rule.get("is_required", True)
        sort_order = rule.get("sort_order", 0)
        pipeline_code = rule.get("pipeline_code", "terrace")

        # Проверка целостности связей перед записью
        if parent_code not in valid_variant_codes or child_code not in valid_variant_codes:
            skipped_count += 1
            continue

        # Формируем уникальный внешний код для правила
        rule_ext_code = f"rule_{parent_code}_{child_code}_{role}"

        # Определяем привязку к контейнеру-пайплайну ядра
        pipeline_ext_code = "pl_terrace" if pipeline_code == "terrace" else "pl_fence"

        # Понятное название для админки Filament
        parent_name = variant_names.get(parent_code, parent_code)
        child_name = variant_names.get(child_code, child_code)
        rule_name = f"{role}: {parent_name} -> {child_name}"

        binding_rules.append({
            "external_code": rule_ext_code,
            "pipeline_external_code": pipeline_ext_code,
            "name": rule_name,
            # Отношения строятся строго между модификациями (SKU)
            "parent_type_key": "variant",
            "parent_external_code": parent_code,
            "child_type_key": "variant",
            "child_external_code": child_code,
            # Роль комплектующего записываем в условия связей
            "conditions": {
                "role": role
            },
            "quantity_formula": "1",
            "is_required": is_required,
            "sort_order": sort_order
        })

    print(f"    - Сгенерировано правил связей: {len(binding_rules)}")
    print(f"    - Отсечено некорректных записей: {skipped_count}")

    # Сборка финального файла импорта для ядра Nicole Core
    print("[+] Шаг 4: Сборка и валидация финального import_data.json...")
    import_data = {
        "currencies": STATIC_CURRENCIES,
        "price_types": STATIC_PRICE_TYPES,
        "languages": ["ru", "en"],
        "families": raw_data.get("families", []),
        "types": raw_data.get("types", []),
        "categories": raw_data.get("categories", []),
        "complex_dictionaries": raw_data.get("complex_dictionaries", []),
        "attributes": raw_data.get("attributes", []),
        "price_groups": [],
        "products": raw_data.get("products", []),
        "pipelines": STATIC_PIPELINES,
        "binding_rules": binding_rules
    }

    with open(OUTPUT_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(import_data, f, indent=2, ensure_ascii=False)

    print(f"[+] Успех: Готовый файл импорта со всеми связями записан в '{OUTPUT_DATA_PATH}'.")


if __name__ == "__main__":
    main()
