<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\TerraceChains;

use Nicole\Box\Core\Models\Product;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\CalculatorPipelineCluster;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\TerraceChains\Pages\ListTerraceChains;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Schemas\PipelineChainForm;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Tables\PipelineChainTable;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Traits\HasPipelineResource;

class TerraceChainResource extends Resource
{
  use HasPipelineResource;

  protected static ?string $model = Product::class;
  protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQueueList;
  protected static ?string $cluster = CalculatorPipelineCluster::class;
  protected static ?string $recordTitleAttribute = 'name';
  protected static ?int $navigationSort = 1;

  public static function getPipelineTypeCode(): string
  {
    return 'terrace';
  }

  public static function getTypeCode(): string
  {
    return 'terraceBoard';
  }

  public static function getModelLabel(): string
  {
    return __('Terrace Chain');
  }

  public static function getPluralModelLabel(): string
  {
    return __('Terrace Chains');
  }

  public static function form(Schema $schema): Schema
  {
    return PipelineChainForm::configure($schema, 'terraceBoard', __('Terrace Board'));
  }

  public static function table(Table $table): Table
  {
    return PipelineChainTable::configure($table, 'pl_terrace', __('Terrace Board (Root)'));
  }

  public static function getPages(): array
  {
    return [
      'index' => ListTerraceChains::route('/'),
    ];
  }
}
