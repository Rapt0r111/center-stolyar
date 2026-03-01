// app/components/GallerySection.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '@/lib/data';
import type { GalleryItem } from '@/lib/data';
import { BLUR } from '@/lib/image-utils'; // ← наш новый утилит

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Virtual } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

// ─── Хук: программный preload полноразмерного изображения ────────────────────
function useImagePreloader() {
  const preloadedRef = useRef<Set<string>>(new Set());

  const preload = useCallback((src: string) => {
    if (preloadedRef.current.has(src)) return;
    preloadedRef.current.add(src);

    // Вставляем <link rel="preload"> — браузер начнёт скачивать немедленно
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    // Указываем что хотим AVIF/WebP (Next.js Image Optimization API)
    link.type = 'image/avif';
    document.head.appendChild(link);
  }, []);

  return { preload };
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  // ✅ Предзагружаем СЛЕДУЮЩИЙ и ПРЕДЫДУЩИЙ слайд пока смотрим текущий
  useEffect(() => {
    const preloadIdx = [
      (idx + 1) % images.length,
      (idx - 1 + images.length) % images.length,
    ];
    preloadIdx.forEach(i => {
      const img = new window.Image();
      // Next.js Image Optimization: запрашиваем оптимизированную версию
      img.src = `/_next/image?url=${encodeURIComponent(images[i].src)}&w=1920&q=85`;
    });
  }, [idx, images]);

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
      style={{ animation: 'fade-slide-in 0.25s ease-out' }}
      onClick={onClose}
    >
      <button aria-label="Закрыть" className="absolute top-6 right-6 p-2 text-white/50 hover:text-[#c8a96e] z-10" onClick={onClose}>
        <X className="w-8 h-8" />
      </button>

      <button aria-label="Предыдущее" onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-white/60 hover:text-[#c8a96e] hover:bg-white/5 transition-all">
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button aria-label="Следующее" onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-white/60 hover:text-[#c8a96e] hover:bg-white/5 transition-all">
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="relative max-w-5xl w-full h-[80vh]" onClick={e => e.stopPropagation()}>
        {/* ✅ Рендерим текущий + соседей для мгновенного переключения */}
        {images.map((item, i) => {
          const isActive = i === idx;
          const isNear = Math.abs(i - idx) <= 1 ||
            (idx === 0 && i === images.length - 1) ||
            (idx === images.length - 1 && i === 0);

          // Не рендерим далёкие слайды совсем
          if (!isActive && !isNear) return null;

          return (
            <div
              key={item.id}
              className={cn(
                'absolute inset-0 transition-opacity duration-300',
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            >
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-contain"
                sizes="100vw"
                // ✅ Текущий — priority, соседи грузятся обычно но заранее
                priority={isActive}
                quality={85}
                placeholder="blur"
                blurDataURL={BLUR.gallery}
              />
            </div>
          );
        })}

        <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
          <p className="text-white/60 text-sm">{images[idx].label}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide Card ────────────────────────────────────────────────────────────────
function SlideCard({
  item,
  slideIndex,
  activeIndex,
  onHover,
  onClick,
}: {
  item: GalleryItem;
  slideIndex: number;
  activeIndex: number;
  onHover: (src: string) => void;
  onClick: () => void;
}) {
  // ✅ Priority только для первых 3 видимых слайдов (активный ± 1)
  const isPriority = Math.abs(slideIndex - activeIndex) <= 1;

  return (
    <div
      onClick={onClick}
      // ✅ При наведении на карточку — сразу начинаем грузить полноразмерное фото
      onMouseEnter={() => onHover(item.src)}
      // ✅ Для тача — начинаем при touchstart
      onTouchStart={() => onHover(item.src)}
      className="group relative h-[550px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
      style={{ border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <Image
        src={item.src}
        alt={item.label}
        fill
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
        sizes="(max-width: 640px) 80vw, 450px"
        priority={isPriority}
        loading={isPriority ? undefined : 'lazy'}
        quality={80}
        placeholder="blur"
        blurDataURL={BLUR.gallery}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008] via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <span className="text-[#c8a96e] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">{item.cat}</span>
        <h3 className="text-white text-2xl lg:text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>{item.label}</h3>
        <div className="w-0 group-hover:w-full h-px bg-[#c8a96e]/50 transition-all duration-700 mb-4" />
        <div className="flex items-center gap-2 text-[#c8a96e] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          Рассмотреть детали <ZoomIn className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────
export default function GallerySection() {
  const [filter, setFilter] = useState<string>('Все');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const { preload } = useImagePreloader();

  const filtered = filter === 'Все'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(i => i.cat === filter);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (swiperRef.current) swiperRef.current.slideTo(0, 0);
    setActiveIndex(0);
  }, [filter]);

  // ✅ При смене активного слайда — сразу preload соседей для лайтбокса
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    const idx = swiper.realIndex;
    setActiveIndex(idx);

    // Preload следующего и предыдущего для лайтбокса
    const neighbors = [
      filtered[(idx + 1) % filtered.length],
      filtered[(idx - 1 + filtered.length) % filtered.length],
    ];
    neighbors.forEach(item => {
      if (item) preload(item.src);
    });
  }, [filtered, preload]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-16 lg:py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a1008 0%, #2a1d12 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Filter — без изменений */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-[#c8a96e]" />
              <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Портфолио</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Галерея <span className="text-[#c8a96e]">проектов</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist">
            {GALLERY_CATEGORIES.map(cat => (
              <button key={cat} role="tab" aria-selected={filter === cat} onClick={() => setFilter(cat)}
                className={cn('px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border',
                  filter === cat ? 'bg-[#c8a96e] text-[#1a1008] border-[#c8a96e] shadow-lg shadow-[#c8a96e]/20'
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-[#c8a96e]/50 hover:text-white'
                )}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={cn('relative transition-all duration-1000 ease-out', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <button onClick={() => swiperRef.current?.slidePrev()} aria-label="Предыдущий слайд"
            className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group">
            <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button onClick={() => swiperRef.current?.slideNext()} aria-label="Следующий слайд"
            className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group">
            <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-1 transition-transform" />
          </button>

          <Swiper
            modules={[Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            coverflowEffect={{ rotate: 0, stretch: 0, depth: 160, modifier: 2, slideShadows: false }}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            // ✅ Отслеживаем прогресс для умного preload
            watchSlidesProgress
            onSlideChange={handleSlideChange}
            onSwiper={swiper => {
              swiperRef.current = swiper;
              // Preload первых 3 слайдов при инициализации
              filtered.slice(0, 3).forEach(item => preload(item.src));
            }}
          >
            {filtered.map((item, i) => (
              <SwiperSlide key={item.id} className="!w-[80%] sm:!w-[450px] h-auto">
                <SlideCard
                  item={item}
                  slideIndex={i}
                  activeIndex={activeIndex}
                  onHover={preload}
                  onClick={() => setLightboxIndex(i)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}