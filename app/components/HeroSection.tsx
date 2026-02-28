'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

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

// Современный компонент для Flip-анимации текста
const FlipText = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="relative flex items-center h-8 overflow-hidden">
      <AnimatePresence mode="popLayout">
        {words.map((word, i) => (
          i === index && (
            <motion.div
              key={word}
              className="flex items-center whitespace-nowrap"
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={`${word}-${charIndex}`}
                  variants={{
                    initial: { 
                      y: 40, 
                      rotateX: -90, 
                      opacity: 0, 
                      filter: 'blur(10px)' 
                    },
                    animate: { 
                      y: 0, 
                      rotateX: 0, 
                      opacity: 1, 
                      filter: 'blur(0px)',
                      transition: {
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1], // Custom spring-like easing
                        delay: charIndex * 0.03, // Stagger effect
                      }
                    },
                    exit: { 
                      y: -40, 
                      rotateX: 90, 
                      opacity: 0, 
                      filter: 'blur(10px)',
                      transition: {
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                        delay: charIndex * 0.02,
                      }
                    }
                  }}
                  className="inline-block text-[#c8a96e] text-sm font-bold tracking-wider uppercase origin-center transform-gpu"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default function HeroSection({ onCta }: HeroSectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
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
        className="absolute inset-0 opacity-[0.04] pointer-events-none select-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'400\' height=\'400\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Glowing accent orbs */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#c8a96e]/10 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#c8a96e]/8 blur-[100px] pointer-events-none" 
      />

      {/* Vertical accent line */}
      <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-[#c8a96e]/40 to-transparent hidden xl:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 md:pb-40">
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

          {/* Rotating product tagline - Modernized */}
          <div
            className={cn(
              'flex items-center gap-3 mb-10 transition-all duration-700 delay-200',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            <div className="w-8 h-px bg-[#c8a96e]/60" />
            <p className="text-white/50 text-sm tracking-widest uppercase">Изготовим</p>
            {/* New Flip Component */}
            <FlipText words={PRODUCTS} />
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
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#c8a96e] hover:bg-[#d4b87e] text-[#1a1008] font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(200,169,110,0.4)] hover:-translate-y-1 active:translate-y-0 text-sm tracking-wide"
            >
              Получить консультацию
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="tel:+78126121515"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white hover:border-[#c8a96e]/60 hover:text-[#c8a96e] rounded-xl transition-all duration-200 text-sm hover:bg-white/5 backdrop-blur-sm"
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/30 pointer-events-none"
      >
        <span className="text-xs uppercase tracking-widest">Прокрутите</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}