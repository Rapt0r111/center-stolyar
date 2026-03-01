/**
 * image-preloader.ts
 *
 * Singleton-преloadер изображений.
 * Генерирует точные /_next/image URL (с правильным bucket-размером)
 * и предзагружает их до того, как пользователь нажмёт на миниатюру.
 *
 * Использование:
 *   import { preloader } from '@/lib/image-preloader';
 *   preloader.preload('/images/gallery/stair-1.jpg', 1920);
 */

// ─── Размерные бакеты из next.config.ts ──────────────────────────────────────
// Должны совпадать с deviceSizes + imageSizes в next.config.ts
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920];
const IMAGE_SIZES  = [16, 32, 48, 64, 96, 128, 256, 384];
const ALL_WIDTHS   = [...IMAGE_SIZES, ...DEVICE_SIZES].sort((a, b) => a - b);

/**
 * Находит ближайший ширший бакет Next.js Image Optimization.
 * Если запросить /_next/image?w=450, Next.js ответит 500 (ближайший бакет).
 * Чтобы preload URL совпал с тем, что запросит <Image />, нужен тот же бакет.
 */
export function nearestNextWidth(displayWidth: number): number {
  return ALL_WIDTHS.find(w => w >= displayWidth) ?? DEVICE_SIZES[DEVICE_SIZES.length - 1];
}

/**
 * Конструирует URL, который Next.js Image Optimization реально обслуживает.
 * Важно: браузер кэширует по URL, поэтому preload и <Image /> должны
 * запрашивать ОДИНАКОВЫЙ URL — только тогда кэш сработает.
 */
export function nextImageUrl(src: string, displayWidth: number, quality = 85): string {
  const w = nearestNextWidth(displayWidth);
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality}`;
}

// ─── Singleton-класс ──────────────────────────────────────────────────────────
class ImagePreloaderService {
  /** Хранит URL, которые уже были поставлены в очередь загрузки */
  private readonly queued = new Set<string>();

  /**
   * Предзагружает одно изображение.
   *
   * @param src          — путь в /public (например '/images/gallery/stair-1.jpg')
   * @param displayWidth — ожидаемая ширина отображения (px). Используем максимальную
   *                       ширину экрана, на которой будет показано фото.
   * @param quality      — качество (должно совпадать с quality у <Image />)
   */
  preload(src: string, displayWidth: number, quality = 85): void {
    if (typeof window === 'undefined') return; // SSR guard

    const url = nextImageUrl(src, displayWidth, quality);
    if (this.queued.has(url)) return; // уже в очереди
    this.queued.add(url);

    // ── Стратегия 1: fetch с высоким приоритетом (Chrome 101+, Safari 17.2+) ─
    // Это самый быстрый способ — браузер грузит и кэширует файл.
    // Используем 'high' через type assertion так как TypeScript ещё не знает
    // об этом экспериментальном поле Priority Hints API.
    try {
      fetch(url, { priority: 'high' } as RequestInit & { priority: string }).catch(() => {
        this._fallbackImage(url);
      });
    } catch {
      // ── Стратегия 2: new Image() — работает везде ──────────────────────────
      this._fallbackImage(url);
    }
  }

  /**
   * Предзагружает массив изображений (например, все слайды галереи).
   * Запускает загрузки параллельно, но не блокирует UI.
   */
  preloadMany(srcs: string[], displayWidth: number, quality = 85): void {
    // Используем idle callback если доступен, чтобы не мешать LCP
    const run = () => srcs.forEach(src => this.preload(src, displayWidth, quality));

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 150);
    }
  }

  /**
   * Предзагружает изображения с задержкой — для соседних слайдов,
   * которые нужны "скоро", но не прямо сейчас.
   */
  preloadDeferred(srcs: string[], displayWidth: number, delayMs = 300): void {
    setTimeout(() => {
      srcs.forEach(src => this.preload(src, displayWidth));
    }, delayMs);
  }

  /**
   * Проверяет, было ли изображение уже поставлено в очередь загрузки.
   * Полезно, чтобы избежать дублирующих операций в компонентах.
   */
  isQueued(src: string, displayWidth: number, quality = 85): boolean {
    return this.queued.has(nextImageUrl(src, displayWidth, quality));
  }

  private _fallbackImage(url: string): void {
    const img = new window.Image();
    img.src = url;
  }
}

/**
 * Глобальный синглтон — импортируйте его в любом компоненте.
 * Кэш живёт весь сеанс пользователя и шарится между компонентами,
 * поэтому одно и то же фото не будет грузиться дважды.
 */
export const preloader = new ImagePreloaderService();

// ─── Вспомогательные константы ───────────────────────────────────────────────
/** Размер для предзагрузки полноэкранного лайтбокса */
export const LIGHTBOX_WIDTH = 1920;

/** Размер для предзагрузки карточек галереи */
export const GALLERY_CARD_WIDTH = 828;

/** Размер для предзагрузки статей */
export const ARTICLE_MODAL_WIDTH = 672;