<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Actions;

use Nicole\Box\Core\Models\BindingRule;
use Nicole\Box\Core\Models\ProductVariant;
use Nicole\Box\Core\Services\Calculator\PipelineTreeService;
use Filament\Actions\Action;
use Filament\Notifications\Notification;

class DeleteNodeAction extends Action
{
  public static function getDefaultName(): ?string
  {
    return 'deleteNode';
  }

  protected function setUp(): void
  {
    parent::setUp();

    $this->requiresConfirmation()
      ->modalHeading(__('Delete Connection?'))
      ->modalDescription(__('Are you sure you want to delete this linked item?'))
      ->action(function (array $arguments) {
        $rule = BindingRule::find($arguments['rule_id']);
        if ($rule) {
          $rule->delete();

          $livewire = $this->getLivewire();
          $config = $livewire->getPipelineConfig();
          $baseVariantId = $livewire->base_variant_id;

          if ($baseVariantId) {
            $treeService = app(PipelineTreeService::class);

            $rootVariant = ProductVariant::find((int)$baseVariantId);
            $wasActive = $rootVariant?->product?->is_active ?? false;

            $report = $treeService->analyzeTree((int)$baseVariantId, $config['pipeline_code']);

            if ($report && !$report['is_valid']) {
              $treeService->toggleTreeActiveStatus($report, false);
              $rootVariant?->product?->update(['is_active' => false]);

              if ($wasActive) {
                Notification::make()
                  ->title(__('Configuration unpublished'))
                  ->body(__('The chain became invalid and was automatically hidden from the site.'))
                  ->warning()
                  ->send();
              } else {
                Notification::make()
                  ->title(__('Connection deleted successfully'))
                  ->success()
                  ->send();
              }
            } else {
              Notification::make()
                ->title(__('Connection deleted successfully'))
                ->success()
                ->send();
            }
          } else {
            Notification::make()->title(__('Connection deleted successfully'))->success()->send();
          }
        }
      });
  }
}
