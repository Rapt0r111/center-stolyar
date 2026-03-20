// next.config.ts
// ─── ИСПРАВЛЕНО: добавлен non-www → www редирект ─────────────────────────────
//
// БАГ 10: Отсутствовал явный редирект centersi.spb.ru → www.centersi.spb.ru
//   в Next.js конфиге. Редирект существовал на уровне сервера/CDN, но
//   без него в next.config.ts Google мог индексировать обе версии.
//
//   Canonical в layout.tsx указывает на www, но лучше иметь двойную защиту.
//   ИСПРАВЛЕНИЕ: добавлен явный 301 для non-www → www.
//
// БАГ 11 (частичный): Strict-Transport-Security имел директиву 'preload'.
//   Убрана из next.config.ts. Если нужна — подать на https://hstspreload.org/
//   и только потом добавить обратно.

import type { NextConfig } from 'next';

// ─── Старые .html страницы → новые якорные секции ────────────────────────────
const OLD_REDIRECTS = [
  // Лестницы
  { source: '/lestnicy.html',                               destination: '/#services', permanent: true },
  { source: '/lestnicy-art7.html',                          destination: '/#services', permanent: true },
  { source: '/vint.html',                                   destination: '/#services', permanent: true },
  { source: '/vintovye-lestnicy.html',                      destination: '/#services', permanent: true },
  { source: '/marshevy.html',                               destination: '/#services', permanent: true },
  { source: '/lestnicy-na-boltcah.html',                    destination: '/#services', permanent: true },
  { source: '/lestnicy-na-metallokarcase.html',             destination: '/#services', permanent: true },
  { source: '/lestnitsa-iz-dereva-pokrytie-lakom.html',     destination: '/#services', permanent: true },
  { source: '/okrasivanie-lestnic.html',                    destination: '/#services', permanent: true },
  { source: '/perila.html',                                 destination: '/#services', permanent: true },
  { source: '/perila-art2.html',                            destination: '/#services', permanent: true },
  { source: '/metallicheskie-perila.html',                  destination: '/#services', permanent: true },
  // Двери
  { source: '/dveri.html',                                  destination: '/#services', permanent: true },
  { source: '/dveri-iz-massiva.html',                       destination: '/#services', permanent: true },
  { source: '/mezhkomnatnye-dveri.html',                    destination: '/#services', permanent: true },
  { source: '/vxodnye-dveri.html',                          destination: '/#services', permanent: true },
  { source: '/razdvizhnye-dveri.html',                      destination: '/#services', permanent: true },
  // Мебель
  { source: '/mebel.html',                                  destination: '/#services', permanent: true },
  { source: '/mebel-iz-dereva.html',                        destination: '/#services', permanent: true },
  { source: '/furnitura-dlya-mebeli.html',                  destination: '/#services', permanent: true },
  { source: '/shkaf-kupe.html',                             destination: '/#services', permanent: true },
  { source: '/kuhonnye-garnitury.html',                     destination: '/#services', permanent: true },
  // Арки
  { source: '/arki-proemy.html',                            destination: '/#services', permanent: true },
  { source: '/arki.html',                                   destination: '/#services', permanent: true },
  { source: '/otdelka-dvernyh-proiomov.html',               destination: '/#services', permanent: true },
  // Потолки, интерьер
  { source: '/potolki.html',                                destination: '/#services', permanent: true },
  { source: '/derevyannye-balkoni.html',                    destination: '/#services', permanent: true },
  { source: '/vnutrennyaya-otdelka-naturalnym-derevom.html', destination: '/#services', permanent: true },
  { source: '/kabinety.html',                               destination: '/#services', permanent: true },
  { source: '/biblioteki.html',                             destination: '/#services', permanent: true },
  // Галерея
  { source: '/photo.html',                                  destination: '/#gallery',  permanent: true },
  { source: '/photo2.html',                                 destination: '/#gallery',  permanent: true },
  { source: '/raznye-raboty.html',                          destination: '/#gallery',  permanent: true },
  { source: '/gallery.html',                                destination: '/#gallery',  permanent: true },
  { source: '/lestnicy-foto.html',                          destination: '/#gallery',  permanent: true },
  { source: '/dveri-foto.html',                             destination: '/#gallery',  permanent: true },
  // О компании
  { source: '/about.html',                                  destination: '/#about',    permanent: true },
  { source: '/o-kompanii.html',                             destination: '/#about',    permanent: true },
  // Контакты
  { source: '/contacts.html',                               destination: '/#contact',  permanent: true },
  { source: '/kontakty.html',                               destination: '/#contact',  permanent: true },
  // Блог
  { source: '/articles/:slug*',                             destination: '/#articles', permanent: true },
  { source: '/blog/:slug*',                                 destination: '/#articles', permanent: true },
  { source: '/statyi.html',                                 destination: '/#articles', permanent: true },
  // Прайс
  { source: '/price.html',                                  destination: '/#contact',  permanent: true },
  { source: '/ceny.html',                                   destination: '/#contact',  permanent: true },
  { source: '/prays-list.html',                             destination: '/#contact',  permanent: true },
  // Wildcard — все остальные .html (ДОЛЖЕН БЫТЬ ПОСЛЕДНИМ)
  { source: '/:path*.html',                                 destination: '/',          permanent: true },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // ── ДОБАВЛЕНО БАГ 10: non-www → www (301) ────────────────────────────
      // Двойная защита: редирект существует на CDN, но лучше иметь и в коде.
      // Обязателен для canonical consistency: все URL → www.centersi.spb.ru
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'centersi.spb.ru' }],
        destination: 'https://www.centersi.spb.ru/:path*',
        permanent: true,
      },
      // ── Старые страницы ───────────────────────────────────────────────────
      ...OLD_REDIRECTS,
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          // ИСПРАВЛЕНО БАГ 11: убран 'preload' из HSTS.
          // Требует регистрации на hstspreload.org перед использованием.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-Robots-Tag',              value: 'index, follow, max-image-preview:large, max-snippet:-1' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/_next/image(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800, max-age=3600' }],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(robots.txt|sitemap.xml)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [70, 80, 85],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  compress: true,
  poweredByHeader: false,
};

export default nextConfig;