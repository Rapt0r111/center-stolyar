'use client';

import { useState } from 'react';
import { Phone, Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
  agree: boolean;
}

const INIT: FormState = { name: '', email: '', phone: '', message: '', agree: false };

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(INIT);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Введите имя';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Введите корректный e-mail';
    if (!form.phone.trim()) e.phone = 'Введите номер телефона';
    if (!form.agree) e.agree = 'Необходимо согласие';
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setForm(INIT);
    }, 1500);
  };

  return (
    <section id="contact" className="py-16 lg:py-32 bg-[#f5f0e8] relative overflow-hidden">
      {/* Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c8a96e, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-[#c8a96e]" />
          <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Связь с нами</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — info */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1008] leading-tight mb-6"
              style={{ fontFamily: 'Georgia, serif' }}>
              Оставьте <span className="text-[#c8a96e]">заявку</span>
            </h2>
            <p className="text-[#3d2b1f]/70 leading-relaxed mb-10">
              Расскажите нам о вашем проекте. Мы перезвоним в течение 30 минут и
              подготовим предварительный расчёт стоимости бесплатно.
            </p>

            <div className="space-y-4 mb-10">
              <a href="tel:+78126121515"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/60 border border-[#c8a96e]/20 hover:border-[#c8a96e]/50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-[#c8a96e] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#1a1008]" />
                </div>
                <div>
                  <p className="text-[#3d2b1f]/50 text-xs mb-0.5">Основной телефон</p>
                  <p className="text-[#1a1008] font-semibold group-hover:text-[#c8a96e] transition-colors">+7 (812) 612-15-15</p>
                </div>
              </a>
              <a href="tel:+78129074403"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/60 border border-[#c8a96e]/20 hover:border-[#c8a96e]/50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-[#c8a96e]/20 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#c8a96e]" />
                </div>
                <div>
                  <p className="text-[#3d2b1f]/50 text-xs mb-0.5">Дополнительный</p>
                  <p className="text-[#1a1008] font-semibold group-hover:text-[#c8a96e] transition-colors">+7 (812) 907-44-03</p>
                </div>
              </a>
              <a href="mailto:s2277766@mail.ru"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/60 border border-[#c8a96e]/20 hover:border-[#c8a96e]/50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-[#c8a96e]/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#c8a96e]" />
                </div>
                <div>
                  <p className="text-[#3d2b1f]/50 text-xs mb-0.5">Электронная почта</p>
                  <p className="text-[#1a1008] font-semibold group-hover:text-[#c8a96e] transition-colors">s2277766@mail.ru</p>
                </div>
              </a>
            </div>

            <div className="p-5 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/20">
              <p className="text-[#3d2b1f] text-sm leading-relaxed">
                <span className="font-semibold">Режим работы:</span> Пн–Пт 9:00–18:00,<br />
                Сб 10:00–15:00. Воскресенье — выходной.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="relative rounded-2xl p-8 lg:p-10 shadow-xl"
            style={{ background: 'linear-gradient(135deg, #1a1008 0%, #3d2b1f 100%)', border: '1px solid rgba(200,169,110,0.15)' }}>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-14 h-14 text-[#c8a96e] mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Заявка отправлена!</h3>
                <p className="text-white/50 text-sm mb-6">Мы перезвоним вам в течение 30 минут в рабочее время.</p>
                <button onClick={() => setStatus('idle')}
                  className="px-6 py-2 rounded-lg bg-[#c8a96e]/20 text-[#c8a96e] text-sm hover:bg-[#c8a96e]/30 transition-colors border border-[#c8a96e]/30">
                  Отправить ещё одну
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <h3 className="text-white text-xl font-semibold mb-2">Ваши данные</h3>

                {/* Name */}
                <Field label="Имя *" error={errors.name}>
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Иван Иванов"
                    className={cn('w-full px-4 py-3 rounded-xl bg-white/8 text-white placeholder-white/30 text-sm outline-none border transition-colors',
                      errors.name ? 'border-red-400/50' : 'border-white/10 focus:border-[#c8a96e]/50')}
                    style={{ background: 'rgba(255,255,255,0.06)' }} />
                </Field>

                {/* Email */}
                <Field label="E-mail *" error={errors.email}>
                  <input value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="example@mail.ru" type="email"
                    className={cn('w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none border transition-colors',
                      errors.email ? 'border-red-400/50' : 'border-white/10 focus:border-[#c8a96e]/50')}
                    style={{ background: 'rgba(255,255,255,0.06)' }} />
                </Field>

                {/* Phone */}
                <Field label="Номер телефона *" error={errors.phone}>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="+7 (___) ___-__-__" type="tel"
                    className={cn('w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none border transition-colors',
                      errors.phone ? 'border-red-400/50' : 'border-white/10 focus:border-[#c8a96e]/50')}
                    style={{ background: 'rgba(255,255,255,0.06)' }} />
                </Field>

                {/* Message */}
                <Field label="Ваш вопрос или комментарий">
                  <textarea value={form.message} onChange={e => set('message', e.target.value)}
                    rows={3} placeholder="Опишите ваш проект..."
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none border border-white/10 focus:border-[#c8a96e]/50 transition-colors resize-none"
                    style={{ background: 'rgba(255,255,255,0.06)' }} />
                </Field>

                {/* Agree */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div
                      onClick={() => set('agree', !form.agree)}
                      className={cn(
                        'mt-0.5 w-5 h-5 rounded-md shrink-0 border-2 flex items-center justify-center transition-colors cursor-pointer',
                        form.agree ? 'bg-[#c8a96e] border-[#c8a96e]' : 'border-white/30 bg-transparent'
                      )}>
                      {form.agree && <svg viewBox="0 0 10 8" className="w-3 h-3 fill-[#1a1008]"><path d="M1 4l2.5 2.5L9 1" stroke="#1a1008" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
                    </div>
                    <span className="text-white/50 text-xs leading-relaxed">
                      Согласен(-на) с обработкой персональных данных в соответствии с политикой конфиденциальности
                    </span>
                  </label>
                  {errors.agree && <p className="text-red-400 text-xs mt-1 ml-8">{errors.agree}</p>}
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-400/20 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Ошибка отправки. Пожалуйста, позвоните нам напрямую.
                  </div>
                )}

                <button
                  onClick={submit}
                  disabled={status === 'loading'}
                  className="w-full py-4 rounded-xl bg-[#c8a96e] hover:bg-[#d4b87e] text-[#1a1008] font-semibold text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(200,169,110,0.3)] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Отправляем...</>
                  ) : 'Оставить заявку'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/60 text-xs mb-1.5 font-medium">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
