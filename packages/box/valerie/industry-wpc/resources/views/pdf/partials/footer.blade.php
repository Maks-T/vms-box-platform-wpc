@php
    $isDark = ($theme ?? 'light') === 'dark';
    $site = config('nicole.company.website', config('nicole.company.website_label', 'greendecks.kz'));
    $address = config('nicole.company.address', 'г. Астана, ул. Өндіріс 12/2');
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