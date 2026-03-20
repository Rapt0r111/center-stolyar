// app/components/seo/JsonLd.tsx
// ─── Утилита для JSON-LD структурированных данных ────────────────────────────
// Защита от XSS: экранируем символы < и > и &.
// Используется в Server Components для инъекции в <head>.

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
};

export function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}