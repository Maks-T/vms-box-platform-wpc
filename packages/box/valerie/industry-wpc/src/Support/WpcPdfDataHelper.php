<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Support;

use Carbon\Carbon;
use Nicole\Box\Core\Models\Order;
use Nicole\Box\Core\Models\OrderProduct;
use Nicole\Box\Core\Models\OrderSection;

class WpcPdfDataHelper
{
  private const array LAYOUT_MAP = [
    'rectangular' => [0 => 'rectangle_horizontal', 1 => 'rectangle_vertical'],
    'trapezoid'   => [0 => 'trapezoid_horizontal', 1 => 'trapezoid_vertical'],
    'l-shaped'    => [
      0 => 'l_shape_horizontal_brick',
      1 => 'l_shape_vertical_brick',
      2 => 'l_shape_horizontal_combined',
      3 => 'l_shape_combined',
    ],
    'u-shaped'    => [
      0 => 'u_shape_brick_legs_horizontal',
      1 => 'u_shape_brick_legs_vertical',
      2 => 'u_shape_plain',
    ],
    'pool'        => [
      0 => 'pool_horizontal',
      1 => 'pool_vertical',
      2 => 'pool_mixed',
    ],
  ];

  /**
   * Главный оркестратор: формирование карточек материалов на основе связей каталога (OrderProducts)
   *
   * @return array<int, array{
   *   title: string,
   *   photo: ?string,
   *   specs: array<string, string>
   * }>
   */
  public static function extractMaterialCards(OrderSection $section, ?Order $order = null): array
  {
    $cards = [];

    /** @var array<int, array<string, mixed>> $estimate */
    $estimate = is_array($section->estimate) ? $section->estimate : (json_decode((string) ($section->estimate ?? '[]'), true) ?? []);

    // Подгружаем товары, категории, EAV-атрибуты и медиа
    $section->loadMissing([
      'products.variant.product.media',
      'products.variant.product.type',
      'products.variant.media',
      'products.variant.attributeValues.attribute',
      'products.variant.attributeValues.option',
    ]);

    $products = $section->products;

    // 1. ПОЗИЦИЯ: Основная террасная доска (terraceBoard)
    if ($boardCard = self::buildBoardCard($products, $estimate)) {
      $cards[] = $boardCard;
    }

    // 2. ПОЗИЦИЯ: Опорная лага (joist)
    if ($joistCard = self::buildJoistCard($products, $estimate)) {
      $cards[] = $joistCard;
    }

    // 3. ПОЗИЦИЯ: Уголок (decorProducts / corner)
    if ($cornerCard = self::buildCornerCard($products, $estimate)) {
      $cards[] = $cornerCard;
    }

    // 4. ПОЗИЦИЯ: Ступень (stepBoard) - если нет уголка, будет 3-м блоком 03
    if ($stepCard = self::buildStepCard($products, $estimate)) {
      $cards[] = $stepCard;
    }

    return $cards;
  }

  /* ==========================================================================
     БИЛДЕРЫ КАРТОЧЕК МАТЕРИАЛОВ (СВЯЗЬ ПО TYPE_CODE И VARIANT_ID)
     ========================================================================== */

  /**
   * Карточка 1: Террасная доска
   */
  private static function buildBoardCard($products, array $estimate): ?array
  {
    /** @var OrderProduct|null $op */
    $op = $products->first(fn ($p) => ($p->variant?->product?->type?->code ?? '') === 'terraceBoard');

    if (!$op || !$op->variant) {
      return null;
    }

    $variant = $op->variant;
    $product = $variant->product;

    $length   = self::getAttributeNumeric($variant, 'length_mm', 3000);
    $width    = self::getAttributeNumeric($product, 'width_mm', 140);
    $height   = self::getAttributeNumeric($product, 'height_mm', 20);
    $color    = self::getAttributeOptionValue($variant, 'color', 'В ассортименте');
    $material = self::getAttributeOptionValue($product, 'material', 'ДПК');

    $estimateData = self::getEstimateByVariantId($estimate, $variant->id);
    $totalQty = $estimateData['count'] > 0 ? $estimateData['count'] : (int) $op->quantity;

    return [
      'title' => '01 · ' . mb_strtoupper($product->name ?? 'ТЕРРАСНАЯ ДОСКА ИЗ ДПК'),
      'photo' => self::getMediaBase64($variant) ?? self::getMediaBase64($product),
      'specs' => [
        'Террасная доска' => (string) ($variant->name ?? $product->name),
        'Материал' => (string) $material,
        'Размер доски' => "{$length} × {$width} × {$height} мм",
        'Цвет / фактура' => (string) $color,
        'Количество доска' => "{$totalQty} шт",
        'Гарантия производителя' => '25 лет',
      ],
    ];
  }

  /**
   * Карточка 2: Лага (Основание)
   */
  private static function buildJoistCard($products, array $estimate): ?array
  {
    /** @var OrderProduct|null $op */
    $op = $products->first(fn ($p) => ($p->variant?->product?->type?->code ?? '') === 'joist');

    if (!$op || !$op->variant) {
      return null;
    }

    $variant = $op->variant;
    $product = $variant->product;

    $length   = self::getAttributeNumeric($variant, 'length_mm', 4000);
    $width    = self::getAttributeNumeric($product, 'width_mm', 50);
    $height   = self::getAttributeNumeric($product, 'height_mm', 40);
    $material = self::getAttributeOptionValue($product, 'material', 'Алюминиевый профиль / ДПК');

    $estimateData = self::getEstimateByVariantId($estimate, $variant->id);
    $totalQty = $estimateData['count'] > 0 ? $estimateData['count'] : (int) $op->quantity;

    return [
      'title' => '02 · ОСНОВАНИЕ (' . mb_strtoupper($product->name ?? 'ОПОРНАЯ ЛАГА') . ')',
      'photo' => self::getMediaBase64($variant) ?? self::getMediaBase64($product),
      'specs' => [
        'Основание' => (string) ($variant->name ?? $product->name),
        'Материал' => (string) $material,
        'Размер лаги' => "{$length} × {$width} × {$height} мм",
        'Тип монтажа' => 'Скрытый, шовный',
        'Количество на проект' => "{$totalQty} шт",
        'Гарантия производителя' => '25 лет',
      ],
    ];
  }

  /**
   * Карточка 3: Уголок (decorProducts / corner)
   */
  private static function buildCornerCard($products, array $estimate): ?array
  {
    /** @var OrderProduct|null $op */
    $op = $products->first(fn ($p) => in_array($p->variant?->product?->type?->code ?? '', ['decorProducts', 'corner', 'decor_products'], true));

    if (!$op || !$op->variant) {
      return null;
    }

    $variant = $op->variant;
    $product = $variant->product;

    $length   = self::getAttributeNumeric($variant, 'length_mm', 3000);
    $width    = self::getAttributeNumeric($product, 'width_mm', 45);
    $height   = self::getAttributeNumeric($product, 'height_mm', 45);
    $color    = self::getAttributeOptionValue($variant, 'color', 'В тон настила');
    $material = self::getAttributeOptionValue($product, 'material', 'ДПК');

    $estimateData = self::getEstimateByVariantId($estimate, $variant->id);
    $totalQty = $estimateData['count'] > 0 ? $estimateData['count'] : (int) $op->quantity;

    return [
      'title' => '03 · ОБРАМЛЕНИЕ (УГОЛОК)',
      'photo' => self::getMediaBase64($variant) ?? self::getMediaBase64($product),
      'specs' => [
        'Наименование' => (string) ($variant->name ?? $product->name),
        'Материал' => (string) $material,
        'Размер уголка' => "{$length} × {$width} × {$height} мм",
        'Цвет' => (string) $color,
        'Назначение' => 'Обрамление внешних углов и торцов',
        'Количество на проект' => "{$totalQty} шт",
        'Гарантия производителя' => '25 лет',
      ],
    ];
  }

  /**
   * Карточка 3 (альтернатива): Ступень (stepBoard)
   */
  private static function buildStepCard($products, array $estimate): ?array
  {
    /** @var OrderProduct|null $op */
    $op = $products->first(fn ($p) => in_array($p->variant?->product?->type?->code ?? '', ['stepBoard', 'step_board', 'step'], true));

    if (!$op || !$op->variant) {
      return null;
    }

    $variant = $op->variant;
    $product = $variant->product;

    $length   = self::getAttributeNumeric($variant, 'length_mm', 3000);
    $width    = self::getAttributeNumeric($product, 'width_mm', 345);
    $height   = self::getAttributeNumeric($product, 'height_mm', 23);
    $color    = self::getAttributeOptionValue($variant, 'color', 'В тон настила');
    $material = self::getAttributeOptionValue($product, 'material', 'ДПК полнотелый профиль');

    $estimateData = self::getEstimateByVariantId($estimate, $variant->id);
    $totalQty = $estimateData['count'] > 0 ? $estimateData['count'] : (int) $op->quantity;

    return [
      'title' => '03 · ОБРАМЛЕНИЕ (СТУПЕНЬ)',
      'photo' => self::getMediaBase64($variant) ?? self::getMediaBase64($product),
      'specs' => [
        'Наименование' => (string) ($variant->name ?? $product->name),
        'Материал' => (string) $material,
        'Размер ступени' => "{$length} × {$width} × {$height} мм",
        'Цвет' => (string) $color,
        'Назначение' => 'Обрамление периметра / ступеней',
        'Количество на проект' => "{$totalQty} шт",
        'Гарантия производителя' => '25 лет',
      ],
    ];
  }

  /* ==========================================================================
     УТИЛИТЫ ТОЧНОГО ИЗВЛЕЧЕНИЯ ДАННЫХ
     ========================================================================== */

  /**
   * Точный поиск количества в смете по ID модификации (variantId)
   *
   * @return array{count: int, total: float}
   */
  private static function getEstimateByVariantId(array $estimate, int $variantId): array
  {
    $count = 0;
    $total = 0.0;

    foreach ($estimate as $row) {
      $rowVariantId = $row['meta']['variantId'] ?? ($row['meta']['variant_id'] ?? null);

      if ($rowVariantId !== null && (int) $rowVariantId === $variantId) {
        $cells = $row['value'] ?? [];
        $count += (int) ($cells[1] ?? 0);
        $priceRaw = (string) ($cells[3] ?? ($cells[2] ?? '0'));
        $total += (float) preg_replace('/[^\d.]/', '', str_replace(' ', '', $priceRaw));
      }
    }

    return ['count' => $count, 'total' => $total];
  }

  /**
   * Извлечение числового EAV-атрибута
   */
  private static function getAttributeNumeric($model, string $code, float|int $default): float|int
  {
    $val = $model->attributeValues->firstWhere('attribute.code', $code)?->value_numeric;
    return $val !== null ? $val : $default;
  }

  /**
   * Извлечение значения опции справочного EAV-атрибута (с поддержкой локализации)
   */
  private static function getAttributeOptionValue($model, string $code, string $default): string
  {
    $option = $model->attributeValues->firstWhere('attribute.code', $code)?->option;
    if (!$option) return $default;

    if (is_array($option->value)) {
      return (string) ($option->value['ru'] ?? reset($option->value));
    }

    return (string) $option->value;
  }

  /**
   * Кодирование медиафайла модели в Base64
   */
  private static function getMediaBase64($model): ?string
  {
    if (!$model) return null;

    $media = $model->getFirstMedia('preview') ?? $model->getFirstMedia('main');
    if ($media && file_exists($media->getPath())) {
      $mime = $media->mime_type ?: 'image/jpeg';
      return 'data:' . $mime . ';base64,' . base64_encode((string) file_get_contents($media->getPath()));
    }

    return null;
  }

  /**
   * Подбор и Base64-кодирование SVG-схемы террасы
   */
  public static function resolveTerraceLayoutImage(OrderSection $section, ?Order $order = null): ?string
  {
    /** @var array<string, mixed> $meta */
    $meta = is_array($section->meta) ? $section->meta : (json_decode((string) ($section->meta ?? '{}'), true) ?? []);

    /** @var array<string, mixed> $calcState */
    $calcState = $order?->calc_state ?? ($section->order?->calc_state ?? []);

    $form = (string) ($meta['properties']['form'] ?? ($calcState['terrace']['selectedForm'] ?? 'rectangular'));
    $direction = (int) ($meta['properties']['layingDirection'] ?? ($calcState['terrace']['layingDirection'] ?? 0));

    $name = self::LAYOUT_MAP[$form][$direction] ?? self::LAYOUT_MAP[$form][0];

    $path = public_path('images/pdf/layouts/terrace/' . $name . '.svg');

    if (file_exists($path)) {
      return 'data:image/svg+xml;base64,' . base64_encode((string) file_get_contents($path));
    }

    return self::extractDrawing($section);
  }

  /**
   * Извлечение чертежа из калькулятора
   */
  public static function extractDrawing(OrderSection $section): ?string
  {
    $mediaItem = $section->getFirstMedia('drawing');

    if ($mediaItem && file_exists($mediaItem->getPath())) {
      $mime = $mediaItem->mime_type ?: 'image/png';
      return 'data:' . $mime . ';base64,' . base64_encode((string) file_get_contents($mediaItem->getPath()));
    }

    /** @var array<string, mixed> $meta */
    $meta = is_array($section->meta) ? $section->meta : (json_decode((string) ($section->meta ?? '{}'), true) ?? []);

    return $meta['draw'][0] ?? ($meta['properties']['draw'][0] ?? null);
  }

  /**
   * Кодирование обложки
   */
  public static function resolveCoverImage(): ?string
  {
    $coverSetting = ltrim((string) config('nicole.company.cover_image', 'images/pdf/cover.jpg'), '/');
    $path = public_path(ltrim($coverSetting, '/'));

    if (file_exists($path)) {
      return 'data:image/jpeg;base64,' . base64_encode((string) file_get_contents($path));
    }

    return null;
  }

  /**
   * Кодирование логотипа (logo.png для темной темы, logo_black.png для светлой)
   */
  public static function resolveLogo(bool $isDark = false): ?string
  {
    $fileName = $isDark ? 'logo.png' : 'logo_black.png';
    $path = public_path('images/pdf/' . $fileName);

    if (file_exists($path)) {
      return 'data:image/png;base64,' . base64_encode((string) file_get_contents($path));
    }

    return null;
  }

  /**
   * 4 параметра для информационной плашки (Страница 2)
   *
   * @return array<int, array{val: string, lbl: string}>
   */
  public static function extractTerraceStats(OrderSection $section): array
  {
    /** @var array<string, mixed> $meta */
    $meta = is_array($section->meta) ? $section->meta : (json_decode((string) ($section->meta ?? '{}'), true) ?? []);
    $props = $meta['properties'] ?? [];

    $formLabels = [
      'rectangular' => 'Прямоугольная',
      'trapezoid'   => 'Трапеция',
      'l-shaped'    => 'Г-образная',
      'u-shaped'    => 'П-образная',
      'pool'        => 'С бассейном',
    ];

    $areaValue = isset($props['decking_area_mm2']) && is_numeric($props['decking_area_mm2'])
      ? number_format(round((float) $props['decking_area_mm2'] / 1_000_000, 2), 2, ',', ' ') . ' м²'
      : '—';

    $perimeterValue = isset($props['perimeter_mm']) && is_numeric($props['perimeter_mm'])
      ? number_format(round((float) $props['perimeter_mm'] / 1000, 2), 2, ',', ' ') . ' м'
      : '—';

    $formName = $formLabels[(string) ($props['form'] ?? '')] ?? 'Индивидуальная';

    return [
      ['val' => $areaValue, 'lbl' => 'ПЛОЩАДЬ НАСТИЛА'],
      ['val' => $perimeterValue, 'lbl' => 'ПЕРИМЕТР'],
      ['val' => $formName, 'lbl' => 'ФОРМА ТЕРРАСЫ'],
      ['val' => '25 лет', 'lbl' => 'ГАРАНТИЯ МАТЕРИАЛА'],
    ];
  }

  /**
   * Форматирование цены
   */
  public static function formatPrice(float|int|string|null $price, string $currency = 'RUB'): string
  {
    $symbol = match ($currency) {
      'RUB' => '₽',
      'USD' => '$',
      'BYN' => 'Br',
      'EUR' => '€',
      'KZT' => '₸',
      default => $currency,
    };

    return number_format((float) ($price ?? 0), 0, '.', ' ') . ' ' . $symbol;
  }

  /**
   * Расчет срока действия КП
   */
  public static function getValidUntil(?Carbon $createdAt = null, int $days = 30): string
  {
    $date = $createdAt ? $createdAt->copy()->addDays($days) : Carbon::now()->addDays($days);
    return $date->locale('ru')->translatedFormat('d F Y');
  }
}