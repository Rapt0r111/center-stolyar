'use server';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ContactFormState {
  status: 'idle' | 'success' | 'error';
  errors: Partial<Record<'name' | 'email' | 'phone' | 'agree', string>>;
  serverError?: string;
  /** Echo back values so the form can repopulate on validation error */
  values?: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
}

// ─── Validation helpers ───────────────────────────────────────────────────────
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// ─── Action ───────────────────────────────────────────────────────────────────
export async function submitContactAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name    = (formData.get('name')    as string | null)?.trim() ?? '';
  const email   = (formData.get('email')   as string | null)?.trim() ?? '';
  const phone   = (formData.get('phone')   as string | null)?.trim() ?? '';
  const message = (formData.get('message') as string | null)?.trim() ?? '';
  const agree   = formData.get('agree') === 'on';

  // ── Client-mirrored validation (single source of truth on the server) ──────
  const errors: ContactFormState['errors'] = {};
  if (!name)                     errors.name  = 'Введите имя';
  if (!phone)                    errors.phone = 'Введите номер телефона';
  if (!email || !isValidEmail(email)) errors.email = 'Введите корректный e-mail';
  if (!agree)                    errors.agree = 'Необходимо согласие';

  if (Object.keys(errors).length > 0) {
    return { status: 'idle', errors, values: { name, email, phone, message } };
  }

  try {
    // ── TODO: Replace with real transport (Resend, Telegram Bot, etc.) ────────
    // Example Resend:
    //   import { Resend } from 'resend';
    //   const resend = new Resend(process.env.RESEND_API_KEY);
    //   await resend.emails.send({ from: '...', to: 's2277766@mail.ru', subject: `Заявка от ${name}`, ... });

    // ── Dev stub ──────────────────────────────────────────────────────────────
    await new Promise<void>(resolve => setTimeout(resolve, 600));
    console.info('[ContactForm] submission:', { name, email, phone, message });

    return { status: 'success', errors: {} };
  } catch (err) {
    console.error('[ContactForm] server error:', err);
    return {
      status: 'error',
      errors: {},
      serverError: 'Не удалось отправить заявку. Позвоните нам напрямую.',
    };
  }
}