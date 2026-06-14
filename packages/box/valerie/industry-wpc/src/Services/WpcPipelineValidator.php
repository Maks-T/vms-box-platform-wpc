<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Services;

use Nicole\Box\Core\Models\BindingRule;
use Nicole\Box\Core\Models\Pipeline;
use Nicole\Box\Core\Models\ProductVariant;

class WpcPipelineValidator
{
  // Запуск анализа дерева привязок от любого корневого элемента
  public function analyzeTree(int $rootVariantId, string $pipelineCode): ?array
  {
    $pipeline = Pipeline::where('external_code', $pipelineCode)->first();

    if (!$pipeline) {
      return null;
    }

    return $this->analyzeNode($rootVariantId, $pipeline->id);
  }

  // Рекурсивный обход узла дерева
  private function analyzeNode(int $variantId, int $pipelineId): array
  {
    // Подгружаем модификацию с картинками
    $variant = ProductVariant::with(['media', 'product.media', 'product.type'])->find($variantId);

    $imageUrl = $variant?->getPreviewUrl();
    $productType = $variant?->product?->type;

    // Извлекаем схему разрешенных слотов привязки из мета-данных типа товара
    $slotsSchema = $productType?->meta['calc_slots'] ?? [];

    $isNodeValid = true;
    $fieldReports = [];

    // Обходим каждый слот из схемы (например: startClip, baseClip, joist)
    foreach ($slotsSchema as $slot) {
      $role = $slot['role'];

      // Ищем привязку в системной таблице binding_rules для этого слота
      $rule = BindingRule::where('pipeline_id', $pipelineId)
        ->where('parent_type', (new ProductVariant())->getMorphClass())
        ->where('parent_id', $variantId)
        ->where('conditions->role', $role)
        ->first();

      $isFieldFilled = !empty($rule?->child_id);

      // Если обязательный слот не заполнен — помечаем узел как ошибочный
      if (($slot['is_required'] ?? false) && !$isFieldFilled) {
        $isNodeValid = false;
      }

      $fieldReport = [
        'field_id' => $role,
        'field_code' => $role,
        'label' => $slot['label'] ?? $role,
        'is_required' => (bool)($slot['is_required'] ?? false),
        'is_filled' => $isFieldFilled,
        'value' => $isFieldFilled ? $rule->child->name : null,
        'is_valid' => true,
        'children' => [],
      ];

      // Если привязка есть — рекурсивно анализируем привязанный дочерний элемент
      if ($isFieldFilled) {
        $childId = (int)$rule->child_id;
        $childAnalysis = $this->analyzeNode($childId, $pipelineId);

        $fieldReport['children'][] = $childAnalysis;

        // Если в глубине дочернего дерева есть ошибки — наверх тоже транслируем ошибку
        if (!$childAnalysis['is_valid']) {
          $fieldReport['is_valid'] = false;
          $isNodeValid = false;
        }
      } elseif ($slot['is_required'] ?? false) {
        $fieldReport['is_valid'] = false;
      }

      $fieldReports[] = $fieldReport;
    }

    // Возвращаем плоскую структуру, идеально совместимую со старыми Blade-шаблонами Letomarket
    return [
      'variant_id' => $variantId,
      'variant_name' => $variant ? $variant->name : "ID: {$variantId}",
      'image_url' => $imageUrl,
      'group_id' => $productType?->id ?? 0,
      'group_name' => $productType ? (string)$productType->name : 'Комплектующие',
      'has_config' => !empty($slotsSchema),
      'is_valid' => $isNodeValid,
      'fields' => $fieldReports,
      'product_slug' => $variant?->product?->slug,
    ];
  }

  // Каскадное переключение активности на сайте для всего дерева привязок
  public function toggleTreeActiveStatus(array $node, bool $status): void
  {
    ProductVariant::where('id', $node['variant_id'])->update(['is_active' => $status]);

    if (!empty($node['fields'])) {
      foreach ($node['fields'] as $field) {
        if (!empty($field['children'])) {
          foreach ($field['children'] as $childNode) {
            $this->toggleTreeActiveStatus($childNode, $status);
          }
        }
      }
    }
  }

}
