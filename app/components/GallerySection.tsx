'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const CATEGORIES = ['Все', 'Лестницы', 'Двери', 'Мебель', 'Арки'];

// Я УБРАЛ свойство `span`, чтобы они больше не ломали сетку. 
// Теперь все фото будут идеально ровными.
const GALLERY_ITEMS = [
  // ЛЕСТНИЦЫ
  { id: 1, cat: 'Лестницы', label: 'Винтовая дубовая лестница', src: '/images/gallery/stair-1.jpg' },
  { id: 2, cat: 'Лестницы', label: 'Классическая маршевая лестница', src: '/images/gallery/stair-2.jpg' },
  { id: 3, cat: 'Лестницы', label: 'Лестница с коваными балясинами', src: '/images/gallery/stair-3.jpg' },
  { id: 4, cat: 'Лестницы', label: 'Элитная лестница из массива', src: '/images/gallery/stair-4.jpg' },
  { id: 5, cat: 'Лестницы', label: 'Парадная лестница', src: '/images/gallery/stair-5.jpg' },
  { id: 6, cat: 'Лестницы', label: 'Современная деревянная лестница', src: '/images/gallery/stair-6.jpg' },
  { id: 7, cat: 'Лестницы', label: 'Лестница в светлых тонах', src: '/images/gallery/stair-7.jpg' },
  { id: 8, cat: 'Лестницы', label: 'Тёмный дуб с подсветкой', src: '/images/gallery/stair-8.jpg' },

  // ДВЕРИ
  { id: 9, cat: 'Двери', label: 'Светлая классическая дверь', src: '/images/gallery/door-1.jpg' },
  { id: 10, cat: 'Двери', label: 'Парадная дверь с витражами и аркой', src: '/images/gallery/door-2.jpg' },
  { id: 11, cat: 'Двери', label: 'Раздвижные двери с художественным узором', src: '/images/gallery/door-3.jpg' },
  { id: 12, cat: 'Двери', label: 'Двустворчатая дверь со стеклом', src: '/images/gallery/door-4.jpg' },
  { id: 13, cat: 'Двери', label: 'Высокая дверь с витражной вставкой', src: '/images/gallery/door-5.jpg' },
  { id: 14, cat: 'Двери', label: 'Филенчатая дверь из массива дуба', src: '/images/gallery/door-6.jpg' },

  // МЕБЕЛЬ
  { id: 15, cat: 'Мебель', label: 'Комод и шкаф в классическом стиле', src: '/images/gallery/furniture-1.jpg' },
  { id: 16, cat: 'Мебель', label: 'Эксклюзивная прихожая с подсветкой', src: '/images/gallery/furniture-2.jpg' },
  { id: 17, cat: 'Мебель', label: 'Шкаф-купе с текстурой дерева', src: '/images/gallery/furniture-3.jpg' },
  { id: 18, cat: 'Мебель', label: 'Рабочая зона и торговое оборудование', src: '/images/gallery/furniture-4.jpg' },
  { id: 19, cat: 'Мебель', label: 'Стеллажи для оптики из массива', src: '/images/gallery/furniture-5.jpg' },
  { id: 20, cat: 'Мебель', label: 'Внутреннее наполнение шкафа', src: '/images/gallery/furniture-6.jpg' },

  // АРКИ
  { id: 21, cat: 'Арки', label: 'Прямоугольный портал из дуба', src: '/images/gallery/arch-1.jpg' },
  { id: 22, cat: 'Арки', label: 'Парадная арка с колоннами и светильниками', src: '/images/gallery/arch-2.jpg' },
  { id: 23, cat: 'Арки', label: 'Классический дверной портал с резьбой', src: '/images/gallery/arch-3.jpg' },
  { id: 24, cat: 'Арки', label: 'Белая полукруглая арка с золочением', src: '/images/gallery/arch-4.jpg' },
  { id: 25, cat: 'Арки', label: 'Оформление проема над лестницей', src: '/images/gallery/arch-5.jpg' },
  { id: 26, cat: 'Арки', label: 'Дверной портал в темном дереве', src: '/images/gallery/arch-6.jpg' },
];

export default function GallerySection() {
  const [filter, setFilter] = useState('Все');
  const [lightbox, setLightbox] = useState<typeof GALLERY_ITEMS[0] | null>(null);
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Берем 12 элементов для главной страницы (чтобы сетка была красивой 4x3)
  const filtered = filter === 'Все' 
    ? GALLERY_ITEMS.slice(0, 12) 
    : GALLERY_ITEMS.filter(i => i.cat === filter);

  return (
    <section id="gallery" ref={ref} className="py-24 lg:py-32 bg-[#f9f6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Шапка и Фильтры */}
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-[#c8a96e]" />
            <span className="text-[#c8a96e] text-sm tracking-[0.2em] uppercase font-semibold">Наши работы</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1008] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Галерея <span className="text-[#c8a96e]">проектов</span>
            </h2>
            
            {/* Кнопки фильтров */}
            <div className="flex flex-wrap gap-2 lg:gap-3 bg-white/60 p-1.5 rounded-2xl backdrop-blur-md border border-[#c8a96e]/20 shadow-sm">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    'px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                    filter === cat
                      ? 'bg-[#c8a96e] text-white shadow-md shadow-[#c8a96e]/30 scale-[1.02]'
                      : 'text-[#5a4a3f] hover:bg-[#c8a96e]/10 hover:text-[#1a1008]'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* СТРОГАЯ СЕТКА (Uniform Grid) */}
        <div className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-700 ease-out',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}>
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setLightbox(item)}
              // aspect-[4/5] делает все фото одинаковыми красивыми вертикальными карточками
              className="group relative w-full aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-[#e8e3dc]"
            >
              {/* Оптимизированное фото */}
              <Image
                src={item.src}
                alt={item.label}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              
              {/* Темный градиент снизу вверх (улучшен для читаемости текста) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0604]/90 via-[#0a0604]/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              
              {/* Иконка лупы (появляется при наведении) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Текст на карточке */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500 text-left">
                <span className="inline-block w-fit px-2 py-1 mb-3 text-[10px] font-bold tracking-widest uppercase text-[#c8a96e] bg-[#c8a96e]/10 border border-[#c8a96e]/30 rounded-md backdrop-blur-sm">
                  {item.cat}
                </span>
                <p className="text-white text-lg font-medium leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                  {item.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Лайтбокс (Просмотр на весь экран) */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-[#0a0604]/95 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-6xl h-full max-h-[85vh] rounded-2xl overflow-hidden flex flex-col justify-center items-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full h-full mb-6">
              <Image 
                  src={lightbox.src} 
                  alt={lightbox.label} 
                  fill
                  className="object-contain"
                  quality={100}
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0a0604] via-[#0a0604]/80 to-transparent text-center">
              <p className="text-[#c8a96e] text-sm uppercase tracking-[0.2em] font-medium mb-2">{lightbox.cat}</p>
              <p className="text-white text-3xl font-medium" style={{ fontFamily: 'Georgia, serif' }}>{lightbox.label}</p>
            </div>

            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#c8a96e] hover:text-[#1a1008] transition-all duration-300 z-50 border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}