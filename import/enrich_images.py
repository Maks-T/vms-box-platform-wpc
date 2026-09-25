#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import re
import sys
import shutil
import argparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Полная эталонная палитра HEX-кодов ДПК (по слагам и русским названиям)
COLOR_PALETTE = {
    # Древесные и натуральные
    "венге": "#2F1E0E", "venge": "#2F1E0E",
    "шоколад": "#3D1F10", "sokolad": "#3D1F10",
    "тик": "#B76E2E", "tik": "#B76E2E",
    "натуральный тик": "#C48A4E", "natural-tik": "#C48A4E",
    "светлый тик": "#D1A377", "svetlyi-tik": "#D1A377",
    "орех": "#5D4037", "orex": "#5D4037",
    "лесной орех": "#704214", "lesnoi-orex": "#704214",
    "орех бразильский": "#664228", "orex-brazilskii": "#664228",
    "дуб": "#B5905C", "dub": "#B5905C",
    "светлый дуб": "#D9C5B2", "svetlyi-dub": "#D9C5B2",
    "беленый дуб": "#E3DAC9", "belenyi-dub": "#E3DAC9",
    "сосна": "#C19A6B", "sosna": "#C19A6B",
    "сонома": "#C9B198", "sonoma": "#C9B198",
    "ясень": "#E4D2B8", "iasen": "#E4D2B8",
    "мербау": "#73343A", "merbau": "#73343A",
    "палисандр": "#542D24", "palisandr": "#542D24",
    "эбен": "#212121", "eben": "#212121",
    "эбонит": "#080808", "ebonit": "#080808",
    "суар": "#4E342E", "suar": "#4E342E",
    "миндаль": "#EED9C4", "mindal": "#EED9C4",
    "чайное дерево": "#A0522D", "cainoe-derevo": "#A0522D",
    "черное дерево": "#1A1A1A", "cernoe-derevo": "#1A1A1A",
    "белое дерево": "#F2F2F2", "beloe-derevo": "#F2F2F2",
    "натур": "#D2B48C", "natur": "#D2B48C",
    "кедр": "#704214", "kedr": "#704214",
    "эвкалипт пятнистый": "#8B5A2B", "evkalipt-piatnistyi": "#8B5A2B",

    # Серые, антрацит, ахроматика
    "антрацит": "#293133", "antracit": "#293133",
    "графит": "#383E42", "grafit": "#383E42",
    "черный графит": "#252525", "cernyi-grafit": "#252525",
    "серый": "#808080", "seryi": "#808080",
    "светло-серый": "#D3D3D3", "svetlo-seryi": "#D3D3D3",
    "темно-серый": "#4F4F4F", "temno-seryi": "#4F4F4F",
    "серый дым": "#93917F", "seryi-dym": "#93917F",
    "серый ледник": "#C1C1C1", "seryi-lednik": "#C1C1C1",
    "белый": "#FFFFFF", "belyi": "#FFFFFF",
    "черный": "#000000", "cernyi": "#000000",
    "слоновая кость": "#FFFFF0", "slonovaia-kost": "#FFFFF0",
    "бежевый": "#F5F5DC", "bezevyi": "#F5F5DC",
    "песочный": "#C2B280", "pesocnyi": "#C2B280",
    "белый песок": "#F5F5F5", "belyi-pesok": "#F5F5F5",
    "капучино": "#A18E82", "kapucino": "#A18E82",
    "мокко": "#967969", "mokko": "#967969",
    "сноу": "#F9FDFF", "snou": "#F9FDFF",
    "латте": "#C5A582", "лате": "#C5A582", "latte": "#C5A582",

    # Цветные и металлы
    "красный": "#A52A2A", "krasnyi": "#A52A2A",
    "коричневый": "#5D4037", "koricnevyi": "#5D4037",
    "светло-коричневый": "#A52A2A", "svetlo-koricnevyi": "#A52A2A",
    "темно-коричневый": "#3E2723", "temno-koricnevyi": "#3E2723",
    "корица": "#7B3F00", "korica": "#7B3F00",
    "терракот": "#C45A38", "terrakot": "#C45A38",
    "бронза": "#CD7F32", "bronza": "#CD7F32",
    "серебро": "#C0C0C0", "serebro": "#C0C0C0",
    "патина браун": "#704214", "patina-braun": "#704214",
    "патина грей": "#708090", "patina-grei": "#708090",
    "патина тик": "#8B4513", "patina-tik": "#8B4513",

    # --- Greendecks: добавлено, отсутствовало в исходной палитре ---
    "натураль": "#C4A77D", "natural": "#C4A77D",
    "натуральный": "#C4A77D", "naturalnyy": "#C4A77D",
    "серебристый": "#C0C0C0", "serebristyy": "#C0C0C0",
    "двухцветная": "#654321", "dvukhtsvetnaya": "#654321",
    "коричневый/темно-коричневый (двухсторонняя)": "#654321",
    "korichnevyy_temno": "#654321",
}


def load_json(path):
    if not os.path.exists(path):
        print(f"[ERROR] Файл не найден: {path}")
        sys.exit(1)
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def normalize_str(s):
    if not s:
        return ""
    s = str(s).strip().lower().replace('ё', 'е')
    s = re.sub(r'\s+', ' ', s)  # схлопнуть любое количество пробелов, а не только двойные
    return s


def main():
    parser = argparse.ArgumentParser(
        description="Склейка картинок из сырой выгрузки и генерация HEX-палитры цветов в import_data.json"
    )
    parser.add_argument('--target', default=os.path.join(BASE_DIR, 'import_data.json'),
                         help="Файл, который обогащаем (по умолчанию: import_data.json рядом со скриптом)")
    parser.add_argument('--source', default=os.path.join(BASE_DIR, 'import_data_raw.json'),
                         help="Сырой файл-источник с картинками (по умолчанию: import_data_raw.json)")
    parser.add_argument('--apply', action='store_true',
                         help="Записать изменения в целевой файл (без флага — тестовый прогон без записи)")
    parser.add_argument('--force-hex', action='store_true',
                         help="Перезаписывать HEX даже у опций, где он уже задан вручную "
                              "(по умолчанию уже заданный HEX не трогается)")
    parser.add_argument('--report-limit', type=int, default=20,
                         help="Сколько несовпавших товаров/вариантов показывать в отчёте (по умолчанию 20)")
    args = parser.parse_args()

    dry_run = not args.apply

    print("=" * 60)
    print(" VMS-NC: Склейка картинок и генератор палитры HEX")
    print(f" Целевой файл:  {args.target}")
    print(f" Файл-источник: {args.source}")
    print(f" Режим: {'[ТЕСТОВЫЙ / DRY-RUN]' if dry_run else '[БОЕВОЙ / APPLY]'}")
    print("=" * 60)

    target_data = load_json(args.target)
    source_data = load_json(args.source)

    # 1. Построение словарей поиска картинок из источника
    prod_by_ext = {}
    prod_by_code = {}
    prod_by_slug = {}

    var_by_ext = {}
    var_by_sku = {}

    for p in source_data.get('products', []):
        p_prev = p.get('preview_picture')
        p_det = p.get('detail_picture')

        if p.get('external_code'):
            prod_by_ext[p['external_code']] = (p_prev, p_det)
        if p.get('code'):
            prod_by_code[p['code']] = (p_prev, p_det)
        if p.get('slug'):
            prod_by_slug[p['slug']] = (p_prev, p_det)

        for v in p.get('variants', []):
            v_prev = v.get('preview_picture')
            v_det = v.get('detail_picture')
            if v.get('external_code'):
                var_by_ext[v['external_code']] = (v_prev, v_det)
            if v.get('sku'):
                var_by_sku[v['sku']] = (v_prev, v_det)

    # 2. Обогащение целевого import_data.json (Товары и SKU) строго 1-к-1
    matched_prods = 0
    total_prods = len(target_data.get('products', []))
    matched_vars = 0
    total_vars = 0
    unmatched_prods = []
    unmatched_vars = []

    for p in target_data.get('products', []):
        p_img = prod_by_ext.get(p.get('external_code')) or \
                prod_by_code.get(p.get('code')) or \
                prod_by_slug.get(p.get('slug'))

        if p_img and p_img[0]:
            p['preview_picture'] = p_img[0]
            p['detail_picture'] = p_img[1]
            matched_prods += 1
        elif not p.get('preview_picture'):
            # у товара и так не было картинки, и источник её не дал — фиксируем для отчёта
            unmatched_prods.append(p.get('code') or p.get('external_code'))

        for v in p.get('variants', []):
            total_vars += 1
            v_img = var_by_ext.get(v.get('external_code')) or \
                    var_by_sku.get(v.get('sku'))

            if v_img and v_img[0]:
                v['preview_picture'] = v_img[0]
                v['detail_picture'] = v_img[1]
                matched_vars += 1
            elif not v.get('preview_picture'):
                unmatched_vars.append(v.get('sku') or v.get('external_code'))

    # 3. Генерация и внедрение HEX-кодов для цветов
    matched_hex = 0
    skipped_existing_hex = 0
    total_colors = 0
    unmatched_colors = []

    for attr in target_data.get('attributes', []):
        if attr.get('code') == 'color':
            for opt in attr.get('options', []):
                total_colors += 1
                val_ru = opt.get('value', {}).get('ru') if isinstance(opt.get('value'), dict) else opt.get('value')
                slug = opt.get('slug')
                val_norm = normalize_str(val_ru)

                existing_hex = (opt.get('meta') or {}).get('hex')
                if existing_hex and not args.force_hex:
                    # HEX уже задан вручную (например, взят напрямую с сайта) — не перетираем
                    skipped_existing_hex += 1
                    continue

                # Ищем HEX в палитре по слагу или русскому названию
                hex_code = COLOR_PALETTE.get(slug) or COLOR_PALETTE.get(val_norm)

                if hex_code:
                    if 'meta' not in opt or opt['meta'] is None:
                        opt['meta'] = {}

                    opt['meta']['hex'] = hex_code
                    # image не трогаем, если уже задан — раньше скрипт затирал его на None
                    opt['meta'].setdefault('image', None)
                    matched_hex += 1
                else:
                    unmatched_colors.append(f"slug='{slug}', name='{val_ru}'")

    # 4. Итоговая статистика
    print(f"\n📊 РЕЗУЛЬТАТЫ:")
    print(f"  • Товары (Products):     {matched_prods} из {total_prods} получили фото")
    print(f"  • Варианты (SKU):        {matched_vars} из {total_vars} получили фото")
    print(f"  • Цвета (HEX-коды):      {matched_hex} из {total_colors} успешно сгенерировано "
          f"({skipped_existing_hex} уже были заданы и пропущены)")

    if unmatched_prods:
        shown = unmatched_prods[:args.report_limit]
        more = len(unmatched_prods) - len(shown)
        print(f"\n  [!] Без картинки осталось товаров: {len(unmatched_prods)}")
        for code in shown:
            print(f"      - {code}")
        if more > 0:
            print(f"      ... и ещё {more}")

    if unmatched_vars:
        shown = unmatched_vars[:args.report_limit]
        more = len(unmatched_vars) - len(shown)
        print(f"\n  [!] Без картинки осталось вариантов (SKU): {len(unmatched_vars)}")
        for sku in shown:
            print(f"      - {sku}")
        if more > 0:
            print(f"      ... и ещё {more}")

    if unmatched_colors:
        print(f"\n  [!] Не найден HEX для {len(unmatched_colors)} цветов:")
        for line in unmatched_colors[:args.report_limit]:
            print(f"      - {line}")

    if dry_run:
        print("\n[INFO] Это был тестовый прогон. Целевой файл не изменён.")
        print("Чтобы применить изменения и сохранить файл, запустите:")
        print(f"  python3 enrich_images.py --target {args.target} --source {args.source} --apply")
    else:
        backup_file = args.target + '.bak'
        shutil.copyfile(args.target, backup_file)
        print(f"\n[OK] Создан бэкап: {backup_file}")
        save_json(args.target, target_data)
        print(f"[OK] Файл {args.target} успешно обновлён и готов к импорту!")


if __name__ == '__main__':
    main()