// app/layout.tsx
// ─── ИСПРАВЛЕНО: 3 бага в layout ─────────────────────────────────────────────
//
// БАГ 7: <link rel="preconnect"> к Google Fonts — лишний.
//   Сайт использует next/font/google, который скачивает шрифты при сборке
//   и раздаёт их самостоятельно. В браузере НЕТ запросов к fonts.googleapis.com.
//   Preconnect создавал DNS-lookup к несуществующему соединению — пустая трата.
//   ИСПРАВЛЕНИЕ: оба preconnect к Google Fonts удалены.
//
// БАГ 8: Geo-теги и yandex-tableau-widget в ручном <head> теге.
//   В Next.js App Router используем metadata.other для custom meta тегов.
//   Ручной <head> рядом с Metadata API может вызвать дубликаты и предупреждения.
//   ИСПРАВЛЕНИЕ: перенесены в metadata.other. <head> теперь только для JSON-LD.
//
// БАГ 9: HSTS заголовок с директивой 'preload'.
//   'preload' требует добавления домена в список hstspreload.org.
//   Если домен туда не добавлен — директива вводит в заблуждение.
//   Если добавлен — очень сложно отменить (минимум 1 год).
//   ИСПРАВЛЕНИЕ: 'preload' убран из HSTS. Можно вернуть после подачи заявки.

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import StructuredData from '@/app/components/seo/StructuredData';

// next/font/google — шрифты самохостируются при сборке.
// НЕТ запросов к fonts.googleapis.com в браузере → preconnect не нужен.
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

const SITE_URL = 'https://www.centersi.spb.ru';
const SITE_NAME = 'Центр Столярных Изделий';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1a1008',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Центр Столярных Изделий — лестницы, двери, мебель из дерева в СПб',
    template: `%s | ${SITE_NAME}`,
  },

  description:
    'Производство изделий из натурального дерева в Санкт-Петербурге с 2008 года. Лестницы, двери, мебель, арки, перила на заказ. 500+ проектов. Гарантия 2 года. Бесплатный расчёт.',

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  alternates: {
    canonical: '/',
    languages: { 'ru-RU': '/' },
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Центр Столярных Изделий — лестницы, двери, мебель из дерева в СПб',
    description: 'Производство изделий из натурального дерева в Санкт-Петербурге с 2008 года. 500+ проектов. Бесплатный расчёт.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Центр Столярных Изделий — изделия из натурального дерева в СПб',
        type: 'image/jpeg',
      },
      {
        url: '/images/og-image-square.jpg',
        width: 800,
        height: 800,
        alt: 'Центр Столярных Изделий',
        type: 'image/jpeg',
      },
    ],
    countryName: 'Russia',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Центр Столярных Изделий — изделия из дерева в СПб',
    description: 'Лестницы, двери, мебель, арки из натурального дерева на заказ. Санкт-Петербург, с 2008 года.',
    images: ['/images/og-image.jpg'],
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },

  appleWebApp: {
    capable: true,
    title: 'ЦСИ — Столярные изделия',
    statusBarStyle: 'black-translucent',
  },

  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },

  // ИСПРАВЛЕНО БАГ 8: Geo-теги и yandex-tableau-widget — через metadata.other
  // Вместо ручного <head> тега — правильный способ для Next.js App Router
  other: {
    // Geo-теги — критично для локального SEO Санкт-Петербург
    'geo.region': 'RU-SPE',
    'geo.placename': 'Санкт-Петербург',
    'geo.position': '59.965347;30.471668',
    'ICBM': '59.965347, 30.471668',
    // Яндекс.Браузер виджет
    'yandex-tableau-widget': `logo=${SITE_URL}/images/logo-black.png, color=#1a1008`,
  },

  category: 'business',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" dir="ltr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/*
         * ИСПРАВЛЕНО БАГ 7: Google Fonts preconnect УДАЛЕНЫ.
         * next/font/google = self-hosted шрифты. Нет запросов к Google в браузере.
         *
         * Оставляем только dns-prefetch для Яндекс.Метрики — она реально нужна.
         */}
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />

        {/*
         * JSON-LD Структурированные данные.
         * Рендерится как Server Component — Google видит в initial HTML.
         * Допустимо в <head> согласно Google и Schema.org.
         */}
        <StructuredData />

        {/*
         * Yandex.Metrika — раскомментировать после получения ID счётчика.
         * Используйте next/script для оптимальной загрузки.
         *
         * import Script from 'next/script';
         * <Script id="yandex-metrika" strategy="afterInteractive">
         *   {`
         *     (function(m,e,t,r,i,k,a){...})(window,document,"script",
         *     "https://mc.yandex.ru/metrika/tag.js","ym");
         *     ym(XXXXXXXX,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
         *   `}
         * </Script>
         */}
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}