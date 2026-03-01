'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Phone, Menu, X } from 'lucide-react';
import {
  motion, AnimatePresence,
  useMotionValue, useSpring,
  Variants
} from 'framer-motion';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'О нас',    id: 'about'    },
  { label: 'Услуги',   id: 'services' },
  { label: 'Галерея',  id: 'gallery'  },
  { label: 'Блог',     id: 'articles' },
  { label: 'Контакты', id: 'contact'  },
  { label: 'Карта',    id: 'map'      },
] as const;

const QUICK_LINKS = [
  { label: 'Услуги',    id: 'services' },
  { label: 'Портфолио', id: 'gallery'  },
  { label: 'Блог',      id: 'articles' },
  { label: 'Контакты',  id: 'contact'  },
] as const;

export const HEADER_HEIGHT_MOBILE  = 106;
export const HEADER_HEIGHT_DESKTOP = 68;

type NavId = typeof NAV_LINKS[number]['id'];

// ─── Scroll lock helpers ──────────────────────────────────────────────────────
// scrollY сохраняем сюда при открытии, чтобы не терять при закрытии
let _savedScrollY = 0;

function lockScroll() {
  _savedScrollY = window.scrollY;
  document.body.style.position  = 'fixed';
  document.body.style.top       = `-${_savedScrollY}px`;
  document.body.style.left      = '0';
  document.body.style.right     = '0';
  document.body.style.overflowY = 'scroll';
}

// restore=true → вернуть на сохранённую позицию (закрытие без навигации)
// restore=false → просто снять блокировку (при клике на ссылку)
function unlockScroll(restore = true) {
  document.body.style.position  = '';
  document.body.style.top       = '';
  document.body.style.left      = '';
  document.body.style.right     = '';
  document.body.style.overflowY = '';
  if (restore) {
    window.scrollTo(0, _savedScrollY);
  }
}

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

function NavPill({ activeId }: { activeId: string }) {
  const x  = useMotionValue(0);
  const w  = useMotionValue(0);
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
        background: 'rgba(200,169,110,0.14)',
        border: '1px solid rgba(200,169,110,0.35)',
      }}
    />
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
const overlayVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.3,  ease: [0.4, 0, 1, 1] } },
  open:   { opacity: 1, transition: { duration: 0.35, ease: [0, 0, 0.2, 1] } },
};
const drawerVariants: Variants = {
  closed: { x: '100%', transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
  open:   { x: 0,      transition: { duration: 0.4,  ease: [0, 0, 0.2, 1] } },
};
const linkVariants: Variants = {
  closed: { opacity: 0, x: 24 },
  open: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.08 + i * 0.055, duration: 0.35, ease: [0, 0, 0.2, 1] },
  }),
};

function MobileDrawer({
  open, activeId, onLink, onClose,
}: {
  open: boolean; activeId: string;
  onLink: (id: string) => void; onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={overlayVariants} initial="closed" animate="open" exit="closed"
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            variants={drawerVariants} initial="closed" animate="open" exit="closed"
            onClick={(e) => e.stopPropagation()}
            className="fixed top-0 right-0 bottom-0 z-[95] w-72 flex flex-col"
            style={{
              background: 'linear-gradient(160deg, #1f1208 0%, #150d05 100%)',
              borderLeft: '1px solid rgba(200,169,110,0.15)',
            }}
          >
            <div className="flex items-center px-6 h-16 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p className="text-white font-bold text-xs uppercase tracking-wider">Меню</p>
                <p className="text-[#c8a96e] text-[9px] uppercase tracking-widest opacity-70">Навигация</p>
              </div>
            </div>

            <nav className="flex flex-col flex-1 px-4 pt-4 gap-1 overflow-y-auto">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeId === link.id;
                return (
                  <motion.button
                    key={link.id} custom={i}
                    variants={linkVariants} initial="closed" animate="open"
                    onClick={() => onLink(link.id)}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left transition-all duration-200',
                      isActive ? 'bg-[#c8a96e]/12 text-[#c8a96e]' : 'text-white/70 hover:text-white hover:bg-white/5',
                    )}
                    style={isActive ? { border: '1px solid rgba(200,169,110,0.25)' } : { border: '1px solid transparent' }}
                  >
                    <span className={cn(
                      'text-[10px] font-mono w-5 h-5 rounded-md flex items-center justify-center shrink-0 font-bold',
                      isActive ? 'bg-[#c8a96e] text-[#1a1008]' : 'bg-white/8 text-white/30',
                    )}>
                      {i + 1}
                    </span>
                    <span className="font-semibold text-[15px]" style={isActive ? { fontFamily: 'Georgia, serif' } : undefined}>
                      {link.label}
                    </span>
                    {isActive && <motion.div layoutId="activeDot" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c8a96e]" />}
                  </motion.button>
                );
              })}
            </nav>

            <div className="p-5 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <a
                href="tel:+78126121515"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(200,169,110,0.15)' }}>
                  <Phone className="w-3.5 h-3.5 text-[#c8a96e]" />
                </div>
                <div>
                  <p className="text-[10px] text-white/35 leading-none mb-0.5">Позвонить</p>
                  <p className="text-sm font-semibold text-white">+7 (812) 612-15-15</p>
                </div>
              </a>
              <button
                onClick={() => onLink('contact')}
                className="w-full py-3 rounded-xl font-bold text-sm text-[#1a1008]"
                style={{ background: '#c8a96e', boxShadow: '0 4px 20px rgba(200,169,110,0.3)' }}
              >
                Оставить заявку
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Navbar({ onNavClick }: { onNavClick: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const activeSection = useActiveSection();
  // флаг: закрываем меню для навигации (не нужно восстанавливать старую позицию)
  const navigatingRef = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Блокируем скролл при открытии. Cleanup — разблокируем с восстановлением
  // позиции, ЕСЛИ не навигируем (navigatingRef.current === false).
  useEffect(() => {
    if (menuOpen) {
      lockScroll();
      return () => {
        unlockScroll(!navigatingRef.current);
        navigatingRef.current = false;
      };
    }
  }, [menuOpen]);

  const handleLink = (id: string) => {
    if (menuOpen) {
      // Помечаем, что идём к навигации — восстанавливать старую позицию не нужно
      navigatingRef.current = true;
      setMenuOpen(false);
      // Даём React время завершить cleanup эффекта (unlockScroll без restore),
      // затем скроллим к нужной секции
      setTimeout(() => onNavClick(id), 60);
    } else {
      onNavClick(id);
    }
  };

  const handleClose = () => {
    // Закрытие без навигации — восстанавливаем позицию
    navigatingRef.current = false;
    setMenuOpen(false);
  };

  const bgStyle: React.CSSProperties = scrolled
    ? { background: 'rgba(18,11,4,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }
    : { background: 'rgba(18,11,4,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-500"
        style={{ boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5)' : 'none' }}
      >
        {/* ── Полоса 1 ──────────────────────────────────────────────── */}
        <div style={{ ...bgStyle, borderBottom: '1px solid rgba(200,169,110,0.12)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-[68px] flex items-center justify-between">

            <button onClick={() => handleLink('hero')} className="flex items-center gap-2.5 group shrink-0">
              <Image src="/images/logo-black.png" alt="ЦСИ" width={48} height={38} className="w-auto h-8 lg:h-10 object-contain" priority />
              <div className="flex flex-col text-left">
                <span className="text-white font-bold text-[10px] lg:text-xs uppercase tracking-wider leading-tight group-hover:text-[#c8a96e] transition-colors">
                  Центр Столярных
                </span>
                <span className="text-[#c8a96e] text-[8px] lg:text-[9px] uppercase tracking-[0.25em] leading-tight">
                  Изделий · СПб
                </span>
              </div>
            </button>

            <nav className="hidden lg:flex items-center gap-1 relative">
              {mounted && <NavPill activeId={activeSection} />}
              {NAV_LINKS.map(link => (
                <button
                  key={link.id}
                  id={`nav-btn-${link.id}`}
                  onClick={() => handleLink(link.id)}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors duration-200 z-10 rounded-full',
                    activeSection === link.id ? 'text-[#c8a96e]' : 'text-white/65 hover:text-white',
                  )}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:+78126121515" className="flex items-center gap-2 text-white/65 hover:text-[#c8a96e] text-sm transition-colors">
                <Phone className="w-3.5 h-3.5" />
                +7 (812) 612-15-15
              </a>
              <button
                onClick={() => handleLink('contact')}
                className="px-5 py-2 rounded-lg text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(200,169,110,0.35)]"
                style={{ background: '#c8a96e', color: '#1a1008' }}
              >
                Заявка
              </button>
            </div>

            <button
              onClick={() => menuOpen ? handleClose() : setMenuOpen(true)}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              className={cn(
                'lg:hidden h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-300 border shrink-0',
                menuOpen
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-[#c8a96e] text-[#1a1008] border-[#c8a96e] hover:bg-[#d8b97e]'
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center justify-center">
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center justify-center">
                    <Menu className="w-4 h-4 stroke-[2.5]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Полоса 2: быстрая навигация (мобиль) ─────────────────── */}
        <div className="lg:hidden" style={{ ...bgStyle, borderBottom: '1px solid rgba(200,169,110,0.10)' }}>
          <div className="flex items-center px-3 py-2 gap-2">
            {QUICK_LINKS.map(link => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLink(link.id)}
                  className={cn(
                    'flex-1 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200',
                    isActive ? 'bg-[#c8a96e] text-[#1a1008]' : 'text-white/55 hover:text-white/90',
                  )}
                  style={
                    isActive
                      ? { boxShadow: '0 2px 12px rgba(200,169,110,0.3)' }
                      : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <MobileDrawer open={menuOpen} activeId={activeSection} onLink={handleLink} onClose={handleClose} />
    </>
  );
}