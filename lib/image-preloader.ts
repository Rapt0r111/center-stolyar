/**
 * image-preloader.ts — v2 (исправленная версия)
 *
 * Исправления:
 * ─────────────────────────────────────────────────────────────────
 * 1. BUG FIX: Дефолтное quality изменено с 85 на 80.
 *    Причина: next.config.ts задаёт qualities: [70, 75, 80, 85, 90].
 *    Большинство компонентов используют quality={80}.
 *    Если preloader запрашивал q=85, а компонент q=80 — URL не совпадал,
 *    браузерный кэш не срабатывал, изображение грузилось дважды.
 *
 * 2. УЛУЧШЕНИЕ: Добавлена стратегия <link rel="preload"> как основная
 *    для критичных изображений (лайтбокс при открытии).
 *    fetch() остаётся фолбэком.
 *    <link rel="preload as="image"> имеет наивысший приоритет браузера
 *    и напрямую попадает в prefetch cache (не конкурирует с render).
 *
 * 3. Документация: явно указано, что quality должен совпадать
 *    с values в next.config.ts → qualities.
 */

// ─── Размерные бакеты из next.config.ts ──────────────────────────────────────
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920];
const IMAGE_SIZES  = [16, 32, 48, 64, 96, 128, 256, 384];
const ALL_WIDTHS   = [...IMAGE_SIZES, ...DEVICE_SIZES].sort((a, b) => a - b);

export function nearestNextWidth(displayWidth: number): number {
  return ALL_WIDTHS.find(w => w >= displayWidth) ?? DEVICE_SIZES[DEVICE_SIZES.length - 1];
}

export function nextImageUrl(src: string, displayWidth: number, quality = 80): string {
  const w = nearestNextWidth(displayWidth);
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality}`;
}

// ─── Singleton-класс ──────────────────────────────────────────────────────────
class ImagePreloaderService {
  private readonly queued = new Set<string>();

  /**
   * Предзагружает одно изображение.
   *
   * ВАЖНО: quality должен совпадать с quality у <Image /> компонента
   * И быть одним из значений из next.config.ts → qualities: [70, 75, 80, 85, 90].
   *
   * Дефолт: 80 — наиболее часто используемый в проекте.
   */
  preload(src: string, displayWidth: number, quality = 80): void {
    if (typeof window === 'undefined') return;

    const url = nextImageUrl(src, displayWidth, quality);
    if (this.queued.has(url)) return;
    this.queued.add(url);

    // ── Стратегия 1: <link rel="preload"> — наивысший браузерный приоритет ─
    // Попадает в prefetch cache и не конкурирует с критическим рендерингом.
    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      // fetchpriority: 'high' для лайтбокса — браузер грузит немедленно
      (link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = 'high';
      document.head.appendChild(link);
      return;
    } catch {
      // Фолбэк если DOM недоступен
    }

    // ── Стратегия 2: fetch с Priority Hints ──────────────────────────────────
    try {
      fetch(url, { priority: 'high' } as RequestInit & { priority: string }).catch(() => {
        this._fallbackImage(url);
      });
    } catch {
      this._fallbackImage(url);
    }
  }

  /**
   * Предзагружает массив изображений через requestIdleCallback.
   * Не блокирует LCP и основной поток.
   */
  preloadMany(srcs: string[], displayWidth: number, quality = 80): void {
    const run = () => srcs.forEach(src => this.preload(src, displayWidth, quality));

    if (typeof window === 'undefined') return;

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 150);
    }
  }

  /**
   * Предзагружает изображения с задержкой — для соседних слайдов.
   */
  preloadDeferred(srcs: string[], displayWidth: number, delayMs = 300, quality = 80): void {
    setTimeout(() => {
      srcs.forEach(src => this.preload(src, displayWidth, quality));
    }, delayMs);
  }

  isQueued(src: string, displayWidth: number, quality = 80): boolean {
    return this.queued.has(nextImageUrl(src, displayWidth, quality));
  }

  private _fallbackImage(url: string): void {
    const img = new window.Image();
    img.src = url;
  }
}

export const preloader = new ImagePreloaderService();

// ─── Константы ───────────────────────────────────────────────────────────────
/** Размер для предзагрузки полноэкранного лайтбокса */
export const LIGHTBOX_WIDTH = 1920;

/** Размер для предзагрузки карточек галереи */
export const GALLERY_CARD_WIDTH = 828;

/** Размер для предзагрузки статей */
export const ARTICLE_MODAL_WIDTH = 672;

/**
 * Качество для лайтбокса — используйте это значение везде,
 * где нужно максимальное качество (модалки, лайтбоксы).
 * Должно совпадать с next.config.ts → qualities.
 */
export const QUALITY_HIGH = 85;

/** Качество для карточек и превью */
export const QUALITY_THUMB = 80;