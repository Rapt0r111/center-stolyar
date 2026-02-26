'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Все', 'Лестницы', 'Двери', 'Мебель', 'Арки'];

const GALLERY_ITEMS = [
  { id: 1, cat: 'Лестницы', label: 'Дубовая лестница', gradient: 'linear-gradient(135deg,#5c3d1e,#8b6340)', span: 'col-span-2 row-span-2' },
  { id: 2, cat: 'Двери',    label: 'Дверь из массива', gradient: 'linear-gradient(135deg,#3d2b1f,#6b4c35)', span: '' },
  { id: 3, cat: 'Мебель',   label: 'Обеденный стол',   gradient: 'linear-gradient(135deg,#6b4c35,#9c7a56)', span: '' },
  { id: 4, cat: 'Арки',     label: 'Классическая арка', gradient: 'linear-gradient(135deg,#2a1d12,#5c3d1e)', span: '' },
  { id: 5, cat: 'Лестницы', label: 'Лестница на больцах', gradient: 'linear-gradient(135deg,#4a3020,#7a5c3e)', span: '' },
  { id: 6, cat: 'Мебель',   label: 'Библиотечный шкаф', gradient: 'linear-gradient(135deg,#8b6340,#c8a96e)', span: 'row-span-2' },
  { id: 7, cat: 'Двери',    label: 'Арочная дверь', gradient: 'linear-gradient(135deg,#3d2b1f,#7a5c3e)', span: '' },
  { id: 8, cat: 'Лестницы', label: 'Перила из нержавейки', gradient: 'linear-gradient(135deg,#5c3d1e,#9c7a56)', span: '' },
  { id: 9, cat: 'Арки',     label: 'Арка-проём', gradient: 'linear-gradient(135deg,#2a1d12,#6b4c35)', span: '' },
  { id:10, cat: 'Мебель',   label: 'Кухонный гарнитур', gradient: 'linear-gradient(135deg,#6b4c35,#c8a96e)', span: '' },
  { id:11, cat: 'Двери',    label: 'Двустворчатая дверь', gradient: 'linear-gradient(135deg,#4a3020,#8b6340)', span: '' },
  { id:12, cat: 'Лестницы', label: 'Деревянный поручень', gradient: 'linear-gradient(135deg,#3d2b1f,#9c7a56)', span: '' },
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

  const filtered = filter === 'Все' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.cat === filter);

  return (
    <section id="gallery" ref={ref} className="py-24 lg:py-32 bg-[#f5f0e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-[#c8a96e]" />
          <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Наши работы</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1008] leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}>
            Галерея <span className="text-[#c8a96e]">проектов</span>
          </h2>
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                  filter === cat
                    ? 'bg-[#c8a96e] text-[#1a1008] shadow-md'
                    : 'bg-white/60 text-[#3d2b1f] border border-[#c8a96e]/20 hover:border-[#c8a96e]/50'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className={cn(
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px] transition-all duration-500',
          visible ? 'opacity-100' : 'opacity-0'
        )}>
          {filtered.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setLightbox(item)}
              className={cn(
                'group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5',
                item.span
              )}
              style={{ background: item.gradient, animationDelay: `${i * 60}ms` }}
            >
              {/* Wood grain texture */}
              <div className="absolute inset-0 opacity-[0.08]"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.08) 4px)' }} />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
              </div>
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-white/60 text-xs">{item.cat}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: lightbox.gradient }}
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.08) 4px)' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-white text-2xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>{lightbox.label}</p>
              <p className="text-white/60 text-sm mt-2">{lightbox.cat}</p>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
