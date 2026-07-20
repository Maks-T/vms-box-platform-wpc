<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\TerraceChains\Pages;

use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Resources\TerraceChains\TerraceChainResource;
use Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline\Shared\Pages\ManagePipelineChains;

class ListTerraceChains extends ManagePipelineChains
{
  protected static string $resource = TerraceChainResource::class;

  protected function getPipelineType(): string
  {
    return 'terrace';
  }

  protected function getTypeCode(): string
  {
    return 'terraceBoard';
  }

  protected function getRootLabel(): string
  {
    return __('Terrace Board');
  }
}
