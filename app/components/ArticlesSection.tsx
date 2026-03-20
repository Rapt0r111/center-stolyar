'use client';

/**
 * ArticlesSection.tsx — animation & image loading rewrite
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ПРИЧИНА ЛАГОВ (устранена):
 * ───────────────────────────────────────────────────────────────────────────
 * layoutId на motion.article → ArticleModal создавал shared layout animation.
 * Framer Motion измерял позицию карточки внутри Swiper-контейнера, который
 * имеет CSS transform: translate3d + rotateY (EffectCoverflow).
 *
 * getBoundingClientRect() возвращает экранные координаты с учётом 3D-трансформа,
 * но Framer Motion не всегда корректно учитывает вложенные CSS 3D-трансформации
 * при расчёте interpolation matrix → на каждом кадре анимации expensive layout
 * recalculation + неправильная интерполяция позиции → визуальный "рывок".
 *
 * РЕШЕНИЕ:
 * ─────────────────────────────────────────────────────────────────────────
 * 1. Убраны layoutId из карточки и модалки. Убран LayoutGroup.
 *
 * 2. Модалка открывается простой scale(0.94→1) + translateY(12px→0) + fade.
 *    Всё 100% GPU-composited (только transform + opacity).
 *    Zero layout recalculations.
 *
 * 3. will-change: transform на контейнере модалки — GPU layer создаётся
 *    заранее, первый кадр не тратится на его промоушен.
 *
 * 4. Карточка: убран motion.article → нативный <article> с CSS hover.
 *    Hover-scale через CSS transform (не через JS Framer Motion).
 *
 * 5. decode() на pointerenter — к клику (~150-300мс) изображение декодировано
 *    в GPU, skeleton не показывается вообще.
 */

import { ArrowRight, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ARTICLES } from '@/lib/data';
import type { Article } from '@/lib/data';
import {
  preloader,
  ARTICLE_MODAL_WIDTH,
  QUALITY_THUMB,
} from '@/lib/image-preloader';
import ImageSkeleton from '@/app/components/ui/ImageSkeleton';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

// ─── Scroll lock ───────────────────────────────────────────────────────────────
function lockBodyScroll(): number {
  const y = window.scrollY;
  document.documentElement.style.overflow = 'hidden';
  return y;
}
function unlockBodyScroll(savedY: number) {
  document.documentElement.style.overflow = '';
  if (Math.abs(window.scrollY - savedY) > 1) {
    window.scrollTo({ top: savedY, behavior: 'instant' });
  }
}

// ─── Modal animation variants ─────────────────────────────────────────────────
// FIX: простые GPU-composited варианты без layoutId
import type { Variants } from 'framer-motion';

const backdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18, ease: [0, 0, 0.2, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } },
};

const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.94, y: 14 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 360, mass: 0.7 },
  },
  exit:    {
    opacity: 0, scale: 0.97, y: 6,
    transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
  },
};

// ─── Article Modal ─────────────────────────────────────────────────────────────
function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  const [imgLoaded, setImgLoaded] = useState(
    () => preloader.isReady(article.image, ARTICLE_MODAL_WIDTH, QUALITY_THUMB),
  );
  const titleId = useId();
  const savedScrollY = useRef(0);

  useEffect(() => {
    savedScrollY.current = lockBodyScroll();
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      unlockBodyScroll(savedScrollY.current);
    };
  }, [onClose]);

  const paragraphs = article.fullContent.split('\n\n').filter(p => p.trim());

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop */}
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel — GPU-composited scale+fade, no layoutId */}
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden z-10 flex flex-col"
        style={{
          background: 'linear-gradient(145deg, #1f1208 0%, #150d05 100%)',
          border: '1px solid rgba(200,169,110,0.2)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          maxHeight: '92vh',
          willChange: 'transform',   // GPU layer создаётся заранее
        }}
      >
        {/* Image header */}
        <div className="relative h-52 sm:h-64 shrink-0 bg-[#1a1008]">
          <ImageSkeleton loaded={imgLoaded} />
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 672px"
            priority
            quality={QUALITY_THUMB}
            draggable={false}
            onLoad={() => setImgLoaded(true)}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#150d05] via-transparent to-transparent opacity-90 pointer-events-none"
            aria-hidden="true"
          />
          <button
            onClick={onClose}
            aria-label="Закрыть статью"
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-all backdrop-blur-sm z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] text-white/90 font-medium uppercase tracking-wider backdrop-blur-md pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.1)' }}
            aria-hidden="true"
          >
            <Calendar className="w-3 h-3 text-[#c8a96e]" />
            {article.date}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-6 sm:p-8">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#c8a96e] text-[#1a1008] text-[10px] font-bold tracking-[0.15em] uppercase shadow-lg shadow-[#c8a96e]/20">
              {article.tag}
            </span>
            <h2
              id={titleId}
              className="text-white text-2xl sm:text-3xl font-bold leading-snug mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {article.title}
            </h2>
            <div className="space-y-4">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-white/70 text-sm sm:text-base leading-relaxed">{para}</p>
              ))}
            </div>
            <div
              className="mt-8 pt-6 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-white/25 text-xs">Центр Столярных Изделий</p>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[#1a1008] text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: '#c8a96e', boxShadow: '0 4px 20px rgba(200,169,110,0.3)' }}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drag handle */}
        <div
          className="sm:hidden absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 pointer-events-none"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ArticlesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Прогрев до входа во viewport
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
    preloader.decodeMany(ARTICLES.map(a => a.image), ARTICLE_MODAL_WIDTH, QUALITY_THUMB);
  }, [visible]);

  // GPU-декодинг на hover
  const handleCardPreload = useCallback((article: Article) => {
    preloader.decode(article.image, ARTICLE_MODAL_WIDTH, QUALITY_THUMB);
  }, []);

  return (
    <section
      id="articles"
      ref={sectionRef}
      aria-label="Блог — полезные материалы"
      className="py-16 lg:py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a1008 0%, #2a1d12 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4" aria-hidden="true">
              <div className="w-12 h-px bg-[#c8a96e]" />
              <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Блог</span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Полезные <span className="text-[#c8a96e]">материалы</span>
            </h2>
          </div>
          <button
            className="text-[#c8a96e] text-sm hover:text-[#d4b87e] flex items-center gap-2 group transition-colors whitespace-nowrap"
            aria-label="Смотреть все статьи"
          >
            Все статьи
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>
        </div>

        <div className={cn(
          'relative transition-all duration-700 ease-out',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        )}>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Предыдущая статья"
            className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group shadow-2xl"
          >
            <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Следующая статья"
            className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group shadow-2xl"
          >
            <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>

          {/* Swipe-fix CSS */}
          <style>{`
            .articles-coverflow-swiper .swiper-wrapper { touch-action: pan-y; }
            .articles-coverflow-swiper .swiper-slide img { -webkit-user-drag: none; pointer-events: none; }
            .articles-coverflow-swiper .swiper-slide * { user-select: none; -webkit-user-select: none; }
            .articles-coverflow-swiper .swiper-slide { isolation: isolate; touch-action: pan-y; }
            .articles-coverflow-swiper .swiper-slide-active { opacity: 1 !important; filter: none !important; z-index: 10 !important; }
            .articles-coverflow-swiper .swiper-slide-prev,
            .articles-coverflow-swiper .swiper-slide-next { z-index: 5 !important; }
            .articles-coverflow-swiper .swiper-slide:not(.swiper-slide-active):not(.swiper-slide-prev):not(.swiper-slide-next) { z-index: 1 !important; }

            /* FIX: CSS hover scale на карточке вместо Framer Motion — нет JS overhead */
            .article-card {
              transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                          box-shadow 0.3s ease;
            }
            .article-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 24px 48px rgba(0,0,0,0.4);
            }
            .article-card:active { transform: translateY(0); }
          `}</style>

          <div className="articles-coverflow-swiper">
            <Swiper
              modules={[Autoplay, EffectCoverflow]}
              onSwiper={swiper => { swiperRef.current = swiper; }}
              effect="coverflow"
              grabCursor
              centeredSlides
              slidesPerView="auto"
              slideToClickedSlide
              coverflowEffect={{ rotate: 0, stretch: 0, depth: 350, modifier: 2, slideShadows: false }}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              watchSlidesProgress
              simulateTouch
              touchStartPreventDefault={false}
              resistance
              resistanceRatio={0.85}
              speed={500}
              threshold={5}
            >
              {ARTICLES.map((a, i) => (
                <SwiperSlide key={a.id} className="!w-[85%] sm:!w-[420px] h-auto">
                  {/*
                   * FIX: нативный <article> вместо motion.article.
                   * CSS hover через .article-card class — GPU transform, нет JS.
                   * Убраны layoutId, transition prop, role="button" дублирования.
                   */}
                  <article
                    className="article-card group relative h-full rounded-3xl overflow-hidden flex flex-col cursor-pointer shadow-2xl bg-[#1a1008]/80"
                    style={{
                      border: '1px solid rgba(200,169,110,0.1)',
                      touchAction: 'pan-y',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                    }}
                    onClick={() => setActiveArticle(a)}
                    onPointerEnter={() => handleCardPreload(a)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Читать статью: ${a.title}`}
                    onKeyDown={e => e.key === 'Enter' && setActiveArticle(a)}
                  >
                    <div className="h-64 relative overflow-hidden w-full shrink-0">
                      <Image
                        src={a.image}
                        alt={a.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 85vw, 420px"
                        priority={i < 2}
                        loading={i < 2 ? undefined : 'eager'}
                        quality={QUALITY_THUMB}
                        draggable={false}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIwIiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDIwIiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzFhMTAwOCIvPjwvc3ZnPg=="
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-[#1a1008] via-transparent to-transparent opacity-90 pointer-events-none"
                        aria-hidden="true"
                      />
                      <div
                        className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] text-white/90 font-medium uppercase tracking-wider pointer-events-none"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        aria-hidden="true"
                      >
                        <Calendar className="w-3 h-3 text-[#c8a96e]" />
                        {a.date}
                      </div>
                    </div>

                    <div className="p-8 flex-grow flex flex-col -mt-8 bg-gradient-to-b from-transparent to-[#1a1008]">
                      <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#c8a96e] text-[#1a1008] text-[10px] font-bold tracking-[0.15em] uppercase self-start shadow-lg shadow-[#c8a96e]/20">
                        {a.tag}
                      </span>
                      <h3
                        className="text-white font-semibold text-xl lg:text-2xl leading-snug mb-4 group-hover:text-[#c8a96e] transition-colors flex-grow"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {a.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-8 line-clamp-3">
                        {a.excerpt}
                      </p>
                      <div
                        className="mt-auto pt-5 flex items-center justify-between"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <span
                          className="text-[#c8a96e] text-sm font-bold uppercase tracking-widest group-hover:text-[#d4b87e] transition-colors flex items-center gap-2"
                          aria-hidden="true"
                        >
                          Читать полностью
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </span>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* AnimatePresence для корректного exit animation */}
      <AnimatePresence>
        {activeArticle && (
          <ArticleModal
            key={activeArticle.id}
            article={activeArticle}
            onClose={() => setActiveArticle(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}