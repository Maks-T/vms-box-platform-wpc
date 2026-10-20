<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Контроллер монтирования страницы конфигуратора ДПК (WPC).
 *
 * @since 2026-09-06
 */
class CalculatorController
{
  /**
   * Отображение страницы калькулятора террас.
   */
  public function show(Request $request): Response
  {
    $widgetSlug = 'calculator-app';
    $assets = $this->getAssets($widgetSlug);

    $user = auth()->user();
    $code = $request->query('code') ?? $request->query('orderCode');

    // Получаем список названий ролей строго строками
    $roles = [];
    if ($user) {
      if (method_exists($user, 'getRoleNames')) {
        $roles = $user->getRoleNames()->values()->toArray();
      } elseif (isset($user->roles)) {
        $roles = collect($user->roles)->pluck('name')->filter()->values()->toArray();
      }
    }

    $initialData = [
      'apiUrl' => rtrim((string) config('app.url'), '/') . '/api',
      'assetsUrl' => rtrim(config('app.url') . '/storage', '/'),
      'baseUrl' => config('app.url'),
      'policyLink' => config('nicole.policy_link', '#'),
      'ofertaLink' => config('nicole.oferta_link', '#'),
      'auth' => [
        'client' => null,
        'employee' => $user ? [
          'id' => (int) $user->id,
          'name' => (string) $user->name,
          'email' => (string) $user->email,
          'roles' => array_values(array_map('strval', $roles)),
        ] : [
          'id' => null,
          'name' => 'Гость',
          'email' => '',
          'roles' => [],
        ],
      ],
      'type' => 'terrace',
    ];

    if (!empty($code)) {
      $initialData['orderCode'] = (string) $code;
    }

    return Inertia::render('Calculator/Show', [
      'assets' => $assets,
      'initialData' => $initialData,
      'currentType' => 'terrace',
    ]);
  }

  /**
   * Поиск собранных бандлов JS и CSS в манифесте виджета.
   */
  protected function getAssets(string $widgetSlug): array
  {
    $manifestPath = public_path($widgetSlug . '/manifest.json');

    if (!file_exists($manifestPath)) {
      return ['js' => null, 'css' => null];
    }

    $manifest = json_decode((string) file_get_contents($manifestPath), true);
    if (!is_array($manifest)) {
      return ['js' => null, 'css' => null];
    }

    $jsFile = null;
    $cssFile = null;

    foreach ($manifest as $key => $path) {
      if (str_ends_with($key, '.js') && (str_starts_with($key, 'main') || str_starts_with($key, 'index'))) {
        $jsFile = str_starts_with($path, '/') ? $path : url($widgetSlug . '/' . $path);
      }

      if (str_ends_with($key, '.css') && (str_starts_with($key, 'main') || str_starts_with($key, 'index'))) {
        $cssFile = str_starts_with($path, '/') ? $path : url($widgetSlug . '/' . $path);
      }
    }

    return [
      'js' => $jsFile,
      'css' => $cssFile,
    ];
  }
}