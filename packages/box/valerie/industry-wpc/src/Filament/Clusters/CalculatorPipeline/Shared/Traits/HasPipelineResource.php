<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Traits;

use Filament\Navigation\NavigationItem;
use Illuminate\Database\Eloquent\Builder;

trait HasPipelineResource
{
  /**
   * Возвращает код пайплайна для редиректа и подсветки меню ('terrace' или 'fence')
   */
  abstract public static function getPipelineTypeCode(): string;

  /**
   * Возвращает системный код типа продукта для фильтрации запросов ('terraceBoard' или 'pillar')
   */
  abstract public static function getTypeCode(): string;

  public static function getNavigationItems(): array
  {
    return [
      NavigationItem::make()
        ->label(static::getPluralModelLabel())
        ->icon(static::getNavigationIcon())
        ->url(static::getUrl('index'))
        ->isActiveWhen(fn () =>
          request()->routeIs(static::getRouteBaseName() . '.index') ||
          (request()->is('*/builder-pipeline-page*') && request()->query('type') === static::getPipelineTypeCode())
        )
        ->sort(static::getNavigationSort()),
    ];
  }

  /**
   * Универсальный метод фильтрации запросов
   */
  public static function getEloquentQuery(): Builder
  {
    return parent::getEloquentQuery()
      ->whereHas('type', fn($q) => $q->where('code', static::getTypeCode()))
      ->where(function (Builder $query) {

        $query->whereHas('linkedItems')
          ->orWhereHas('variants', function (Builder $vQ) {
            $vQ->whereIn('id', function ($sub) {
              $sub->select('parent_id')
                ->from('binding_rules')
                ->where('parent_type', 'product_variant');
            });
          });
      });
  }
}
