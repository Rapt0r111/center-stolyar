/**
 * image-preloader.ts v3 — 2026/2027 edition
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * КОРНЕВЫЕ БАГИ v2 (исправлены здесь):
 * ───────────────────────────────────────────────────────────────────────────
 * BUG 1 — CACHE MISS в GallerySection:
 *   Lightbox <Image quality={85}> запрашивал /_next/image?q=85
 *   preloader.preload() дефолтно использовал q=80 → ДРУГОЙ URL → промах кэша.
 *   Каждое открытие лайтбокса = новый сетевой запрос.
 *
 * BUG 2 — CACHE MISS в ServicesSection:
 *   PhotoLightbox <Image quality={88}> — значение 88 отсутствует в qualities[].
 *   Next.js Image Optimization отдаёт ближайшее разрешённое значение (85),
 *   но preloader запрашивал q=80 → тройной промах.
 *
 * BUG 3 — Только HTTP-кэш, не GPU-декодинг:
 *   preload() через fetch() / <link rel="preload"> качает байты в HTTP-кэш,
 *   но не декодирует изображение. При открытии модалки браузер ещё тратит
 *   10–80мс на декодирование PNG/JPEG → мерцание skeleton.
 *   Решение: img.decode() — декодирует пиксели в GPU-память заранее.
 *
 * BUG 4 — IntersectionObserver слишком поздно:
 *   Предзагрузка стартовала только когда секция входила во viewport.
 *   К тому времени пользователь уже мог кликнуть карточку.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * АРХИТЕКТУРА v3:
 * ───────────────────────────────────────────────────────────────────────────
 *
 *   warm(src, w, q)        — кладёт байты в HTTP-кэш (fetch, non-blocking)
 *   decode(src, w, q)      — скачивает + декодирует в GPU, возвращает Promise
 *   isReady(src, w, q)     — синхронная проверка: декодировано ли уже?
 *   warmMany / decodeMany  — batch-версии через requestIdleCallback
 *   decodeDeferred         — decode с задержкой (предсказание соседних слайдов)
 *
 * ─── ПРАВИЛО КАЧЕСТВА ────────────────────────────────────────────────────
 *   quality В ВЫЗОВАХ PRELOADER ОБЯЗАН СОВПАДАТЬ с quality у <Image>.
 *   Иначе URL не совпадает → кэш не срабатывает.
 *
 *   QUALITY_HIGH  = 85  → лайтбоксы, модалки (крупные полноэкранные)
 *   QUALITY_THUMB = 80  → карточки, превью
 *   QUALITY_MICRO = 70  → миниатюры (100px и меньше)
 */

// ─── Next.js image sizing ─────────────────────────────────────────────────────
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920];
const IMAGE_SIZES  = [16, 32, 48, 64, 96, 128, 256, 384];
const ALL_WIDTHS   = [...IMAGE_SIZES, ...DEVICE_SIZES].sort((a, b) => a - b);

export function nearestNextWidth(displayWidth: number): number {
  return ALL_WIDTHS.find(w => w >= displayWidth) ?? DEVICE_SIZES[DEVICE_SIZES.length - 1];
}

export function nextImageUrl(src: string, displayWidth: number, quality: number): string {
  const w = nearestNextWidth(displayWidth);
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality}`;
}

// ─── Singleton ────────────────────────────────────────────────────────────────
class ImagePreloaderService {
  /** URL-ы, по которым уже выдан fetch/link */
  private readonly warmed   = new Set<string>();
  /** URL → Promise декодинга */
  private readonly decoding = new Map<string, Promise<void>>();
  /** URL-ы, успешно декодированные в GPU */
  private readonly ready    = new Set<string>();

  // ─── Public API ─────────────────────────────────────────────────────────

  /**
   * Кладёт байты в HTTP-кэш через fetch() с высоким приоритетом.
   * Fire-and-forget. Не блокирует рендер.
   * Используй для фонового прогрева (idle, hover без hover-deadline).
   */
  warm(src: string, displayWidth: number, quality: number): void {
    if (typeof window === 'undefined') return;
    const url = nextImageUrl(src, displayWidth, quality);
    if (this.warmed.has(url)) return;
    this.warmed.add(url);

    try {
      fetch(url, { priority: 'high' } as RequestInit & { priority: string })
        .catch(() => this._imgFallback(url));
    } catch {
      this._imgFallback(url);
    }
  }

  /**
   * Скачивает И декодирует изображение в GPU-память через img.decode().
   * Возвращает Promise — ждите его перед открытием модалки для instant display.
   * Повторные вызовы возвращают тот же закешированный Promise.
   *
   * КРИТИЧНО: quality должен совпадать с <Image quality={N}>.
   */
  decode(src: string, displayWidth: number, quality: number): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    const url = nextImageUrl(src, displayWidth, quality);

    // Уже декодировано — возвращаем resolved Promise
    if (this.ready.has(url)) return Promise.resolve();

    // Декодинг уже в процессе — возвращаем существующий Promise
    const existing = this.decoding.get(url);
    if (existing) return existing;

    const p = new Promise<void>((resolve) => {
      const img = new Image();

      const done = () => {
        this.ready.add(url);
        resolve();
      };

      img.onload = () => {
        // img.decode() — декодирует пиксели в GPU (Chrome 64+, Safari 15.4+, Firefox 133+)
        if (typeof img.decode === 'function') {
          img.decode().then(done, done); // on error → still resolve (graceful)
        } else {
          done();
        }
      };

      img.onerror = done; // fail-silent: не блокируем UI
      img.src = url;
    });

    this.warmed.add(url);
    this.decoding.set(url, p);
    return p;
  }

  /**
   * Синхронная проверка: изображение декодировано и GPU-готово?
   * Используй для initialState в компонентах чтобы никогда не показывать skeleton
   * если изображение уже готово.
   *
   * Пример:
   *   const [loaded, setLoaded] = useState(
   *     () => preloader.isReady(src, LIGHTBOX_WIDTH, QUALITY_HIGH)
   *   );
   */
  isReady(src: string, displayWidth: number, quality: number): boolean {
    return this.ready.has(nextImageUrl(src, displayWidth, quality));
  }

  /**
   * Warming многих изображений через requestIdleCallback (не блокирует LCP).
   * Для фонового прогрева при скролле / смене фильтра.
   */
  warmMany(srcs: string[], displayWidth: number, quality: number): void {
    if (typeof window === 'undefined') return;
    const run = () => srcs.forEach(src => this.warm(src, displayWidth, quality));

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 3000 });
    } else {
      setTimeout(run, 200);
    }
  }

  /**
   * Декодинг многих изображений через requestIdleCallback.
   * Для прогрева всего набора при входе секции во viewport.
   */
  decodeMany(srcs: string[], displayWidth: number, quality: number): void {
    if (typeof window === 'undefined') return;
    const run = () => srcs.forEach(src => this.decode(src, displayWidth, quality));

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 4000 });
    } else {
      setTimeout(run, 300);
    }
  }

  /**
   * Декодинг с задержкой — для предсказания соседних слайдов.
   * Пример: при смене слайда начинаем decode следующего через 150мс.
   */
  decodeDeferred(srcs: string[], displayWidth: number, delayMs: number, quality: number): void {
    setTimeout(
      () => srcs.forEach(src => this.decode(src, displayWidth, quality)),
      delayMs,
    );
  }

  // ─── Legacy aliases (backward compat) ────────────────────────────────────
  /** @deprecated use warm() — preload только в HTTP-кэш без decode */
  preload(src: string, displayWidth: number, quality: number): void {
    this.warm(src, displayWidth, quality);
  }
  /** @deprecated use warmMany() */
  preloadMany(srcs: string[], displayWidth: number, quality: number): void {
    this.warmMany(srcs, displayWidth, quality);
  }
  /** @deprecated use decodeDeferred() */
  preloadDeferred(srcs: string[], displayWidth: number, delayMs: number, quality: number): void {
    this.decodeDeferred(srcs, displayWidth, delayMs, quality);
  }

  isWarmed(src: string, displayWidth: number, quality: number): boolean {
    return this.warmed.has(nextImageUrl(src, displayWidth, quality));
  }

  // ─── Private ──────────────────────────────────────────────────────────────
  private _imgFallback(url: string): void {
    try {
      const img = new Image();
      img.src = url;
    } catch { /* SSR guard */ }
  }
}

export const preloader = new ImagePreloaderService();

// ─── Размерные константы ──────────────────────────────────────────────────────
/** Полноэкранный лайтбокс / модалка */
export const LIGHTBOX_WIDTH      = 1920;
/** Карточки галереи */
export const GALLERY_CARD_WIDTH  = 828;
/** Карточки статей */
export const ARTICLE_MODAL_WIDTH = 672;

// ─── Константы качества ───────────────────────────────────────────────────────
/**
 * ВАЖНО: значения ДОЛЖНЫ присутствовать в next.config.ts → qualities[].
 * Несовпадение quality между preloader и <Image> = CACHE MISS.
 */
/** Для лайтбоксов, модалок, полноэкранных изображений */
export const QUALITY_HIGH  = 85;
/** Для карточек, превью, слайдов */
export const QUALITY_THUMB = 80;
/** Для миниатюр ≤ 160px */
export const QUALITY_MICRO = 70;