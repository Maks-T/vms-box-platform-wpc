<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Http\Controllers;

use Illuminate\Http\Request;
use Nicole\Box\Core\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class CalculatorController
{
  /**
   * Отображение страницы калькулятора ДПК (Террасы / Ограждения).
   */
  public function show(Request $request, string $type = 'terrace'): Response
  {
    $widgetSlug = 'calculator-app';

    $assets = $this->getAssets($widgetSlug);

    $state = null;
    $order = null;

    $user = auth()->user();

    $initialData = [
      'apiUrl' => config('app.url') . '/api/v1',

      'assetsUrl' => rtrim(config('app.url') . '/storage', '/'),
      'baseUrl' => config('app.url'),
      'policyLink' => config('nicole.policy_link', '#'),
      'ofertaLink' => config('nicole.oferta_link', '#'),
      'state' => $state,
      'auth' => [
        'client' => null,
        'employee' => $user ? [
          'id' => $user->id,
          'name' => $user->name,
          'email' => $user->email,
          'roles' => method_exists($user, 'getRoleNames')
            ? $user->getRoleNames()->toArray()
            : [],
        ] : null,
      ],
      'type' => $type,
    ];

    return Inertia::render('Calculator/Show', [
      'assets' => $assets,
      'initialData' => $initialData,
      'currentType' => $type,
    ]);
  }

  protected function getAssets(string $widgetSlug): array
  {
    $manifestPath = public_path($widgetSlug . '/manifest.json');

    if (!file_exists($manifestPath)) {
      return ['js' => null, 'css' => null];
    }

    $manifest = json_decode(file_get_contents($manifestPath), true);

    $jsFile = null;
    $cssFile = null;

    foreach ($manifest as $key => $path) {
      if (str_ends_with($key, '.js') && (str_starts_with($key, 'main') || str_starts_with($key, 'index'))) {
        $jsFile = str_starts_with($path, '/')
          ? $path
          : url($widgetSlug . '/' . $path);
      }

      if (str_ends_with($key, '.css') && (str_starts_with($key, 'main') || str_starts_with($key, 'index'))) {
        $cssFile = str_starts_with($path, '/')
          ? $path
          : url($widgetSlug . '/' . $path);
      }
    }

    return [
      'js' => $jsFile,
      'css' => $cssFile,
    ];
  }
}
