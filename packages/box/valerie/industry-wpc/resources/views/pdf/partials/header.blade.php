@php
    use Valerie\Box\IndustryWpc\Support\WpcPdfDataHelper;

    $isDark = ($theme ?? 'light') === 'dark';
    $logoBase64 = WpcPdfDataHelper::resolveLogo($isDark);
    $companyName = config('nicole.company.name', 'POLIVAN GROUP');
    $companyPhone = config('nicole.company.phone', '8 (800) 100-05-75');
    $companyEmail = config('nicole.company.email', 'info@polivan.com');
@endphp

<div class="pdf-header {{ $isDark ? 'pdf-header-dark' : '' }}">
    <div class="header-logo-box">
        @if(!empty($logoBase64))
            <img src="{{ $logoBase64 }}" alt="{{ $companyName }}" class="header-logo-img" />
        @else
            <span class="header-logo-text">{{ $companyName }}</span>
        @endif
    </div>

    <div class="header-contacts-text">
        {{ $companyPhone }} · {{ $companyEmail }}
    </div>
</div>