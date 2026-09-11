@php
    use Valerie\Box\IndustryWpc\Support\WpcPdfDataHelper;

    $section = $order->sections->first();
    $stats = $section ? WpcPdfDataHelper::extractTerraceStats($section) : [];
    $terraceLayoutImage = $section ? WpcPdfDataHelper::resolveTerraceLayoutImage($section, $order) : null;
    $companyName = config('nicole.company.name', 'GREENDECKS');
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

            {{-- 3. Описательный текст с брендом Greendecks --}}
            <div class="about-desc-text">
                Благодарим за интерес к террасным решениям {{ $companyName }}. Ниже — расчёт материалов для {{ mb_strtolower($stats[2]['val'] ?? 'террасы') }},
                подобранных из коллекций {{ $companyName }}: долговечный настил из ДПК с выразительной фактурой дерева и скрытым крепежом, а также
                комплектующие и элементы обрамления. Изделия выполнены из экологичного композита, устойчивы к влаге и перепадам температур, с заводской гарантией 25 лет.
            </div>
        </div>
    </div>

    {{-- Подвал --}}
    @include('valerie-wpc::pdf.partials.footer', ['theme' => 'light', 'pageNum' => $pageNum, 'totalPages' => $totalPages])
</div>