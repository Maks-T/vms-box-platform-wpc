#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys
from collections import deque
from typing import Any, Dict, List, Set, Tuple

# Системный external_code категории "СКРЫТЫЕ ТОВАРЫ" из import_data.json
HIDDEN_CATEGORY_EXT_CODE = "BQxklt1ugaMstMFUmeaKL1"


def load_json(filepath: str) -> Dict[str, Any]:
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(filepath: str, data: Dict[str, Any]) -> None:
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def filter_catalog(
    input_file: str,
    output_file: str,
    keep_joists: bool = True,
    deactivate_non_polivan_boards: bool = True,
) -> None:
    print(f"Загрузка файла: {input_file}...")
    data = load_json(input_file)

    products: List[Dict[str, Any]] = data.get("products", [])
    binding_rules: List[Dict[str, Any]] = data.get("binding_rules", [])
    attributes: List[Dict[str, Any]] = data.get("attributes", [])

    # 1. Поиск external_code бренда POLIVAN
    polivan_brand_codes: Set[str] = set()
    for attr in attributes:
        if attr.get("code") == "brand":
            for opt in attr.get("options", []):
                slug = (opt.get("slug") or "").lower()
                val_ru = ((opt.get("value") or {}).get("ru") or "").lower()
                val_en = ((opt.get("value") or {}).get("en") or "").lower()
                if any(x in s for s in (slug, val_ru, val_en) for x in ("polivan", "поливан")):
                    polivan_brand_codes.add(opt.get("external_code"))

    print(f"Код бренда Polivan: {polivan_brand_codes}")

    # 2. Индексация каталога товаров
    product_by_ext: Dict[str, Dict[str, Any]] = {}
    variant_by_ext: Dict[str, Dict[str, Any]] = {}
    variant_to_product_ext: Dict[str, str] = {}
    product_to_variants_ext: Dict[str, Set[str]] = {}

    for prod in products:
        p_ext = prod.get("external_code")
        if not p_ext:
            continue
        product_by_ext[p_ext] = prod
        product_to_variants_ext[p_ext] = set()

        for var in prod.get("variants", []):
            v_ext = var.get("external_code")
            if v_ext:
                variant_by_ext[v_ext] = var
                variant_to_product_ext[v_ext] = p_ext
                product_to_variants_ext[p_ext].add(v_ext)

    # 3. Разделение товаров Polivan (все 7 корней, включая фасадную панель)
    polivan_all_products_ext: Set[str] = set()
    polivan_pipeline_roots_ext: Set[str] = set()

    for p_ext, prod in product_by_ext.items():
        brand_val = prod.get("eav", {}).get("brand")
        name_ru = (prod.get("name", {}).get("ru") or "").lower()
        slug = (prod.get("slug") or "").lower()

        is_polivan = (
            brand_val in polivan_brand_codes
            or "polivan" in name_ru
            or "поливан" in name_ru
            or "polivan" in slug
        )

        if is_polivan:
            polivan_all_products_ext.add(p_ext)
            p_type = prod.get("product_type_external_code")
            # Все террасные доски (включая фасадную панель) и столбы Polivan
            if p_type in ("type_terraceBoard", "type_pillar"):
                polivan_pipeline_roots_ext.add(p_ext)

    print(f"Всего товаров Polivan: {len(polivan_all_products_ext)}")
    print(f"Корневых досок (в т.ч. фасадная панель) и столбов Polivan: {len(polivan_pipeline_roots_ext)}")

    # 4. Построение дерева связей из binding_rules
    rules_by_parent: Dict[str, List[Dict[str, Any]]] = {}
    for rule in binding_rules:
        parent_code = rule.get("parent_external_code")
        if parent_code:
            rules_by_parent.setdefault(parent_code, []).append(rule)

    # 5. BFS-обход от корней Polivan (+ лаги)
    active_rules: List[Dict[str, Any]] = []
    active_rules_ext: Set[str] = set()
    keep_entities_ext: Set[str] = set()
    queue = deque()

    # Точки входа: корни Polivan
    for p_ext in polivan_pipeline_roots_ext:
        keep_entities_ext.add(p_ext)
        for v_ext in product_to_variants_ext.get(p_ext, []):
            keep_entities_ext.add(v_ext)
            queue.append(v_ext)

    # Точки входа: подсистема (лаги)
    if keep_joists:
        for p_ext, prod in product_by_ext.items():
            if prod.get("product_type_external_code") == "type_joist":
                keep_entities_ext.add(p_ext)
                for v_ext in product_to_variants_ext.get(p_ext, []):
                    keep_entities_ext.add(v_ext)
                    queue.append(v_ext)

    while queue:
        curr_ext = queue.popleft()

        for rule in rules_by_parent.get(curr_ext, []):
            r_ext = rule.get("external_code")
            ch_ext = rule.get("child_external_code")

            # Проверяем, нужно ли отсекать чужие доски/ступени
            if ch_ext and deactivate_non_polivan_boards:
                ch_prod_ext = variant_to_product_ext.get(ch_ext, ch_ext)
                ch_prod = product_by_ext.get(ch_prod_ext)
                if ch_prod and ch_prod_ext not in polivan_all_products_ext:
                    p_type = ch_prod.get("product_type_external_code")
                    # Если потомок - чужая доска или ступень (не крепеж и не лага)
                    if p_type in ("type_board", "type_stepBoard", "type_terraceBoard"):
                        continue

            if r_ext and r_ext not in active_rules_ext:
                active_rules_ext.add(r_ext)
                active_rules.append(rule)

            if ch_ext and ch_ext not in keep_entities_ext:
                keep_entities_ext.add(ch_ext)
                queue.append(ch_ext)

                if ch_ext in variant_to_product_ext:
                    parent_prod_ext = variant_to_product_ext[ch_ext]
                    if parent_prod_ext not in keep_entities_ext:
                        keep_entities_ext.add(parent_prod_ext)

                if ch_ext in product_to_variants_ext:
                    for v_ext in product_to_variants_ext[ch_ext]:
                        if v_ext not in keep_entities_ext:
                            keep_entities_ext.add(v_ext)
                            queue.append(v_ext)

    # 6. Добавляем в keep все остальные штучные товары Polivan (уголки, крышки, планки)
    for p_ext in polivan_all_products_ext:
        keep_entities_ext.add(p_ext)
        for v_ext in product_to_variants_ext.get(p_ext, []):
            keep_entities_ext.add(v_ext)

    # 7. Обновление активности и скрытие не-Polivan комплектующих
    active_count = 0
    deactivated_count = 0
    hidden_count = 0
    saved_components = []

    for prod in products:
        p_ext = prod.get("external_code")
        prod_name = prod.get("name", {}).get("ru", prod.get("slug", p_ext))
        code = prod.get("code", "—")

        is_keep = (p_ext in keep_entities_ext) or any(
            v_ext in keep_entities_ext for v_ext in product_to_variants_ext.get(p_ext, [])
        )

        if is_keep:
            prod["is_active"] = True
            active_count += 1

            # Если это не Polivan, скрываем товар из публичной витрины каталога
            if p_ext not in polivan_all_products_ext:
                prod["category_external_code"] = HIDDEN_CATEGORY_EXT_CODE
                prod.setdefault("settings", {}).setdefault("channels", {}).setdefault("widget", {})["is_public"] = False
                hidden_count += 1
                saved_components.append(f"  [+] {code}: {prod_name} (переведен в скрытые)")

            for var in prod.get("variants", []):
                v_ext = var.get("external_code")
                var["is_active"] = (p_ext in polivan_all_products_ext) or (v_ext in keep_entities_ext)
        else:
            prod["is_active"] = False
            deactivated_count += 1
            for var in prod.get("variants", []):
                var["is_active"] = False

    # 8. Очистка binding_rules
    initial_rules_count = len(binding_rules)
    data["binding_rules"] = active_rules
    deactivated_rules_count = initial_rules_count - len(active_rules)

    # 9. Итоговый отчет
    print("\n" + "=" * 70)
    print("ИТОГИ ОБРАБОТКИ ФАЙЛА ДЛЯ POLIVAN:")
    print("=" * 70)
    print(f"Всего товаров в каталоге:              {len(products)}")
    print(f"Товаров Polivan:                       {len(polivan_all_products_ext)}")
    print(f"  - из них корни (доски/столбы/фасад): {len(polivan_pipeline_roots_ext)}")
    print(f"Оставлено активных товаров:            {active_count}")
    print(f"  - из них Polivan на витрине:         {len(polivan_all_products_ext)}")
    print(f"  - из них скрытых под капот (BOM):    {hidden_count}")
    print(f"Деактивировано сторонних товаров:      {deactivated_count}")
    print("-" * 70)
    print(f"Всего связей BOM в файле:              {initial_rules_count}")
    print(f"Оставлено связей для веток Polivan:    {len(active_rules)}")
    print(f"Удалено неактивных чужих связей:       {deactivated_rules_count}")
    print("-" * 70)
    print("Сторонние комплектующие, скрытые из каталога (доступны только сметчикам):")
    for comp in sorted(saved_components):
        print(comp)
    print("=" * 70)

    save_json(output_file, data)
    print(f"\nФайл успешно сохранен: {output_file}")


if __name__ == "__main__":
    src_file = "import_data.json"
    dst_file = "import_data.json"

    if len(sys.argv) > 1:
        src_file = sys.argv[1]
    if len(sys.argv) > 2:
        dst_file = sys.argv[2]

    if not os.path.exists(src_file):
        print(f"Ошибка: Файл '{src_file}' не найден!")
        sys.exit(1)

    # keep_joists=True: лаги сохраняются
    # deactivate_non_polivan_boards=True: чужие доски и ступени деактивируются
    filter_catalog(
        input_file=src_file,
        output_file=dst_file,
        keep_joists=True,
        deactivate_non_polivan_boards=True,
    )
