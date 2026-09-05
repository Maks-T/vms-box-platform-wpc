<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryWpc\Http\Controllers;

use Illuminate\Http\Request;
use Nicole\Box\Core\Models\Order;
use Nicole\Box\Core\Support\WidgetAssetHelper;
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

    // 1. Поиск заказа (по code или orderId)
    $orderCode = null;
    $state = null;

    if ($request->filled('code')) {
      $orderCode = (string)$request->input('code');
    } elseif ($request->filled('orderId')) {
      $order = Order::find($request->input('orderId'));
      $orderCode = $order?->code;
    }

    // 2. Получение авторизованного пользователя с fallback для гостей
    $user = auth()->user();

    $employee = [
      'id' => $user?->id ?? null,
      'name' => $user?->name ?? 'Гость / Клиент',
      'email' => $user?->email ?? 'guest@vms.local',
      'roles' => ($user && method_exists($user, 'getRoleNames'))
        ? $user->getRoleNames()->toArray()
        : ['guest'],
    ];

    // 3. Формирование initialData строго по схеме oliver-deck (InitialDataProps)
    $initialData = [
      'apiUrl' => config('app.url') . '/api',
      'auth' => [
        'employee' => $employee,
      ],
    ];

    // ВАЖНО: orderCode и state строго взаимоисключающие!
    if ($orderCode) {
      $initialData['orderCode'] = $orderCode;
    }

    return Inertia::render('Calculator/Show', [
      'assets' => $assets,
      'initialData' => $initialData,
      'currentType' => $type,
    ]);
  }

  /**
   * Получение скомпилированных ассетов из manifest.json
   */
  protected function getAssets(string $widgetSlug): array
  {
    $manifestPath = public_path($widgetSlug . '/manifest.json');

    if (!file_exists($manifestPath)) {
      return ['js' => null, 'css' => null];
    }

    $manifest = json_decode(file_get_contents($manifestPath), true) ?? [];

    $jsFile = null;
    $cssFile = null;

    // Ищем main.js / main.css в манифесте
    if (isset($manifest['main.js'])) {
      $path = $manifest['main.js'];
      $jsFile = str_starts_with($path, '/') ? $path : url($widgetSlug . '/' . $path);
    }

    if (isset($manifest['main.css'])) {
      $path = $manifest['main.css'];
      $cssFile = str_starts_with($path, '/') ? $path : url($widgetSlug . '/' . $path);
    }

    // Fallback перебором ключей, если манифест имеет другой формат
    if (!$jsFile || !$cssFile) {
      foreach ($manifest as $key => $path) {
        if (!$jsFile && str_ends_with($key, '.js') && (str_starts_with($key, 'main') || str_starts_with($key, 'index'))) {
          $jsFile = str_starts_with($path, '/') ? $path : url($widgetSlug . '/' . $path);
        }

        if (!$cssFile && str_ends_with($key, '.css') && (str_starts_with($key, 'main') || str_starts_with($key, 'index'))) {
          $cssFile = str_starts_with($path, '/') ? $path : url($widgetSlug . '/' . $path);
        }
      }
    }

    return [
      'js' => $jsFile,
      'css' => $cssFile,
    ];
  }
}