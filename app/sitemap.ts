// app/sitemap.ts
// ─── ИСПРАВЛЕНО: якорные URL (#fragment) в sitemap ───────────────────────────
//
// БАГ: В предыдущей версии sitemap содержал URL вида:
//   https://www.centersi.spb.ru/#services
//   https://www.centersi.spb.ru/#gallery
//   ...и т.д.
//
// Google ИГНОРИРУЕТ hash-фрагменты — все эти URL воспринимались как
// https://www.centersi.spb.ru/ → 5 дублирующих записей для одной страницы.
// Это не помогало SEO и засоряло sitemap.
//
// ПРАВИЛО: В sitemap должны быть только канонические URL, которые
// возвращают 200 и содержат уникальный контент.
//
// ИТОГ: Один URL главной страницы со всеми изображениями.

import type { MetadataRoute } from 'next';
import { ARTICLES, GALLERY_ITEMS } from '@/lib/data';

const BASE_URL = 'https://www.centersi.spb.ru';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Все изображения для Image Sitemap (Next.js 16)
  // Google индексирует их отдельно в Google Images
  const galleryImageUrls = GALLERY_ITEMS.map(item => `${BASE_URL}${item.src}`);
  const articleImageUrls = ARTICLES.map(article => `${BASE_URL}${article.image}`);

  return [
    {
      // Единственная реальная страница — главная
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      // Все изображения сайта — индексируются Google Images
      images: [
        `${BASE_URL}/images/og-image.jpg`,
        `${BASE_URL}/images/logo-black.png`,
        ...galleryImageUrls,
        ...articleImageUrls,
      ],
    },
  ];
}