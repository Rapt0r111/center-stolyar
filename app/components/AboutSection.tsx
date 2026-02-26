'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const STATS = [
  { value: 16, suffix: '+', label: 'лет опыта', sublabel: 'с 2008 года' },
  { value: 500, suffix: '+', label: 'проектов', sublabel: 'выполнено' },
  { value: 12, suffix: '', label: 'пород дерева', sublabel: 'в работе' },
  { value: 100, suffix: '%', label: 'гарантия', sublabel: 'качества' },
];

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatCard({ value, suffix, label, sublabel, active }: typeof STATS[0] & { active: boolean }) {
  const count = useCountUp(value, 1600, active);
  return (
    <div className="text-center">
      <p className="text-4xl lg:text-5xl font-bold text-[#c8a96e]" style={{ fontFamily: 'Georgia, serif' }}>
        {count}{suffix}
      </p>
      <p className="text-[#1a1008] font-semibold mt-1 text-sm">{label}</p>
      <p className="text-[#3d2b1f]/50 text-xs mt-0.5">{sublabel}</p>
    </div>
  );
}

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="relative py-24 lg:py-32 bg-[#f5f0e8] overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, #c8a96e 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3d2b1f 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-px bg-[#c8a96e]" />
          <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">О компании</span>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
          {/* Left — text */}
          <div className={cn('transition-all duration-700', visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8')}>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1008] leading-tight mb-8"
              style={{ fontFamily: 'Georgia, serif' }}>
              Создаём красоту<br />
              <span className="text-[#c8a96e]">из дерева</span> с 2008
            </h2>
            <p className="text-[#3d2b1f]/70 text-lg leading-relaxed mb-6">
              Центр Столярных Изделий — производственная компания в Санкт-Петербурге,
              специализирующаяся на изготовлении эксклюзивных изделий из натурального
              дерева по индивидуальным проектам заказчика.
            </p>
            <p className="text-[#3d2b1f]/70 leading-relaxed mb-8">
              Мы работаем с ценными породами: дуб, ясень, бук, сосна, лиственница,
              орех. Каждое изделие создаётся с учётом пожеланий клиента — от
              классических форм до современного минимализма.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Собственное производство', 'Доставка и монтаж', 'Гарантия 2 года', 'Авторский дизайн'].map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-[#c8a96e]/15 text-[#3d2b1f] rounded-full text-xs font-medium border border-[#c8a96e]/30">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — blockquote card */}
          <div className={cn('transition-all duration-700 delay-200', visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8')}>
            <div className="relative rounded-2xl overflow-hidden p-8 lg:p-10"
              style={{ background: 'linear-gradient(135deg, #3d2b1f 0%, #1a1008 100%)' }}>
              {/* Grain */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '150px' }} />
              <div className="absolute top-6 right-8 text-[#c8a96e]/20 text-8xl font-serif leading-none select-none">&quot;</div>
              <blockquote className="relative">
                <p className="text-white/90 text-xl lg:text-2xl leading-relaxed font-light italic mb-8"
                  style={{ fontFamily: 'Georgia, serif' }}>
                  Каждая деталь — это результат мастерства, уважения к материалу и внимания к пожеланиям клиента.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#c8a96e] flex items-center justify-center text-[#1a1008] font-bold text-sm">ЦСИ</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Центр Столярных Изделий</p>
                    <p className="text-[#c8a96e] text-xs">г. Санкт-Петербург</p>
                  </div>
                </div>
              </blockquote>
              {/* Decorative corner lines */}
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#c8a96e]/30 rounded-bl" />
              <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#c8a96e]/30 rounded-tl" />
            </div>

            {/* Values list */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: '🌳', text: 'Натуральное дерево' },
                { icon: '✦', text: 'Индивидуальный подход' },
                { icon: '🔧', text: 'Профессиональный монтаж' },
                { icon: '📐', text: 'Точные замеры' },
              ].map(v => (
                <div key={v.text} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-[#c8a96e]/20">
                  <span className="text-lg">{v.icon}</span>
                  <span className="text-[#1a1008] text-xs font-medium">{v.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className={cn(
          'grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-[#c8a96e]/20 transition-all duration-700 delay-300',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        )}>
          {STATS.map(s => <StatCard key={s.label} {...s} active={visible} />)}
        </div>
      </div>
    </section>
  );
}
