'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'О Компании', id: 'about' },
  { label: 'Галерея', id: 'gallery' },
  { label: 'Виды Работ', id: 'services' },
  { label: 'Связь с Центром', id: 'contact' },
  { label: 'Карта', id: 'map' },
];

interface NavbarProps {
  onNavClick: (id: string) => void;
}

export default function Navbar({ onNavClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLink = (id: string) => {
    onNavClick(id);
    setMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#1a1008]/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => handleLink('hero')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#c8a96e] flex items-center justify-center shadow-md group-hover:bg-[#d4b87e] transition-colors">
              <span className="text-[#1a1008] font-bold text-sm tracking-wider">ЦСИ</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-semibold text-sm leading-tight">Центр Столярных</p>
              <p className="text-[#c8a96e] text-xs leading-tight tracking-widest uppercase">Изделий</p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLink(link.id)}
                className="px-4 py-2 text-sm text-white/80 hover:text-[#c8a96e] transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-1 left-4 right-4 h-px bg-[#c8a96e] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </button>
            ))}
          </nav>

          {/* Phone + Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+78126121515"
              className="hidden md:flex items-center gap-2 text-[#c8a96e] text-sm font-medium hover:text-[#d4b87e] transition-colors"
            >
              <Phone className="w-4 h-4" />
              +7 (812) 612-15-15
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden p-2 text-white hover:text-[#c8a96e] transition-colors"
              aria-label="Меню"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 bg-[#1a1008]/97 backdrop-blur-md',
          menuOpen ? 'max-h-96 border-t border-[#c8a96e]/20' : 'max-h-0'
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLink(link.id)}
              className="text-left px-4 py-3 text-white/80 hover:text-[#c8a96e] hover:bg-white/5 rounded-lg transition-colors text-sm"
            >
              {link.label}
            </button>
          ))}
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href="tel:+78126121515"
              className="flex items-center gap-2 px-4 py-2 text-[#c8a96e] text-sm"
            >
              <Phone className="w-4 h-4" />
              +7 (812) 612-15-15
            </a>
            <a
              href="tel:+78129074403"
              className="flex items-center gap-2 px-4 py-2 text-[#c8a96e] text-sm"
            >
              <Phone className="w-4 h-4" />
              +7 (812) 907-44-03
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
