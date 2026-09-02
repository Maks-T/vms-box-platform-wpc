#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TARGET_FILE = os.path.join(BASE_DIR, 'import_data.json')
SOURCE_FILE = os.path.join(BASE_DIR, 'import_data_letomarket.json')
BACKUP_FILE = os.path.join(BASE_DIR, 'import_data.json.bak')

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
    return str(s).strip().lower().replace('ё', 'е').replace('  ', ' ')

def main():
    dry_run = '--apply' not in sys.argv

    print("=" * 60)
    print(" VMS-NC: Склейка картинок и генератор палитры HEX")
    print(f" Режим: {'[ТЕСТОВЫЙ / DRY-RUN]' if dry_run else '[БОЕВОЙ / APPLY]'}")
    print("=" * 60)

    target_data = load_json(TARGET_FILE)
    source_data = load_json(SOURCE_FILE)

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

    for p in target_data.get('products', []):
        p_img = prod_by_ext.get(p.get('external_code')) or \
                prod_by_code.get(p.get('code')) or \
                prod_by_slug.get(p.get('slug'))

        if p_img and p_img[0]:
            p['preview_picture'] = p_img[0]
            p['detail_picture'] = p_img[1]
            matched_prods += 1

        for v in p.get('variants', []):
            total_vars += 1
            v_img = var_by_ext.get(v.get('external_code')) or \
                    var_by_sku.get(v.get('sku'))

            if v_img and v_img[0]:
                v['preview_picture'] = v_img[0]
                v['detail_picture'] = v_img[1]
                matched_vars += 1

    # 3. Генерация и внедрение HEX-кодов для цветов
    matched_hex = 0
    total_colors = 0

    for attr in target_data.get('attributes', []):
        if attr.get('code') == 'color':
            for opt in attr.get('options', []):
                total_colors += 1
                val_ru = opt.get('value', {}).get('ru') if isinstance(opt.get('value'), dict) else opt.get('value')
                slug = opt.get('slug')
                val_norm = normalize_str(val_ru)

                # Ищем HEX в палитре по слагу или русскому названию
                hex_code = COLOR_PALETTE.get(slug) or COLOR_PALETTE.get(val_norm)

                if hex_code:
                    if 'meta' not in opt or opt['meta'] is None:
                        opt['meta'] = {}

                    opt['meta']['hex'] = hex_code
                    opt['meta']['image'] = None
                    matched_hex += 1
                else:
                    print(f"  [?] Не найден HEX для цвета: slug='{slug}', name='{val_ru}'")

    # 4. Итоговая статистика
    print(f"\n📊 РЕЗУЛЬТАТЫ:")
    print(f"  • Товары (Products):     {matched_prods} из {total_prods} получили фото")
    print(f"  • Варианты (SKU):        {matched_vars} из {total_vars} получили фото")
    print(f"  • Цвета (HEX-коды):      {matched_hex} из {total_colors} успешно сгенерировано")

    if dry_run:
        print("\n[INFO] Это был тестовый прогон. Файл import_data.json не изменен.")
        print("Чтобы применить изменения и сохранить файл, запустите:")
        print("  py enrich_images.py --apply")
    else:
        shutil.copyfile(TARGET_FILE, BACKUP_FILE)
        print(f"\n[OK] Создан бэкап: {BACKUP_FILE}")
        save_json(TARGET_FILE, target_data)
        print(f"[OK] Файл {TARGET_FILE} успешно обновлен и готов к импорту!")

if __name__ == '__main__':
    main()
