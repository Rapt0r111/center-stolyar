'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Stat } from '@/lib/data';

function useCountUp(target: number, duration = 1600, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const timer = setInterval(() => {
      frame++;
      // Ease-out curve
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      const current = Math.round(progress * target);
      setCount(current);
      if (frame >= totalFrames) { setCount(target); clearInterval(timer); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatCard({ value, suffix, label, sublabel, active, index }: Stat & { active: boolean; index: number }) {
  const count = useCountUp(value, 1600, active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative text-center p-6 rounded-2xl group"
      style={{
        background: 'rgba(200,169,110,0.04)',
        border: '1px solid rgba(200,169,110,0.12)',
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(200,169,110,0.3)' }}
      />

      <p
        className="text-4xl lg:text-5xl font-bold text-[#c8a96e]"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {count}{suffix}
      </p>
      <p className="text-[#1a1008] font-semibold mt-1.5 text-sm">{label}</p>
      <p className="text-[#3d2b1f]/45 text-xs mt-0.5">{sublabel}</p>
    </motion.div>
  );
}

export default function StatsRow({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-12"
      style={{ borderTop: '1px solid rgba(200,169,110,0.18)' }}
    >
      {stats.map((s, i) => (
        <StatCard key={s.label} {...s} active={visible} index={i} />
      ))}
    </div>
  );
}