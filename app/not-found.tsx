// app/not-found.tsx
// ─── Custom 404 Page ──────────────────────────────────────────────────────────
// Server Component — нет 'use client'.
// Когда старые проиндексированные URL редиректятся через 301, у Google
// формируется корректный сигнал. Но для URL которых нет в редиректах —
// нужна красивая 404 страница, а не дефолтная Next.js.

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Страница не найдена',
  description: 'Запрашиваемая страница не существует. Вернитесь на главную страницу Центра Столярных Изделий.',
  robots: { index: false, follow: true }, // 404 не индексируем
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'linear-gradient(135deg, #1a1008 0%, #3d2b1f 100%)' }}
    >
      {/* Декоративный номер */}
      <p
        className="text-[12rem] font-bold leading-none select-none pointer-events-none mb-2"
        style={{
          fontFamily: 'Georgia, serif',
          color: 'transparent',
          WebkitTextStroke: '2px rgba(200,169,110,0.25)',
        }}
        aria-hidden="true"
      >
        404
      </p>

      <h1
        className="text-3xl sm:text-4xl font-bold text-white mb-4"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Страница не найдена
      </h1>

      <p className="text-white/50 max-w-md leading-relaxed mb-8">
        Возможно, страница была перемещена или её адрес изменился.
        Воспользуйтесь навигацией или вернитесь на главную.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-8 py-3 rounded-xl font-semibold text-[#1a1008] text-sm transition-all hover:-translate-y-0.5"
          style={{ background: '#c8a96e', boxShadow: '0 4px 20px rgba(200,169,110,0.3)' }}
        >
          На главную
        </Link>
        <a
          href="tel:+78126121515"
          className="px-8 py-3 rounded-xl text-white text-sm border border-white/20 hover:border-[#c8a96e]/50 hover:text-[#c8a96e] transition-all"
        >
          +7 (812) 612-15-15
        </a>
      </div>

      <p className="mt-12 text-white/20 text-xs">
        Центр Столярных Изделий · г. Санкт-Петербург
      </p>
    </div>
  );
}
