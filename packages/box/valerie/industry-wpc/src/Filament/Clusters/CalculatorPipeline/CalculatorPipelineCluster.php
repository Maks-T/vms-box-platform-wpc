<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Filament\Clusters\CalculatorPipeline;

use BackedEnum;
use Filament\Clusters\Cluster;
use Filament\Support\Icons\Heroicon;

class CalculatorPipelineCluster extends Cluster
{

  protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquares2x2;

  protected static ?int $navigationSort = 3;

  public static function getNavigationLabel(): string
  {
    return __('Binding Master');
  }

  public static function getClusterBreadcrumb(): ?string
  {
    return __('Binding Master');
  }

  public static function getNavigationGroup(): ?string
  {
    return __('Calculator Settings');
  }
}
