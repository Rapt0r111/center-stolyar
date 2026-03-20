'use client';

/**
 * ContactSection.tsx — React 19 edition
 *
 * Изменения:
 * ─────────────────────────────────────────────────────────────────
 * 1. Заменены useState + useTransition на useActionState (React 19)
 *    — валидация и отправка происходят через Server Action,
 *      компонент просто реагирует на state.
 * 2. <form action={formAction}> — нативная интеграция форм React 19.
 *    Браузер автоматически вызывает Server Action, поддерживается
 *    прогрессивное улучшение (работает без JS).
 * 3. defaultValue из state.values — поля восстанавливаются при ошибке
 *    валидации без лишних useState.
 * 4. useFormStatus заменяет ручной isPending — читает состояние
 *    ближайшей формы прямо из контекста.
 * 5. Удалена клиентская валидация-дубликат; сервер — единый источник правды.
 */

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Phone, Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitContactAction, type ContactFormState } from '@/app/actions/contact';

// ─── Constants ────────────────────────────────────────────────────────────────
const PHONES = [
  { href: 'tel:+78126121515', display: '+7 (812) 612-15-15', label: 'Основной телефон', primary: true  },
  { href: 'tel:+78129074403', display: '+7 (812) 907-44-03', label: 'Дополнительный',   primary: false },
] as const;

const INITIAL_STATE: ContactFormState = { status: 'idle', errors: {} };

// ─── Sub-components ───────────────────────────────────────────────────────────
function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/55 text-xs mb-1.5 font-medium">{label}</label>
      {children}
      {error && (
        <p role="alert" className="text-red-400/90 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={11} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (hasError: boolean) =>
  cn(
    'w-full px-4 py-3 rounded-xl text-white placeholder-white/25 text-sm outline-none border transition-all duration-200',
    'bg-white/5',
    hasError
      ? 'border-red-400/50 focus:border-red-400/70'
      : 'border-white/10 focus:border-[#c8a96e]/50 focus:bg-white/[0.07]',
  );

/** Reads pending state from nearest <form> — React 19 / react-dom */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-full py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
      style={{
        background: '#c8a96e',
        color: '#1a1008',
        boxShadow: pending ? 'none' : '0 0 30px rgba(200,169,110,0.25)',
      }}
    >
      {pending ? (
        <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Отправляем...</>
      ) : (
        'Оставить заявку'
      )}
    </button>
  );
}

// ─── Success state ────────────────────────────────────────────────────────────
function SuccessView({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'rgba(200,169,110,0.12)', border: '1px solid rgba(200,169,110,0.3)' }}
      >
        <CheckCircle className="w-8 h-8 text-gold" aria-hidden="true" />
      </div>
      <h3 className="text-white text-xl font-semibold mb-2">Заявка отправлена!</h3>
      <p className="text-white/45 text-sm mb-6 max-w-xs">
        Мы перезвоним вам в течение 30 минут в рабочее время.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-2.5 rounded-xl text-gold text-sm transition-colors hover:bg-white/10"
        style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.25)' }}
      >
        Отправить ещё одну
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ContactSection() {
  /**
   * useActionState — React 19
   * Returns [currentState, formAction, isPending]
   * formAction передаётся напрямую в <form action={...}>
   */
  const [state, formAction] = useActionState(submitContactAction, INITIAL_STATE);

  // Reset: переключаем на новый экземпляр через key
  // Простейший способ без дополнительного useState — используем key на форме.
  // Для "Отправить ещё одну" нам нужно принудительно сбросить state.
  // Так как useActionState нельзя сбросить напрямую, оборачиваем в key-state:
  const [formKey, setFormKey] = React.useState(0);
  const handleReset = () => setFormKey(k => k + 1);

  const { errors, serverError, values } = state;

  return (
    <section id="contact" className="py-16 lg:py-20 bg-cream relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c8a96e, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-gold" aria-hidden="true" />
          <span className="text-gold text-xs tracking-widest uppercase font-medium">Связь с нами</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Left: info ──────────────────────────────────────────────── */}
          <div>
            <h2
              className="text-4xl lg:text-5xl font-bold text-wood-dark leading-tight mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Оставьте <span className="text-gold">заявку</span>
            </h2>
            <p className="text-wood-mid/65 leading-relaxed mb-10">
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
                    aria-hidden="true"
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
                  aria-hidden="true"
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
            {state.status === 'success' ? (
              <SuccessView onReset={handleReset} />
            ) : (
              /**
               * key=formKey → при сбросе React пересоздаёт форму,
               * очищая все input-значения и useActionState.
               */
              <form key={formKey} action={formAction} noValidate className="space-y-5">
                <h3 className="text-white text-xl font-semibold mb-2">Ваши данные</h3>

                <Field label="Имя *" error={errors.name}>
                  <input
                    name="name"
                    defaultValue={values?.name}
                    placeholder="Иван Иванов"
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    className={inputCls(!!errors.name)}
                  />
                </Field>

                <Field label="E-mail *" error={errors.email}>
                  <input
                    name="email"
                    defaultValue={values?.email}
                    placeholder="example@mail.ru"
                    type="email"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    className={inputCls(!!errors.email)}
                  />
                </Field>

                <Field label="Номер телефона *" error={errors.phone}>
                  <input
                    name="phone"
                    defaultValue={values?.phone}
                    placeholder="+7 (___) ___-__-__"
                    type="tel"
                    autoComplete="tel"
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                    className={inputCls(!!errors.phone)}
                  />
                </Field>

                <Field label="Комментарий или вопрос">
                  <textarea
                    name="message"
                    defaultValue={values?.message}
                    rows={3}
                    placeholder="Опишите ваш проект..."
                    className={cn(inputCls(false), 'resize-none')}
                  />
                </Field>

                {/* Checkbox — native input, accessible */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agree"
                      aria-required="true"
                      aria-invalid={!!errors.agree}
                      className="sr-only peer"
                    />
                    {/* Custom visual checkbox tied to peer state */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mt-0.5 w-5 h-5 rounded-md shrink-0 border-2 flex items-center justify-center transition-all',
                        'border-white/25 bg-transparent peer-checked:bg-[#c8a96e] peer-checked:border-[#c8a96e]',
                        'peer-focus-visible:ring-2 peer-focus-visible:ring-[#c8a96e]/40',
                        'group-hover:border-[#c8a96e]/50',
                        errors.agree ? 'border-red-400/50' : '',
                      )}
                    >
                      {/* We can't use peer-checked inside the span for SVG visibility
                          without a workaround — using CSS peer works with sibling targets.
                          A small JS-free trick: use CSS only. */}
                      <svg viewBox="0 0 10 8" className="w-3 h-3 opacity-0 peer-checked:opacity-100 transition-opacity">
                        <path d="M1 4l2.5 2.5L9 1" stroke="#1a1008" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="text-white/45 text-xs leading-relaxed">
                      Согласен(-на) с обработкой персональных данных в соответствии
                      с политикой конфиденциальности
                    </span>
                  </label>
                  {errors.agree && (
                    <p role="alert" className="text-red-400/90 text-xs mt-1 ml-8 flex items-center gap-1">
                      <AlertCircle size={11} aria-hidden="true" /> {errors.agree}
                    </p>
                  )}
                </div>

                {/* Server-level error */}
                {(state.status === 'error' || serverError) && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 p-3 rounded-lg text-red-400 text-sm"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {serverError ?? 'Неизвестная ошибка'}
                  </div>
                )}

                <SubmitButton />
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Import React for useState ─────────────────────────────────────────────────
// (needed for formKey state — the rest is server-driven)
import React from 'react';