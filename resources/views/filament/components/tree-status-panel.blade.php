@props(['variantId', 'isValid', 'isRootActive'])

@php
  if ($isRootActive) {
      $colorVar = 'var(--success-500)';
      $bgVar = 'var(--success-50)';
      $textVar = 'var(--success-700)';
      $icon = 'heroicon-s-rocket-launch';
      $title = 'Цепочка опубликована на сайте';
      $desc = 'Конфигурация полностью готова и доступна в калькуляторе.';
      $btnLabel = 'Скрыть с сайта';
      $btnColor = 'danger';
      $btnIcon = 'heroicon-m-eye-slash';
      $action = 'deactivate';
  } elseif ($isValid) {
      $colorVar = 'var(--warning-500)';
      $bgVar = 'var(--warning-50)';
      $textVar = 'var(--warning-700)';
      $icon = 'heroicon-s-document-check';
      $title = 'Дерево собрано верно';
      $desc = 'Цепочка готова, но пока скрыта. Вы можете опубликовать её.';
      $btnLabel = 'Опубликовать';
      $btnColor = 'success';
      $btnIcon = 'heroicon-m-rocket-launch';
      $action = 'activate';
  } else {
      $colorVar = 'var(--danger-500)';
      $bgVar = 'var(--danger-50)';
      $textVar = 'var(--danger-700)';
      $icon = 'heroicon-s-exclamation-triangle';
      $title = 'Требуется настройка конфигурации';
      $desc = 'Для публикации заполните все обязательные элементы (отмечены красным).';
      $btnLabel = 'Опубликовать';
      $btnColor = 'success';
      $btnIcon = 'heroicon-m-rocket-launch';
      $action = 'activate';
  }
@endphp

<div class="fi-section rounded-xl shadow-sm ring-1 ring-gray-950/5 mb-6 overflow-hidden bg-white">
  <div
    class="flex flex-row items-center justify-between gap-4 p-4 sm:p-5 border-l-4"
    style="border-color: {{ $colorVar }}; background-color: {{ $bgVar }};"
  >
    <div class="flex items-center gap-4">
      <x-filament::icon :icon="$icon" class="h-8 w-8 shrink-0" style="color: {{ $colorVar }};" />
      <div class="flex flex-col">
        <h3 class="text-base font-bold leading-tight" style="color: {{ $textVar }};">{{ $title }}</h3>
        <p class="text-xs sm:text-sm text-gray-700 mt-0.5">{{ $desc }}</p>
      </div>
    </div>
    <div class="shrink-0 ml-auto">
      <x-filament::button
        wire:click="mountAction('activateTree', { variant_id: {{ $variantId }}, action: '{{ $action }}' })"
        :color="$btnColor"
        :icon="$btnIcon"
        :disabled="!$isValid && !$isRootActive"
      >
        {{ $btnLabel }}
      </x-filament::button>
    </div>
  </div>
</div>
