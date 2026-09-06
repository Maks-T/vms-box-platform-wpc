@php
    use Valerie\Box\IndustryWpc\Support\WpcPdfDataHelper;

    $validUntil = $order->created_at
        ? mb_strtolower(\Carbon\Carbon::parse($order->created_at)->locale('ru')->addDays(30)->translatedFormat('d F Y'))
        : mb_strtolower(\Carbon\Carbon::now()->locale('ru')->addDays(30)->translatedFormat('d F Y'));

    $phone = $order->manager?->phone ?? config('nicole.company.phone', '+375 29 189 8322');
    $email = $order->manager?->email ?? config('nicole.company.email', 'info@vistegra.by');
    $site  = config('nicole.company.website_label', 'vistegra.ru');
@endphp

<div class="page page-dark">
    <div class="top-gradient-line"></div>
    @include('valerie-wpc::pdf.partials.header', ['theme' => 'dark'])

    <div class="page-content page-content-contacts">
        {{-- Главный заголовок --}}
        <h2 class="contacts-hero-title">Готовы обсудить вашу террасу</h2>

        {{-- 3 шага реализации --}}
        <div class="steps-stack">
            <div class="step-card">
                <div class="step-num-col">1</div>
                <div class="step-text-col">
                    <div class="step-title">Подтвердите КП</div>
                    <div class="step-desc">Напишите или позвоните менеджеру — уточним детали и зафиксируем заказ</div>
                </div>
            </div>

            <div class="step-card">
                <div class="step-num-col">2</div>
                <div class="step-text-col">
                    <div class="step-title">Замер на объекте</div>
                    <div class="step-desc">Проверяем размеры и основание, финализируем смету и сроки.</div>
                </div>
            </div>

            <div class="step-card">
                <div class="step-num-col">3</div>
                <div class="step-text-col">
                    <div class="step-title">Монтаж под ключ</div>
                    <div class="step-desc">Договор, поставка материалов и монтаж террасы.</div>
                </div>
            </div>
        </div>

        {{-- 3-колоночная плашка контактов --}}
        <div class="contacts-info-card">
            <div class="contact-info-col">
                <div class="contact-info-lbl">Телефон</div>
                <div class="contact-info-val">{{ $phone }}</div>
            </div>
            <div class="contact-info-col">
                <div class="contact-info-lbl">Почта</div>
                <div class="contact-info-val">{{ $email }}</div>
            </div>
            <div class="contact-info-col">
                <div class="contact-info-lbl">Сайт</div>
                <div class="contact-info-val">{{ $site }}</div>
            </div>
        </div>

        {{-- Нижний блок: Срок действия + Общая сумма --}}
        <div class="closing-summary-block">
            <div class="closing-divider"></div>
            <div class="closing-row">
                <div class="closing-date-col">
                    <div class="closing-lbl">Срок действия КП</div>
                    <div class="closing-val">до {{ $validUntil }} года · 30 дней</div>
                </div>

                <div class="closing-price-col">
                    <div class="closing-lbl">Общая сумма заказа</div>
                    <div class="closing-price-val">
                        {{ WpcPdfDataHelper::formatPrice($order->grand_total, $order->currency) }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Тёмный подвал --}}
    @include('valerie-wpc::pdf.partials.footer', ['theme' => 'dark', 'pageNum' => $pageNum, 'totalPages' => $totalPages])
</div>