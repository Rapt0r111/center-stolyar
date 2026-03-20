// app/page.tsx
// ─── Server Component — убран 'use client' ───────────────────────────────────
//
// БАГ (КРИТИЧНЫЙ): Предыдущая версия имела 'use client' из-за useCallback.
// Это делало ВСЮ страницу клиентским рендером (CSR):
//   - Google получал пустой HTML при первом обходе
//   - Весь контент (заголовки, тексты, мета) появлялся только после JS
//   - Core Web Vitals LCP страдал — нет SSR-контента
//   - Рейтинг в поиске снижался, так как Googlebot видел пустую страницу
//
// ИСПРАВЛЕНИЕ:
//   1. Убран 'use client' и useCallback из page.tsx
//   2. scrollToSection перенесён в lib/scroll.ts
//   3. Navbar и HeroSection импортируют scrollToSection напрямую
//      (они уже 'use client' — это допустимо)
//
// РЕЗУЛЬТАТ:
//   - Google получает полный SSR HTML со всем контентом
//   - AboutSection рендерится как Server Component (никакого JS!)
//   - Client Components (Navbar, Hero, Gallery...) гидрируются отдельно
//   - LCP улучшается за счёт SSR-контента в initial HTML

import Navbar          from '@/app/components/Navbar';
import HeroSection     from '@/app/components/HeroSection';
import AboutSection    from '@/app/components/AboutSection';
import ServicesSection from '@/app/components/ServicesSection';
import GallerySection  from '@/app/components/GallerySection';
import ArticlesSection from '@/app/components/ArticlesSection';
import ContactSection  from '@/app/components/ContactSection';
import FooterSection   from '@/app/components/FooterSection';
import ScrollToTop     from '@/app/components/ScrollToTop';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1a1008] font-sans">
      {/*
       * Navbar — Client Component ('use client').
       * Теперь использует scrollToSection из lib/scroll.ts напрямую.
       * Props onNavClick больше нет — не нужен.
       */}
      <Navbar />

      <main id="main-content">
        {/*
         * HeroSection — Client Component ('use client').
         * onCta больше нет — компонент сам вызывает scrollToSection('contact').
         */}
        <HeroSection />

        {/* Server Component — рендерится на сервере, нет JS */}
        <AboutSection />

        {/* Client Components — гидрируются после загрузки JS */}
        <ServicesSection />
        <GallerySection />
        <ArticlesSection />
        <ContactSection />

        {/* Server Component — статический footer */}
        <FooterSection />
      </main>

      <ScrollToTop />
    </div>
  );
}