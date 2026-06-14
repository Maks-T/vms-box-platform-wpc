@props(['node', 'isRoot' => false, 'depth' => 0, 'blockTitle' => null, 'inGroup' => false])

@php
  $hasConfig = $node['has_config'] ?? false;
  $isValid   = $node['is_valid'] ?? false;

  $status = match(true) {
      !$hasConfig => [
          'color'     => 'var(--warning-500)',
          'bg'        => 'var(--warning-50)',
          'badge'     => 'warning',
          'badgeText' => 'Требует связи',
          'btnColor'  => 'warning',
          'btnLabel'  => 'Создать связь',
      ],
      !$isValid => [
          'color'     => 'var(--danger-500)',
          'bg'        => 'var(--danger-50)',
          'badge'     => 'danger',
          'badgeText' => 'Есть ошибки',
          'btnColor'  => 'danger',
          'btnLabel'  => 'Исправить',
      ],
      default => [
          'color'     => 'var(--success-500)',
          'bg'        => 'var(--success-50)',
          'badge'     => 'success',
          'badgeText' => 'Заполнено',
          'btnColor'  => $isRoot ? 'primary' : 'gray',
          'btnLabel'  => $isRoot ? 'Изменить' : 'Настроить',
      ],
  };

  $title     = $blockTitle ?? $node['group_name'] ?? 'Неизвестная группа';
  $name      = $node['variant_name'] ?? 'Не выбран';
  $variantId = $node['variant_id'] ?? '';
  $slug      = $node['product_slug'] ?? null;
  $imageUrl  = $node['image_url'] ?? null;
  $fields    = $node['fields'] ?? [];
  $hasFields = count($fields) > 0;
@endphp

<div class="relative {{ $inGroup ? 'mb-3 last:mb-0' : 'mb-4' }} {{ (!$isRoot && !$inGroup) ? 'ml-8' : '' }}">

  @if(!$isRoot && !$inGroup)
    <div class="absolute -left-6 -top-8 border-l-2 border-dotted border-gray-300"
         style="bottom: calc(100% - 24px);"></div>
    <div class="absolute w-6 top-6 -left-6 border-t-2 border-dotted border-gray-300"></div>
  @endif

  <div x-data="{ isCollapsed: false }"
       class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 border-l-4"
       style="border-left-color: {{ $status['color'] }};">

    <div @click="isCollapsed = !isCollapsed"
         class="flex items-center justify-between p-3 cursor-pointer transition gap-2 hover:bg-gray-100 bg-gray-50 border-b border-gray-200">
      <div class="flex items-center gap-2 min-w-0 pr-2">
        <x-filament::icon icon="heroicon-m-chevron-right"
                          class="w-4 h-4 shrink-0 transition-transform duration-200"
                          style="color: {{ $status['color'] }};" x-bind:class="{ 'rotate-90': !isCollapsed }"/>
        <span class="text-sm font-bold truncate" style="color: {{ $status['color'] }};">{{ $title }}</span>
      </div>
      <div class="shrink-0 ml-auto" @click.stop>
        <x-filament::badge :color="$status['badge']">{{ $status['badgeText'] }}</x-filament::badge>
      </div>
    </div>

    <div x-show="!isCollapsed" x-collapse>
      <div class="p-4 flex flex-col gap-4">

        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="flex items-start gap-3">
            @if($imageUrl)
              <img src="{{ $imageUrl }}" alt="img"
                   class="w-10 h-10 rounded-md object-cover border border-gray-200 shrink-0"/>
            @else
              <div class="w-10 h-10 rounded-md shrink-0 flex items-center justify-center border border-gray-200 bg-gray-50">
                <x-filament::icon icon="heroicon-m-cube" class="w-6 h-6"
                                  style="color: {{ $status['color'] }};"/>
              </div>
            @endif
            <div class="flex flex-col mt-0.5">
              <span class="text-xs font-semibold text-gray-500 tracking-wider">ID: {{ $variantId }}</span>

              <div class="flex items-start gap-2 mt-0.5">
                <span class="text-sm font-bold leading-tight text-gray-900">{{ $name }}</span>

                @if($slug)
                  <a href="{{ route('product.show', $slug) }}" target="_blank"
                     class="shrink-0 text-gray-400 hover:text-primary-600 transition"
                     title="Открыть товар на сайте">
                    <x-filament::icon icon="heroicon-m-arrow-top-right-on-square"
                                      class="w-4 h-4 mt-0.5"/>
                  </a>
                @endif
              </div>

            </div>
          </div>
          <div class="shrink-0 mt-2 sm:mt-0">
            @if($hasFields || !$hasConfig)
              <x-filament::button
                wire:click="mountAction('configureNode', { variant_id: {{ $node['variant_id'] }}, group_id: {{ $node['group_id'] }} })"
                size="sm" :color="$status['btnColor']" :outlined="$status['btnColor'] === 'gray'">
                {{ $status['btnLabel'] }}
              </x-filament::button>
            @endif
          </div>
        </div>

        @if($hasFields)
          <div class="flex flex-col gap-3 mt-1 relative ml-2 pl-4 pr-2 sm:pr-4 pb-2 border-l-2 border-gray-100">
            @foreach($fields as $field)
              @php
                $childCount = count($field['children'] ?? []);
              @endphp

              @if($childCount === 0)
                @include('valerie-wpc::filament.components.fields.field-text', ['field' => $field])
              @elseif($childCount > 1 || ($field['type'] ?? '') === 'multiselect')
                @include('valerie-wpc::filament.components.fields.field-group', ['field' => $field, 'depth' => $depth])
              @else
                @include('valerie-wpc::filament.components.fields.field-single', ['field' => $field, 'depth' => $depth])
              @endif
            @endforeach
          </div>
        @endif

      </div>
    </div>
  </div>
</div>
