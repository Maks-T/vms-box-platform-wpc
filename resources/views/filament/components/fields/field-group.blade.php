@props(['field', 'depth'])

@php
  $children   = $field['children'] ?? [];
  $childCount = count($children);
  $label      = $field['label'] ?? 'Группа элементов';

  $hasError = collect($children)->contains(fn($c) => !($c['is_valid'] ?? false) || !($c['has_config'] ?? false));

  $status = [
      'color' => $hasError ? 'var(--danger-500)' : 'var(--success-500)',
      'bg'    => $hasError ? 'var(--danger-50)' : 'var(--success-50)',
  ];
@endphp

<div class="relative mt-2 mb-4 ml-6 mr-2 sm:mr-4">

  <div class="absolute -left-6 -top-5 border-l-2 border-dotted border-gray-300"
       style="bottom: calc(100% - 20px);"></div>
  <div class="absolute w-6 top-5 -left-6 border-t-2 border-dotted border-gray-300"></div>

  <div x-data="{ isGroupOpen: true }"
       class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-300 border-l-4"
       style="border-left-color: {{ $status['color'] }};">

    <div @click="isGroupOpen = !isGroupOpen"
         class="flex items-center justify-between p-2.5 cursor-pointer transition-colors border-b border-gray-200"
         style="background-color: {{ $status['bg'] }};">
      <div class="flex items-center gap-2">
        <x-filament::icon icon="heroicon-m-folder-open" class="w-5 h-5" style="color: {{ $status['color'] }};"
                          x-show="isGroupOpen"/>
        <x-filament::icon icon="heroicon-m-folder" class="w-5 h-5" style="color: {{ $status['color'] }};"
                          x-show="!isGroupOpen"/>
        <span class="text-sm font-bold uppercase tracking-wider"
              style="color: {{ $status['color'] }};">{{ $label }}</span>
        <span class="text-xs px-2 py-0.5 rounded-full bg-white border font-bold shadow-sm"
              style="color: {{ $status['color'] }}; border-color: {{ $status['color'] }};">{{ $childCount }} шт.</span>
      </div>
      <div class="flex items-center gap-3">
        @if($hasError)
          <x-filament::badge color="danger" size="sm">Ошибки внутри</x-filament::badge>
        @endif
        <x-filament::icon icon="heroicon-m-chevron-down" class="w-4 h-4 transition-transform duration-200"
                          style="color: {{ $status['color'] }};" x-bind:class="{ '-rotate-90': !isGroupOpen }"/>
      </div>
    </div>

    <div x-show="isGroupOpen" x-collapse>
      <div class="p-3 sm:p-4 pb-4 flex flex-col gap-4 relative bg-gray-50">
        @foreach($children as $childIndex => $childNode)
          <div class="pl-4 pb-2 mr-2 border-l-2 border-gray-200">
            @include('valerie-wpc::filament.components.tree-node',[
                'node'       => $childNode,
                'isRoot'     => false,
                'depth'      => $depth + 1,
                'blockTitle' => "Элемент #" . ($childIndex + 1),
                'inGroup'    => true
            ])
          </div>
        @endforeach
      </div>
    </div>
  </div>
</div>
