#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys

# ==============================================================================
# НАСТРОЙКИ И ИНФРАСТРУКТУРНЫЕ КОНСТАНТЫ
# ==============================================================================
INPUT_RAW_DATA_PATH = "./import/import_data_raw.json"
INPUT_PIPELINES_PATH = "./import/import_pipelines.json"

OUTPUT_DATA_PATH = "./import/import_data.json"
OUTPUT_PIPELINES_PATH = "./import/import_pipelines.json"

# Базовые валюты платформы (основная валюта — RUB)
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
            "ru": "Розничная цена",
            "en": "Retail Price"
        },
        "description": {
            "ru": "Базовая розничная цена в системе",
            "en": "Base retail price in the system"
        }
    }
]

# Набор характеристик, которые должны быть сохранены как числовые (float)
NUMERIC_EAV_ATTRIBUTES = {
    "length_mm", "width_mm", "height_mm", "thickness_mm", "wall_thickness_mm"
}


def cast_numeric_eav(eav_dict):
    """
    Принудительно приводит значения из NUMERIC_EAV_ATTRIBUTES к типу float.
    """
    if not isinstance(eav_dict, dict):
        return eav_dict

    cleaned_eav = {}
    for key, value in eav_dict.items():
        if key in NUMERIC_EAV_ATTRIBUTES:
            try:
                cleaned_eav[key] = float(value)
            except (ValueError, TypeError):
                cleaned_eav[key] = value  # если не удалось привести, оставляем как есть
        else:
            cleaned_eav[key] = value
    return cleaned_eav


def validate_and_prepare():
    # 1. Проверяем наличие входных файлов
    if not os.path.exists(INPUT_RAW_DATA_PATH):
        print(f"[-] Ошибка: Файл каталога '{INPUT_RAW_DATA_PATH}' не найден.")
        sys.exit(1)

    if not os.path.exists(INPUT_PIPELINES_PATH):
        print(f"[-] Ошибка: Файл привязок '{INPUT_PIPELINES_PATH}' не найден.")
        sys.exit(1)

    print("[+] Загрузка исходных файлов данных...")
    with open(INPUT_RAW_DATA_PATH, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)

    with open(INPUT_PIPELINES_PATH, 'r', encoding='utf-8') as f:
        raw_pipelines = json.load(f)

    # 2. Индексируем все существующие модификации (SKU) для валидации связей
    valid_variant_codes = set()
    total_products = 0
    total_variants = 0

    print("[+] Индексация модификаций каталога ДПК...")
    for product in raw_data.get("products", []):
        total_products += 1

        # Принудительно очищаем EAV-характеристики на уровне базового товара
        if "eav" in product:
            product["eav"] = cast_numeric_eav(product["eav"])

        for variant in product.get("variants", []):
            total_variants += 1
            variant_code = variant.get("external_code")
            if variant_code:
                valid_variant_codes.add(variant_code)

            # Принудительно очищаем EAV-характеристики на уровне модификации (SKU)
            if "eav" in variant:
                variant["eav"] = cast_numeric_eav(variant["eav"])

    print(f"    - Всего товаров проиндексировано: {total_products}")
    print(f"    - Всего модификаций (SKU) найдено: {total_variants}")

    # 3. Валидируем связи в файле привязок ДПК
    cleaned_pipelines = []
    skipped_pipelines_count = 0

    print("[+] Верификация реляционной целостности таблицы привязок...")
    for rule in raw_pipelines:
        parent = rule.get("parent_external_code")
        child = rule.get("child_external_code")

        if parent in valid_variant_codes and child in valid_variant_codes:
            cleaned_pipelines.append(rule)
        else:
            skipped_pipelines_count += 1
            # Логируем битые ссылки для ручной отладки контент-менеджерами
            if parent not in valid_variant_codes:
                print(f"    [!] Пропущено правило {rule.get('role')} (сорт. {rule.get('sort_order')}): "
                      f"Родительский SKU '{parent}' отсутствует в каталоге товаров.")
            if child not in valid_variant_codes:
                print(f"    [!] Пропущено правило {rule.get('role')} (сорт. {rule.get('sort_order')}): "
                      f"Дочерний SKU '{child}' отсутствует в каталоге товаров.")

    print(f"    - Успешно верифицировано связей: {len(cleaned_pipelines)}")
    print(f"    - Отсечено некорректных связей: {skipped_pipelines_count}")

    # 4. Собираем итоговую структуру import_data.json
    final_import_data = {
        "currencies": STATIC_CURRENCIES,
        "price_types": STATIC_PRICE_TYPES,
        "languages": ["ru", "en"],
        "families": raw_data.get("families", []),
        "types": raw_data.get("types", []),
        "categories": raw_data.get("categories", []),
        "complex_dictionaries": raw_data.get("complex_dictionaries", []),
        "attributes": raw_data.get("attributes", []),
        "price_groups": [], # Заполняется при необходимости
        "products": raw_data.get("products", [])
    }

    # 5. Сохраняем результаты на диск
    print("[+] Сохранение подготовленных файлов...")

    with open(OUTPUT_DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(final_import_data, f, indent=2, ensure_ascii=False)
    print(f"    -> Данные каталога успешно записаны в: {OUTPUT_DATA_PATH}")

    with open(OUTPUT_PIPELINES_PATH, 'w', encoding='utf-8') as f:
        json.dump(cleaned_pipelines, f, indent=2, ensure_ascii=False)
    print(f"    -> Очищенные привязки ДПК успешно записаны в: {OUTPUT_PIPELINES_PATH}")

    print("\n[+] Подготовка данных успешно завершена. Файлы готовы к загрузке через 'php artisan vms:import'.")


if __name__ == '__main__':
    validate_and_prepare()
