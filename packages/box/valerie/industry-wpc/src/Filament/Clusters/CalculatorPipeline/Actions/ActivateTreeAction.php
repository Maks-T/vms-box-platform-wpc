<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Actions;

use Nicole\Box\Core\Models\ProductVariant;
use Nicole\Box\Core\Services\Calculator\PipelineTreeService;
use Filament\Actions\Action;
use Filament\Notifications\Notification;

class ActivateTreeAction extends Action
{
  public static function getDefaultName(): ?string
  {
    return 'activateTree';
  }

  protected function setUp(): void
  {
    parent::setUp();

    $this->action(function (array $arguments) {
      $livewire = $this->getLivewire();
      $config = $livewire->getPipelineConfig();
      $treeService = app(PipelineTreeService::class);

      $report = $treeService->analyzeTree((int)$arguments['variant_id'], $config['pipeline_code']);

      if (!$report) {
        Notification::make()->title(__('Error analyzing tree'))->danger()->send();
        return;
      }

      if ($arguments['action'] === 'activate' && !$report['is_valid']) {
        Notification::make()
          ->title(__('Cannot activate'))
          ->body(__('There are empty required connections in the tree.'))
          ->danger()
          ->send();
        return;
      }

      $status = $arguments['action'] === 'activate';
      $treeService->toggleTreeActiveStatus($report, $status);

      $rootVariant = ProductVariant::find((int)$arguments['variant_id']);
      $rootVariant?->product?->update(['is_active' => $status]);

      Notification::make()
        ->title($status ? __('The entire chain has been published on the website') : __('The entire chain has been hidden from the website'))
        ->success()
        ->send();
    });
  }
}
