import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ─── Viewport (отдельный экспорт — рекомендуется Next.js 14+) ────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1008",
};

// ─── SEO metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://csi-spb.ru"), // замените на реальный домен
  title: {
    default: "Центр Столярных Изделий — лестницы, двери, мебель из дерева",
    template: "%s | Центр Столярных Изделий",
  },
  description:
    "Производство эксклюзивных изделий из натурального дерева в Санкт-Петербурге с 2008 года. Лестницы, двери, мебель, арки на заказ. Гарантия качества, доставка и монтаж.",
  keywords: [
    "лестницы из дерева",
    "деревянные двери на заказ",
    "столярные изделия Санкт-Петербург",
    "мебель из массива",
    "арки деревянные",
    "ЦСИ",
  ],
  authors: [{ name: "Центр Столярных Изделий" }],
  creator: "Центр Столярных Изделий",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Центр Столярных Изделий",
    title: "Центр Столярных Изделий — лестницы, двери, мебель из дерева",
    description:
      "Производство эксклюзивных изделий из натурального дерева в Санкт-Петербурге. С 2008 года, 500+ проектов.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // ✅ Исправлено: было lang="en"
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}