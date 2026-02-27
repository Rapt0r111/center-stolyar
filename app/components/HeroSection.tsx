'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRODUCTS = [
  'Лестницы',
  'Двери',
  'Мебель из дерева',
  'Арки и проёмы',
  'Потолки и декор',
  'Библиотеки',
];

interface HeroSectionProps {
  onCta: () => void;
}

export default function HeroSection({ onCta }: HeroSectionProps) {
  const [visible, setVisible] = useState(false);
  const [activeProduct, setActiveProduct] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((p) => (p + 1) % PRODUCTS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #1a1008 0%, #3d2b1f 45%, #2a1d12 100%)',
      }}
    >
      {/* Decorative grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'400\' height=\'400\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Glowing accent orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#c8a96e]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#c8a96e]/8 blur-[100px] pointer-events-none" />

      {/* Vertical accent line */}
      <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-[#c8a96e]/40 to-transparent hidden xl:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
          <div
            className={cn(
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c8a96e]/30 bg-[#c8a96e]/10 text-[#c8a96e] text-xs tracking-widest uppercase mb-8 transition-all duration-700',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] animate-pulse" />
            Санкт-Петербург · С 2008 года
          </div>

          {/* Main heading */}
          <h1
            className={cn(
              'text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6 transition-all duration-700 delay-100',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            ЦЕНТР
            <br />
            <span className="text-[#c8a96e]">СТОЛЯРНЫХ</span>
            <br />
            ИЗДЕЛИЙ
          </h1>

          {/* Rotating product tagline */}
          <div
            className={cn(
              'flex items-center gap-3 mb-10 transition-all duration-700 delay-200',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            <div className="w-8 h-px bg-[#c8a96e]/60" />
            <p className="text-white/50 text-sm tracking-widest uppercase">Изготовим</p>
            <div className="overflow-hidden h-6">
              <p
                key={activeProduct}
                className="text-[#c8a96e] text-sm font-medium tracking-wider uppercase animate-[fadeSlideIn_0.4s_ease-out]"
              >
                {PRODUCTS[activeProduct]}
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            className={cn(
              'text-white/60 text-lg text-justify max-w-2xl leading-relaxed mb-12 transition-all duration-700 delay-300',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            Создаём эксклюзивные изделия из ценных пород дерева по индивидуальным
            проектам. Профессиональное производство, гарантия качества, доставка
            и монтаж по всему Санкт-Петербургу.
          </p>

          {/* CTA buttons */}
          <div
            className={cn(
              'flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-[400ms]',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            <button
              onClick={onCta}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#c8a96e] hover:bg-[#d4b87e] text-[#1a1008] font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(200,169,110,0.3)] hover:-translate-y-0.5 text-sm tracking-wide"
            >
              Получить консультацию
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="tel:+78126121515"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white hover:border-[#c8a96e]/60 hover:text-[#c8a96e] rounded-xl transition-all duration-200 text-sm"
            >
              +7 (812) 612-15-15
            </a>
          </div>

          {/* Stats strip */}
          <div
            className={cn(
              'mt-16 pt-8 border-t border-white/10 grid grid-cols-3 gap-8 max-w-lg transition-all duration-700 delay-500',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            {[
              { value: '16+', label: 'лет опыта' },
              { value: '500+', label: 'проектов' },
              { value: '100%', label: 'гарантия' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-[#c8a96e]">{stat.value}</p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
        <span className="text-xs uppercase tracking-widest">Прокрутите</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}
