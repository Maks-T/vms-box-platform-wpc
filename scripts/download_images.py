#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import json
import re
import hashlib
import argparse
import tempfile
import urllib.request
import urllib.parse
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Ошибка: библиотека Pillow не установлена. Установите командой: pip install Pillow")
    sys.exit(1)


def parse_arguments():
    parser = argparse.ArgumentParser(description="Универсальный загрузчик и оптимизатор изображений для VMS Platform.")

    parser.add_argument("-i", "--input", default="import_data_raw.json", help="Имя входного сырого JSON файла")
    parser.add_argument("-o", "--output", default="import_data.json", help="Имя выходного обработанного JSON файла")
    parser.add_argument("-d", "--dir", default=None, help="Базовая директория (папка import)")
    parser.add_argument("-s", "--size", type=int, default=600, help="Целевой размер изображения в px (по умолчанию 600)")
    parser.add_argument("-q", "--quality", type=int, default=85, help="Качество сжатия WebP (от 1 до 100, по умолчанию 85)")
    parser.add_argument("--crop", action="store_true", help="Принудительно обрезать все изображения до квадрата")
    parser.add_argument("--no-cache", action="store_true", help="Игнорировать файл кэша и скачать заново")

    return parser.parse_args()


def resolve_base_dir(custom_dir: str | None) -> str:
    """Автоматическое определение рабочей папки проекта"""
    if custom_dir and os.path.exists(custom_dir):
        return custom_dir

    # Проверяем текущую папку, если скрипт запущен из /import
    current_path = Path.cwd()
    if (current_path / "import_data_raw.json").exists() or current_path.name == "import":
        return str(current_path)

    # Проверяем подпапку import/ из корня проекта
    if (current_path / "import").exists():
        return str(current_path / "import")

    # Стандартные пути для WPC платформы (Linux / WSL)
    wpc_linux = Path("/home/maks-t/vms-box-platform-wpc/import")
    wpc_wsl = Path(r"\\wsl.localhost\Ubuntu-24.04\home\maks-t\vms-box-platform-wpc\import")

    if os.name == 'posix' and wpc_linux.exists():
        return str(wpc_linux)
    elif wpc_wsl.exists():
        return str(wpc_wsl)

    return str(current_path)


def sanitize_filename(url: str) -> str:
    """Генерация чистого и уникального имени файла WebP"""
    parsed = urllib.parse.urlparse(url)
    raw_name = os.path.basename(parsed.path)

    if not raw_name:
        url_hash = hashlib.md5(url.encode('utf-8')).hexdigest()[:8]
        return f"img_{url_hash}.webp"

    name_without_ext, _ = os.path.splitext(raw_name)

    # Очищаем от мусорных суффиксов размеров WordPress (например: -300x195, -600x390, -sl528x528)
    cleaned = re.sub(r'-\d+x\d+(?:px)?', '', name_without_ext, flags=re.IGNORECASE)
    cleaned = re.sub(r'-sl\d+x\d+', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'[^a-zA-Z0-9_\-]', '-', cleaned)
    cleaned = re.sub(r'-+', '-', cleaned).strip('-')

    # Добавляем короткий хэш пути URL, чтобы исключить затирание файлов с одинаковым названием из разных папок
    path_hash = hashlib.md5(parsed.path.encode('utf-8')).hexdigest()[:6]
    return f"{cleaned}_{path_hash}.webp"


def optimize_and_save_image(source_path: str, dest_path: str, max_size: int = 600, quality: int = 85, force_square: bool = False):
    """Универсальная обработка изображения: авто-поворот, прозрачность, ресайз и сохранение в WebP"""
    try:
        with Image.open(source_path) as img:
            # Исправляем ориентацию по EXIF (если фото с телефона)
            img = ImageOps.exif_transpose(img)

            # Конвертируем цветовые режимы (CMYK -> RGB, сохраняем RGBA для прозрачности)
            if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                img = img.convert("RGBA")
            elif img.mode != "RGB":
                img = img.convert("RGB")

            width, height = img.size

            if force_square:
                # Квадратный кроп по центру
                min_side = min(width, height)
                left = (width - min_side) / 2
                top = (height - min_side) / 2
                right = (width + min_side) / 2
                bottom = (height + min_side) / 2
                img = img.crop((left, top, right, bottom))
                img = img.resize((max_size, max_size), Image.Resampling.LANCZOS)
            else:
                # Пропорциональное сжатие по длинной стороне
                if width > max_size or height > max_size:
                    if width > height:
                        new_width = max_size
                        new_height = max(1, int(height * (max_size / width)))
                    else:
                        new_height = max_size
                        new_width = max(1, int(width * (max_size / height)))
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

            img.save(dest_path, "WEBP", quality=quality, method=6)
            return True

    except Exception as e:
        print(f"  [Ошибка обработки]: {e}")
        return False


def download_file(url: str, dest_path: str) -> bool:
    """Безопасное скачивание файла по сети"""
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
    )
    with urllib.request.urlopen(req, timeout=15) as response, open(dest_path, 'wb') as out_file:
        out_file.write(response.read())
    return True


def download_and_process(url: str, images_dir: str, cache: dict, max_size: int, quality: int, force_crop: bool, json_prefix: str = "products/") -> str:
    """Основной пайплайн: скачивание -> обработка -> кэширование"""
    clean_name = sanitize_filename(url)
    local_path = os.path.join(images_dir, clean_name)
    relative_json_path = json_prefix + clean_name

    # Проверяем кэш
    if url in cache and os.path.exists(local_path):
        return cache[url]

    print(f"-> Скачивание: {url}")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".tmp") as tmp:
        temp_path = tmp.name

    try:
        download_file(url, temp_path)
        success = optimize_and_save_image(temp_path, local_path, max_size=max_size, quality=quality, force_square=force_crop)

        if success:
            cache[url] = relative_json_path
            print(f"   [OK] Сохранено: {clean_name}")
            return relative_json_path
        else:
            return url

    except Exception as e:
        print(f"   [Ошибка скачивания]: {e}")
        return url

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


def traverse_json(node, images_dir: str, cache: dict, max_size: int, quality: int, force_crop: bool, is_stone_context: bool = False):
    """Рекурсивный обход любого JSON-дерева со сквозной заменой абсолютных ссылок на относительные пути"""
    if isinstance(node, dict):
        # Контекстное автоопределение: квадратный кроп для текстур камня
        current_crop = force_crop
        if "product_type_external_code" in node:
            type_code = str(node["product_type_external_code"]).lower()
            if "stone" in type_code:
                current_crop = True

        return {
            k: traverse_json(v, images_dir, cache, max_size, quality, force_crop=current_crop, is_stone_context=current_crop)
            for k, v in node.items()
        }

    elif isinstance(node, list):
        return [
            traverse_json(item, images_dir, cache, max_size, quality, force_crop=force_crop, is_stone_context=is_stone_context)
            for item in node
        ]

    elif isinstance(node, str) and (node.startswith("http://") or node.startswith("https://")):
        # Проверяем, является ли строка ссылкой на изображение
        lower_url = node.lower()
        if any(lower_url.endswith(ext) or ext + "?" in lower_url for ext in ('.jpg', '.jpeg', '.png', '.webp', '.avif', '.bmp')):
            return download_and_process(node, images_dir, cache, max_size, quality, force_crop)

    return node


def main():
    args = parse_arguments()
    base_dir = resolve_base_dir(args.dir)

    input_json_path = os.path.join(base_dir, args.input)
    output_json_path = os.path.join(base_dir, args.output)
    cache_file_path = os.path.join(base_dir, "image_cache.json")
    images_dir_path = os.path.join(base_dir, "export_images", "products")

    print(f"=== VMS Universal Image Downloader ===")
    print(f"Базовая папка:  {base_dir}")
    print(f"Входной JSON:   {input_json_path}")
    print(f"Выходной JSON:  {output_json_path}")
    print(f"Папка картинок: {images_dir_path}")
    print(f"======================================\n")

    if not os.path.exists(input_json_path):
        print(f"Критическая ошибка: Входной файл не найден: {input_json_path}")
        sys.exit(1)

    os.makedirs(images_dir_path, exist_ok=True)

    # Чтение кэша
    url_cache = {}
    if not args.no_cache and os.path.exists(cache_file_path):
        try:
            with open(cache_file_path, 'r', encoding='utf-8') as cf:
                url_cache = json.load(cf)
        except Exception as e:
            print(f"Предупреждение: Не удалось прочитать кэш ({e}), создаем новый.")

    # Чтение входного сырого JSON
    with open(input_json_path, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)

    # Обработка
    processed_data = traverse_json(
        raw_data,
        images_dir=images_dir_path,
        cache=url_cache,
        max_size=args.size,
        quality=args.quality,
        force_crop=args.crop
    )

    # Сохранение кэша
    try:
        with open(cache_file_path, 'w', encoding='utf-8') as cf:
            json.dump(url_cache, cf, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Ошибка сохранения кэша: {e}")

    # Сохранение готового JSON
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, ensure_ascii=False, indent=2)

    print(f"\n[УСПЕХ] Готово! Итоговый файл сохранен в: {output_json_path}")


if __name__ == "__main__":
    main()