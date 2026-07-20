<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Tables;

use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Nicole\Box\Core\Models\ProductVariant;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Pages\BuilderPipelinePage;

use Nicole\Box\Core\Services\Calculator\PipelineTreeService;

class PipelineChainTable
{

  protected static function getDefaultVariant($product): ?ProductVariant
  {
    return $product->variants()->where('is_default', true)->first()
      ?? $product->variants()->first();
  }

  public static function configure(Table $table, string $pipelineCode, string $rootLabel): Table
  {
    return $table
      ->columns([
        TextColumn::make('name')
          ->label($rootLabel)
          ->searchable()
          ->sortable()
          ->description(fn($record) => $record->code),

        IconColumn::make('is_active')
          ->label(__('Is Active'))
          ->boolean(),

        TextColumn::make('tree_validity')
          ->label(__('Tree State'))
          ->state(function ($record) use ($pipelineCode) {
            $variant = static::getDefaultVariant($record);
            if (!$variant) {
              return __('Has Errors (Incomplete)');
            }

            $report = app(PipelineTreeService::class)->analyzeTree($variant->id, $pipelineCode);
            return $report && $report['is_valid'] ? __('Ready to Publish') : __('Has Errors (Incomplete)');
          })
          ->badge()
          ->color(fn(string $state): string => match ($state) {
            __('Ready to Publish') => 'success',
            default => 'danger',
          }),
      ])
      ->filters([
        TernaryFilter::make('is_active')
          ->label(__('Active on Site')),
      ])
      ->recordActions([
        // Быстрая публикация / скрытие с сайта
        Action::make('toggle_active')
          ->label(fn($record) => $record->is_active ? __('Hide from Site') : __('Publish'))
          ->icon(fn($record) => $record->is_active ? 'heroicon-m-eye-slash' : 'heroicon-m-rocket-launch')
          ->color(fn($record) => $record->is_active ? 'danger' : 'success')
          ->action(function ($record) use ($pipelineCode) {
            $variant = static::getDefaultVariant($record);
            if (!$variant) return;

            $treeService = app(PipelineTreeService::class);
            $report = $treeService->analyzeTree($variant->id, $pipelineCode);

            if (!$report) {
              Notification::make()->title(__('Tree analysis error'))->danger()->send();
              return;
            }

            $targetStatus = !$record->is_active;

            if ($targetStatus && !$report['is_valid']) {
              Notification::make()
                ->title(__('Cannot Publish'))
                ->body(__('There are errors or uncompleted elements in the chain.'))
                ->danger()
                ->send();
              return;
            }

            $treeService->toggleTreeActiveStatus($report, $targetStatus);

            $record->update(['is_active' => $targetStatus]);

            Notification::make()
              ->title($targetStatus ? __('The entire chain has been published') : __('The entire chain has been hidden'))
              ->success()
              ->send();
          }),

        Action::make('open_pipeline')
          ->label(__('Open in Master'))
          ->icon('heroicon-m-sparkles')
          ->color('primary')
          ->url(function ($record) use ($pipelineCode) {
            $variant = static::getDefaultVariant($record);
            return BuilderPipelinePage::getUrl([
              'base_variant_id' => $variant?->id,
              'type' => $pipelineCode === 'pl_fence' ? 'fence' : 'terrace'
            ]);
          }),
      ]);
  }
}
