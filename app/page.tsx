'use client';

import { useCallback } from 'react';
import Navbar          from '@/app/components/Navbar';
import HeroSection     from '@/app/components/HeroSection';
import AboutSection    from '@/app/components/AboutSection';
import ServicesSection from '@/app/components/ServicesSection';
import GallerySection  from '@/app/components/GallerySection';
import ArticlesSection from '@/app/components/ArticlesSection';
import ContactSection  from '@/app/components/ContactSection';
import FooterSection   from '@/app/components/FooterSection';
import ScrollToTop     from '@/app/components/ScrollToTop';

// Высоты шапки:
//   Мобиль  — двухрядная (bar 64px + quick-strip ~42px) = 106px
//   Десктоп — однорядная 68px
const MOBILE_HEADER  = 106;
const DESKTOP_HEADER = 68;

export default function HomePage() {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const isMobile   = window.innerWidth < 1024;
    const offset     = isMobile ? MOBILE_HEADER : DESKTOP_HEADER;
    const top        = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1008] font-sans">
      <Navbar onNavClick={scrollTo} />
      <main>
        <HeroSection     onCta={() => scrollTo('contact')} />
        <AboutSection    />
        <ServicesSection />
        <GallerySection  />
        <ArticlesSection />
        <ContactSection  />
        <FooterSection   />
      </main>
      <ScrollToTop />
    </div>
  );
}