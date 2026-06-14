<div style="display: flex; align-items: center; gap: 12px; width: 100%; overflow: hidden;">
  @if($imageUrl)
    <img
      src="{{ $imageUrl }}"
      style="width: 36px; height: 36px; min-width: 36px; border-radius: 4px; object-fit: cover; border: 1px solid #e5e7eb; flex-shrink: 0;"
      alt="img"
    />
  @endif

  <div style="display: flex; flex-direction: column; overflow: hidden;">
    <span style="font-weight: 500; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: inherit;">
      {{ $name }}
    </span>
    <span style="font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
      ID: {{ $id }}
    </span>
  </div>
</div>
