@props(['field'])

@php
  $label    = $field['label'] ?? 'Свойство';
  $value    = $field['value'] ?? null;
  $isFilled = $field['is_filled'] ?? false;
@endphp

<div class="flex items-center gap-2 py-1 ml-2">
  <span class="text-sm font-medium text-gray-500">{{ $label }}:</span>

  @if(!$isFilled)
    <x-filament::badge color="danger" size="sm">Требует связи</x-filament::badge>
  @else
    <span class="text-sm font-bold text-gray-900">{{ $value }}</span>
  @endif
</div>
