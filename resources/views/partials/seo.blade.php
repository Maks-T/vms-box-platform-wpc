{{-- resources/views/partials/seo.blade.php --}}
@php
  $title = $seo['title'] ?? 'Каталог террасной доски ДПК и МПК — OliverDeck';
  $description = $seo['description'] ?? 'Продажа террасной доски из ДПК и МПК, фасадных панелей и комплектующих от производителя по первым ценам в Москве и МО.';
  $keywords = $seo['keywords'] ?? 'террасная доска, дпк, мпк, ступени, монтаж террасы, оливердек, oliverdeck, москва';

  $image = $seo['og_image'] ?? asset('images/og-default.webp');
  $url = url()->current();
  $siteName = 'OliverDeck';
@endphp

  <!-- Базовые SEO теги -->
<title inertia>{{ $title }}</title>
<meta name="description" content="{{ $description }}" inertia>
<meta name="keywords" content="{{ $keywords }}" inertia>

<!-- Open Graph (Telegram, WhatsApp, VK, Facebook) -->
<meta property="og:type" content="{{ $seo['og_type'] ?? 'website' }}" inertia>
<meta property="og:site_name" content="{{ $siteName }}" inertia>
<meta property="og:title" content="{{ $title }}" inertia>
<meta property="og:description" content="{{ $description }}" inertia>
<meta property="og:url" content="{{ $url }}" inertia>

<!-- Изображение Open Graph -->
<meta property="og:image" content="{{ $image }}" inertia>
<meta property="og:image:type" content="image/webp" inertia>
<meta property="og:image:width" content="1200" inertia>
<meta property="og:image:height" content="630" inertia>

<!-- Twitter Cards (Telegram/Discord) -->
<meta name="twitter:card" content="summary_large_image" inertia>
<meta name="twitter:title" content="{{ $title }}" inertia>
<meta name="twitter:description" content="{{ $description }}" inertia>
<meta name="twitter:image" content="{{ $image }}" inertia>
