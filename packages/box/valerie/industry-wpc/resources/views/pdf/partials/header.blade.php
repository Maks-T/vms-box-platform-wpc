@php
    use Valerie\Box\IndustryWpc\Support\WpcPdfDataHelper;

    $isDark = ($theme ?? 'light') === 'dark';
    $logoBase64 = WpcPdfDataHelper::resolveLogo($isDark);
@endphp

<div class="pdf-header {{ $isDark ? 'pdf-header-dark' : '' }}">
    <div class="header-logo-box">
        @if(!empty($logoBase64))
            <img src="{{ $logoBase64 }}" alt="Vistegra" class="header-logo-img" />
        @else
            <span class="header-logo-text">{{ config('nicole.company.name', 'vistegra') }}</span>
        @endif
    </div>

    <div class="header-contacts-text">
        {{ config('nicole.company.phone', '+375 29 189 8322') }} · {{ config('nicole.company.email', 'info@vistegra.by') }}
    </div>
</div>