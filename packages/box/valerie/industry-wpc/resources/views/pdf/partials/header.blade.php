@php
    use Valerie\Box\IndustryWpc\Support\WpcPdfDataHelper;

    $isDark = ($theme ?? 'light') === 'dark';
    $logoBase64 = WpcPdfDataHelper::resolveLogo($isDark);
    $companyName = config('nicole.company.name', 'GREENDECKS');
    $companyPhone = config('nicole.company.phone', '+7 (775) 172-07-63');
    $companyEmail = config('nicole.company.email', 'info@greendecks.kz');
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