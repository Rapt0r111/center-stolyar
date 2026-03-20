// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,

    /**
     * QUALITY REGISTRY — единственный источник правды.
     *
     * Каждое значение здесь должно иметь соответствие в image-preloader.ts:
     *   QUALITY_MICRO  = 70  → ThumbCard (160px), мелкие превью
     *   QUALITY_THUMB  = 80  → карточки галереи, статьи
     *   QUALITY_HIGH   = 85  → лайтбоксы, полноэкранные модалки
     *
     * Если компонент использует quality NOT из этого массива →
     * Next.js Image Optimization может вернуть неожиданное значение.
     *
     * УДАЛЕНО: 88 (не использовалось корректно, ServicesSection → 85).
     * УДАЛЕНО: 90 (избыточно для JPEG/WebP, AVIF сам по себе эффективнее).
     */
    qualities: [70, 80, 85],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",            value: "SAMEORIGIN" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security",  value: "max-age=31536000; includeSubDomains" },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Агрессивное кеширование Next.js optimized images
        // s-maxage=86400 — CDN кешируют на сутки
        // stale-while-revalidate=604800 — отдают кеш пока обновляют
        source: "/_next/image(.*)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=86400, stale-while-revalidate=604800, max-age=3600" },
        ],
      },
    ];
  },

  compress: true,
};

export default nextConfig;