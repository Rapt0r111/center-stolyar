import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Image optimisation ──────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
  },

  // ─── Security headers ────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff"          },
          { key: "X-Frame-Options",           value: "SAMEORIGIN"       },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // ─── Compression ─────────────────────────────────────────────────────────
  compress: true,

  // ─── Logging (dev) ───────────────────────────────────────────────────────
  logging: {
    fetches: { fullUrl: false },
  },
};

export default nextConfig;