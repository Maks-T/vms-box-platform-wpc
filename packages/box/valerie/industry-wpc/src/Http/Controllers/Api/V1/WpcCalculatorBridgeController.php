<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Nicole\Box\Core\Models\Attribute;
use Nicole\Box\Core\Models\AttributeOption;
use Nicole\Box\Core\Models\BindingRule;
use Nicole\Box\Core\Models\ComplexDictionary;
use Nicole\Box\Core\Models\Pipeline;
use Nicole\Box\Core\Models\Product;
use Nicole\Box\Core\Models\ProductVariant;
use Nicole\Box\Core\Services\PricingManager;
use Nicole\Box\Core\Services\Calculator\PipelineTreeService;

class WpcCalculatorBridgeController extends Controller
{

  public function products(Request $request): JsonResponse
  {

    $productCategory = $request->input('productCategory');
    $oIdsRaw = $request->input('offersId') ?: $request->input('OFFERS_ID');
    $oIds = $oIdsRaw ? array_filter(explode(',', (string)$oIdsRaw)) : [];
    $pIds = $request->input('productsId') ?: $request->input('PRODUCTS_ID');

    $query = Product::query()
      ->where('catalog_type', 'product')
      ->where('is_active', true);

    if (filled($productCategory)) {
      $query->whereHas('attributeValues', function ($q) use ($productCategory) {
        $q->whereHas('attribute', fn($attr) => $attr->where('code', 'product_calc_category'))
          ->whereHas('option', fn($opt) => $opt->where('slug', $productCategory));
      });
    }

    if (filled($pIds)) {
      $query->whereIn('id', array_filter(explode(',', (string)$pIds)));
    }

    if (!empty($oIds)) {
      $query->whereHas('variants', fn($q) => $q->whereIn('id', $oIds));
    }

    $products = $query->with([
      'category',
      'media',
      'linkedItems.child',
      'attributeValues.attribute',
      'attributeValues.option',
      'variants' => function ($q) use ($oIds) {
        $q->where('is_active', true)
          ->with(['media', 'prices.type', 'attributeValues.attribute', 'attributeValues.option.media']);
        if (!empty($oIds)) {
          $q->whereIn('id', $oIds);
        }
      }
    ])->get();

    $pricingManager = app(PricingManager::class);
    $locale = app()->getLocale();
    $formattedData = [];

    foreach ($products as $product) {
      $variants = [];

      foreach ($product->variants as $variant) {
        $colorOption = $variant->attributeValues->firstWhere('attribute.code', 'color')?->option;
        $colorMeta = $colorOption ? ($colorOption->settings ?? []) : [];
        $hexColor = $colorMeta['visual']['hex'] ?? null;
        $textureUrl = $colorOption ? $colorOption->getFirstMediaUrl('main') : null;

        $variants[] = [
          'id' => $variant->id,
          'product_id' => $product->id,
          'name' => $variant->getTranslation('name', $locale) ?: $variant->name,
          'code' => $variant->sku,
          'ms_id' => $variant->external_code,
          'external_code' => $variant->external_code,
          'price' => (float)$pricingManager->getVariantPrice($variant),
          'image_url' => $variant->getPreviewUrl() ?: $product->getPreviewUrl(),
          'color_name' => $colorOption ? $colorOption->getTranslation('value', $locale) : null,
          'color_slug' => $colorOption ? $colorOption->slug : null,
          'color_hex' => $hexColor,
          'color_texture_url' => $textureUrl ?: null,
        ];
      }

      $brand = $product->attributeValues->firstWhere('attribute.code', 'brand')?->value_string;
      $textureVal = $product->attributeValues->firstWhere('attribute.code', 'texture')?->option?->getTranslation('value', $locale);

      $length = $product->attributeValues->firstWhere('attribute.code', 'length_mm')?->value_numeric;
      $width = $product->attributeValues->firstWhere('attribute.code', 'width_mm')?->value_numeric;
      $height = $product->attributeValues->firstWhere('attribute.code', 'height_mm')?->value_numeric;


      $linked = [];
      if ($product->linkedItems) {
        foreach ($product->linkedItems as $linkedItem) {
          $linked[] = [
            'product_id' => $linkedItem->child_id,
            'quantity_formula' => $linkedItem->quantity_formula ?? '1',
          ];
        }
      }

      $formattedData[$product->id] = [
        'id' => $product->id,
        'name' => $product->getTranslation('name', $locale) ?: $product->name,
        'slug' => $product->slug,
        'article' => $product->code,
        'ms_id' => $product->external_code,
        'external_code' => $product->external_code,
        'min_price' => (float)$product->min_price,
        'image_url' => $product->getPreviewUrl(),
        'category_id' => $product->category_id,
        'category_name' => $product->category ? $product->category->getTranslation('name', $locale) : null,
        'category_slug' => $product->category?->slug,
        'brand' => $brand,
        'texture' => $textureVal,
        'calc_category' => $productCategory,
        'length_mm' => $length ? (int)$length : null,
        'width_mm' => $width ? (int)$width : null,
        'height_mm' => $height ? (int)$height : null,
        'detail_page_url' => url("/product/{$product->slug}"),
        'linked_products' => $linked,
        'linked_items' => $linked,
        'variants' => $variants,
      ];
    }

    return response()->json([
      'status' => 'success',
      'message' => 'Data retrieved successfully',
      'data' => $formattedData,
    ]);
  }

  /**
   * Сборка иерархического дерева связей Летомаркет на основе плоских binding_rules
   */
  public function config(string $type): JsonResponse
  {
    $pipelineCode = $type === 'fence' ? 'pl_fence' : 'pl_terrace';
    $pipeline = Pipeline::where('code', $pipelineCode)->firstOrFail();

    $rules = BindingRule::where('pipeline_id', $pipeline->id)->get();
    $output = [];

    $groupedByParent = $rules->groupBy('parent_id');

    foreach ($groupedByParent as $parentId => $parentRules) {
      $variant = ProductVariant::find($parentId);
      if (!$variant) continue;

      $parentTypeCode = $variant->product?->type?->code;
      if (!$parentTypeCode) continue;

      $jsGroupKey = match ($parentTypeCode) {
        'terraceBoard' => 'decking',
        'pillar' => 'pillars',
        'baluster' => 'balusters',
        'rail' => 'rails',
        'lath' => 'laths',
        'decorProducts' => 'decorProducts',
        'stepBoard' => 'stepBoards',
        'board' => 'universalBoards',
        default => $parentTypeCode
      };

      $values = [];
      $groupedByRole = $parentRules->groupBy('role');

      foreach ($groupedByRole as $role => $roleRules) {
        $childIds = [];
        $scalarValue = null;

        foreach ($roleRules as $rule) {
          if ($rule->child_id) {
            $childIds[] = $rule->child_id;
          } elseif (!empty($rule->static_meta)) {
            $scalarValue = head($rule->static_meta);
          }
        }

        if (!empty($childIds)) {
          $values[$role] = implode('_', $childIds);
        } elseif ($scalarValue !== null) {
          $values[$role] = (string)$scalarValue;
        }
      }

      $values['is_active'] = true;
      $output[$jsGroupKey][$parentId] = $values;
    }

    return response()->json($output);
  }

  public function settings(): JsonResponse
  {
    $dict = ComplexDictionary::where('code', 'calculator_settings')->with('records')->first();
    $settings = [];

    if ($dict) {
      foreach ($dict->records as $record) {
        $settings[$record->slug] = $record->meta['value'] ?? null;
      }
    }

    return response()->json($settings);
  }

  public function layouts(): JsonResponse
  {
    $dict = ComplexDictionary::where('code', 'calculator_layouts')->with('records')->first();
    $layouts = [];

    if ($dict) {
      foreach ($dict->records as $record) {
        $width = (string)($record->meta['width'] ?? '');
        $type = $record->meta['type'] ?? 'rec';

        $layouts[$width][$type] = [
          'width' => $width,
          'type' => $type,
          '3000&4000' => $record->meta['formula_3000_4000'] ?? '',
          '3000' => $record->meta['formula_3000'] ?? '',
          '4000' => $record->meta['formula_4000'] ?? '',
        ];
      }
    }

    return response()->json($layouts);
  }
}
