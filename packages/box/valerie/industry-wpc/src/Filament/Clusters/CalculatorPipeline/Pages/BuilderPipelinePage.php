<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Pages;

use Nicole\Box\Core\Models\ProductVariant;
use Nicole\Box\Core\Services\Calculator\PipelineTreeService;
use Nicole\Box\Core\Filament\Forms\Components\VariantSelect;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\CalculatorPipelineCluster;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Actions\ConfigureNodeAction;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Actions\ActivateTreeAction;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Actions\DeleteNodeAction;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Actions\ConfigureRootAction;
use Filament\Actions\Action;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Infolists\Components\TextEntry;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Enums\Width;
use Illuminate\Support\HtmlString;
use Livewire\Attributes\Url;

class BuilderPipelinePage extends Page implements HasForms
{
  use InteractsWithForms;

  protected string $view = 'valerie-wpc::filament.clusters.calculator-pipeline.pages.builder-pipeline-page';

  protected static ?string $cluster = CalculatorPipelineCluster::class;
  protected static bool $shouldRegisterNavigation = false;

  #[Url]
  public ?int $base_variant_id = null;

  #[Url]
  public string $type = 'terrace';

  public function getMaxContentWidth(): Width|string|null
  {
    return Width::ScreenTwoExtraLarge;
  }

  public function mount(): void
  {
    $this->form->fill([
      'base_variant_id' => $this->base_variant_id,
    ]);
  }

  /**
   * Возвращает настройки пайплайна
   */
  public function getPipelineConfig(): array
  {
    //ToDo получать из бд
    return match ($this->type) {
      'fence' => [
        'pipeline_code' => 'pl_fence',
        'title' => __('Configuration Wizard: Fencing'),
        'label' => __('Pillar (Root)'),
        'type_code' => 'pillar'
      ],
      default => [
        'pipeline_code' => 'pl_terrace',
        'title' => __('Configuration Wizard: Terrace'),
        'label' => __('Terrace Board (Root)'),
        'type_code' => 'terraceBoard'
      ],
    };
  }

  public function getTitle(): string
  {
    return $this->getPipelineConfig()['title'];
  }

  public function configureNodeAction(): Action
  {
    return ConfigureNodeAction::make();
  }

  public function activateTreeAction(): Action
  {
    return ActivateTreeAction::make();
  }

  public function deleteNodeAction(): Action
  {
    return DeleteNodeAction::make();
  }

  public function configureRootAction(): Action
  {
    return ConfigureRootAction::make();
  }

  public function form(Schema $schema): Schema
  {
    $config = $this->getPipelineConfig();

    return $schema->components([
      Section::make(__('Step 1: Select Root Product'))
        ->description(fn() => __('Select the base element (:label) to configure connections for', ['label' => $config['label']]))
        ->schema([
          VariantSelect::make('base_variant_id')
            ->label($config['label'])
            ->live()
            ->required()
            ->getSearchResultsUsing(function (string $search) use ($config) {
              return ProductVariant::query()
                ->with(['product.media', 'media'])
                ->whereHas('product.type', fn($q) => $q->where('code', $config['type_code']))
                ->where(function ($query) use ($search) {
                  $query->where('sku', 'ilike', "%{$search}%")
                    ->orWhere('external_code', 'ilike', "%{$search}%")
                    ->orWhereHas('product', function ($q) use ($search) {
                      $q->where('name->ru', 'ilike', "%{$search}%")
                        ->orWhere('name->en', 'ilike', "%{$search}%");
                    });
                })
                ->limit(15)
                ->get()
                ->mapWithKeys(fn($v) => [$v->id => VariantSelect::renderVariantOption($v)])
                ->toArray();
            })
            ->options(function () use ($config) {
              return ProductVariant::query()
                ->whereHas('product.type', fn($q) => $q->where('code', $config['type_code']))
                ->get()
                ->mapWithKeys(function (ProductVariant $record) {
                  $html = VariantSelect::renderVariantOption($record);
                  return [$record->id => $html];
                })
                ->toArray();
            })
        ]),

      Section::make(__('Step 2: Connection Analysis (Component Tree)'))
        ->visible(fn(Get $get) => filled($get('base_variant_id')))
        ->schema([
          TextEntry::make('tree_render')
            ->hiddenLabel()
            ->html()
            ->state(function (Get $get) use ($config) {
              $variantId = $get('base_variant_id');
              if (!$variantId) return null;

              $report = app(PipelineTreeService::class)->analyzeTree((int)$variantId, $config['pipeline_code']);
              if (!$report) return null;

              $report['has_config'] = true;
              $report['group_name'] = $config['label'];

              $rootVariant = ProductVariant::find($variantId);
              $isRootActive = $rootVariant?->is_active ?? false;

              $buttonsHtml = view('valerie-wpc::filament.clusters.calculator-pipeline.components.tree-status-panel', [
                'variantId' => $variantId,
                'isValid' => $report['is_valid'],
                'isRootActive' => $isRootActive,
              ])->render();

              $treeHtml = view('valerie-wpc::filament.clusters.calculator-pipeline.components.tree-node', [
                'node' => $report,
                'isRoot' => true
              ])->render();

              return new HtmlString($buttonsHtml . $treeHtml);
            })
        ])
    ]);
  }
}
