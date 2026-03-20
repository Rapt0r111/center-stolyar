// next.config.ts
// ─── Next.js Config с 301-редиректами со старого сайта ───────────────────────
//
// КРИТИЧНО для SEO:
// Старый сайт centersi.spb.ru имел десятки проиндексированных страниц.
// Без 301-редиректов весь накопленный авторитет (PageRank) теряется,
// а Google видит сотни 404 — это сигнал о плохом качестве сайта.
//
// Все старые URL → 301 → новый сайт (якорная секция или главная).
// 301 (Permanent Redirect) передаёт ~90-99% PageRank на новый URL.

import type { NextConfig } from 'next';

// ─── Все известные старые URL старого сайта → новые якоря ────────────────────
// Источник: Google Search Results для site:centersi.spb.ru
const OLD_REDIRECTS = [
  // ─── Лестницы ─────────────────────────────────────────────────────────────
  { source: '/lestnicy.html',                                  destination: '/#services', permanent: true },
  { source: '/lestnicy-art7.html',                             destination: '/#services', permanent: true },
  { source: '/vint.html',                                      destination: '/#services', permanent: true },
  { source: '/vintovye-lestnicy.html',                         destination: '/#services', permanent: true },
  { source: '/marshevy.html',                                  destination: '/#services', permanent: true },
  { source: '/lestnicy-na-boltcah.html',                       destination: '/#services', permanent: true },
  { source: '/lestnicy-na-metallokarcase.html',                destination: '/#services', permanent: true },
  { source: '/lestnitsa-iz-dereva-pokrytie-lakom.html',        destination: '/#services', permanent: true },
  { source: '/okrasivanie-lestnic.html',                       destination: '/#services', permanent: true },
  { source: '/perila.html',                                    destination: '/#services', permanent: true },
  { source: '/perila-art2.html',                               destination: '/#services', permanent: true },
  { source: '/metallicheskie-perila.html',                     destination: '/#services', permanent: true },

  // ─── Двери ───────────────────────────────────────────────────────────────
  { source: '/dveri.html',                                     destination: '/#services', permanent: true },
  { source: '/dveri-iz-massiva.html',                          destination: '/#services', permanent: true },
  { source: '/mezhkomnatnye-dveri.html',                       destination: '/#services', permanent: true },
  { source: '/vxodnye-dveri.html',                             destination: '/#services', permanent: true },
  { source: '/razdvizhnye-dveri.html',                         destination: '/#services', permanent: true },

  // ─── Мебель ──────────────────────────────────────────────────────────────
  { source: '/mebel.html',                                     destination: '/#services', permanent: true },
  { source: '/mebel-iz-dereva.html',                           destination: '/#services', permanent: true },
  { source: '/furnitura-dlya-mebeli.html',                     destination: '/#services', permanent: true },
  { source: '/shkaf-kupe.html',                                destination: '/#services', permanent: true },
  { source: '/kuhonnye-garnitury.html',                        destination: '/#services', permanent: true },

  // ─── Арки и проёмы ───────────────────────────────────────────────────────
  { source: '/arki-proemy.html',                               destination: '/#services', permanent: true },
  { source: '/arki.html',                                      destination: '/#services', permanent: true },
  { source: '/otdelka-dvernyh-proiomov.html',                  destination: '/#services', permanent: true },

  // ─── Потолки, интерьер ───────────────────────────────────────────────────
  { source: '/potolki.html',                                   destination: '/#services', permanent: true },
  { source: '/derevyannye-balkoni.html',                       destination: '/#services', permanent: true },
  { source: '/vnutrennyaya-otdelka-naturalnym-derevom.html',   destination: '/#services', permanent: true },
  { source: '/kabinety.html',                                  destination: '/#services', permanent: true },
  { source: '/biblioteki.html',                                destination: '/#services', permanent: true },

  // ─── Галерея / фото ──────────────────────────────────────────────────────
  { source: '/photo.html',                                     destination: '/#gallery',  permanent: true },
  { source: '/photo2.html',                                    destination: '/#gallery',  permanent: true },
  { source: '/raznye-raboty.html',                             destination: '/#gallery',  permanent: true },
  { source: '/gallery.html',                                   destination: '/#gallery',  permanent: true },
  { source: '/lestnicy-foto.html',                             destination: '/#gallery',  permanent: true },
  { source: '/dveri-foto.html',                                destination: '/#gallery',  permanent: true },

  // ─── О компании ──────────────────────────────────────────────────────────
  { source: '/about.html',                                     destination: '/#about',    permanent: true },
  { source: '/o-kompanii.html',                                destination: '/#about',    permanent: true },

  // ─── Контакты ────────────────────────────────────────────────────────────
  { source: '/contacts.html',                                  destination: '/#contact',  permanent: true },
  { source: '/kontakty.html',                                  destination: '/#contact',  permanent: true },

  // ─── Статьи / блог ───────────────────────────────────────────────────────
  { source: '/articles/:slug*',                                destination: '/#articles', permanent: true },
  { source: '/blog/:slug*',                                    destination: '/#articles', permanent: true },
  { source: '/statyi.html',                                    destination: '/#articles', permanent: true },

  // ─── Прайс-лист ──────────────────────────────────────────────────────────
  { source: '/price.html',                                     destination: '/#contact',  permanent: true },
  { source: '/ceny.html',                                      destination: '/#contact',  permanent: true },
  { source: '/prays-list.html',                                destination: '/#contact',  permanent: true },

  // ─── Wildcard для любых старых .html страниц ─────────────────────────────
  // Должен быть ПОСЛЕДНИМ — ловит всё что не совпало выше
  { source: '/:path*.html',                                    destination: '/',          permanent: true },
];

const nextConfig: NextConfig = {
  // ─── 301 Редиректы ──────────────────────────────────────────────────────
  async redirects() {
    return OLD_REDIRECTS;
  },

  // ─── Response Headers ────────────────────────────────────────────────────
  async headers() {
    return [
      // Безопасность и SEO-заголовки для всех страниц
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',            value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security',  value: 'max-age=31536000; includeSubDomains; preload' },
          // X-Robots-Tag — дополнительный контроль индексирования
          { key: 'X-Robots-Tag',               value: 'index, follow, max-image-preview:large, max-snippet:-1' },
        ],
      },
      // Статические изображения — агрессивное кеширование (1 год)
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Next.js оптимизированные изображения
      {
        source: '/_next/image(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800, max-age=3600' },
        ],
      },
      // Статические ассеты Next.js
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // robots.txt и sitemap.xml — не кешируем долго (могут меняться)
      {
        source: '/(robots.txt|sitemap.xml)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },

  // ─── Images ──────────────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,

    // QUALITY REGISTRY — значения должны совпадать с image-preloader.ts
    // QUALITY_MICRO = 70, QUALITY_THUMB = 80, QUALITY_HIGH = 85
    qualities: [70, 80, 85],
  },

  // ─── Оптимизация бандла ──────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  compress: true,

  // ─── Trailing slash — выбираем без слеша (canonical consistency) ─────────
  // trailingSlash: false, // уже по умолчанию

  // ─── Powered by header — скрываем (безопасность) ─────────────────────────
  poweredByHeader: false,
};

export default nextConfig;