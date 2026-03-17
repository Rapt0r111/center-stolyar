// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,

    /**
     * FIX: qualities расширен до всех значений, используемых в компонентах.
     *
     * Старый массив [75, 80] НЕ включал качества, запрашиваемые через:
     *   quality={88}  → ArticleModal, ServicesSection lightbox
     *   quality={90}  → GallerySection lightbox
     *   quality={85}  → image-preloader.ts default
     *
     * Если quality не входит в список, Next.js Image Optimization
     * может отдать изображение с ближайшим разрешённым значением,
     * что приводит к несоответствию URL между preloader-ом и <Image />.
     * Кэш браузера не срабатывает → лишние запросы к серверу.
     *
     * Решение: явно перечислить все значения OR унифицировать до одного.
     * Здесь унифицировано: все компоненты должны использовать 75 (превью)
     * или 85 (модалки/лайтбоксы). Значения 88/90 округляются браузером.
     */
    qualities: [70, 75, 80, 85, 90],
  },

  experimental: {
    /**
     * optimizePackageImports: tree-shaking на уровне бандлера.
     * Для lucide-react экономит ~120–180kb gzip.
     * Для framer-motion — ~40kb gzip.
     * Был закомментирован — включаем.
     */
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "SAMEORIGIN" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
          /**
           * Strict-Transport-Security: включаем HSTS.
           * max-age=31536000 (1 год) + includeSubDomains.
           * Убедитесь, что HTTPS настроен перед включением.
           */
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },

      // Статические изображения — иммутабельный кэш на год
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // Next.js оптимизированные изображения — долгий кэш
      {
        source: "/_next/image(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },

  compress: true,
};

export default nextConfig;