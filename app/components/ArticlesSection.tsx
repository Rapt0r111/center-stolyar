'use client';

import { ArrowRight, Calendar } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Обновленный массив: добавлено поле image
const ARTICLES = [
  {
    date: '15 января 2026',
    tag: 'Материалы',
    title: 'Металлические ограждения лестниц из нержавеющей стали',
    excerpt: 'Нержавеющая сталь в сочетании с деревом — один из самых популярных запросов 2026 года. Рассказываем о видах и преимуществах.',
    color: '#5c3d1e',
    image: '/images/article-1.jpeg', // Путь к первому фото (кованые перила)
  },
  {
    date: '8 декабря 2025',
    tag: 'Дизайн',
    title: 'Тренды деревянных интерьеров: что актуально в 2026 году',
    excerpt: 'Натуральные фактуры, тёмные породы дерева и смешение стилей — разбираем главные тенденции в оформлении жилых пространств.',
    color: '#3d2b1f',
    image: '/images/article-2.jpeg', // Путь ко второму фото (витрины и стол)
  },
  {
    date: '22 ноября 2025',
    tag: 'Советы',
    title: 'Как выбрать породу дерева для лестницы: дуб, ясень или бук?',
    excerpt: 'Сравниваем три самые популярные породы для лестниц по прочности, внешнему виду и цене. Помогаем сделать правильный выбор.',
    color: '#4a3020',
    image: '/images/article-3.jpeg', // Путь к третьему фото (ступени на металлокаркасе)
  },
];

export default function ArticlesSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="articles" ref={ref} className="py-24 lg:py-32"
      style={{ background: 'linear-gradient(180deg, #1a1008 0%, #2a1d12 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-[#c8a96e]" />
          <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Статьи</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}>
            Полезные <span className="text-[#c8a96e]">материалы</span>
          </h2>
          <button className="text-[#c8a96e] text-sm hover:text-[#d4b87e] flex items-center gap-2 group transition-colors">
            Все статьи <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ARTICLES.map((a, i) => (
            <article
              key={a.title}
              className={cn(
                'group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] cursor-pointer flex flex-col',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{
                transitionDelay: `${i * 100}ms`,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(200,169,110,0.12)',
              }}
            >
              {/* Color bar top */}

              {/* Изображение статьи */}
              <div className="h-56 relative overflow-hidden w-full">
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                {/* Легкий градиент поверх картинки, чтобы она мягче вписывалась в темный дизайн */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a1d12]/80 via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c8a96e]/15 text-[#c8a96e] text-xs font-medium border border-[#c8a96e]/20">
                    {a.tag}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/30 text-xs">
                    <Calendar className="w-3 h-3" /> {a.date}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-base leading-snug mb-3 group-hover:text-[#c8a96e] transition-colors line-clamp-2">
                  {a.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{a.excerpt}</p>
                <button className="flex items-center gap-2 text-[#c8a96e] text-sm font-medium group/btn hover:text-[#d4b87e] transition-colors mt-auto w-fit">
                  Подробнее
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}