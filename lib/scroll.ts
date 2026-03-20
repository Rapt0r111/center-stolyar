// lib/scroll.ts
// ─── Утилита плавного скролла к секции ───────────────────────────────────────
// Вынесена из page.tsx чтобы Navbar.tsx и HeroSection.tsx могли импортировать
// напрямую без props-drilling, что позволяет page.tsx быть Server Component.

export const MOBILE_HEADER_HEIGHT  = 106; // двойная шапка: nav 64px + quick-strip 42px
export const DESKTOP_HEADER_HEIGHT = 68;  // одинарная шапка

export function scrollToSection(id: string): void {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  const isMobile = window.innerWidth < 1024;
  const offset   = isMobile ? MOBILE_HEADER_HEIGHT : DESKTOP_HEADER_HEIGHT;
  const top      = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}