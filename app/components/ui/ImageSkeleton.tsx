'use client';

/**
 * ImageSkeleton.tsx — v3
 *
 * Изменения:
 * - Шиммер практически невидим: очень тонкий, почти прозрачный.
 * - Быстрый fade-out (100ms) — картинка появляется без задержки.
 * - Анимация чуть медленнее (2s) — глаз не успевает её заметить.
 */

import { useEffect, useRef, useState } from 'react';

interface ImageSkeletonProps {
  loaded?: boolean;
  variant?: 'dark' | 'cream';
  className?: string;
}

const VARIANTS = {
  dark:  { base: '#1a1008', shimmer: 'rgba(45,30,15,0.5)' },
  cream: { base: '#ece5d8', shimmer: 'rgba(200,169,110,0.1)' },
} as const;

export default function ImageSkeleton({
  loaded = false,
  variant = 'dark',
  className = '',
}: ImageSkeletonProps) {
  const [mounted, setMounted] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colors = VARIANTS[variant];

  useEffect(() => {
    if (loaded) {
      timerRef.current = setTimeout(() => setMounted(false), 110);
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
        transition: loaded ? 'opacity 0.1s ease-out' : 'none',
      }}
    >
      {/* Very subtle shimmer — barely visible, just a hint of activity */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            90deg,
            transparent      0%,
            ${colors.shimmer} 45%,
            ${colors.shimmer} 55%,
            transparent      100%
          )`,
          animation: 'skeleton-shimmer 2s infinite linear',
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