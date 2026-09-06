@php
    use Valerie\Box\IndustryWpc\Support\WpcPdfDataHelper;
@endphp

<div class="page">
    <div class="top-gradient-line"></div>
    @include('valerie-wpc::pdf.partials.header', ['theme' => 'light'])

    <div class="page-content page-content-estimate">
        @foreach($order->sections as $section)
            @php
                $estimateRows = array_slice($section->estimate ?? [], 1);
                $sectionTitle = mb_strtolower((string) $section->title);

                $displayTitle = str_contains($sectionTitle, 'террас')
                    ? 'Смета на террасу'
                    : (str_contains($sectionTitle, 'огражд') ? 'Смета на ограждения' : 'Смета на ' . $sectionTitle);
            @endphp

            <div class="estimate-block">
                {{-- Заголовок раздела с правильным склонением --}}
                <h2 class="estimate-section-title">{{ $displayTitle }}</h2>

                {{-- Таблица сметы --}}
                <div class="estimate-table-wrap">
                    {{-- Шапка таблицы --}}
                    <div class="estimate-table-head">
                        <div class="est-th-name">НАИМЕНОВАНИЕ</div>
                        <div class="est-th-qty">КОЛ-ВО</div>
                        <div class="est-th-price">СТОИМОСТЬ</div>
                    </div>
                    <div class="estimate-head-divider"></div>

                    {{-- Строки сметы --}}
                    <div class="estimate-table-body">
                        @foreach($estimateRows as $row)
                            @php
                                $cells = $row['value'] ?? [];
                                $name = $cells[0] ?? '—';
                                $qty = $cells[1] ?? '1';

                                // Корректное извлечение цены с учетом запятой в десятичных долях
                                $rawPrice = (string) ($cells[3] ?? ($cells[2] ?? '0'));
                                $cleanPrice = str_replace(
                                    [',', ' ', "\xc2\xa0", "\u{A0}", 'руб.', '₽', 'Br', '$'],
                                    ['.', '', '', '', '', '', '', ''],
                                    $rawPrice
                                );
                                $numPrice = is_numeric($cleanPrice) ? (float) $cleanPrice : 0.0;
                                $formattedPrice = $numPrice > 0 ? WpcPdfDataHelper::formatPrice($numPrice, $order->currency) : $rawPrice;
                            @endphp

                            <div class="estimate-row">
                                <div class="est-td-name">{{ $name }}</div>
                                <div class="est-td-qty">{{ $qty }}</div>
                                <div class="est-td-price">{{ $formattedPrice }}</div>
                            </div>
                        @endforeach
                    </div>

                    {{-- Итого по разделу --}}
                    <div class="estimate-subtotal-divider"></div>
                    <div class="estimate-subtotal-row">
                        <div class="est-subtotal-label">Итого</div>
                        <div class="est-subtotal-value">
                            {{ WpcPdfDataHelper::formatPrice($section->price_grand_total, $order->currency) }}
                        </div>
                    </div>
                </div>
            </div>
        @endforeach

        {{-- Фирменная синяя плашка общей стоимости материалов --}}
        <div class="grand-price-banner">
            <div class="banner-left">
                <div class="banner-left-title">ОБЩАЯ СТОИМОСТЬ МАТЕРИАЛОВ</div>
                <div class="banner-left-desc">Без учёта стоимости монтажных работ и доставки</div>
            </div>
            <div class="banner-right-price">
                {{ WpcPdfDataHelper::formatPrice($order->grand_total, $order->currency) }}
            </div>
        </div>

        {{-- Дисклеймер --}}
        <div class="estimate-disclaimer">
            Расчёт предварительный и не является публичной офертой. Для получения полной стоимости проекта, включая монтаж и доставку, обратитесь к нашему менеджеру.
        </div>
    </div>

    @include('valerie-wpc::pdf.partials.footer', ['theme' => 'light', 'pageNum' => $pageNum, 'totalPages' => $totalPages])
</div>