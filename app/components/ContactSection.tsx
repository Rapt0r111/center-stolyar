'use client';

import { useState, useTransition } from 'react';
import { Phone, Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormState {
  name:    string;
  email:   string;
  phone:   string;
  message: string;
  agree:   boolean;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INIT: FormState = { name: '', email: '', phone: '', message: '', agree: false };

const PHONES = [
  { href: 'tel:+78126121515', display: '+7 (812) 612-15-15', label: 'Основной телефон', primary: true  },
  { href: 'tel:+78129074403', display: '+7 (812) 907-44-03', label: 'Дополнительный',   primary: false },
] as const;

function validate(form: FormState): FieldErrors {
  const e: FieldErrors = {};
  if (!form.name.trim())  e.name  = 'Введите имя';
  if (!form.phone.trim()) e.phone = 'Введите номер телефона';
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = 'Введите корректный e-mail';
  if (!form.agree) e.agree = 'Необходимо согласие';
  return e;
}

// ─── Submits form data. Replace body with real API / Telegram / Resend call. ──
async function sendForm(data: Omit<FormState, 'agree'>): Promise<{ success: boolean; error?: string }> {
  // Example: POST to /api/contact  (create app/api/contact/route.ts separately)
  // const res = await fetch('/api/contact', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) return { success: false, error: 'Ошибка сервера' };
  // return { success: true };

  // ── Dev stub ──────────────────────────────────────────────────────────────
  await new Promise(r => setTimeout(r, 700));
  console.info('Form submitted:', data);
  return { success: true };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/55 text-xs mb-1.5 font-medium">{label}</label>
      {children}
      {error && (
        <p className="text-red-400/90 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (hasError: boolean) =>
  cn(
    'w-full px-4 py-3 rounded-xl text-white placeholder-white/25 text-sm outline-none border transition-all duration-200',
    hasError
      ? 'border-red-400/50 bg-red-500/5'
      : 'border-white/10 focus:border-[#c8a96e]/50 focus:bg-white/[0.04]',
  );

// ─── Main component ───────────────────────────────────────────────────────────
export default function ContactSection() {
  const [form, setForm]         = useState<FormState>(INIT);
  const [errors, setErrors]     = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);
  const [isPending, startTransition] = useTransition();

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    setServerError(null);
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) return;

    startTransition(async () => {
      const result = await sendForm({
        name: form.name, email: form.email,
        phone: form.phone, message: form.message,
      });
      if (result.success) {
        setSuccess(true);
        setForm(INIT);
      } else {
        setServerError(result.error ?? 'Неизвестная ошибка');
      }
    });
  };

  return (
    <section id="contact" className="py-16 lg:py-20 bg-[#f5f0e8] relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c8a96e, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-[#c8a96e]" />
          <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Связь с нами</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* ── Left: contacts info ─────────────────────────────────────── */}
          <div>
            <h2
              className="text-4xl lg:text-5xl font-bold text-[#1a1008] leading-tight mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Оставьте <span className="text-[#c8a96e]">заявку</span>
            </h2>
            <p className="text-[#3d2b1f]/65 leading-relaxed mb-10">
              Расскажите нам о вашем проекте. Мы перезвоним в течение 30 минут и
              подготовим предварительный расчёт стоимости бесплатно.
            </p>

            <div className="space-y-3 mb-10">
              {PHONES.map(p => (
                <a
                  key={p.href}
                  href={p.href}
                  className="flex items-center gap-4 p-4 rounded-xl group transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(200,169,110,0.18)' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: p.primary ? '#c8a96e' : 'rgba(200,169,110,0.15)' }}
                  >
                    <Phone className={cn('w-4 h-4', p.primary ? 'text-[#1a1008]' : 'text-[#c8a96e]')} />
                  </div>
                  <div>
                    <p className="text-[#3d2b1f]/45 text-xs mb-0.5">{p.label}</p>
                    <p className="text-[#1a1008] font-semibold text-sm group-hover:text-[#c8a96e] transition-colors">
                      {p.display}
                    </p>
                  </div>
                </a>
              ))}

              <a
                href="mailto:s2277766@mail.ru"
                className="flex items-center gap-4 p-4 rounded-xl group transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(200,169,110,0.18)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(200,169,110,0.15)' }}
                >
                  <Mail className="w-4 h-4 text-[#c8a96e]" />
                </div>
                <div>
                  <p className="text-[#3d2b1f]/45 text-xs mb-0.5">Электронная почта</p>
                  <p className="text-[#1a1008] font-semibold text-sm group-hover:text-[#c8a96e] transition-colors">
                    s2277766@mail.ru
                  </p>
                </div>
              </a>
            </div>

            <div
              className="p-5 rounded-xl"
              style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.18)' }}
            >
              <p className="text-[#3d2b1f] text-sm leading-relaxed">
                <span className="font-semibold">Режим работы:</span> Пн–Пт 9:00–18:00,
                <br />Сб 10:00–15:00. Воскресенье — выходной.
              </p>
            </div>
          </div>

          {/* ── Right: form ──────────────────────────────────────────────── */}
          <div
            className="relative rounded-2xl p-8 lg:p-10 shadow-2xl grain"
            style={{
              background: 'linear-gradient(135deg, #1a1008 0%, #3d2b1f 100%)',
              border: '1px solid rgba(200,169,110,0.12)',
            }}
          >
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'rgba(200,169,110,0.12)', border: '1px solid rgba(200,169,110,0.3)' }}
                >
                  <CheckCircle className="w-8 h-8 text-[#c8a96e]" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Заявка отправлена!</h3>
                <p className="text-white/45 text-sm mb-6 max-w-xs">
                  Мы перезвоним вам в течение 30 минут в рабочее время.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl text-[#c8a96e] text-sm transition-colors"
                  style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.25)' }}
                >
                  Отправить ещё одну
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <h3 className="text-white text-xl font-semibold mb-2">Ваши данные</h3>

                <Field label="Имя *" error={errors.name}>
                  <input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Иван Иванов"
                    className={inputCls(!!errors.name)}
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                </Field>

                <Field label="E-mail *" error={errors.email}>
                  <input
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="example@mail.ru"
                    type="email"
                    className={inputCls(!!errors.email)}
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                </Field>

                <Field label="Номер телефона *" error={errors.phone}>
                  <input
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    type="tel"
                    className={inputCls(!!errors.phone)}
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                </Field>

                <Field label="Комментарий или вопрос">
                  <textarea
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    rows={3}
                    placeholder="Опишите ваш проект..."
                    className={cn(inputCls(false), 'resize-none')}
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                </Field>

                {/* Checkbox */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div
                      role="checkbox"
                      aria-checked={form.agree}
                      tabIndex={0}
                      onClick={() => set('agree', !form.agree)}
                      onKeyDown={e => e.key === ' ' && set('agree', !form.agree)}
                      className={cn(
                        'mt-0.5 w-5 h-5 rounded-md shrink-0 border-2 flex items-center justify-center transition-all cursor-pointer',
                        form.agree
                          ? 'bg-[#c8a96e] border-[#c8a96e]'
                          : 'border-white/25 bg-transparent hover:border-[#c8a96e]/50',
                      )}
                    >
                      {form.agree && (
                        <svg viewBox="0 0 10 8" className="w-3 h-3">
                          <path d="M1 4l2.5 2.5L9 1" stroke="#1a1008" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-white/45 text-xs leading-relaxed">
                      Согласен(-на) с обработкой персональных данных в соответствии
                      с политикой конфиденциальности
                    </span>
                  </label>
                  {errors.agree && (
                    <p className="text-red-400/90 text-xs mt-1 ml-8 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.agree}
                    </p>
                  )}
                </div>

                {serverError && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg text-red-400 text-sm"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {serverError}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="w-full py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  style={{
                    background: '#c8a96e',
                    color: '#1a1008',
                    boxShadow: isPending ? 'none' : '0 0 30px rgba(200,169,110,0.25)',
                  }}
                >
                  {isPending
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Отправляем...</>
                    : 'Оставить заявку'
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}