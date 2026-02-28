// ─── Server Component — no 'use client' ─────────────────────────────────────
// Only the animated counters need the client; everything else renders on server.

import Image from 'next/image';
import { STATS } from '@/lib/data';
import StatsRow from './statsrow';

const TAGS = [
  'Собственное производство',
  'Доставка и монтаж',
  'Гарантия 2 года',
  'Авторский дизайн',
] as const;

const VALUES = [
  { icon: '🌳', text: 'Натуральное дерево'       },
  { icon: '✦',  text: 'Индивидуальный подход'   },
  { icon: '🔧', text: 'Профессиональный монтаж'  },
  { icon: '📐', text: 'Точные замеры'            },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="relative py-16 lg:py-20 bg-[#f5f0e8] overflow-hidden">
      {/* Background accents */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, #c8a96e 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3d2b1f 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-[#c8a96e]" />
          <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">
            О компании
          </span>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <h2
              className="text-4xl lg:text-5xl font-bold text-[#1a1008] leading-tight mb-8"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Создаём красоту
              <br />
              <span className="text-[#c8a96e]">из дерева</span> с 2008
            </h2>

            <p className="text-[#3d2b1f]/70 text-lg leading-relaxed mb-6">
              Центр Столярных Изделий — производственная компания в Санкт-Петербурге,
              специализирующаяся на изготовлении эксклюзивных изделий из натурального
              дерева по индивидуальным проектам заказчика.
            </p>
            <p className="text-[#3d2b1f]/70 leading-relaxed mb-8">
              Мы работаем с ценными породами: дуб, ясень, бук, сосна, лиственница, орех.
              Каждое изделие создаётся с учётом пожеланий клиента — от классических форм
              до современного минимализма.
            </p>

            <div className="flex flex-wrap gap-3">
              {TAGS.map(tag => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full text-[#3d2b1f] text-xs font-medium"
                  style={{
                    background: 'rgba(200,169,110,0.12)',
                    border: '1px solid rgba(200,169,110,0.28)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — blockquote card */}
          <div>
            <div
              className="relative rounded-2xl overflow-hidden p-8 lg:p-10 grain"
              style={{ background: 'linear-gradient(135deg, #3d2b1f 0%, #1a1008 100%)' }}
            >
              <div className="absolute top-6 right-8 text-[#c8a96e]/20 text-8xl font-serif leading-none select-none">
                &quot;
              </div>

              <blockquote className="relative">
                <p
                  className="text-white/90 text-xl lg:text-2xl leading-relaxed font-light italic mb-8"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Каждая деталь — это результат мастерства, уважения к материалу и
                  внимания к пожеланиям клиента.
                </p>

                <div className="flex items-center gap-4">
                  <Image
                    src="/images/logo-black.png"
                    alt="ЦСИ Логотип"
                    width={100}
                    height={80}
                    className="object-contain"
                    priority
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">
                      Центр Столярных Изделий
                    </p>
                    <p className="text-[#c8a96e] text-xs">г. Санкт-Петербург</p>
                  </div>
                </div>
              </blockquote>

              {/* Corner accents */}
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#c8a96e]/30 rounded-bl" />
              <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#c8a96e]/30 rounded-tl" />
            </div>

            {/* Values grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {VALUES.map(v => (
                <div
                  key={v.text}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(200,169,110,0.18)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span className="text-lg">{v.icon}</span>
                  <span className="text-[#1a1008] text-xs font-medium">{v.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats — client island for animated counters */}
        <StatsRow stats={STATS} />
      </div>
    </section>
  );
}