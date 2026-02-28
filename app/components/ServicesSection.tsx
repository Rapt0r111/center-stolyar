'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion'; // Импортируем анимацию
import { 
  Fence, DoorOpen, Armchair, SquareSplitVertical, 
  Layers, Library, createLucideIcon, X, ArrowRight 
} from 'lucide-react';

// --- ИКОНКИ ---
const Stairs = createLucideIcon('Stairs', [
  ['path', { d: 'M3 21h18', key: '1' }],
  ['path', { d: 'M3 21v-4h4v-4h4v-4h4v-4h4', key: '2' }],
]);

// --- ДАННЫЕ ---
const SERVICES = [
  {
    id: 1,
    icon: Stairs,
    title: 'Лестницы',
    short: 'Любые конструкции',
    desc: 'Маршевые, винтовые, на больцах — любые конструкции из дуба, ясеня и бука по вашему проекту.',
    fullDesc: 'Мы проектируем и создаем лестницы, которые становятся центром интерьера. Используем массив дуба, ясеня и бука высшего сорта. Возможна интеграция подсветки, кованых элементов и стеклянных ограждений. Полный цикл: от 3D-проекта до монтажа.',
  },
  {
    id: 2,
    icon: Fence,
    title: 'Перила',
    short: 'Ограждения и поручни',
    desc: 'Деревянные и комбинированные ограждения, нержавеющие стойки, стеклянные вставки.',
    fullDesc: 'Безопасность и стиль. Мы изготавливаем перила сложной геометрии, гнутые поручни и комбинированные ограждения (дерево + металл + стекло). Идеальная шлифовка и тактильно приятное покрытие маслом или лаком.',
  },
  {
    id: 3,
    icon: DoorOpen,
    title: 'Двери',
    short: 'Массив и шпон',
    desc: 'Межкомнатные и входные двери из массива. Классика, модерн, лофт — под любой интерьер.',
    fullDesc: 'Двери премиум-класса с повышенной шумоизоляцией. Мы делаем нестандартные размеры, порталы, раздвижные системы и скрытые двери (invisible). Надежная фурнитура и уплотнители.',
  },
  {
    id: 4,
    icon: Armchair,
    title: 'Мебель',
    short: 'Ручная работа',
    desc: 'Столы, стулья, скамьи, шкафы, тумбы — мебель ручной работы под заказ.',
    fullDesc: 'Эксклюзивная мебель, созданная по вашим эскизам или фото. Обеденные группы, комоды, кровати. Мы подбираем текстуру дерева так, чтобы она "играла" на свету, создавая уникальный рисунок.',
  },
  {
    id: 5,
    icon: SquareSplitVertical,
    title: 'Арки',
    short: 'Оформление проёмов',
    desc: 'Деревянные арки для дверных проёмов: классические, романские, эллиптические формы.',
    fullDesc: 'Преобразите пространство без установки дверей. Арки визуально расширяют помещение и добавляют ему высоты. Изготавливаем сложные радиусные элементы и порталы с капителями и резьбой.',
  },
  {
    id: 6,
    icon: Layers,
    title: 'Потолки',
    short: 'Кессоны и балки',
    desc: 'Деревянные балки, рейки, кессоны, карнизы и декоративные молдинги для потолков.',
    fullDesc: 'Кессонные потолки и фальш-балки в стиле шале, лофт или английской классики. Это решение придает помещению статусность, скрывает коммуникации и улучшает акустику.',
  },
  {
    id: 7,
    icon: Library,
    title: 'Кабинеты',
    short: 'Библиотеки и стеллажи',
    desc: 'Встроенные стеллажи, шкафы-купе, библиотеки и панели из ценных пород дерева.',
    fullDesc: 'Комплексная отделка кабинетов "под ключ". Стеновые панели (буазери), встроенные библиотеки и рабочие столы. Создаем атмосферу респектабельности и уюта для продуктивной работы.',
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);

  // Блокировка скролла
  useEffect(() => {
    if (selectedService) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [selectedService]);

  return (
    <section
      id="services"
      ref={ref}
      className="relative py-20 lg:py-28 overflow-hidden bg-[#1a1008]"
    >
      {/* Декоративный фон */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#c8a96e]/20 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Заголовок */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-4 opacity-80">
            <div className="w-8 h-px bg-[#c8a96e]" />
            <span className="text-[#c8a96e] text-xs tracking-[0.2em] uppercase font-semibold">Наши услуги</span>
            <div className="w-8 h-px bg-[#c8a96e]" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight font-serif">
            Что мы <span className="text-[#c8a96e] italic">изготавливаем</span>
          </h2>
        </div>

        {/* СЕТКА (Grid) */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            
            return (
              <motion.button
                key={s.id}
                onClick={() => setSelectedService(s)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(200,169,110,0.5)' }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'group relative flex flex-col items-center justify-center text-center',
                  'w-[calc(50%-0.5rem)] sm:w-40 lg:w-44 aspect-square',
                  'rounded-2xl cursor-pointer',
                  'bg-white/[0.03] border border-white/10 hover:bg-[#c8a96e]/10',
                  'backdrop-blur-sm'
                )}
              >
                <div className="mb-3 p-3 rounded-full bg-[#1a1008] border border-white/5 group-hover:border-[#c8a96e] transition-colors duration-300 shadow-lg relative z-10">
                  <Icon size={28} className="text-[#c8a96e]" strokeWidth={1.5} />
                </div>
                <span className="text-white font-medium text-sm sm:text-base leading-tight group-hover:text-[#c8a96e] transition-colors relative z-10">
                  {s.title}
                </span>
                
                {/* Подсветка при наведении */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* --- МОДАЛЬНОЕ ОКНО С ANIMATE PRESENCE --- */}
      <AnimatePresence>
        {selectedService && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            {/* 1. Backdrop (Фон) */}
            <motion.div 
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#0f0905]/80"
              onClick={() => setSelectedService(null)}
            />

            {/* 2. Modal Card (Карточка) */}
            <motion.div 
              layoutId={`modal-${selectedService.id}`} // Магия: связь с элементом (опционально)
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-[#1a1008] border border-[#c8a96e]/30 rounded-3xl shadow-2xl overflow-hidden z-20"
            >
              
              {/* Декор внутри модалки */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8a96e]/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Кнопка закрыть */}
              <motion.button 
                whileHover={{ rotate: 90, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-full z-20"
              >
                <X size={20} />
              </motion.button>

              <div className="p-8 sm:p-10 relative z-10">
                
                {/* Хедер с иконкой */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-5 mb-6"
                >
                  <div className="p-4 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/20 text-[#c8a96e] shadow-[0_0_15px_rgba(200,169,110,0.15)]">
                    {React.createElement(selectedService.icon, { size: 36, strokeWidth: 1.5 })}
                  </div>
                  <div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold text-white font-serif mb-1"
                    >
                      {selectedService.title}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-[#c8a96e] text-sm uppercase tracking-wide opacity-80"
                    >
                      {selectedService.short}
                    </motion.p>
                  </div>
                </motion.div>

                {/* Текстовый контент (Каскадное появление) */}
                <div className="space-y-4">
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/90 text-lg leading-relaxed font-medium"
                  >
                    {selectedService.desc}
                  </motion.p>
                  
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="w-full h-px bg-white/10 origin-left" 
                  />
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/50 text-sm leading-relaxed"
                  >
                    {selectedService.fullDesc}
                  </motion.p>
                </div>

                {/* Footer / CTA Button */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 pt-6 flex justify-end"
                >
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: '#d4b77d' }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#c8a96e] text-[#1a1008] font-bold shadow-[0_4px_14px_0_rgba(200,169,110,0.39)]"
                    onClick={() => alert(`Заявка на: ${selectedService.title}`)}
                  >
                    <span>Заказать расчёт</span>
                    <ArrowRight size={18} />
                  </motion.button>
                </motion.div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}