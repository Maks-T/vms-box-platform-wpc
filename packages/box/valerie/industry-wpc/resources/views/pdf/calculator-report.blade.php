@php
    /** @var \Nicole\Box\Core\Models\Order $order */
    $currencySymbol = match($order->currency) {
        'RUB' => '₽',
        'USD' => '$',
        'BYN' => 'Br',
        default => $order->currency
    };

    $dmRegular = base_path('packages/box/valerie/industry-wpc/resources/fonts/Manrope/Manrope-Regular.ttf');
    $dmMedium  = base_path('packages/box/valerie/industry-wpc/resources/fonts/Manrope/Manrope-Medium.ttf');
    $dmSemiBold = base_path('packages/box/valerie/industry-wpc/resources/fonts/Manrope/Manrope-SemiBold.ttf');
    $dmBold    = base_path('packages/box/valerie/industry-wpc/resources/fonts/Manrope/Manrope-Bold.ttf');

    $fontStyles = '';
    if (file_exists($dmRegular)) {
      $fontStyles .= '@font-face { font-family: "Manrope"; src: url("data:font/truetype;charset=utf-8;base64,' . base64_encode((string) file_get_contents($dmRegular)) . '") format("truetype"); font-weight: 400; font-style: normal; } ';
    }
    if (file_exists($dmMedium)) {
      $fontStyles .= '@font-face { font-family: "Manrope"; src: url("data:font/truetype;charset=utf-8;base64,' . base64_encode((string) file_get_contents($dmMedium)) . '") format("truetype"); font-weight: 500; font-style: normal; } ';
    }
    if (file_exists($dmSemiBold)) {
      $fontStyles .= '@font-face { font-family: "Manrope"; src: url("data:font/truetype;charset=utf-8;base64,' . base64_encode((string) file_get_contents($dmSemiBold)) . '") format("truetype"); font-weight: 600; font-style: normal; } ';
    }
    if (file_exists($dmBold)) {
      $fontStyles .= '@font-face { font-family: "Manrope"; src: url("data:font/truetype;charset=utf-8;base64,' . base64_encode((string) file_get_contents($dmBold)) . '") format("truetype"); font-weight: 700; font-style: normal; } ';
    }

    $cssPath = base_path('packages/box/valerie/industry-wpc/resources/css/pdf-report.css');
    $cssContent = file_exists($cssPath) ? file_get_contents($cssPath) : '';

    $totalPages = 5;
@endphp
        <!DOCTYPE html>
<html lang="{{ $order->locale ?? 'ru' }}">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $title ?? 'Коммерческое предложение' }} №{{ $order->code }}</title>
    <style>
        {!! $fontStyles !!}
        {!! $cssContent !!}
    </style>
</head>
<body>

{{-- СТРАНИЦА 1: ТИТУЛЬНЫЙ ЛИСТ (ОБЛОЖКА) [ТЕМНАЯ] --}}
@include('valerie-wpc::pdf.pages.01-cover', ['pageNum' => 1, 'totalPages' => $totalPages])

{{-- СТРАНИЦА 2: О РАСЧЕТЕ И СХЕМА ОБЪЕКТА [СВЕТЛАЯ] --}}
@include('valerie-wpc::pdf.pages.02-about', ['pageNum' => 2, 'totalPages' => $totalPages])

{{-- СТРАНИЦА 3: МАТЕРИАЛЫ И КОМПЛЕКТУЮЩИЕ [СВЕТЛАЯ] --}}
@include('valerie-wpc::pdf.pages.03-materials', ['pageNum' => 3, 'totalPages' => $totalPages])

{{-- СТРАНИЦА 4: СМЕТНЫЙ РАСЧЕТ ПРОЕКТА [СВЕТЛАЯ] --}}
@include('valerie-wpc::pdf.pages.04-estimate', ['pageNum' => 4, 'totalPages' => $totalPages])

{{-- СТРАНИЦА 5: СЛЕДУЮЩИЙ ШАГ И КОНТАКТЫ [ТЕМНАЯ] --}}
@include('valerie-wpc::pdf.pages.05-contacts', ['pageNum' => 5, 'totalPages' => $totalPages])

</body>
</html>