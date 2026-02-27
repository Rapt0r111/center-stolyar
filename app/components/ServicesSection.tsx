'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Fence, 
  DoorOpen, 
  Armchair, 
  SquareSplitVertical, 
  Layers, 
  Library,
  createLucideIcon
} from 'lucide-react';

// Создаем полноценную иконку в стиле Lucide
const Stairs = createLucideIcon('Stairs', [
  ['path', { d: 'M3 21h18', key: '1' }],
  ['path', { d: 'M3 21v-4h4v-4h4v-4h4v-4h4', key: '2' }],
]);

const SERVICES = [
  {
    icon: Stairs,
    title: 'Лестницы',
    desc: 'Маршевые, винтовые, на больцах — любые конструкции из дуба, ясеня и бука по вашему проекту.',
  },
  {
    icon: Fence,
    title: 'Перила и поручни',
    desc: 'Деревянные и комбинированные ограждения, нержавеющие стойки, стеклянные вставки.',
  },
  {
    icon: DoorOpen,
    title: 'Двери',
    desc: 'Межкомнатные и входные двери из массива. Классика, модерн, лофт — под любой интерьер.',
  },
  {
    icon: Armchair,
    title: 'Мебель из дерева',
    desc: 'Столы, стулья, скамьи, шкафы, тумбы — мебель ручной работы под заказ.',
  },
  {
    icon: SquareSplitVertical,
    title: 'Арки и проёмы',
    desc: 'Деревянные арки для дверных проёмов: классические, романские, эллиптические формы.',
  },
  {
    icon: Layers,
    title: 'Потолки и декор',
    desc: 'Деревянные балки, рейки, кессоны, карнизы и декоративные молдинги для потолков.',
  },
  {
    icon: Library,
    title: 'Кабинеты и библиотеки',
    desc: 'Встроенные стеллажи, шкафы-купе, библиотеки и панели из ценных пород дерева.',
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden bg-[#1a1008]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-[#c8a96e]" />
          <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Виды работ</span>
        </div>
        
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-16 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Что мы <span className="text-[#c8a96e]">изготавливаем</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon; // Берем компонент иконки
            
            return (
              <div
                key={s.title}
                className={cn(
                  'group relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{
                  transitionDelay: `${i * 60}ms`,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(200,169,110,0.15)',
                }}
              >
                <div className="relative z-10">
                  <div className="mb-6">
                    {/* Теперь все иконки (включая лестницу) рендерятся одинаково */}
                    <Icon 
                      size={32} 
                      strokeWidth={1.5} 
                      className="text-[#c8a96e] group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-[#c8a96e] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}