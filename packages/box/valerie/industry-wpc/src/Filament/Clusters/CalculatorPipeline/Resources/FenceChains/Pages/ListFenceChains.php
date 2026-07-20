<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\FenceChains\Pages;

use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\FenceChains\FenceChainResource;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Pages\ManagePipelineChains;

class ListFenceChains extends ManagePipelineChains
{
  protected static string $resource = FenceChainResource::class;

  protected function getPipelineType(): string
  {
    return 'fence';
  }

  protected function getTypeCode(): string
  {
    return 'pillar';
  }

  protected function getRootLabel(): string
  {
    return __('Pillar');
  }
}
