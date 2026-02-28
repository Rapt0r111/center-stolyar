'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import {
  motion, AnimatePresence,
  useMotionValue, useSpring,
  Variants
} from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Navigation data ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'О нас',    id: 'about'    },
  { label: 'Галерея',  id: 'gallery'  },
  { label: 'Блог',     id: 'articles' },
  { label: 'Услуги',   id: 'services' },
  { label: 'Контакты', id: 'contact'  },
  { label: 'Карта',    id: 'map'      },
] as const;

type NavId = typeof NAV_LINKS[number]['id'];

// ─── iOS-safe scroll lock ─────────────────────────────────────────────────────
function lockScroll() {
  const scrollY = window.scrollY;
  document.body.style.position   = 'fixed';
  document.body.style.top        = `-${scrollY}px`;
  document.body.style.left       = '0';
  document.body.style.right      = '0';
  document.body.style.overflowY  = 'scroll';
}

function unlockScroll() {
  const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10));
  document.body.style.position  = '';
  document.body.style.top       = '';
  document.body.style.left      = '';
  document.body.style.right     = '';
  document.body.style.overflowY = '';
  window.scrollTo(0, scrollY);
}

// ─── Active section hook ──────────────────────────────────────────────────────
function useActiveSection(): NavId | '' {
  const [active, setActive] = useState<NavId | ''>('');
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-38% 0px -38% 0px', threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);
  return active;
}

// ─── Sliding pill indicator (desktop) ────────────────────────────────────────
function NavPill({ activeId }: { activeId: string }) {
  const x = useMotionValue(0);
  const w = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 380, damping: 32 });
  const sw = useSpring(w, { stiffness: 380, damping: 32 });

  useEffect(() => {
    if (!activeId) return;
    const raf = requestAnimationFrame(() => {
      const btn = document.getElementById(`nav-btn-${activeId}`);
      if (!btn) return;
      const nav = btn.closest('nav');
      if (!nav) return;
      const nRect = nav.getBoundingClientRect();
      const bRect = btn.getBoundingClientRect();
      x.set(bRect.left - nRect.left);
      w.set(bRect.width);
    });
    return () => cancelAnimationFrame(raf);
  }, [activeId, x, w]);

  if (!activeId) return null;

  return (
    <motion.span
      className="absolute top-1/2 -translate-y-1/2 h-8 rounded-full pointer-events-none"
      style={{
        x: sx, width: sw,
        background: 'rgba(200,169,110,0.11)',
        border: '1px solid rgba(200,169,110,0.28)',
      }}
    />
  );
}

// ─── Hamburger icon ───────────────────────────────────────────────────────────
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative flex flex-col items-end justify-center w-6 h-5">
      {/* Top line */}
      <motion.span
        animate={open ? { rotate: 45, y: 1, width: '100%' } : { rotate: 0, y: -6, width: '100%' }}
        className="absolute h-px bg-white rounded-full origin-center"
        transition={{ duration: 0.3 }}
        style={{ background: open ? '#c8a96e' : 'white' }}
      />
      {/* Middle line */}
      <motion.span
        animate={open ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
        className="absolute h-px bg-white/50 rounded-full"
        style={{ width: '65%' }}
        transition={{ duration: 0.2 }}
      />
      {/* Bottom line */}
      <motion.span
        animate={open ? { rotate: -45, y: 1, width: '100%' } : { rotate: 0, y: 6, width: '100%' }}
        className="absolute h-px bg-white rounded-full origin-center"
        transition={{ duration: 0.3 }}
        style={{ background: open ? '#c8a96e' : 'white' }}
      />
    </div>
  );
}

// ─── Mobile full-screen overlay ───────────────────────────────────────────────
// ФИКС ТИПОВ: используем "as const" для массива в ease, чтобы TS видел кортеж
const overlayVariants: Variants = {
  closed: {
    clipPath: 'circle(0% at calc(100% - 32px) 32px)',
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as const },
  },
  open: {
    clipPath: 'circle(150% at calc(100% - 32px) 32px)',
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as const },
  },
};

const linkVariants: Variants = {
  closed: { opacity: 0, x: 30 },
  open: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.1 + i * 0.05, duration: 0.4 }
  }),
  exit: { opacity: 0, x: 10 }
};

function MobileMenu({ open, activeId, onLink }: { open: boolean, activeId: string, onLink: (id: string) => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={overlayVariants}
          initial="closed" animate="open" exit="closed"
          className="fixed inset-0 z-[100] flex flex-col backdrop-blur-sm bg-[#150c04cc] overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none grain" />
          
          <nav className="flex flex-col justify-center flex-1 px-8 pt-20">
            {NAV_LINKS.map((link, i) => {
              const isActive = activeId === link.id;
              return (
                <motion.button
                  key={link.id} custom={i} variants={linkVariants}
                  onClick={() => onLink(link.id)}
                  className="flex items-center gap-4 py-4 text-left border-b border-white/5"
                >
                  <span className={cn("text-[10px] font-mono leading-none", isActive ? "text-[#c8a96e]" : "text-white/20")}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span 
                    className={cn("text-3xl font-bold transition-colors", isActive ? "text-[#c8a96e]" : "text-white/80")}
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {link.label}
                  </span>
                </motion.button>
              );
            })}
          </nav>

          <div className="p-8 pb-12 border-t border-white/5 bg-[#1a1108]">
            <a href="tel:+78126121515" className="flex items-center gap-3 text-[#c8a96e] font-bold text-lg">
              <Phone className="w-5 h-5" /> +7 (812) 612-15-15
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar({ onNavClick }: { onNavClick: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) lockScroll(); else unlockScroll();
    return () => unlockScroll();
  }, [menuOpen]);

  const handleLink = (id: string) => {
    onNavClick(id);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 lg:h-20 flex items-center">
        <div
          className={cn(
            'absolute inset-0 transition-all duration-500 ease-in-out',
            scrolled ? 'bg-[#150c04]/90 backdrop-blur-md' : 'bg-transparent'
          )}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative flex items-center justify-between">
          <button onClick={() => handleLink('hero')} className="flex items-center gap-3 z-[60]">
            <Image src="/images/logo-black.png" alt="Logo" width={50} height={40} className="w-auto h-10 lg:h-12 object-contain" priority />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-white font-bold text-xs uppercase tracking-wider">Центр Столярных</span>
              <span className="text-[#c8a96e] text-[9px] uppercase tracking-[0.2em]">Изделий</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-2 relative">
            {mounted && <NavPill activeId={activeSection} />}
            {NAV_LINKS.map((link) => (
              <button
                key={link.id} id={`nav-btn-${link.id}`}
                onClick={() => handleLink(link.id)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors z-10",
                  activeSection === link.id ? "text-[#c8a96e]" : "text-white/60 hover:text-white"
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <a href="tel:+78126121515" className="text-white/70 hover:text-[#c8a96e] text-sm transition-colors flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> +7 (812) 612-15-15
            </a>
            <button 
              onClick={() => handleLink('contact')}
              className="bg-[#c8a96e] hover:bg-[#d4b87e] text-[#150c04] px-5 py-2 rounded-lg text-sm font-bold transition-all"
            >
              Заявка
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Controls */}
      <div className="fixed top-0 right-0 z-[110] lg:hidden flex items-center h-16 px-4 gap-2">
        {!menuOpen && (
          <a href="tel:+78126121515" className="p-2 text-[#c8a96e]">
            <Phone className="w-5 h-5" />
          </a>
        )}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
          aria-label="Menu"
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </div>

      <MobileMenu
        open={menuOpen}
        activeId={activeSection}
        onLink={handleLink}
      />
    </>
  );
}