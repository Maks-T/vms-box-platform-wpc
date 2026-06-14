@props(['field', 'depth'])

@php
  $children = $field['children'] ?? [];
  $label    = $field['label'] ?? 'Поле';
@endphp

<div class="flex flex-col relative my-2 ml-6 mr-3 sm:mr-5">

  <div class="absolute -left-6 -top-4 border-l-2 border-dotted border-gray-300" style="bottom: calc(100% - 16px);"></div>
  <div class="absolute w-6 top-4 -left-6 border-t-2 border-dotted border-gray-300"></div>

  @foreach($children as $childNode)
    @include('valerie-wpc::filament.components.tree-node',[
        'node'       => $childNode,
        'isRoot'     => false,
        'depth'      => $depth + 1,
        'blockTitle' => $label,
        'inGroup'    => true
    ])
  @endforeach
</div>
