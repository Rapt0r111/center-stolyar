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

export default function HomePage() {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    if ('startViewTransition' in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void })
        .startViewTransition(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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