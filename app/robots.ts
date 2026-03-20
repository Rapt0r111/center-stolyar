// app/robots.ts
// ─── ИСПРАВЛЕНО: 3 критических бага ──────────────────────────────────────────
//
// БАГ 1 (КРИТИЧНЫЙ): '/_next/' был в disallow.
//   Это блокировало ВСЕ JS и CSS файлы. Google не мог рендерить страницу.
//   Правило из документации: "Don't block CSS/JS — Google needs them for rendering".
//   Результат: Google индексировал пустую страницу без контента.
//
// БАГ 2: '/*.json$' — невалидный синтаксис robots.txt.
//   Robots.txt не поддерживает regex с якорем $. Паттерн игнорировался.
//
// БАГ 3: '/api/' блокировала только путь, но API-роутов нет.
//   Оставлено для безопасности на случай появления API.
//
// ИТОГ: Google может свободно краулить и рендерить весь сайт.

import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.centersi.spb.ru';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Все поисковые роботы — полный доступ
        // ВАЖНО: /_next/ НЕ блокируем — там JS/CSS для рендера
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // AI-боты — блокируем парсинг контента
      { userAgent: 'GPTBot',       disallow: '/' },
      { userAgent: 'CCBot',        disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'Claude-Web',   disallow: '/' },
      { userAgent: 'Omgilibot',    disallow: '/' },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}