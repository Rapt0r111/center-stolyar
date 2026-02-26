'use client';

import Navbar from '@/app/components/Navbar';
import HeroSection from '@/app/components/HeroSection';
import AboutSection from '@/app/components/AboutSection';
import ServicesSection from '@/app/components/ServicesSection';
import GallerySection from '@/app/components/GallerySection';
import ArticlesSection from '@/app/components/ArticlesSection';
import ContactSection from '@/app/components/ContactSection';
import FooterSection from '@/app/components/FooterSection';

const globalStyles = `
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
html { scroll-behavior: smooth; }
* { box-sizing: border-box; }
`;

function App() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#1a1008] font-sans">
      <style>{globalStyles}</style>
      <Navbar onNavClick={scrollTo} />
      <main>
        <HeroSection onCta={() => scrollTo('contact')} />
        <AboutSection />
        <ServicesSection />
        <GallerySection />
        <ArticlesSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
}

export default App;