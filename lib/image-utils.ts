// lib/image-utils.ts

/**
 * Генерирует SVG-плейсхолдер в виде base64.
 * Используется как blurDataURL для <Image />.
 * 
 * @param w - ширина (для aspect-ratio)
 * @param h - высота
 * @param color - цвет фона (hex без #)
 */
export function shimmer(w: number, h: number, color = '2a1a0e') {
  return `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${w}" height="${h}" fill="#${color}"/>
      <rect id="r" width="${w}" height="${h}" fill="url(#g)"/>
      <defs>
        <linearGradient id="g">
          <stop stop-color="#${color}" offset="20%"/>
          <stop stop-color="#3d2b1f" offset="50%"/>
          <stop stop-color="#${color}" offset="70%"/>
        </linearGradient>
      </defs>
    </svg>`;
}

export function toBase64(str: string) {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return window.btoa(unescape(encodeURIComponent(str)));
}

/**
 * Готовая строка для blurDataURL
 */
export function blurPlaceholder(
  w = 400,
  h = 300,
  color?: string
) {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h, color))}`;
}

// Пресеты для разных контекстов
export const BLUR = {
  gallery:   blurPlaceholder(450, 550, '1a1008'),
  thumbnail: blurPlaceholder(160, 100, '1a1008'),
  article:   blurPlaceholder(672, 256, '150d05'),
  card:      blurPlaceholder(420, 256, '1a1008'),
} as const;