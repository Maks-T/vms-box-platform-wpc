<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Support;

use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\RepeatableEntry\TableColumn;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Nicole\Box\Core\Contracts\OrderSectionFormatterInterface;
use Nicole\Box\Core\Models\OrderSection;

/**
 * Отраслевой форматтер для террасных систем ДПК.
 *
 * @since 2026-09-06
 */
class WpcTerraceSectionFormatter implements OrderSectionFormatterInterface
{
  public function formatSpecifications(OrderSection $section): array
  {
    $props = $section->meta['properties'] ?? [];
    if (empty($props)) {
      return [];
    }

    $formLabels = [
      'rectangular' => __('Rectangular'),
      'trapezoid'   => __('Trapezoid'),
      'l-shaped'    => __('L-shaped'),
      'u-shaped'    => __('U-shaped'),
      'pool'        => __('With pool cutout'),
    ];

    $formatted = [];

    if (isset($props['form'])) {
      $formKey = (string)$props['form'];
      $formatted[__('Terrace Form')] = $formLabels[$formKey] ?? __($formKey);
    }

    if (isset($props['decking_area_mm2']) && is_numeric($props['decking_area_mm2'])) {
      $areaM2 = round((float)$props['decking_area_mm2'] / 1_000_000, 2);
      $formatted[__('Decking Area')] = "{$areaM2} " . __('m²');
    }

    if (isset($props['perimeter_mm']) && is_numeric($props['perimeter_mm'])) {
      $perimM = round((float)$props['perimeter_mm'] / 1000, 2);
      $formatted[__('Finishing Perimeter')] = "{$perimM} " . __('m');
    }

    foreach ($props as $key => $val) {
      if (in_array($key, ['form', 'decking_area_mm2', 'perimeter_mm'], true)) {
        continue;
      }
      $formatted[__(ucfirst(str_replace('_', ' ', (string)$key)))] = is_bool($val) ? ($val ? __('Yes') : __('No')) : (string)$val;
    }

    return $formatted;
  }

  public function formatSummary(OrderSection $section): string
  {
    $specs = $this->formatSpecifications($section);
    if (empty($specs)) {
      return '-';
    }

    return collect($specs)
      ->map(fn($val, $key) => "▪ {$key}: {$val}")
      ->join("<br />");
  }

  /**
   * Отраслевой рендеринг сметы террасы с финансовым блоком.
   *
   * @since 2026-09-06
   */
  public function formatEstimate(OrderSection $section): array
  {
    $estimate = $section->estimate ?? [];
    if (empty($estimate) || !is_array($estimate)) {
      return [TextEntry::make('empty_estimate')->state(__('No estimate data'))->hiddenLabel()];
    }

    $headers = $estimate[0]['value'] ?? [];
    $rows = array_slice($estimate, 1);

    if (empty($rows)) {
      return [TextEntry::make('empty_estimate')->state(__('No estimate data'))->hiddenLabel()];
    }

    $tableColumns = [];
    $textEntries = [];
    $totalCols = count($headers);

    foreach ($headers as $colIndex => $colName) {
      $tableColumns[] = TableColumn::make((string)$colName);
      $entry = TextEntry::make("col_{$colIndex}");

      if ($colIndex > 0) {
        $entry->alignEnd();
      }

      if ($colIndex === $totalCols - 1) {
        $entry->weight('bold')->color('success');
      }

      $textEntries[] = $entry;
    }

    $flatData = [];
    foreach ($rows as $item) {
      $cells = $item['value'] ?? [];
      $row = [];
      foreach ($headers as $colIndex => $colName) {
        $row["col_{$colIndex}"] = $cells[$colIndex] ?? '';
      }
      $flatData[] = $row;
    }

    $currency = (string)($section->order?->currency ?? 'RUB');

    return [
      // 1. Таблица сметных позиций
      RepeatableEntry::make('wpc_estimate_table')
        ->hiddenLabel()
        ->state($flatData)
        ->table($tableColumns)
        ->schema($textEntries)
        ->columnSpanFull(),

      // 2. Отраслевой финансовый блок
      Section::make(__('Financial Summary'))
        ->icon('heroicon-o-calculator')
        ->schema([
          Grid::make(['default' => 1, 'sm' => 2, 'md' => 4])
            ->schema([
              TextEntry::make('price_total')
                ->label(__('Subtotal'))
                ->state(fn() => number_format((float)$section->price_total, 2, '.', ' ') . " {$currency}"),

              TextEntry::make('price_discount')
                ->label(__('Discount'))
                ->visible((float)$section->price_discount > 0)
                ->state(function () use ($section, $currency) {
                  $discountVal = number_format((float)$section->price_discount, 2, '.', ' ') . " {$currency}";
                  $percent = (float)($section->price_discount_percent ?? 0);
                  return $percent > 0 ? "-{$discountVal} ({$percent}%)" : "-{$discountVal}";
                })
                ->color('danger'),

              TextEntry::make('price_vat')
                ->label(__('VAT'))
                ->visible((float)$section->price_vat > 0)
                ->state(function () use ($section, $currency) {
                  $vatVal = number_format((float)$section->price_vat, 2, '.', ' ') . " {$currency}";
                  $percent = (float)($section->price_vat_percent ?? 0);
                  return $percent > 0 ? "{$vatVal} ({$percent}%)" : $vatVal;
                })
                ->color('gray'),

              TextEntry::make('price_grand_total')
                ->label(__('Total to Pay'))
                ->state(fn() => number_format((float)$section->price_grand_total, 2, '.', ' ') . " {$currency}")
                ->weight('bold')
                ->color('success')
                ->size('lg'),
            ]),
        ])
        ->collapsible(false)
        ->columnSpanFull(),
    ];
  }
}