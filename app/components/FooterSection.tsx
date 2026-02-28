// ─── Server Component — нет хуков, нет событий → рендерится на сервере ───────
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const SOCIAL_LINKS = [
  {
    label: 'VK',
    href: '#',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" aria-hidden="true">
        <path d="M0 23.04C0 12.1788 0 6.74826 3.37413 3.37413C6.74826 0 12.1788 0 23.04 0H24.96C35.8212 0 41.2517 0 44.6259 3.37413C48 6.74826 48 12.1788 48 23.04V24.96C48 35.8212 48 41.2517 44.6259 44.6259C41.2517 48 35.8212 48 24.96 48H23.04C12.1788 48 6.74826 48 3.37413 44.6259C0 41.2517 0 35.8212 0 24.96V23.04Z" fill="#0077FF"/>
        <path d="M25.54 34.5801C14.6 34.5801 8.3601 27.0801 8.1001 14.6001H13.5801C13.7601 23.7601 17.8 27.6401 21 28.4401V14.6001H26.1602V22.5001C29.3202 22.1601 32.6398 18.5601 33.7598 14.6001H38.9199C38.0599 19.4801 34.4599 23.0801 31.8999 24.5601C34.4599 25.7601 38.5601 28.9001 40.1201 34.5801H34.4399C33.2199 30.7801 30.1802 27.8401 26.1602 27.4401V34.5801H25.54Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: 'Telegram',
    href: '#',
    icon: (
      <svg viewBox="0 0 240 240" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="tg-g" x1="120" y1="240" x2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1d93d2"/>
            <stop offset="1" stopColor="#38b0e3"/>
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="120" fill="url(#tg-g)"/>
        <path d="M81.229,128.772l14.237,39.406s1.78,3.687,3.686,3.687,30.255-29.492,30.255-29.492l31.525-60.89L81.737,118.6Z" fill="#c8daea"/>
        <path d="M100.106,138.878l-2.733,29.046s-1.144,8.9,7.754,0,17.415-15.763,17.415-15.763" fill="#a9c6d8"/>
        <path d="M81.486,130.178,52.2,120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229,2.1-2.2,6.489-4.523,120.106-45.36,120.106-45.36s3.208-1.081,5.1-.362a2.766,2.766,0,0,1,1.885,2.055,9.357,9.357,0,0,1,.254,2.585c-.009.752-.1,1.449-.169,2.542-.692,11.165-21.4,94.493-21.4,94.493s-1.239,4.876-5.678,5.043A8.13,8.13,0,0,1,146.1,172.5c-8.711-7.493-38.819-27.727-45.472-32.177a1.27,1.27,0,0,1-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6,53.821-51.492c.108-.379-.3-.566-.848-.4-3.482,1.281-63.844,39.4-70.506,43.607A3.21,3.21,0,0,1,81.486,130.178Z" fill="#fff"/>
      </svg>
    ),
  },
  {
    label: 'MAX',
    href: '#',
    icon: (
      <svg viewBox="0 0 1000 1000" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="mx-g1" x1="117.847" x2="1000" y1="760.536" y2="500" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#4cf"/>
            <stop offset=".662" stopColor="#53e"/>
            <stop offset="1" stopColor="#93d"/>
          </linearGradient>
          <radialGradient id="mx-g2" cx="-87.392" cy="1166.116" r="500" gradientTransform="rotate(51.356 1551.478 559.3) scale(2.42703433 1)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00f"/>
            <stop offset="1" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1000" height="1000" fill="url(#mx-g1)" ry="249.681"/>
        <rect width="1000" height="1000" fill="url(#mx-g2)" ry="249.681"/>
        <path fill="#fff" fillRule="evenodd" clipRule="evenodd" d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z"/>
      </svg>
    ),
  },
] as const;

const LEGAL = [
  { label: 'ИНН',  value: '7825329987'  },
  { label: 'КПП',  value: '780701001'   },
  { label: 'ОГРН', value: '1127847368890' },
  { label: 'БИК',  value: '044030653'   },
] as const;

export default function FooterSection() {
  return (
    <footer id="map" className="bg-[#1a1008]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-[#c8a96e]" />
          <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">
            Как нас найти
          </span>
        </div>
        <h2
          className="text-4xl lg:text-5xl font-bold text-white mb-12 leading-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Мы в <span className="text-[#c8a96e]">Санкт-Петербурге</span>
        </h2>

        {/* Map + contacts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">

          {/* Yandex map */}
          <div
            className="lg:col-span-2 rounded-2xl overflow-hidden relative"
            style={{
              border: '1px solid rgba(170,121,36,0.8)',
              minHeight: 280,
              backgroundColor: '#f0ede6',
            }}
          >
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=30.471668%2C59.965347&z=16&pt=30.471668%2C59.965347%2Cpm2rdm"
              width="100%"
              height="100%"
              title="Мы на карте"
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />

            {/* Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1a1008] via-[#1a1008]/80 to-transparent pointer-events-none">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-auto">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-[#c8a96e]" />
                    <p className="text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      шоссе Революции, д. 106
                    </p>
                  </div>
                  <p className="text-white/80 text-sm ml-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Санкт-Петербург
                  </p>
                </div>
                <a
                  href="https://yandex.ru/maps/?pt=30.471668,59.965347&z=17&text=Санкт-Петербург,+шоссе+Революции,+106"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c8a96e] text-[#1a1008] text-sm font-semibold hover:bg-[#d4b87e] transition-colors shadow-lg"
                >
                  Открыть в Яндекс Картах
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact card */}
          <div
            className="rounded-2xl p-7 space-y-6"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(200,169,110,0.12)',
            }}
          >
            <h3 className="text-white font-semibold text-lg">Контакты</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#c8a96e] shrink-0" />
                <div>
                  <a href="tel:+78126121515" className="text-white text-sm hover:text-[#c8a96e] transition-colors block">
                    +7 (812) 612-15-15
                  </a>
                  <a href="tel:+78129074403" className="text-white/50 text-sm hover:text-[#c8a96e] transition-colors block">
                    +7 (812) 907-44-03
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#c8a96e] shrink-0" />
                <a href="mailto:s2277766@mail.ru" className="text-white text-sm hover:text-[#c8a96e] transition-colors">
                  s2277766@mail.ru
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c8a96e] shrink-0 mt-0.5" />
                <p className="text-white/60 text-sm leading-relaxed">
                  г. Санкт-Петербург,<br />шоссе Революции, д. 106
                </p>
              </div>
            </div>

            {/* Social */}
            <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-white/30 text-xs mb-3">Мы в социальных сетях</p>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Перейти в ${s.label}`}
                    className="block w-10 h-10 hover:scale-110 transition-transform origin-center drop-shadow-md"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {LEGAL.map(d => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="text-white/30 text-xs">{d.label}:</span>
                <span className="text-white/50 text-xs font-mono">{d.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-black.png"
                alt="ЦСИ Логотип"
                width={100}
                height={80}
                className="object-contain"
              />
              <p className="text-white/30 text-xs">
                © 2008–{new Date().getFullYear()} Центр Столярных Изделий. Все права защищены.
              </p>
            </div>
            <p className="text-white/20 text-xs">г. Санкт-Петербург</p>
          </div>
        </div>

      </div>
    </footer>
  );
}