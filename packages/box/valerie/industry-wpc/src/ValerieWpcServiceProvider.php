<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class ValerieWpcServiceProvider extends ServiceProvider
{
  public function register(): void
  {
    // Регистрация специфичных сервисов индустрии камня
  }

  public function boot(): void
  {
    $this->loadJsonTranslationsFrom(__DIR__ . '/../lang');
    $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');
    $this->loadViewsFrom(__DIR__ . '/../resources/views', 'valerie-wpc');

    $this->registerApiRoutes();
  }

  protected function registerApiRoutes(): void
  {
    if (!$this->app->routesAreCached()) {
      Route::prefix('api/v1')
        ->middleware(['api', \Nicole\Box\Core\Http\Middleware\EnforceChannelContext::class])
        ->group(__DIR__ . '/../routes/api.php');
    }

    if ($this->app->runningInConsole()) {
      $modules = config('nicole.import_modules', []);
      $modules[] = \Valerie\Box\IndustryWpc\Importers\WpcPipelineImporter::class;
      config(['nicole.import_modules' => $modules]);
    }

  }
}
