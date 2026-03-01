'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GALLERY_ITEMS } from '@/lib/data';

interface TagInfo {
  icon: string;
  title: string;
  desc: string;
  detail: string;
  galleryCategory?: string;
}

const TAG_DATA: Record<string, TagInfo> = {
  'Собственное производство': {
    icon: '🏭',
    title: 'Собственное производство',
    desc: 'Наш производственный цех площадью более 1000 м² оснащён профессиональным деревообрабатывающим оборудованием европейского класса.',
    detail:
      'Полный цикл изготовления — от распиловки и сушки древесины до финишной шлифовки и нанесения покрытия — проходит под нашим контролем. Это исключает посредников, сокращает сроки и позволяет реализовывать проекты любой сложности.',
    galleryCategory: 'Лестницы',
  },
  'Доставка и монтаж': {
    icon: '🚚',
    title: 'Доставка и монтаж',
    desc: 'Осуществляем доставку и профессиональный монтаж изделий по всему Санкт-Петербургу и Ленинградской области.',
    detail:
      'Наши монтажные бригады имеют опыт работы более 10 лет. Используем собственный транспорт с мягкими креплениями для сохранности изделий. После монтажа — уборка и финальная проверка каждого элемента.',
    galleryCategory: 'Мебель',
  },
  'Гарантия 2 года': {
    icon: '🛡️',
    title: 'Гарантия 2 года',
    desc: 'Предоставляем официальную гарантию 2 года на все изготовленные изделия. Дефекты материала или сборки устраняем бесплатно.',
    detail:
      'Гарантийные обязательства закреплены в договоре. Для изделий из массива дуба и ясеня гарантия распространяется на геометрию, прочность соединений и сохранность покрытия при соблюдении условий эксплуатации.',
    galleryCategory: 'Двери',
  },
  'Авторский дизайн': {
    icon: '✏️',
    title: 'Авторский дизайн',
    desc: 'Каждый проект разрабатывается индивидуально. Наши дизайнеры создают 3D-визуализацию до начала производства.',
    detail:
      'Вы можете предоставить свои эскизы или фотографии — мы адаптируем идею под технические возможности и ваш бюджет. Работаем в стилях: классика, модерн, лофт, скандинавский, прованс и др.',
    galleryCategory: 'Арки',
  },
};

export default function TagsWithModal() {
  const [active, setActive] = useState<TagInfo | null>(null);

  const galleryImages = active?.galleryCategory
    ? GALLERY_ITEMS.filter(i => i.cat === active.galleryCategory).slice(0, 4)
    : [];

  return (
    <>
      {/* Tags */}
      <div className="flex flex-wrap gap-3">
        {Object.keys(TAG_DATA).map(tag => (
          <button
            key={tag}
            onClick={() => setActive(TAG_DATA[tag])}
            className="px-4 py-1.5 rounded-full text-[#3d2b1f] text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{
              background: 'rgba(200,169,110,0.12)',
              border: '1px solid rgba(200,169,110,0.28)',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setActive(null)}
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 8 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden z-10"
              style={{
                background: 'linear-gradient(145deg, #f5f0e8 0%, #ece5d8 100%)',
                border: '1px solid rgba(200,169,110,0.3)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
              }}
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Закрыть"
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#3d2b1f]/40 hover:text-[#3d2b1f] hover:bg-black/5 transition-colors z-10"
              >
                <X size={18} />
              </button>

              <div className="p-7">
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: 'rgba(200,169,110,0.15)',
                      border: '1px solid rgba(200,169,110,0.25)',
                    }}
                  >
                    {active.icon}
                  </div>
                  <h3
                    className="text-xl font-bold text-[#1a1008]"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {active.title}
                  </h3>
                </div>

                <p className="text-[#3d2b1f] text-sm leading-relaxed mb-3">{active.desc}</p>
                <div className="h-px bg-[#c8a96e]/20 my-4" />
                <p className="text-[#3d2b1f]/65 text-sm leading-relaxed">{active.detail}</p>

                {/* Gallery thumbnails */}
                {galleryImages.length > 0 && (
                  <div className="mt-5 grid grid-cols-4 gap-2">
                    {galleryImages.map(img => (
                      <div
                        key={img.id}
                        className="relative h-16 rounded-xl overflow-hidden"
                        style={{ border: '1px solid rgba(200,169,110,0.2)' }}
                      >
                        <Image
                          src={img.src}
                          alt={img.label}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}