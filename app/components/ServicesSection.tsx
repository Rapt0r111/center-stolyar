'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { SERVICES } from '@/lib/data';
import type { Service } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fence, DoorOpen, Armchair, SquareSplitVertical,
  Layers, Library, createLucideIcon, X, ArrowRight,
  type LucideIcon,
} from 'lucide-react';

const Stairs = createLucideIcon('Stairs', [
  ['path', { d: 'M3 21h18', key: 'base' }],
  ['path', { d: 'M3 21v-4h4v-4h4v-4h4v-4h4', key: 'steps' }],
]);

const ICON_MAP: Record<string, LucideIcon> = {
  Stairs, Fence, DoorOpen, Armchair, SquareSplitVertical, Layers, Library,
};

const CELL_CLASSES: Record<number, string> = {
  0: 'col-span-2 row-span-2',
  1: 'col-span-1 row-span-1',
  2: 'col-span-1 row-span-1',
  3: 'col-span-1 row-span-1',
  4: 'col-span-1 row-span-1',
  5: 'col-span-2 row-span-1',
  6: 'col-span-2 row-span-1',
};

// ─── Modal ────────────────────────────────────────────────────────────────────
function ServiceModal({
  service, onClose, onCta,
}: {
  service: Service;
  onClose: () => void;
  onCta: (title: string) => void;
}) {
  const Icon = ICON_MAP[service.iconName] ?? Layers;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Услуга: ${service.title}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-[#0f0905]/85 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 8 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden z-20 grain"
        style={{
          background: 'linear-gradient(145deg, #24160c 0%, #1a1008 60%, #0f0905 100%)',
          border: '1px solid rgba(200,169,110,0.25)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,169,110,0.05)',
        }}
      >
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 70%)' }}
        />

        <motion.button
          whileHover={{ rotate: 90, backgroundColor: 'rgba(255,255,255,0.08)' }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white rounded-full z-20 transition-colors"
        >
          <X size={20} />
        </motion.button>

        <div className="p-8 sm:p-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="flex items-start gap-5 mb-7"
          >
            <div
              className="p-4 rounded-2xl shrink-0"
              style={{
                background: 'rgba(200,169,110,0.1)',
                border: '1px solid rgba(200,169,110,0.2)',
                boxShadow: '0 0 20px rgba(200,169,110,0.12)',
              }}
            >
              <Icon size={34} className="text-[#c8a96e]" strokeWidth={1.4} />
            </div>
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className="text-2xl font-bold text-white mb-1"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {service.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[#c8a96e] text-xs uppercase tracking-[0.15em] opacity-80"
              >
                {service.short}
              </motion.p>
            </div>
          </motion.div>

          <div className="space-y-5">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="text-white/90 text-lg leading-relaxed"
            >
              {service.desc}
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.34, duration: 0.5 }}
              className="h-px origin-left"
              style={{ background: 'linear-gradient(90deg, rgba(200,169,110,0.4), transparent)' }}
            />

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/55 text-sm leading-relaxed"
            >
              {service.fullDesc}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-6 flex justify-end"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: '#d4b77d' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onCta(service.title)}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[#1a1008] font-bold text-sm tracking-wide transition-colors"
              style={{
                backgroundColor: '#c8a96e',
                boxShadow: '0 4px 20px rgba(200,169,110,0.35)',
              }}
            >
              Заказать расчёт
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Bento Card ───────────────────────────────────────────────────────────────
function BentoCard({
  service, index, onClick,
}: {
  service: Service;
  index: number;
  onClick: (s: Service) => void;
}) {
  const Icon = ICON_MAP[service.iconName] ?? Layers;
  const isFeatured = index === 0;

  return (
    <motion.button
      onClick={() => onClick(service)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative text-left rounded-2xl overflow-hidden cursor-pointer transition-all duration-500',
        CELL_CLASSES[index] ?? 'col-span-1 row-span-1',
        isFeatured ? 'min-h-[260px]' : 'min-h-[130px]',
      )}
      style={{
        background: isFeatured
          ? 'linear-gradient(145deg, rgba(200,169,110,0.08) 0%, rgba(255,255,255,0.02) 100%)'
          : 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(200,169,110,0.07) 0%, transparent 70%)' }}
      />
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(200,169,110,0.35)' }}
      />

      <div className={cn('relative z-10 h-full flex', isFeatured ? 'flex-col p-7' : 'items-center gap-4 p-5')}>
        <div
          className={cn(
            'shrink-0 flex items-center justify-center rounded-xl transition-all duration-300',
            isFeatured ? 'w-14 h-14 mb-auto group-hover:scale-110' : 'w-10 h-10 group-hover:scale-105',
          )}
          style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.12)' }}
        >
          <Icon size={isFeatured ? 28 : 22} className="text-[#c8a96e]" strokeWidth={1.4} />
        </div>

        <div className={isFeatured ? 'mt-4' : ''}>
          <p
            className={cn(
              'font-semibold text-white group-hover:text-[#c8a96e] transition-colors',
              isFeatured ? 'text-xl mb-2' : 'text-sm leading-snug',
            )}
            style={isFeatured ? { fontFamily: 'Georgia, serif' } : undefined}
          >
            {service.title}
          </p>

          {isFeatured && (
            <p className="text-white/45 text-sm leading-relaxed line-clamp-2">{service.desc}</p>
          )}
          {!isFeatured && (
            <p className="text-white/35 text-[11px] mt-0.5 leading-snug line-clamp-1">{service.short}</p>
          )}
        </div>

        {isFeatured && (
          <div className="mt-6 flex items-center gap-2 text-[#c8a96e] text-xs font-bold uppercase tracking-wider opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Подробнее <ArrowRight size={12} />
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = selectedService ? 'hidden' : '';
    // Always restore on unmount
    return () => { document.body.style.overflow = ''; };
  }, [selectedService]);

  const handleCta = useCallback((_title: string) => {
    setSelectedService(null);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, []);

  return (
    <section
      id="services"
      className="relative py-16 lg:py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a1008 0%, #150d05 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,169,110,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#c8a96e]" />
            <span className="text-[#c8a96e] text-xs tracking-[0.2em] uppercase font-semibold">Наши услуги</span>
            <div className="w-8 h-px bg-[#c8a96e]" />
          </div>
          <h2
            className="text-3xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Что мы <em className="not-italic text-[#c8a96e]">изготавливаем</em>
          </h2>
          <p className="text-white/40 text-sm mt-3 max-w-md">
            Нажмите на карточку, чтобы узнать подробности и получить расчёт
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 auto-rows-auto">
          {SERVICES.map((s, i) => (
            <BentoCard key={s.id} service={s} index={i} onClick={setSelectedService} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onCta={handleCta}
          />
        )}
      </AnimatePresence>
    </section>
  );
}