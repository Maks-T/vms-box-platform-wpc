<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc;

use Illuminate\Support\ServiceProvider;
use Valerie\Box\IndustryWpc\Providers\RouteServiceProvider;
use Valerie\Box\IndustryWpc\Providers\PipelineServiceProvider;
use Nicole\Box\Core\Support\OrderSectionFormatterResolver;
use Valerie\Box\IndustryWpc\Support\WpcTerraceSectionFormatter;

class ValerieWpcServiceProvider extends ServiceProvider
{
  public function register(): void
  {
    $this->loadJsonTranslationsFrom(__DIR__ . '/../lang');

    $this->app->register(PipelineServiceProvider::class);
    $this->app->register(RouteServiceProvider::class);

    // Регистрация форматтера террас ДПК в ядре
    // @since 2026-09-06
    if (class_exists(OrderSectionFormatterResolver::class)) {
      OrderSectionFormatterResolver::register('terrace', WpcTerraceSectionFormatter::class);
    }
  }

  public function boot(): void
  {
    $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');
    $this->loadViewsFrom(__DIR__ . '/../resources/views', 'valerie-wpc');
  }

}