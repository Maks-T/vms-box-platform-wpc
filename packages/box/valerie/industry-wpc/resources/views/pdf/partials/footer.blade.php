@php
    $isDark = ($theme ?? 'light') === 'dark';
@endphp

<div class="pdf-footer {{ $isDark ? 'pdf-footer-dark' : '' }}">
    <div class="footer-cell-left">{{ config('nicole.company.website_label', 'vistegra.ru') }}</div>
    <div class="footer-cell-center">
        @if($isDark)
            {{ config('nicole.company.address', 'Могилев · ул. Космонавтов, д. 19, оф.316') }}
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