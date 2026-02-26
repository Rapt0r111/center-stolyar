'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const SERVICES = [
  {
    icon: '🪜',
    title: 'Лестницы',
    desc: 'Маршевые, винтовые, на больцах — любые конструкции из дуба, ясеня и бука по вашему проекту.',
  },
  {
    icon: '🔩',
    title: 'Перила и поручни',
    desc: 'Деревянные и комбинированные ограждения, нержавеющие стойки, стеклянные вставки.',
  },
  {
    icon: '🚪',
    title: 'Двери',
    desc: 'Межкомнатные и входные двери из массива. Классика, модерн, лофт — под любой интерьер.',
  },
  {
    icon: '🪑',
    title: 'Мебель из дерева',
    desc: 'Столы, стулья, скамьи, шкафы, тумбы — мебель ручной работы под заказ.',
  },
  {
    icon: '🏛️',
    title: 'Арки и проёмы',
    desc: 'Деревянные арки для дверных проёмов: классические, романские, эллиптические формы.',
  },
  {
    icon: '✨',
    title: 'Потолки и декор',
    desc: 'Деревянные балки, рейки, кессоны, карнизы и декоративные молдинги для потолков.',
  },
  {
    icon: '📚',
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
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #2a1d12 0%, #1a1008 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#c8a96e]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#c8a96e]/6 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-[#c8a96e]" />
          <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Виды работ</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
          style={{ fontFamily: 'Georgia, serif' }}>
          Что мы <span className="text-[#c8a96e]">изготавливаем</span>
        </h2>
        <p className="text-white/50 max-w-xl mb-16 leading-relaxed">
          Полный цикл производства — от замера и проектирования до изготовления и монтажа.
        </p>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={cn(
                'group relative rounded-2xl p-6 cursor-default transition-all duration-500 hover:-translate-y-1',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                i === 6 ? 'sm:col-span-2 lg:col-span-1' : ''
              )}
              style={{
                transitionDelay: `${i * 60}ms`,
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(200,169,110,0.15)',
              }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'rgba(200,169,110,0.05)', boxShadow: '0 0 40px rgba(200,169,110,0.1)' }} />

              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#c8a96e]/40 to-transparent
                scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />

              <div className="relative">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">
                  {s.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-[#c8a96e] transition-colors">
                  {s.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                  {s.desc}
                </p>
              </div>

              {/* Corner bracket */}
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#c8a96e]/20 rounded-br group-hover:border-[#c8a96e]/50 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
