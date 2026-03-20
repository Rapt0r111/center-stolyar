'use client';

/**
 * GallerySection.tsx — image-loading fixes
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ИСПРАВЛЕНИЯ (относительно предыдущей версии):
 * ───────────────────────────────────────────────────────────────────────────
 *
 * 1. CRITICAL — quality mismatch (был CACHE MISS на каждое открытие):
 *    Lightbox <Image quality={85}> + preloader q=80 → разные URL → 2 запроса.
 *    Теперь все preloader-вызовы для LIGHTBOX_WIDTH используют QUALITY_HIGH=85.
 *
 * 2. preload() → decode() на поверхностях взаимодействия:
 *    На pointerenter мы теперь запускаем img.decode(), а не просто fetch().
 *    Это гарантирует, что к моменту клика изображение декодировано в GPU —
 *    skeleton исчезает мгновенно или не показывается вообще.
 *
 * 3. isReady() для начального состояния imgLoaded:
 *    const [imgLoaded, setImgLoaded] = useState(
 *      () => preloader.isReady(item.src, LIGHTBOX_WIDTH, QUALITY_HIGH)
 *    );
 *    Если изображение уже декодировано (поле с предыдущего открытия или
 *    агрессивный прогрев), skeleton вообще не показывается.
 *
 * 4. activeItem.id change effect тоже проверяет isReady():
 *    useEffect(() => {
 *      setImgLoaded(preloader.isReady(activeItem.src, LIGHTBOX_WIDTH, QUALITY_HIGH));
 *    }, [activeItem.id]);
 *
 * 5. IntersectionObserver rootMargin увеличен до 400px снизу:
 *    Прогрев начинается до того как секция входит во viewport.
 *
 * 6. Swiper slides: loading="eager" вместо "lazy" для слайдов в DOM.
 *    Browser-native lazy loading не работает корректно с CSS transform в Swiper.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '@/lib/data';
import type { GalleryItem } from '@/lib/data';
import { BLUR } from '@/lib/image-utils';
import {
  preloader,
  LIGHTBOX_WIDTH,
  GALLERY_CARD_WIDTH,
  QUALITY_HIGH,
  QUALITY_THUMB,
} from '@/lib/image-preloader';
import ImageSkeleton from '@/app/components/ui/ImageSkeleton';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import {
  motion, AnimatePresence,
  LayoutGroup,
  useReducedMotion,
} from 'framer-motion';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const LAYOUT_TRANSITION = {
  type: 'tween' as const,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  duration: 0.38,
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  images: GalleryItem[];
  activeItem: GalleryItem;
  onClose: () => void;
  onNavigate: (item: GalleryItem) => void;
}

function Lightbox({ images, activeItem, onClose, onNavigate }: LightboxProps) {
  // FIX: инициализируем из isReady() — если уже декодировано, skeleton не нужен
  const [imgLoaded, setImgLoaded] = useState(
    () => preloader.isReady(activeItem.src, LIGHTBOX_WIDTH, QUALITY_HIGH),
  );
  const shouldReduceMotion = useReducedMotion();
  const currentIdx = images.findIndex(i => i.id === activeItem.id);

  const goPrev = useCallback(() => {
    const prevItem = images[(currentIdx - 1 + images.length) % images.length];
    onNavigate(prevItem);
    // FIX: decode следующего-следующего сразу, с правильным quality
    preloader.decode(
      images[(currentIdx - 2 + images.length) % images.length].src,
      LIGHTBOX_WIDTH,
      QUALITY_HIGH,
    );
  }, [images, currentIdx, onNavigate]);

  const goNext = useCallback(() => {
    const nextItem = images[(currentIdx + 1) % images.length];
    onNavigate(nextItem);
    // FIX: decode следующего-следующего сразу, с правильным quality
    preloader.decode(
      images[(currentIdx + 2) % images.length].src,
      LIGHTBOX_WIDTH,
      QUALITY_HIGH,
    );
  }, [images, currentIdx, onNavigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // FIX: при смене activeItem проверяем isReady — если уже декодировано, не сбрасываем
  useEffect(() => {
    setImgLoaded(preloader.isReady(activeItem.src, LIGHTBOX_WIDTH, QUALITY_HIGH));
  }, [activeItem.id, activeItem.src]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Фото: ${activeItem.label}`}
    >
      <motion.div
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-pointer"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.button
        aria-label="Закрыть галерею"
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.18, duration: 0.25 }}
        whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}
      >
        <X className="w-7 h-7" />
      </motion.button>

      {images.length > 1 && (
        <>
          <motion.button
            aria-label="Предыдущее фото"
            onClick={e => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full text-white/50 hover:text-[#c8a96e] hover:bg-white/5 transition-all"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16 }} whileHover={{ x: -3 }} whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-8 h-8" />
          </motion.button>
          <motion.button
            aria-label="Следующее фото"
            onClick={e => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full text-white/50 hover:text-[#c8a96e] hover:bg-white/5 transition-all"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16 }} whileHover={{ x: 3 }} whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-8 h-8" />
          </motion.button>
        </>
      )}

      <motion.div
        layoutId={`gallery-img-${activeItem.id}`}
        className="relative z-10 cursor-default"
        style={{ width: '90vw', maxWidth: '1100px', height: '80vh' }}
        initial={shouldReduceMotion ? {} : { opacity: 0.5, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={LAYOUT_TRANSITION}
        onClick={e => e.stopPropagation()}
      >
        <motion.div
          layoutId={`gallery-corner-${activeItem.id}`}
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius: 16 }}
          animate={{ borderRadius: 12 }}
          transition={LAYOUT_TRANSITION}
        >
          <ImageSkeleton loaded={imgLoaded} />
          <Image
            key={activeItem.id}
            src={activeItem.src}
            alt={activeItem.label}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 90vw, 1100px"
            priority
            quality={QUALITY_HIGH}   // FIX: было захардкожено 85, теперь константа
            draggable={false}
            onLoad={() => setImgLoaded(true)}
          />
        </motion.div>
        <motion.div
          className="absolute -bottom-8 left-0 right-0 text-center"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          aria-live="polite"
        >
          <p className="text-white/50 text-sm">{activeItem.label}</p>
        </motion.div>
      </motion.div>

      {images.length > 1 && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          role="tablist" aria-label="Выбор фото"
        >
          {images.map((item, idx) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={item.id === activeItem.id}
              aria-label={`Фото ${idx + 1}: ${item.label}`}
              onClick={e => { e.stopPropagation(); onNavigate(item); }}
              // FIX: decode при наведении на точку навигации
              onMouseEnter={() => preloader.decode(item.src, LIGHTBOX_WIDTH, QUALITY_HIGH)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                item.id === activeItem.id ? 'bg-[#c8a96e] w-5' : 'bg-white/30 w-1.5 hover:bg-white/60'
              )}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── Slide Card ────────────────────────────────────────────────────────────────
interface SlideCardProps {
  item: GalleryItem;
  isPriority: boolean;
  onClick: () => void;
  onPreload: () => void;
}

function SlideCard({ item, isPriority, onClick, onPreload }: SlideCardProps) {
  const [thumbLoaded, setThumbLoaded] = useState(
    // FIX: карточки используют QUALITY_THUMB=80
    () => preloader.isReady(item.src, GALLERY_CARD_WIDTH, QUALITY_THUMB),
  );

  return (
    <motion.div
      layoutId={`gallery-img-${item.id}`}
      onClick={onClick}
      onPointerEnter={onPreload}
      className="group relative h-[550px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
      style={{
        border: '1px solid rgba(255,255,255,0.05)',
        touchAction: 'pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      whileHover={{ scale: 1.01 }}
      transition={LAYOUT_TRANSITION}
      role="button"
      aria-label={`Открыть: ${item.label}`}
    >
      <motion.div
        layoutId={`gallery-corner-${item.id}`}
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius: 24 }}
        transition={LAYOUT_TRANSITION}
      >
        <ImageSkeleton loaded={thumbLoaded} />
        <Image
          src={item.src}
          alt={item.label}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 80vw, 450px"
          priority={isPriority}
          // FIX: убрали loading="lazy" для Swiper — все слайды в DOM,
          // browser lazy loading не работает корректно с CSS transform
          loading={isPriority ? undefined : 'eager'}
          quality={QUALITY_THUMB}   // FIX: константа вместо захардкоженного 80
          draggable={false}
          placeholder="blur"
          blurDataURL={BLUR.gallery}
          onLoad={() => setThumbLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008] via-transparent to-transparent opacity-80 pointer-events-none" />
      </motion.div>

      <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
        <span className="text-[#c8a96e] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">{item.cat}</span>
        <h3 className="text-white text-2xl lg:text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          {item.label}
        </h3>
        <div className="w-0 group-hover:w-full h-px bg-[#c8a96e]/50 transition-all duration-700 mb-4" />
        <div className="flex items-center gap-2 text-[#c8a96e] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          Рассмотреть детали <ZoomIn className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────
export default function GallerySection() {
  const [filter, setFilter] = useState<string>('Все');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperRef = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const filtered = useMemo(
    () => filter === 'Все' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.cat === filter),
    [filter],
  );

  // FIX: rootMargin '400px' снизу — прогрев начинается до входа секции во viewport
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0, rootMargin: '0px 0px 400px 0px' }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    // FIX: первые 3 — decode() (GPU-готовность), остальные — warmMany() (HTTP-кэш)
    // Оба вызова с QUALITY_HIGH=85 чтобы URL совпадал с Lightbox <Image quality={85}>
    filtered.slice(0, 3).forEach(item =>
      preloader.decode(item.src, LIGHTBOX_WIDTH, QUALITY_HIGH)
    );
    preloader.decodeMany(
      filtered.slice(3).map(i => i.src),
      LIGHTBOX_WIDTH,
      QUALITY_HIGH,
    );

    // Дополнительно: прогреваем карточные версии (GALLERY_CARD_WIDTH, QUALITY_THUMB)
    preloader.warmMany(
      filtered.map(i => i.src),
      GALLERY_CARD_WIDTH,
      QUALITY_THUMB,
    );
  }, [visible, filtered]);

  useEffect(() => {
    if (swiperRef.current) swiperRef.current.slideTo(0, 0);
    setActiveIndex(0);
  }, [filter]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    const idx = swiper.realIndex;
    setActiveIndex(idx);
    // FIX: decode соседних слайдов с QUALITY_HIGH для лайтбокса
    [
      filtered[(idx + 1) % filtered.length],
      filtered[(idx - 1 + filtered.length) % filtered.length],
    ].forEach(item => preloader.decode(item.src, LIGHTBOX_WIDTH, QUALITY_HIGH));
  }, [filtered]);

  const handleCardPreload = useCallback((item: GalleryItem) => {
    // FIX: decode() вместо preload() + правильный quality
    // К моменту клика (100–300мс после hover) изображение будет декодировано в GPU
    preloader.decode(item.src, LIGHTBOX_WIDTH, QUALITY_HIGH);
  }, []);

  const handleCardClick = useCallback((item: GalleryItem) => {
    setActiveItem(item);
    const idx = filtered.findIndex(i => i.id === item.id);
    // FIX: decode соседей с правильным quality
    [
      filtered[(idx + 1) % filtered.length],
      filtered[(idx - 1 + filtered.length) % filtered.length],
    ].forEach(n => preloader.decode(n.src, LIGHTBOX_WIDTH, QUALITY_HIGH));
  }, [filtered]);

  return (
    <LayoutGroup id="gallery-section">
      <section
        id="gallery"
        ref={sectionRef}
        aria-label="Галерея проектов"
        className="py-16 lg:py-20 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1a1008 0%, #2a1d12 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-4" aria-hidden="true">
                <div className="w-12 h-px bg-[#c8a96e]" />
                <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Портфолио</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Галерея <span className="text-[#c8a96e]">проектов</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Фильтр по категории">
              {GALLERY_CATEGORIES.map(cat => (
                <motion.button
                  key={cat}
                  role="tab"
                  id={`gallery-tab-${cat}`}
                  aria-selected={filter === cat}
                  aria-controls="gallery-carousel"
                  onClick={() => setFilter(cat)}
                  // FIX: decode при наведении на фильтр — прогреваем категорию заранее
                  onMouseEnter={() => {
                    const catItems = cat === 'Все' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.cat === cat);
                    preloader.decodeDeferred(
                      catItems.map(i => i.src),
                      LIGHTBOX_WIDTH,
                      200,
                      QUALITY_HIGH,
                    );
                  }}
                  className={cn(
                    'px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border',
                    filter === cat
                      ? 'bg-[#c8a96e] text-[#1a1008] border-[#c8a96e] shadow-lg shadow-[#c8a96e]/20'
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-[#c8a96e]/50 hover:text-white'
                  )}
                  whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          <div
            id="gallery-carousel"
            role="tabpanel"
            aria-labelledby={`gallery-tab-${filter}`}
            className={cn(
              'relative transition-all duration-700 ease-out',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Предыдущий слайд"
              className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group"
            >
              <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Следующий слайд"
              className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group"
            >
              <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>

            <style>{`
              .gallery-coverflow-swiper .swiper-wrapper { touch-action: pan-y; }
              .gallery-coverflow-swiper .swiper-slide img { -webkit-user-drag: none; user-drag: none; pointer-events: none; }
              .gallery-coverflow-swiper .swiper-slide * { user-select: none; -webkit-user-select: none; }
              .gallery-coverflow-swiper .swiper-slide { touch-action: pan-y; }
              .gallery-coverflow-swiper .swiper-slide-active { opacity: 1 !important; filter: none !important; }
            `}</style>

            <div className="gallery-coverflow-swiper">
              <Swiper
                modules={[Autoplay, EffectCoverflow]}
                effect="coverflow"
                grabCursor
                centeredSlides
                slidesPerView="auto"
                coverflowEffect={{ rotate: 0, stretch: 0, depth: 200, modifier: 1.8, slideShadows: false }}
                autoplay={{ delay: 5000, disableOnInteraction: true }}
                watchSlidesProgress
                simulateTouch
                touchStartPreventDefault={false}
                resistance
                resistanceRatio={0.85}
                speed={500}
                threshold={5}
                onSlideChange={handleSlideChange}
                onSwiper={swiper => { swiperRef.current = swiper; }}
              >
                {filtered.map((item, i) => (
                  <SwiperSlide key={`${filter}-${item.id}`} className="!w-[80%] sm:!w-[450px] h-auto">
                    <SlideCard
                      item={item}
                      isPriority={Math.abs(i - activeIndex) <= 1}
                      onPreload={() => handleCardPreload(item)}
                      onClick={() => handleCardClick(item)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeItem && (
          <Lightbox
            key="lightbox"
            images={filtered}
            activeItem={activeItem}
            onClose={() => setActiveItem(null)}
            onNavigate={setActiveItem}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}