<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc;

use Illuminate\Support\ServiceProvider;
use Valerie\Box\IndustryWpc\Providers\RouteServiceProvider;
use Valerie\Box\IndustryWpc\Providers\PipelineServiceProvider;

class ValerieWpcServiceProvider extends ServiceProvider
{
  public function register(): void
  {
    $this->loadJsonTranslationsFrom(__DIR__ . '/../lang');

    // Регистрируем дочерние провайдеры
    $this->app->register(PipelineServiceProvider::class);
    $this->app->register(RouteServiceProvider::class);
  }

  public function boot(): void
  {
    $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

    // Регистрируем вью-шаблоны под префиксом valerie-wpc::
    $this->loadViewsFrom(__DIR__ . '/../resources/views', 'valerie-wpc');
  }

}
