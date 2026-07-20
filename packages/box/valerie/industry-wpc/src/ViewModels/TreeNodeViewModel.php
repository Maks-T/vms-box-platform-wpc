<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\ViewModels;

use Nicole\Box\Core\Models\ProductVariant;
use Nicole\Box\Core\Support\Calculator\PipelineRoleResolver;

class TreeNodeViewModel
{
  public string $variantId;
  public string $name;
  public ?string $slug;
  public ?string $imageUrl;
  public bool $isFilled;
  public bool $isValid;
  public array $status;
  public string $title;
  public array $fields;
  public bool $hasFields;

  public function __construct(array $node, bool $isRoot = false, ?string $blockTitle = null)
  {
    $currentLocale = app()->getLocale();

    $this->variantId = (string)($node['variant_id'] ?? ($node['child']['id'] ?? ''));
    $this->name      = $node['variant_name'] ?? ($node['child']['name'] ?? __('Not Selected'));
    $this->slug      = $node['product_slug'] ?? ($node['child']['slug'] ?? null);
    $this->imageUrl  = $node['image_url'] ?? ($node['child']['image_url'] ?? null);

    $isRequired = $node['is_required'] ?? false;
    $this->isFilled   = $isRoot ? true : (!empty($this->variantId));
    $this->isValid    = $node['is_valid'] ?? false;

    $this->status = match(true) {
      $this->isFilled && !$this->isValid => [
        'color'     => 'var(--danger-500)',
        'bg'        => 'var(--danger-50)',
        'badge'     => 'danger',
        'badgeText' => __('Has Errors'),
        'btnColor'  => 'danger',
        'btnLabel'  => __('Fix'),
      ],
      $isRequired && !$this->isFilled => [
        'color'     => 'var(--warning-500)',
        'bg'        => 'var(--warning-50)',
        'badge'     => 'warning',
        'badgeText' => __('Requires Link'),
        'btnColor'  => 'warning',
        'btnLabel'  => __('Create Link'),
      ],
      !$isRequired && !$this->isFilled => [
        'color'     => 'var(--gray-300)',
        'bg'        => 'var(--gray-50)',
        'badge'     => 'gray',
        'badgeText' => __('Optional'),
        'btnColor'  => 'gray',
        'btnLabel'  => __('Create Link'),
      ],
      default => [
        'color'     => 'var(--success-500)',
        'bg'        => 'var(--success-50)',
        'badge'     => 'success',
        'badgeText' => __('Completed'),
        'btnColor'  => 'gray',
        'btnLabel'  => __('Configure'),
      ],
    };

    $roleCode = $node['field_code'] ?? '';
    $industry = $node['pipeline_industry'] ?? 'wpc';

    $this->title = $blockTitle
      ?? ($node['label']
        ?? (PipelineRoleResolver::getLabel($industry, $roleCode) ?: ($node['group_name'] ?? __('Unknown Group'))));

    $this->fields    = $node['fields'] ?? ($node['children'] ?? []);
    $this->hasFields = count($this->fields) > 0;
  }

}
