'use client';

/**
 * ImageSkeleton.tsx
 *
 * Красивый анимированный скелетон, который заменяет пиксельный blurDataURL.
 * Показывается поверх изображения, пока оно грузится, затем плавно исчезает.
 *
 * Принцип работы:
 *  - Рендерится как `position: absolute; inset: 0` поверх контейнера <Image />
 *  - Слушает событие onLoad у Image через `imageRef` — получает сигнал, когда
 *    реальное изображение загружено
 *  - Плавно уходит через opacity: 0 → затем размонтируется
 *
 * Использование:
 *  <div className="relative">
 *    <Image ... onLoad={() => setLoaded(true)} />
 *    <ImageSkeleton loaded={loaded} />
 *  </div>
 */

import { motion, AnimatePresence } from 'framer-motion';

interface ImageSkeletonProps {
  /** Передайте true, когда <Image /> вызвал onLoad */
  loaded?: boolean;
  /** Цвет фона (темнее = для тёмных секций) */
  variant?: 'dark' | 'cream';
  /** Дополнительные классы для контейнера */
  className?: string;
}

const VARIANTS = {
  dark:  { base: '#1a1008', shimmer: 'rgba(61,43,31,0.9)'  },
  cream: { base: '#ece5d8', shimmer: 'rgba(200,169,110,0.25)' },
} as const;

export default function ImageSkeleton({
  loaded = false,
  variant = 'dark',
  className = '',
}: ImageSkeletonProps) {
  const colors = VARIANTS[variant];

  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          // Не мешаем кликам сквозь скелетон
          className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
          style={{ background: colors.base, zIndex: 2 }}
          // Появляется мгновенно, исчезает плавно
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Shimmer — полоса градиента, скользящая слева направо */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                90deg,
                transparent    0%,
                ${colors.shimmer} 45%,
                ${colors.shimmer} 55%,
                transparent    100%
              )`,
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 0.2,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Хук-утилита для управления состоянием загрузки.
 * Позволяет не дублировать useState + onLoad в каждом компоненте.
 *
 * Использование:
 *   const { loaded, onLoad } = useImageLoad();
 *   <Image ... onLoad={onLoad} />
 *   <ImageSkeleton loaded={loaded} />
 */
export function useImageLoad(initialLoaded = false) {
  // Инлайновый импорт чтобы не заставлять клиентов импортировать React
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useState, useCallback } = require('react');
  const [loaded, setLoaded] = useState(initialLoaded);
  const onLoad = useCallback(() => setLoaded(true), []);
  return { loaded, onLoad };
}