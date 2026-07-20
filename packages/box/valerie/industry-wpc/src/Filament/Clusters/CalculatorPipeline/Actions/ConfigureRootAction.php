<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Actions;

use Nicole\Box\Core\Models\ProductVariant;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Schemas\PipelineRootForm;
use Filament\Actions\Action;
use Filament\Support\Enums\Width;
use Filament\Schemas\Schema;

class ConfigureRootAction extends Action
{
  public static function getDefaultName(): ?string
  {
    return 'configureRoot';
  }

  protected function setUp(): void
  {
    parent::setUp();

    $this->modalHeading(function () {
      $livewire = $this->getLivewire();
      $variant = ProductVariant::find($livewire->base_variant_id);
      return __('Configuration Settings: :name', ['name' => $variant?->name]);
    })
      ->modalWidth(Width::SevenExtraLarge)
      ->fillForm(function () {
        $livewire = $this->getLivewire();
        $config = $livewire->getPipelineConfig();
        return PipelineRootForm::fill($livewire->base_variant_id, $config['pipeline_code']);
      })
      ->schema(function (Schema $schema) {
        $livewire = $this->getLivewire();
        $config = $livewire->getPipelineConfig();
        return PipelineRootForm::configure($schema, $config['pipeline_code']);
      })
      ->action(function (array $data) {
        $livewire = $this->getLivewire();
        $config = $livewire->getPipelineConfig();
        PipelineRootForm::save($data, $livewire->base_variant_id, $config['pipeline_code']);
      });
  }
}
