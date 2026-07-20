<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc;

use Filament\Contracts\Plugin;
use Filament\Panel;

class ValerieWpcPlugin implements Plugin
{
  public function getId(): string
  {
    return 'valerie-box-industry-wpc';
  }

  public function register(Panel $panel): void
  {
    $panel->discoverResources(
      in: __DIR__.'/Filament/Resources',
      for: 'Valerie\\Box\\IndustryWpc\\Filament\\Resources',
    );

    $panel->discoverPages(
      in: __DIR__.'/Filament/Pages',
      for: 'Valerie\\Box\\IndustryWpc\\Filament\\Pages',
    );

    $panel->discoverClusters(
      in: __DIR__.'/Filament/Clusters',
      for: 'Valerie\\Box\\IndustryWpc\\Filament\\Clusters',
    );
  }

  public function boot(Panel $panel): void
  {
    //
  }

  public static function make(): static
  {
    return new static;
  }
}
