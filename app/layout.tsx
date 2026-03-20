// app/layout.tsx
// ─── Root Layout с полной SEO-оптимизацией ───────────────────────────────────
// Домен: https://www.centersi.spb.ru (канонический с www)
// Все URL → www. (редирект через next.config.ts)

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import StructuredData from '@/app/components/seo/StructuredData';

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

// ─── Реальный домен (с www — канонический) ────────────────────────────────────
// centersi.spb.ru (без www) делает 301 → www.centersi.spb.ru
const SITE_URL  = 'https://www.centersi.spb.ru';
const SITE_NAME = 'Центр Столярных Изделий';

// ─── Viewport ─────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1a1008',
  colorScheme: 'dark',
};

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Центр Столярных Изделий — лестницы, двери, мебель из дерева в СПб',
    template: `%s | ${SITE_NAME}`,
  },

  // 158 символов — оптимально для Google и Яндекс
  description:
    'Производство изделий из натурального дерева в Санкт-Петербурге с 2008 года. Лестницы, двери, мебель, арки, перила на заказ. 500+ проектов. Гарантия 2 года. Бесплатный расчёт.',

  // Яндекс учитывает keywords при ранжировании локальных запросов
  keywords: [
    'лестницы из дерева на заказ',
    'деревянные лестницы Санкт-Петербург',
    'межкомнатные двери из массива',
    'мебель из дерева на заказ',
    'столярные изделия Санкт-Петербург',
    'деревянные арки для дверных проёмов',
    'перила и ограждения лестниц',
    'изделия из дуба',
    'изделия из ясеня',
    'кабинеты из дерева',
    'деревянные потолки кессоны',
    'Центр Столярных Изделий',
    'ЦСИ Санкт-Петербург',
    'производство деревянных изделий СПб',
    'лестницы из массива дуба',
    'винтовые лестницы СПб',
    'маршевые лестницы',
    'двери из массива на заказ',
    'centersi spb',
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  // Canonical — всегда www. (защита от дублей non-www vs www)
  alternates: {
    canonical: '/',
    languages: {
      'ru-RU': '/',
    },
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

  // Open Graph — VK, Telegram, WhatsApp, LinkedIn
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Центр Столярных Изделий — лестницы, двери, мебель из дерева в СПб',
    description:
      'Производство изделий из натурального дерева в Санкт-Петербурге с 2008 года. 500+ проектов. Бесплатный расчёт.',
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
        alt: 'Центр Столярных Изделий — логотип и продукция',
        type: 'image/jpeg',
      },
    ],
    countryName: 'Russia',
  },

  // Twitter / X Card
  twitter: {
    card: 'summary_large_image',
    title: 'Центр Столярных Изделий — изделия из дерева в СПб',
    description:
      'Лестницы, двери, мебель, арки из натурального дерева на заказ. Санкт-Петербург, с 2008 года.',
    images: ['/images/og-image.jpg'],
  },

  // Favicons — сгенерируйте на https://realfavicongenerator.net/
  icons: {
    icon: [
      { url: '/favicon.ico',      sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png',      sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png',      sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },

  appleWebApp: {
    capable: true,
    title: 'ЦСИ — Столярные изделия',
    statusBarStyle: 'black-translucent',
  },

  // Запрещаем iOS авто-форматировать телефоны/адреса (управляем сами)
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },

  // ── Верификация поисковиков ────────────────────────────────────────────────
  // Раскомментировать после регистрации:
  // verification: {
  //   google: 'GOOGLE_SEARCH_CONSOLE_CODE',
  //   yandex: 'YANDEX_WEBMASTER_CODE',
  // },

  category: 'business',
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Preconnects для ускорения загрузки внешних ресурсов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />

        {/* Geo мета-теги — критично для локального SEO Санкт-Петербург */}
        <meta name="geo.region"    content="RU-SPE" />
        <meta name="geo.placename" content="Санкт-Петербург" />
        <meta name="geo.position"  content="59.965347;30.471668" />
        <meta name="ICBM"          content="59.965347, 30.471668" />

        {/* Яндекс.Браузер виджет */}
        <meta
          name="yandex-tableau-widget"
          content={`logo=${SITE_URL}/images/logo-black.png, color=#1a1008`}
        />

        {/* JSON-LD структурированные данные — рендерится на сервере */}
        <StructuredData />

        {/* ── Yandex.Metrika ────────────────────────────────────────────────
            ЗАМЕНИТЕ 'XXXXXXXX' на ваш реальный ID счётчика
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
              ym(XXXXXXXX,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
            `,
          }}
        />
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