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

def load_json(path):
    if not os.path.exists(path):
        print(f"[ERROR] Файл не найден: {path}")
        sys.exit(1)
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    dry_run = '--apply' not in sys.argv

    print("=" * 60)
    print(" VMS-NC: Скрипт сопоставления и внедрения путей картинок")
    print(f" Режим: {'[ТЕСТОВЫЙ / DRY-RUN]' if dry_run else '[БОЕВОЙ / APPLY]'}")
    print("=" * 60)

    target_data = load_json(TARGET_FILE)
    source_data = load_json(SOURCE_FILE)

    # 1. Построение словарей поиска из Letomarket источника
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

    color_opts_map = {}
    for attr in source_data.get('attributes', []):
        if attr.get('code') == 'color':
            for opt in attr.get('options', []):
                meta = opt.get('meta') or {}
                img = meta.get('image')
                hex_c = meta.get('hex')
                val_ru = opt.get('value', {}).get('ru') if isinstance(opt.get('value'), dict) else opt.get('value')

                entry = {'image': img, 'hex': hex_c}
                if opt.get('external_code'):
                    color_opts_map[opt['external_code']] = entry
                if opt.get('slug'):
                    color_opts_map[opt['slug']] = entry
                if val_ru:
                    color_opts_map[val_ru.strip().lower()] = entry

    # 2. Обогащение целевого import_data.json
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

        # Обрабатываем варианты товара
        for v in p.get('variants', []):
            total_vars += 1
            v_img = var_by_ext.get(v.get('external_code')) or \
                    var_by_sku.get(v.get('sku'))

            if v_img and v_img[0]:
                v['preview_picture'] = v_img[0]
                v['detail_picture'] = v_img[1]
                matched_vars += 1

    # 3. Обогащение текстур цветов в attributes
    matched_colors = 0
    total_colors = 0

    for attr in target_data.get('attributes', []):
        if attr.get('code') == 'color':
            for opt in attr.get('options', []):
                total_colors += 1
                val_ru = opt.get('value', {}).get('ru') if isinstance(opt.get('value'), dict) else opt.get('value')
                val_key = val_ru.strip().lower() if val_ru else None

                col_meta = color_opts_map.get(opt.get('external_code')) or \
                           color_opts_map.get(opt.get('slug')) or \
                           (color_opts_map.get(val_key) if val_key else None)

                if col_meta:
                    if 'meta' not in opt or opt['meta'] is None:
                        opt['meta'] = {}
                    if col_meta.get('hex'):
                        opt['meta']['hex'] = col_meta['hex']
                    if col_meta.get('image'):
                        opt['meta']['image'] = col_meta['image']
                        matched_colors += 1

    # 4. Вывод статистики
    print(f"\n📊 РЕЗУЛЬТАТЫ СОПОСТАВЛЕНИЯ:")
    print(f"  • Товары (Products):     {matched_prods} из {total_prods} получили пути к картинкам")
    print(f"  • Варианты (SKU):        {matched_vars} из {total_vars} получили пути к картинкам")
    print(f"  • Текстуры цветов:       {matched_colors} из {total_colors} получили привязки")

    if dry_run:
        print("\n[INFO] Это был тестовый прогон. Файл import_data.json не изменен.")
        print("Чтобы применить изменения, запустите:")
        print("  py enrich_images.py --apply")
    else:
        shutil.copyfile(TARGET_FILE, BACKUP_FILE)
        print(f"\n[OK] Создан бэкап: {BACKUP_FILE}")
        save_json(TARGET_FILE, target_data)
        print(f"[OK] Файл {TARGET_FILE} успешно обновлен и сохранен!")

if __name__ == '__main__':
    main()
