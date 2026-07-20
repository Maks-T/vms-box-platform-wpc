<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Nicole\Box\Core\Models\ProductVariant;
use Nicole\Box\Core\Models\BindingRule;

use Nicole\Box\Core\Filament\Forms\Components\ProductSelect;

class PipelineChainForm
{
  public static function configure(Schema $schema, string $typeCode, string $rootLabel): Schema
  {
    return $schema->components([
      Select::make('variant_id')
        ->label($rootLabel)
        ->required()
        ->searchable()
        ->preload()
        ->allowHtml()
        ->options(function () use ($typeCode) {

          $configuredVariantIds = BindingRule::where('parent_type', (new ProductVariant())->getMorphClass())
            ->pluck('parent_id')
            ->unique()
            ->toArray();

          return ProductVariant::query()
            ->whereHas('product.type', fn($q) => $q->where('code', $typeCode))
            ->whereNotIn('id', $configuredVariantIds)
            ->get()
            ->mapWithKeys(function (ProductVariant $record) {
              $html = ProductSelect::renderProductOption($record->product);
              return [$record->id => $html];
            })
            ->toArray();
        })
    ]);
  }
}
