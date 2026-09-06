@php
    $isDark = ($theme ?? 'light') === 'dark';
    $site = config('nicole.company.website', config('nicole.company.website_label', 'polivan.com'));
    $address = config('nicole.company.address', 'Москва / Владивосток');
@endphp

<div class="pdf-footer {{ $isDark ? 'pdf-footer-dark' : '' }}">
    <div class="footer-cell-left">{{ $site }}</div>
    <div class="footer-cell-center">
        @if($isDark)
            {{ $address }}
        @else
            Коммерческое предложение
        @endif
    </div>
    <div class="footer-cell-right">
        @if($isDark)
            КП № {{ $order->code }} · {{ $pageNum ?? 5 }} / {{ $totalPages ?? 5 }}
        @else
            {{ $pageNum ?? 2 }} / {{ $totalPages ?? 5 }}
        @endif
    </div>
</div>