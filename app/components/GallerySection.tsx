'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Импорт Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const CATEGORIES = ['Все', 'Лестницы', 'Двери', 'Мебель', 'Арки'];

const GALLERY_ITEMS = [
  { id: 1, cat: 'Лестницы', label: 'Винтовая дубовая лестница', src: '/images/gallery/stair-1.jpg' },
  { id: 2, cat: 'Лестницы', label: 'Классическая маршевая лестница', src: '/images/gallery/stair-2.jpg' },
  { id: 3, cat: 'Лестницы', label: 'Лестница с коваными балясинами', src: '/images/gallery/stair-3.jpg' },
  { id: 4, cat: 'Лестницы', label: 'Элитная лестница из массива', src: '/images/gallery/stair-4.jpg' },
  { id: 5, cat: 'Лестницы', label: 'Парадная лестница', src: '/images/gallery/stair-5.jpg' },
  { id: 9, cat: 'Двери', label: 'Светлая классическая дверь', src: '/images/gallery/door-1.jpg' },
  { id: 10, cat: 'Двери', label: 'Парадная дверь с витражами', src: '/images/gallery/door-2.jpg' },
  { id: 11, cat: 'Двери', label: 'Раздвижные двери с узором', src: '/images/gallery/door-3.jpg' },
  { id: 15, cat: 'Мебель', label: 'Комод в классическом стиле', src: '/images/gallery/furniture-1.jpg' },
  { id: 16, cat: 'Мебель', label: 'Эксклюзивная прихожая', src: '/images/gallery/furniture-2.jpg' },
  { id: 17, cat: 'Мебель', label: 'Шкаф-купе', src: '/images/gallery/furniture-3.jpg' },
  { id: 21, cat: 'Арки', label: 'Прямоугольный портал', src: '/images/gallery/arch-1.jpg' },
];

export default function GalleryCompact() {
  const [filter, setFilter] = useState('Все');
  const [lightbox, setLightbox] = useState<typeof GALLERY_ITEMS[0] | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const filtered = filter === 'Все' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.cat === filter);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-16 lg:py-32 overflow-hidden"
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
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Галерея <span className="text-[#c8a96e]">проектов</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border',
                  filter === cat
                    ? 'bg-[#c8a96e] text-[#1a1008] border-[#c8a96e] shadow-lg shadow-[#c8a96e]/20'
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-[#c8a96e]/50 hover:text-white'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Слайдер с кнопками по бокам */}
        <div
          className={cn(
            'relative transition-all duration-1000 ease-out',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Левая стрелка */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group"
          >
            <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Правая стрелка */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-[#c8a96e]/30 bg-[#1a1008]/40 backdrop-blur-md flex items-center justify-center text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-500 group"
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
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 160,
              modifier: 2,
              slideShadows: false,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            {filtered.map((item) => (
              <SwiperSlide 
                key={item.id} 
                className="!w-[80%] sm:!w-[450px] h-auto [&.swiper-slide]:transition-all [&.swiper-slide]:duration-700 [&:not(.swiper-slide-active)]:opacity-30 [&:not(.swiper-slide-active)]:blur-[4px] [&:not(.swiper-slide-active)]:scale-90"
              >
                <div 
                  onClick={() => setLightbox(item)}
                  className="group relative h-[550px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/5"
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Затемнение снизу */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008] via-transparent to-transparent opacity-80" />

                  {/* Инфо */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[#c8a96e] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                      {item.cat}
                    </span>
                    <h3 className="text-white text-2xl lg:text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
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

       {/* Lightbox */}
       {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-[#c8a96e] transition-colors">
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-5xl w-full h-[80vh]" onClick={e => e.stopPropagation()}>
             <Image src={lightbox.src} alt={lightbox.label} fill className="object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}