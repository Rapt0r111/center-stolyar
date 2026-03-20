// app/robots.ts
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.centersi.spb.ru';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/*.json$'],
      },
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'CCBot',  disallow: '/' },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}