@php
    use Valerie\Box\IndustryWpc\Support\WpcPdfDataHelper;

    $section = $order->sections->first();
    $materialCards = $section ? WpcPdfDataHelper::extractMaterialCards($section, $order) : [];
@endphp

<div class="page">
    <div class="top-gradient-line"></div>
    @include('valerie-wpc::pdf.partials.header', ['theme' => 'light'])

    <div class="page-content page-content-materials">
        <h2 class="materials-page-title">Террасная доска</h2>

        <div class="materials-list">
            @foreach($materialCards as $card)
                <div class="material-card">
                    {{-- Шапка карточки --}}
                    <div class="material-card__header">
                        <div class="material-card__title">{{ $card['title'] }}</div>
                        <div class="material-card__price">{{ $card['price'] }}</div>
                    </div>

                    {{-- Тело карточки: Картинка 260x195 + Таблица характеристик --}}
                    <div class="material-card__body">
                        <div class="material-card__photo">
                            @if(!empty($card['photo']))
                                <img src="{{ $card['photo'] }}" alt="{{ $card['title'] }}" class="material-card__img" />
                            @endif
                        </div>

                        <div class="material-card__specs">
                            @foreach($card['specs'] as $label => $val)
                                <div class="spec-row">
                                    <div class="spec-label">{{ $label }}</div>
                                    <div class="spec-value">{{ $val }}</div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    @include('valerie-wpc::pdf.partials.footer', ['theme' => 'light', 'pageNum' => $pageNum, 'totalPages' => $totalPages])
</div>