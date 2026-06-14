<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Pages;

use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Enums\Width;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\HtmlString;
use Livewire\Attributes\Url;
use Nicole\Box\Core\Models\BindingRule;
use Nicole\Box\Core\Models\Pipeline;
use Nicole\Box\Core\Models\ProductType;
use Nicole\Box\Core\Models\ProductVariant;
use Valerie\Box\IndustryWpc\Services\WpcPipelineValidator;

class BuilderPipelinePage extends Page implements HasForms
{
  use InteractsWithForms;

  // Подключаем Blade-шаблон, перенесенный в ресурсы плагина ДПК
  protected string $view = 'valerie-wpc::filament.pages.builder-pipeline-page';
  protected static bool $shouldRegisterNavigation = false;

  #[Url]
  public ?int $base_variant_id = null;

  // Может принимать значения: terrace (настил), joist (лаги) или fence (ограждения)
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

  // Конфигурационный маппинг параметров в зависимости от типа
  protected function getPipelineConfig(): array
  {
    return match ($this->type) {
      'fence' => [
        'pipeline_code' => 'fence',
        'root_type_code' => 'pillar',
        'title' => 'Мастер конфигурации: Ограждения',
        'label' => 'Столб (SKU)',
      ],
      'joist' => [
        'pipeline_code' => 'terrace',
        'root_type_code' => 'joist',
        'title' => 'Мастер конфигурации: Опорные лаги',
        'label' => 'Лага (SKU)',
      ],
      default => [
        'pipeline_code' => 'terrace',
        'root_type_code' => 'terraceBoard',
        'title' => 'Мастер конфигурации: Терраса',
        'label' => 'Террасная доска (SKU)',
      ],
    };
  }

  public function getTitle(): string
  {
    return $this->getPipelineConfig()['title'];
  }

  public function form(Schema $schema): Schema
  {
    $config = $this->getPipelineConfig();

    return $schema->components([
      Section::make('Шаг 1: Выбор корневого товара')
        ->description("Выберите базовый элемент, для которого будем настраивать связи")
        ->schema([
          Select::make('base_variant_id')
            ->label($config['label'])
            ->searchable()
            ->preload()
            ->live()
            ->allowHtml()
            ->options(function () use ($config) {
              // Ищем только те SKU, которые принадлежат выбранному типу ДПК-товаров
              return ProductVariant::query()
                ->whereHas('product.type', fn(Builder $q) => $q->where('code', $config['root_type_code']))
                ->get()
                ->mapWithKeys(function (ProductVariant $record) {
                  $imageUrl = $record->getPreviewUrl();

                  // Используем красивый Blade-опшен с фото товара из ресурсов плагина ДПК
                  $html = view('valerie-wpc::filament.components.select-variant-option', [
                    'name' => $record->name,
                    'id' => $record->id,
                    'imageUrl' => $imageUrl,
                  ])->render();

                  return [$record->id => $html];
                })
                ->toArray();
            })
        ]),

      Section::make('Анализ связей (Дерево комплектующих)')
        ->visible(fn(Get $get) => filled($get('base_variant_id')))
        ->schema([
          TextEntry::make('tree_render')
            ->hiddenLabel()
            ->html()
            ->state(function (Get $get) use ($config) {
              $variantId = $get('base_variant_id');
              if (!$variantId) return null;

              $validator = app(WpcPipelineValidator::class);
              $report = $validator->analyzeTree((int)$variantId, $config['pipeline_code']);

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

  // Экшен настройки конкретного слота (открывает модалку при клике на «Настроить»)
  public function configureNodeAction(): Action
  {
    return Action::make('configureNode')
      ->modalHeading(function (array $arguments) {
        $variant = ProductVariant::find($arguments['variant_id']);
        return "Настройка связей для: {$variant?->name}";
      })
      ->modalWidth(Width::FourExtraLarge)
      ->fillForm(function (array $arguments): array {
        $pipelineCode = $this->getPipelineConfig()['pipeline_code'];
        $pipeline = Pipeline::where('external_code', $pipelineCode)->first();

        // Считываем текущие настроенные связи из базы данных
        $rules = BindingRule::where('pipeline_id', $pipeline?->id)
          ->where('parent_type', (new ProductVariant())->getMorphClass())
          ->where('parent_id', $arguments['variant_id'])
          ->get();

        $values = [];
        foreach ($rules as $rule) {
          $role = data_get($rule->conditions, 'role');
          if ($role) {
            $values[$role] = $rule->child_id;
          }
        }

        return [
          'values' => $values,
        ];
      })
      ->schema(function (array $arguments) {
        $variant = ProductVariant::with('product.type')->find($arguments['variant_id']);
        $slots = $variant?->product?->type?->meta['calc_slots'] ?? [];

        $schema = [];
        foreach ($slots as $slot) {
          $statePath = "values.{$slot['role']}";

          // Строим селект выбора SKU на основе типа сопутствующих товаров
          $component = Select::make($statePath)
            ->label($slot['label'])
            ->searchable()
            ->preload()
            ->allowHtml()
            ->options(function () use ($slot) {
              return ProductVariant::query()
                ->whereHas('product.type', fn(Builder $q) => $q->where('code', $slot['target_type_code']))
                ->get()
                ->mapWithKeys(function ($v) {
                  $imageUrl = $v->getPreviewUrl();

                  $html = view('valerie-wpc::filament.components.select-variant-option', [
                    'name' => $v->name,
                    'id' => $v->id,
                    'imageUrl' => $imageUrl,
                  ])->render();

                  return [$v->id => $html];
                })
                ->toArray();
            });

          $schema[] = $component->required($slot['is_required'] ?? false);
        }

        return [
          Grid::make(2)->schema($schema)
        ];
      })
      ->action(function (array $data, array $arguments) {
        $pipelineCode = $this->getPipelineConfig()['pipeline_code'];
        $pipeline = Pipeline::where('external_code', $pipelineCode)->first();
        $morphClass = (new ProductVariant())->getMorphClass();

        // Сохраняем связи в универсальную системную таблицу binding_rules ядра VMS-NC
        foreach ($data['values'] ?? [] as $role => $childId) {
          if (empty($childId)) {
            BindingRule::where('pipeline_id', $pipeline?->id)
              ->where('parent_type', $morphClass)
              ->where('parent_id', $arguments['variant_id'])
              ->where('conditions->role', $role)
              ->delete();
            continue;
          }

          BindingRule::updateOrCreate([
            'pipeline_id' => $pipeline?->id,
            'parent_type' => $morphClass,
            'parent_id' => $arguments['variant_id'],
            'conditions->role' => $role
          ], [
            'conditions' => ['role' => $role],
            'child_type' => $morphClass,
            'child_id' => $childId,
            'quantity_formula' => '1',
            'is_required' => true,
          ]);
        }

        Notification::make()->title('Настройки связей сохранены')->success()->send();
      });
  }

  // Экшен публикации/скрытия всей цепочки
  public function activateTreeAction(): Action
  {
    return Action::make('activateTree')
      ->action(function (array $arguments) {
        $config = $this->getPipelineConfig();
        $validator = app(WpcPipelineValidator::class);

        $report = $validator->analyzeTree((int)$arguments['variant_id'], $config['pipeline_code']);

        if (!$report) {
          Notification::make()->title('Ошибка анализа дерева')->danger()->send();
          return;
        }

        if ($arguments['action'] === 'activate' && !$report['is_valid']) {
          Notification::make()
            ->title('Невозможно активировать')
            ->body('В дереве есть незаполненные обязательные элементы.')
            ->danger()
            ->send();
          return;
        }

        $status = $arguments['action'] === 'activate';
        $validator->toggleTreeActiveStatus($report, $status);

        Notification::make()
          ->title($status ? 'Конфигурация активирована' : 'Конфигурация скрыта с сайта')
          ->success()
          ->send();
      });
  }
}
