@php
    use Valerie\Box\IndustryWpc\Support\WpcPdfDataHelper;

    $section = $order->sections->first();
    $stats = $section ? WpcPdfDataHelper::extractTerraceStats($section) : [];
    $terraceLayoutImage = $section ? WpcPdfDataHelper::resolveTerraceLayoutImage($section, $order) : null;
@endphp

<div class="page">
    <div class="top-gradient-line"></div>

    {{-- Шапка --}}
    @include('valerie-wpc::pdf.partials.header', ['theme' => 'light'])

    {{-- Основной контент страницы --}}
    <div class="page-content page-content-about">
        <h2 class="about-title">О расчёте</h2>

        <div class="about-content-stack">
            {{-- 1. Рамка с SVG-чертежом террасы --}}
            <div class="schematic-card">
                @if (!empty($terraceLayoutImage))
                    <img src="{{ $terraceLayoutImage }}" alt="Схема террасы" class="schematic-img" />
                @endif
            </div>

            {{-- 2. Сетка из 4 параметров --}}
            <div class="stats-grid-4">
                @foreach($stats as $st)
                    <div class="stat-card">
                        <div class="stat-val">{{ $st['val'] }}</div>
                        <div class="stat-lbl">{{ $st['lbl'] }}</div>
                    </div>
                @endforeach
            </div>

            {{-- 3. Описательный текст --}}
            <div class="about-desc-text">
                Благодарим за интерес к террасным решениям VISTEGRA. Ниже — расчёт материалов для {{ mb_strtolower($stats[2]['val'] ?? 'террасы') }},
                подобранных из коллекций POLIVAN GROUP: настил SINGARAJA с 3D-текстурой дерева и скрытым крепежом, а также
                ограждение DENPASAR — столбы, балясины и перила в цвете «Серый». Все изделия выполнены из ДПК на основе
                первичного полиэтилена HDPE и бамбуковой муки, с заводской гарантией 15 лет.
            </div>
        </div>
    </div>

    {{-- Подвал --}}
    @include('valerie-wpc::pdf.partials.footer', ['theme' => 'light', 'pageNum' => $pageNum, 'totalPages' => $totalPages])
</div>