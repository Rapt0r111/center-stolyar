'use client';

/**
 * ServicesSection.tsx — ОПТИМИЗИРОВАННАЯ ВЕРСИЯ
 *
 * Изменения vs оригинал:
 * ───────────────────────────────────────────────────────────────
 * 1. ServiceModal: обложка использует ImageSkeleton вместо blur
 * 2. Фотополоса в модалке: миниатюры используют Skeleton
 * 3. При открытии модалки сразу preload всех фото галереи этой категории
 * 4. PhotoLightbox: активное фото с priority + Skeleton
 * 5. Хук useImageLoad вынесен из ImageSkeleton для чистоты использования
 */

import React, { useEffect, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { SERVICES, GALLERY_ITEMS } from '@/lib/data';
import type { Service, GalleryItem } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fence, DoorOpen, Armchair, SquareSplitVertical,
  Layers, Library, createLucideIcon, X, ArrowRight, ZoomIn, ChevronLeft, ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import { preloader, LIGHTBOX_WIDTH } from '@/lib/image-preloader';
import ImageSkeleton from '@/app/components/ui/ImageSkeleton';

const Stairs = createLucideIcon('Stairs', [
  ['path', { d: 'M3 21h18', key: 'base' }],
  ['path', { d: 'M3 21v-4h4v-4h4v-4h4v-4h4', key: 'steps' }],
]);

const ICON_MAP: Record<string, LucideIcon> = {
  Stairs, Fence, DoorOpen, Armchair, SquareSplitVertical, Layers, Library,
};

const SERVICE_GALLERY: Record<string, string> = {
  'Лестницы': 'Лестницы',
  'Перила':   'Лестницы',
  'Двери':    'Двери',
  'Мебель':   'Мебель',
  'Арки':     'Арки',
  'Потолки':  'Лестницы',
  'Кабинеты': 'Мебель',
};

const CELL_CLASSES: Record<number, string> = {
  0: 'col-span-2 row-span-2',
  1: 'col-span-1 row-span-1',
  2: 'col-span-1 row-span-1',
  3: 'col-span-1 row-span-1',
  4: 'col-span-1 row-span-1',
  5: 'col-span-2 row-span-1',
  6: 'col-span-2 row-span-1',
};

// ─── Photo Lightbox ───────────────────────────────────────────────────────────
function PhotoLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Сброс состояния загрузки при смене фото
  useEffect(() => { setImgLoaded(false); }, [idx]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') { setIdx(i => (i + 1) % images.length); }
      if (e.key === 'ArrowLeft')  { setIdx(i => (i - 1 + images.length) % images.length); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
      onClick={onClose}
    >
      <button
        aria-label="Закрыть"
        className="absolute top-5 right-5 p-2 text-white/50 hover:text-white transition-colors z-10"
        onClick={onClose}
      >
        <X className="w-7 h-7" />
      </button>

      {images.length > 1 && (
        <>
          <button
            aria-label="Предыдущее"
            onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white/60 hover:text-[#c8a96e] hover:bg-white/5 transition-all z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            aria-label="Следующее"
            onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white/60 hover:text-[#c8a96e] hover:bg-white/5 transition-all z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl w-full h-[80vh] mx-8"
          onClick={e => e.stopPropagation()}
        >
          {/* Skeleton вместо blur */}
          <ImageSkeleton loaded={imgLoaded} />

          <Image
            src={images[idx].src}
            alt={images[idx].label}
            fill
            className="object-contain"
            sizes="100vw"
            priority  // В лайтбоксе всегда priority
            quality={88}
            onLoad={() => setImgLoaded(true)}
          />
          <p className="absolute bottom-0 left-0 right-0 text-center text-white/50 text-sm pb-2">
            {images[idx].label}
          </p>
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setIdx(i); }}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === idx ? 'bg-[#c8a96e] w-4' : 'bg-white/30 w-1.5'
              )}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Service Modal ─────────────────────────────────────────────────────────────
function ServiceModal({
  service, onClose, onCta,
}: {
  service: Service;
  onClose: () => void;
  onCta: (title: string) => void;
}) {
  const Icon = ICON_MAP[service.iconName] ?? Layers;
  const swiperRef = React.useRef<SwiperType | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryImages = GALLERY_ITEMS.filter(
    item => item.cat === (SERVICE_GALLERY[service.title] ?? '')
  );

  // При открытии модалки сразу preload всех фото этой категории
  useEffect(() => {
    if (galleryImages.length > 0) {
      // Первое фото — сразу (пользователь может кликнуть немедленно)
      preloader.preload(galleryImages[0].src, LIGHTBOX_WIDTH);
      // Остальные — через idle callback
      preloader.preloadMany(
        galleryImages.slice(1).map(i => i.src),
        LIGHTBOX_WIDTH
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service.title]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxIndex === null) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, lightboxIndex]);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={`Услуга: ${service.title}`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-[#0f0905]/85 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 8 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-2xl rounded-3xl overflow-hidden z-20 grain"
          style={{
            background: 'linear-gradient(145deg, #24160c 0%, #1a1008 60%, #0f0905 100%)',
            border: '1px solid rgba(200,169,110,0.25)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 70%)' }}
          />

          <motion.button
            whileHover={{ rotate: 90, backgroundColor: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute top-4 right-4 p-2 text-white/40 hover:text-white rounded-full z-20 transition-colors"
          >
            <X size={20} />
          </motion.button>

          <div className="p-8 sm:p-10 relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="flex items-start gap-5 mb-7"
            >
              <div
                className="p-4 rounded-2xl shrink-0"
                style={{
                  background: 'rgba(200,169,110,0.1)',
                  border: '1px solid rgba(200,169,110,0.2)',
                  boxShadow: '0 0 20px rgba(200,169,110,0.12)',
                }}
              >
                <Icon size={34} className="text-[#c8a96e]" strokeWidth={1.4} />
              </div>
              <div>
                <h3
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {service.title}
                </h3>
                <p className="text-[#c8a96e] text-xs uppercase tracking-[0.15em] opacity-80">
                  {service.short}
                </p>
              </div>
            </motion.div>

            {/* Text */}
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
                className="text-white/90 text-lg leading-relaxed"
              >
                {service.desc}
              </motion.p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.34, duration: 0.5 }}
                className="h-px origin-left"
                style={{ background: 'linear-gradient(90deg, rgba(200,169,110,0.4), transparent)' }}
              />
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/55 text-sm leading-relaxed"
              >
                {service.fullDesc}
              </motion.p>
            </div>

            {/* Photo strip */}
            {galleryImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/25 text-[10px] uppercase tracking-widest">Примеры работ</p>
                  {galleryImages.length > 3 && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-[#c8a96e] hover:bg-white/5 transition-all"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-[#c8a96e] hover:bg-white/5 transition-all"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="modal-photos-swiper">
                  <style>{`
                    .modal-photos-swiper .swiper-slide {
                      opacity: 1 !important;
                      filter: none !important;
                      transform: none !important;
                    }
                  `}</style>
                  <Swiper
                    modules={[Autoplay]}
                    onSwiper={s => { swiperRef.current = s; }}
                    spaceBetween={8}
                    slidesPerView={3}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    loop={galleryImages.length >= 3}
                  >
                    {galleryImages.map((img, i) => (
                      <SwiperSlide key={img.id}>
                        <ThumbCard
                          img={img}
                          index={i}
                          onHover={() => preloader.preload(img.src, LIGHTBOX_WIDTH)}
                          onClick={() => setLightboxIndex(i)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58 }}
              className="mt-7 pt-6 flex justify-end"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: '#d4b77d' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onCta(service.title)}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[#1a1008] font-bold text-sm tracking-wide transition-colors"
                style={{ backgroundColor: '#c8a96e', boxShadow: '0 4px 20px rgba(200,169,110,0.35)' }}
              >
                Заказать расчёт
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <PhotoLightbox
            images={galleryImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Thumbnail Card (вынесен для чистоты) ─────────────────────────────────────
function ThumbCard({
  img, index, onHover, onClick,
}: {
  img: GalleryItem;
  index: number;
  onHover: () => void;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer"
      style={{ height: 100, border: '1px solid rgba(255,255,255,0.06)' }}
      onMouseEnter={onHover}
      onTouchStart={onHover}
      onClick={onClick}
    >
      {/* Skeleton для миниатюр */}
      <ImageSkeleton loaded={loaded} />

      <Image
        src={img.src}
        alt={img.label}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="160px"
        loading={index === 0 ? 'eager' : 'lazy'}
        quality={70}
        onLoad={() => setLoaded(true)}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
        <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1.5px rgba(200,169,110,0.6)' }}
      />
    </div>
  );
}

// ─── Bento Card ───────────────────────────────────────────────────────────────
function BentoCard({
  service, index, onClick,
}: {
  service: Service;
  index: number;
  onClick: (s: Service) => void;
}) {
  const Icon = ICON_MAP[service.iconName] ?? Layers;
  const isFeatured = index === 0;

  // Preload при наведении на карточку услуги
  const handleHover = useCallback(() => {
    const category = SERVICE_GALLERY[service.title];
    if (!category) return;
    const imgs = GALLERY_ITEMS.filter(i => i.cat === category);
    preloader.preloadDeferred(imgs.map(i => i.src), LIGHTBOX_WIDTH, 300);
  }, [service.title]);

  return (
    <motion.button
      onClick={() => onClick(service)}
      onMouseEnter={handleHover}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative text-left rounded-2xl overflow-hidden cursor-pointer transition-all duration-500',
        CELL_CLASSES[index] ?? 'col-span-1 row-span-1',
        isFeatured ? 'min-h-[200px]' : 'min-h-[88px]',
      )}
      style={{
        background: isFeatured
          ? 'linear-gradient(145deg, rgba(200,169,110,0.08) 0%, rgba(255,255,255,0.02) 100%)'
          : 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(200,169,110,0.07) 0%, transparent 70%)' }}
      />
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(200,169,110,0.35)' }}
      />

      <div className={cn('relative z-10 h-full flex', isFeatured ? 'flex-col p-6' : 'items-center gap-3 p-4')}>
        <div
          className={cn(
            'shrink-0 flex items-center justify-center rounded-xl transition-all duration-300',
            isFeatured ? 'w-12 h-12 mb-auto group-hover:scale-110' : 'w-9 h-9 group-hover:scale-105',
          )}
          style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.12)' }}
        >
          <Icon size={isFeatured ? 24 : 18} className="text-[#c8a96e]" strokeWidth={1.4} />
        </div>
        <div className={isFeatured ? 'mt-3' : ''}>
          <p
            className={cn('font-semibold text-white group-hover:text-[#c8a96e] transition-colors', isFeatured ? 'text-lg mb-1.5' : 'text-sm leading-snug')}
            style={isFeatured ? { fontFamily: 'Georgia, serif' } : undefined}
          >
            {service.title}
          </p>
          {isFeatured && <p className="text-white/45 text-sm leading-relaxed line-clamp-2">{service.desc}</p>}
          {!isFeatured && <p className="text-white/35 text-[10px] mt-0.5 leading-snug line-clamp-1">{service.short}</p>}
        </div>
        {isFeatured && (
          <div className="mt-4 flex items-center gap-2 text-[#c8a96e] text-xs font-bold uppercase tracking-wider opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Подробнее <ArrowRight size={12} />
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (selectedService) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      return () => {
        document.body.style.overflow = '';
        document.body.style.height = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [selectedService]);

  const handleCta = useCallback((_title: string) => {
    setSelectedService(null);
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (!el) return;
      const isMobile = window.innerWidth < 1024;
      const offset = isMobile ? 106 : 68;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 300);
  }, []);

  return (
    <section
      id="services"
      className="relative py-10 lg:py-14 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a1008 0%, #150d05 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,169,110,0.06) 0%, transparent 70%)' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#c8a96e]" />
            <span className="text-[#c8a96e] text-xs tracking-[0.2em] uppercase font-semibold">Наши услуги</span>
            <div className="w-8 h-px bg-[#c8a96e]" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Что мы <em className="not-italic text-[#c8a96e]">изготавливаем</em>
          </h2>
          <p className="text-white/40 text-xs mt-2 max-w-md">
            Нажмите на карточку, чтобы узнать подробности и получить расчёт
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 auto-rows-auto">
          {SERVICES.map((s, i) => (
            <BentoCard key={s.id} service={s} index={i} onClick={setSelectedService} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onCta={handleCta}
          />
        )}
      </AnimatePresence>
    </section>
  );
}