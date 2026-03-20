// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { ARTICLES, GALLERY_ITEMS } from '@/lib/data';

const BASE_URL = 'https://www.centersi.spb.ru';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const galleryImageUrls = GALLERY_ITEMS.map(
    item => `${BASE_URL}${item.src}`
  );
  const articleImageUrls = ARTICLES.map(
    article => `${BASE_URL}${article.image}`
  );

  return [
    // Главная — максимальный приоритет, все изображения
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      images: [
        `${BASE_URL}/images/og-image.jpg`,
        ...galleryImageUrls,
        ...articleImageUrls,
      ],
    },
    // Якорные секции
    {
      url: `${BASE_URL}/#about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/#services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/#gallery`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: galleryImageUrls,
    },
    {
      url: `${BASE_URL}/#articles`,
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.7,
      images: articleImageUrls,
    },
    {
      url: `${BASE_URL}/#contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}