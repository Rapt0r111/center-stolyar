'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '@/lib/data';
import type { GalleryItem } from '@/lib/data';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

export default function GallerySection() {
  const [filter, setFilter]   = useState<string>('Все');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const swiperRef  = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const filtered = filter === 'Все'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(i => i.cat === filter);

  // Visibility for entrance animation
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Reset swiper to first slide when filter changes
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0, 0); // instant — no animation on filter change
    }
  }, [filter]);

  // Escape key for lightbox + scroll lock
  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  // Navigate lightbox prev / next
  const lightboxNav = useCallback((dir: 1 | -1) => {
    if (!lightbox) return;
    const idx = filtered.findIndex(i => i.id === lightbox.id);
    const next = filtered[(idx + dir + filtered.length) % filtered.length];
    setLightbox(next);
  }, [lightbox, filtered]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-16 lg:py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a1008 0%, #2a1d12 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-[#c8a96e]" />
              <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Портфолио</span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Галерея <span className="text-[#c8a96e]">проектов</span>
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Фильтр по категориям">
            {GALLERY_CATEGORIES.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={filter === cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border',
                  filter === cat
                    ? 'bg-[#c8a96e] text-[#1a1008] border-[#c8a96e] shadow-lg shadow-[#c8a96e]/20'
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-[#c8a96e]/50 hover:text-white',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div
          className={cn(
            'relative transition-all duration-1000 ease-out',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Предыдущий слайд"
            className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group"
          >
            <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Следующий слайд"
            className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group"
          >
            <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-1 transition-transform" />
          </button>

          <Swiper
            modules={[Autoplay, EffectCoverflow]}
            onSwiper={swiper => { swiperRef.current = swiper; }}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            coverflowEffect={{ rotate: 0, stretch: 0, depth: 160, modifier: 2, slideShadows: false }}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
          >
            {filtered.map(item => (
              <SwiperSlide
                key={item.id}
                className="!w-[80%] sm:!w-[450px] h-auto"
              >
                <div
                  onClick={() => setLightbox(item)}
                  className="group relative h-[550px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
                  style={{ border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 640px) 80vw, 450px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008] via-transparent to-transparent opacity-80" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[#c8a96e] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                      {item.cat}
                    </span>
                    <h3
                      className="text-white text-2xl lg:text-3xl font-bold mb-4"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {item.label}
                    </h3>
                    <div className="w-0 group-hover:w-full h-px bg-[#c8a96e]/50 transition-all duration-700 mb-4" />
                    <div className="flex items-center gap-2 text-[#c8a96e] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      Рассмотреть детали <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
          style={{ animation: 'fade-slide-in 0.25s ease-out' }}
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            aria-label="Закрыть"
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-[#c8a96e] transition-colors z-10"
            onClick={() => setLightbox(null)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Prev */}
          <button
            aria-label="Предыдущее фото"
            onClick={e => { e.stopPropagation(); lightboxNav(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-white/60 hover:text-[#c8a96e] hover:bg-white/5 transition-all"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Next */}
          <button
            aria-label="Следующее фото"
            onClick={e => { e.stopPropagation(); lightboxNav(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-white/60 hover:text-[#c8a96e] hover:bg-white/5 transition-all"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl w-full h-[80vh]"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.label}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
              <p className="text-white/60 text-sm">{lightbox.label}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}