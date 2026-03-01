'use client';

import { ArrowRight, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ARTICLES } from '@/lib/data';
import type { Article } from '@/lib/data';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

// ─── Article Modal ────────────────────────────────────────────────────────────
function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Split content into paragraphs
  const paragraphs = article.fullContent
    .split('\n\n')
    .filter(p => p.trim());

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden z-10 flex flex-col"
        style={{
          background: 'linear-gradient(145deg, #1f1208 0%, #150d05 100%)',
          border: '1px solid rgba(200,169,110,0.2)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          maxHeight: '92vh',
        }}
      >
        {/* Cover image */}
        <div className="relative h-52 sm:h-64 shrink-0 bg-[#1a1008]">
          {!imgLoaded && (
            <div className="absolute inset-0 z-10">
              <div
                className="w-full h-full animate-pulse"
                style={{ background: 'linear-gradient(90deg, #2a1a0e 25%, #3d2b1f 50%, #2a1a0e 75%)', backgroundSize: '200% 100%' }}
              />
              {/* Иконка изображения по центру */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#c8a96e]/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
            </div>
          )}
          <Image
            src={article.image}
            alt={article.title}
            fill
            className={cn(
              "object-cover transition-opacity duration-500",
              imgLoaded ? "opacity-100" : "opacity-0"  // ← плавное появление
            )}
            sizes="(max-width: 640px) 100vw, 672px"
            priority
            onLoad={() => setImgLoaded(true)}  // ← триггер
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#150d05] via-transparent to-transparent opacity-90" />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-all backdrop-blur-sm z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Date badge */}
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] text-white/90 font-medium uppercase tracking-wider backdrop-blur-md"
            style={{
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
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
              className="text-white text-2xl sm:text-3xl font-bold leading-snug mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {article.title}
            </h2>

            <div className="space-y-4">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-white/70 text-sm sm:text-base leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Bottom CTA */}
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

        {/* Mobile drag indicator */}
        <div className="sm:hidden absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />
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

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section
        id="articles"
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
                <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Блог</span>
              </div>
              <h2
                className="text-4xl lg:text-5xl font-bold text-white leading-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Полезные <span className="text-[#c8a96e]">материалы</span>
              </h2>
            </div>

            <button className="text-[#c8a96e] text-sm hover:text-[#d4b87e] flex items-center gap-2 group transition-colors whitespace-nowrap">
              Все статьи
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Slider */}
          {/* Slider */}
          <div
            className={cn(
              'relative transition-all duration-1000 ease-out',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            {/* ── Preload: браузер начнёт скачивать картинки до открытия модалки ── */}
            <div className="sr-only" aria-hidden="true">
              {ARTICLES.map(a => (
                <Image
                  key={a.id}
                  src={a.image}
                  alt=""
                  width={1}
                  height={1}
                  priority
                />
              ))}
            </div>

            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Предыдущая статья"
              className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group shadow-2xl"
            >
              <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 group-hover:-translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Следующая статья"
              className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group shadow-2xl"
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
              slideToClickedSlide
              coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows: false }}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
            >
              {ARTICLES.map(a => (
                <SwiperSlide
                  key={a.id}
                  className="!w-[85%] sm:!w-[420px] h-auto"
                >
                  <article
                    onClick={() => setActiveArticle(a)}
                    className={cn(
                      'group relative h-full rounded-3xl overflow-hidden flex flex-col',
                      'cursor-pointer shadow-2xl transition-all duration-500',
                      'bg-[#1a1008]/80 backdrop-blur-xl',
                    )}
                    style={{ border: '1px solid rgba(200,169,110,0.1)' }}
                  >
                    {/* Cover */}
                    <div className="h-64 relative overflow-hidden w-full shrink-0">
                      <Image
                        src={a.image}
                        alt={a.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 768px) 85vw, 420px"
                        priority={a.id <= 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008] via-transparent to-transparent opacity-90" />

                      <div
                        className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] text-white/90 font-medium uppercase tracking-wider"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <Calendar className="w-3 h-3 text-[#c8a96e]" />
                        {a.date}
                      </div>
                    </div>

                    {/* Body */}
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
                        <span className="text-[#c8a96e] text-sm font-bold uppercase tracking-widest group-hover:text-[#d4b87e] transition-colors flex items-center gap-2">
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
      </section>

      {/* Article modal */}
      <AnimatePresence>
        {activeArticle && (
          <ArticleModal
            article={activeArticle}
            onClose={() => setActiveArticle(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}