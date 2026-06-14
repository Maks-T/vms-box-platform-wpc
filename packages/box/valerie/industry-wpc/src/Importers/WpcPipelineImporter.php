<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Importers;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Nicole\Box\Core\Importers\Contracts\ImportModuleInterface;
use Nicole\Box\Core\Models\BindingRule;
use Nicole\Box\Core\Models\Pipeline;
use Nicole\Box\Core\Models\ProductVariant;

class WpcPipelineImporter implements ImportModuleInterface
{
  public function getName(): string
  {
    return 'WPC Universal Pipelines and Binding Rules';
  }

  public function run(array $settings, array $data, Command $command): void
  {
    $command->info('Старт импорта пайплайнов и привязок ДПК...');

    // 1. Создаем или находим базовые конвейеры калькулятора (Терраса и Ограждения)
    $pipelineMap = $this->ensureBasePipelines();

    // 2. Ищем и загружаем файл плоских привязок
    // Проверяем оба варианта имени файла (import_pipelines.json и import_calculator_pipelines.json) для надежности
    $filePath = base_path('import/import_pipelines.json');
    if (!File::exists($filePath)) {
      $filePath = base_path('import/import_calculator_pipelines.json');
    }

    if (!File::exists($filePath)) {
      $command->warn('  ⚠ Пропущено: Файл привязок ДПК не найден в папке import/.');
      return;
    }

    $flatRules = json_decode(File::get($filePath), true);

    if (empty($flatRules)) {
      $command->warn('  ⚠ Пропущено: Файл привязок ДПК пуст.');
      return;
    }

    // Кэшируем все существующие модификации (SKU) по их внешним кодам, чтобы не перегружать СУБД запросами
    $variantMap = ProductVariant::pluck('id', 'external_code')->toArray();
    $morphClass = (new ProductVariant())->getMorphClass();

    // Запускаем красивый прогресс-бар в консоли деплоя
    $bar = $command->getOutput()->createProgressBar(count($flatRules));
    $importedCount = 0;

    foreach ($flatRules as $rule) {
      $pipelineId = $pipelineMap[$rule['pipeline_code']] ?? null;
      $parentId = $variantMap[$rule['parent_external_code']] ?? null;
      $childId = $variantMap[$rule['child_external_code']] ?? null;

      // Если родитель или дочерний элемент не найдены в базе (например, товар был исключен как неликвид) — безопасно пропускаем
      if (!$pipelineId || !$parentId || !$childId) {
        $bar->advance();
        continue;
      }

      // Связываем элементы через системную таблицу binding_rules ядра VMS-NC
      BindingRule::updateOrCreate(
        [
          'pipeline_id' => $pipelineId,
          'parent_type' => $morphClass,
          'parent_id' => $parentId,
          'child_type' => $morphClass,
          'child_id' => $childId,
          'conditions->role' => $rule['role'] // Сохраняем системную роль привязки
        ],
        [
          'conditions' => [
            'role' => $rule['role']
          ],
          'quantity_formula' => (string)($rule['quantity_formula'] ?? '1'), // По умолчанию количество равно 1
          'is_required' => (bool)$rule['is_required'],
          'sort_order' => (int)$rule['sort_order'],
        ]
      );

      $importedCount++;
      $bar->advance();
    }

    $bar->finish();
    $command->line('');
    $command->info("Успешно импортировано привязок в системную таблицу binding_rules: {$importedCount}");
  }

  /**
   * Создает или находит системные пайплайны ДПК
   */
  private function ensureBasePipelines(): array
  {
    $pipelines = [
      'terrace' => [
        'name' => ['ru' => 'Терраса из ДПК', 'en' => 'WPC Terrace'],
        'industry' => 'decking',
      ],
      'fence' => [
        'name' => ['ru' => 'Ограждения из ДПК', 'en' => 'WPC Fences'],
        'industry' => 'decking',
      ],
    ];

    $map = [];
    foreach ($pipelines as $code => $p) {
      $model = Pipeline::updateOrCreate(
        ['external_code' => $code],
        [
          'name' => $p['name'],
          'industry' => $p['industry'],
          'is_active' => true,
        ]
      );
      $map[$code] = $model->id;
    }

    return $map;
  }
}
