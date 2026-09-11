@php
    use Valerie\Box\IndustryWpc\Support\WpcPdfDataHelper;

    $coverPhotoBase64 = WpcPdfDataHelper::resolveCoverImage();
    $coverLogoBase64  = WpcPdfDataHelper::resolveLogo(true);

    $section = $order->sections->first();
    $stats = $section ? WpcPdfDataHelper::extractTerraceStats($section) : [];

    $terraceForm = $stats[2]['val'] ?? 'Прямоугольная';
    $terraceArea = $stats[0]['val'] ?? '—';
    $terracePerimeter = $stats[1]['val'] ?? '—';
    $customerName = $order->customer?->full_name ?? 'Частный клиент';
@endphp

<div class="page page-cover">
    <div class="top-gradient-line"></div>

    {{-- Верхнее фото террасы --}}
    <div class="cover-photo-container">
        @if (!empty($coverPhotoBase64))
            <img src="{{ $coverPhotoBase64 }}" alt="Cover Photo" class="cover-photo-img" />
        @endif
        <div class="cover-photo-gradient"></div>
    </div>

    {{-- Строгий полиграфический контент --}}
    <div class="cover-content">

        {{-- Верхняя строка: Логотип + Номер КП --}}
        <div class="cover-top-row">
            @if(!empty($coverLogoBase64))
                <img src="{{ $coverLogoBase64 }}" alt="Logo" class="cover-logo-img" />
            @else
                <span class="cover-brand-title">{{ config('nicole.company.name', 'GREENDECKS') }}</span>
            @endif

            <div class="cover-doc-meta">
                <span class="cover-doc-code">КП № {{ $order->code }}</span>
                <span class="cover-doc-date">{{ $order->created_at ? $order->created_at->format('d.m.Y') : date('d.m.Y') }}</span>
            </div>
        </div>

        {{-- Заголовок документа --}}
        <div class="cover-title-block">
            <h1 class="cover-title">
                Коммерческое<br/>
                <span class="cover-title-accent">предложение</span>
            </h1>
        </div>

        {{-- Полиграфическая сетка параметров (без серых пузырей) --}}
        <div class="cover-meta-grid">
            <div class="cover-meta-item">
                <span class="cover-meta-label">Заказчик</span>
                <span class="cover-meta-value">{{ $customerName }}</span>
            </div>

            <div class="cover-meta-item">
                <span class="cover-meta-label">Форма террасы</span>
                <span class="cover-meta-value">{{ $terraceForm }}</span>
            </div>

            <div class="cover-meta-item">
                <span class="cover-meta-label">Площадь настила</span>
                <span class="cover-meta-value">{{ $terraceArea }}</span>
            </div>

            <div class="cover-meta-item">
                <span class="cover-meta-label">Периметр</span>
                <span class="cover-meta-value">{{ $terracePerimeter }}</span>
            </div>
        </div>

        {{-- Лаконичная нижняя плашка стоимости --}}
        <div class="cover-bottom-row">
            <div class="cover-price-card">
                <div class="cover-price-left">
                    <span class="cover-price-label">Общая стоимость материалов</span>
                    <span class="cover-price-sublabel">Комплектация под ключ по проекту</span>
                </div>
                <div class="cover-price-val">
                    {{ WpcPdfDataHelper::formatPrice($order->grand_total, $order->currency) }}
                </div>
            </div>
        </div>

    </div>
</div>