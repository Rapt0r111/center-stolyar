'use client';

/**
 * ImageSkeleton.tsx — v2
 *
 * Переписан на чистый CSS вместо Framer Motion:
 * - Анимация shimmer через CSS @keyframes (GPU, нет JS overhead)
 * - Fade-out через CSS transition (мгновенный — нет лишнего цикла рендера)
 * - После fade-out (150ms) размонтируется полностью
 */

import { useEffect, useRef, useState } from 'react';

interface ImageSkeletonProps {
  /** Передайте true, когда <Image /> вызвал onLoad */
  loaded?: boolean;
  /** Цвет фона */
  variant?: 'dark' | 'cream';
  className?: string;
}

const VARIANTS = {
  dark:  { base: '#1a1008', shimmer: 'rgba(50,35,20,0.85)' },
  cream: { base: '#ece5d8', shimmer: 'rgba(200,169,110,0.22)' },
} as const;

export default function ImageSkeleton({
  loaded = false,
  variant = 'dark',
  className = '',
}: ImageSkeletonProps) {
  // После завершения CSS-перехода (150ms) полностью убираем DOM-узел
  const [mounted, setMounted] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colors = VARIANTS[variant];

  useEffect(() => {
    if (loaded) {
      timerRef.current = setTimeout(() => setMounted(false), 160);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loaded]);

  if (!mounted) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: colors.base,
        zIndex: 2,
        opacity: loaded ? 0 : 1,
        transition: loaded ? 'opacity 0.15s ease-out' : 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            90deg,
            transparent      0%,
            ${colors.shimmer} 40%,
            ${colors.shimmer} 60%,
            transparent      100%
          )`,
          animation: 'skeleton-shimmer 1.5s infinite linear',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

export function useImageLoad(
  imgRef?: React.RefObject<HTMLImageElement | null>,
  initialLoaded = false,
) {
  const [loaded, setLoaded] = useState(initialLoaded);

  useEffect(() => {
    if (imgRef?.current?.complete) {
      setLoaded(true);
    }
  }, [imgRef]);

  const onLoad = () => setLoaded(true);
  return { loaded, onLoad };
}