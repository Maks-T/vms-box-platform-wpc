<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\FenceChains;

use Nicole\Box\Core\Models\Product;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\CalculatorPipelineCluster;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\FenceChains\Pages\ListFenceChains;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Schemas\PipelineChainForm;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Tables\PipelineChainTable;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Traits\HasPipelineResource;

class FenceChainResource extends Resource
{
  use HasPipelineResource;

  protected static ?string $model = Product::class;
  protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBars3BottomRight;
  protected static ?string $cluster = CalculatorPipelineCluster::class;
  protected static ?string $recordTitleAttribute = 'name';
  protected static ?int $navigationSort = 2;

  public static function getPipelineTypeCode(): string
  {
    return 'fence';
  }

  public static function getTypeCode(): string
  {
    return 'pillar';
  }

  public static function getModelLabel(): string
  {
    return __('Fence Chain');
  }

  public static function getPluralModelLabel(): string
  {
    return __('Fence Chains');
  }

  public static function form(Schema $schema): Schema
  {
    return PipelineChainForm::configure($schema, 'pillar', __('Pillar'));
  }

  public static function table(Table $table): Table
  {
    return PipelineChainTable::configure($table, 'pl_fence', __('Pillar (Root)'));
  }

  public static function getPages(): array
  {
    return [
      'index' => ListFenceChains::route('/'),
    ];
  }
}
