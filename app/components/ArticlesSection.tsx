'use client';

import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

const ARTICLES = [
  {
    id: 1,
    date: '15 января 2026',
    tag: 'Материалы',
    title: 'Металлические ограждения лестниц из нержавеющей стали',
    excerpt: 'Нержавеющая сталь в сочетании с деревом — один из самых популярных запросов 2026 года. Рассказываем о видах и преимуществах.',
    image: '/images/article-1.jpeg',
  },
  {
    id: 2,
    date: '8 декабря 2025',
    tag: 'Дизайн',
    title: 'Тренды деревянных интерьеров: что актуально в 2026 году',
    excerpt: 'Натуральные фактуры, тёмные породы дерева и смешение стилей — разбираем главные тенденции в оформлении жилых пространств.',
    image: '/images/article-2.jpeg',
  },
  {
    id: 3,
    date: '22 ноября 2025',
    tag: 'Советы',
    title: 'Как выбрать породу дерева для лестницы: дуб, ясень или бук?',
    excerpt: 'Сравниваем три самые популярные породы для лестниц по прочности, внешнему виду и цене. Помогаем сделать правильный выбор.',
    image: '/images/article-3.jpeg',
  },
];

export default function ArticlesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
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
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Полезные <span className="text-[#c8a96e]">материалы</span>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-[#c8a96e] text-sm hover:text-[#d4b87e] flex items-center gap-2 group transition-colors whitespace-nowrap">
              Все статьи <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            'relative transition-all duration-1000 ease-out',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          
          {/* Навигация */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-1 transition-transform" />
          </button>

          <Swiper
            modules={[Navigation, Autoplay, EffectCoverflow]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            loop={false} // ОТКЛЮЧЕНО
            watchSlidesProgress={true} // Улучшает производительность анимаций
            slideToClickedSlide={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
            }}
            className="!overflow-visible"
          >
            {ARTICLES.map((a) => (
              <SwiperSlide 
                key={a.id} 
                // Убрали transition-all отсюда, чтобы не было дерганья
                className="!w-[85%] sm:!w-[420px] h-auto transition-opacity duration-500 [&:not(.swiper-slide-active)]:opacity-40 [&:not(.swiper-slide-active)]:blur-[2px]"
              >
                <article className={cn(
                  "group relative h-full rounded-3xl overflow-hidden flex flex-col transition-all duration-500 cursor-pointer shadow-2xl border border-white/5",
                  "bg-[#1a1008]/80 backdrop-blur-xl border-[#c8a96e]/10 hover:border-[#c8a96e]/30"
                )}>
                  
                  <div className="h-64 relative overflow-hidden w-full">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 420px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008] via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-[10px] text-white/90 font-medium uppercase tracking-wider">
                      <Calendar className="w-3 h-3 text-[#c8a96e]" /> {a.date}
                    </div>
                  </div>

                  <div className="p-8 flex-grow flex flex-col relative -mt-8 bg-gradient-to-b from-transparent to-[#1a1008]">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#c8a96e] text-[#1a1008] text-[10px] font-bold tracking-[0.15em] uppercase shadow-lg shadow-[#c8a96e]/20">
                        {a.tag}
                      </span>
                    </div>

                    <h3 className="text-white font-semibold text-xl lg:text-2xl leading-snug mb-4 group-hover:text-[#c8a96e] transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                      {a.title}
                    </h3>
                    
                    <p className="text-white/50 text-sm leading-relaxed mb-8 line-clamp-3 flex-grow">
                      {a.excerpt}
                    </p>
                    
                    <div className="mt-auto border-t border-white/5 pt-5 flex items-center justify-between">
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
  );
}