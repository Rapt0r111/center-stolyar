'use client';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function FooterSection() {
    return (
        <footer id="map" className="bg-[#1a1008]">
            {/* Map section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-px bg-[#c8a96e]" />
                    <span className="text-[#c8a96e] text-xs tracking-widest uppercase font-medium">Как нас найти</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-12 leading-tight"
                    style={{ fontFamily: 'Georgia, serif' }}>
                    Мы в <span className="text-[#c8a96e]">Санкт-Петербурге</span>
                </h2>

                {/* Map card + contacts */}
                <div className="grid lg:grid-cols-3 gap-6 mb-16">

                    {/* Интерактивная карта Яндекс */}
                    <div className="lg:col-span-2 rounded-2xl overflow-hidden relative group"
                        style={{ border: '1px solid rgba(170, 121, 36, 0.8)', minHeight: 280, backgroundColor: '#f0ede6' }}>

                        {/* Iframe с картой */}
                        <iframe
                            /* Используем параметр pt (point), чтобы жестко зафиксировать красный маркер на координатах */
                            src="https://yandex.ru/map-widget/v1/?ll=30.471668%2C59.965347&z=16&pt=30.471668%2C59.965347%2Cpm2rdm"
                            width="100%"
                            height="100%"
                            title="Мы на карте"
                            className="absolute inset-0 w-full h-full"
                        />

                        {/* Address overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-[#1a1008] via-[#1a1008]/80 to-transparent pointer-events-none transition-opacity duration-300">
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
                                {/* Кнопка открытия полноценной карты */}
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
                    <div className="rounded-2xl p-7 space-y-6"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,169,110,0.12)' }}>
                        <h3 className="text-white font-semibold text-lg">Контакты</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-[#c8a96e] shrink-0" />
                                <div>
                                    <a href="tel:+78126121515" className="text-white text-sm hover:text-[#c8a96e] transition-colors block">+7 (812) 612-15-15</a>
                                    <a href="tel:+78129074403" className="text-white/50 text-sm hover:text-[#c8a96e] transition-colors block">+7 (812) 907-44-03</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-[#c8a96e] shrink-0" />
                                <a href="mailto:s2277766@mail.ru" className="text-white text-sm hover:text-[#c8a96e] transition-colors">s2277766@mail.ru</a>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-[#c8a96e] shrink-0 mt-0.5" />
                                <p className="text-white/60 text-sm leading-relaxed">
                                    г. Санкт-Петербург,<br />шоссе Революции, д. 106
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <p className="text-white/30 text-xs mb-3">Мы в социальных сетях</p>
                            <div className="flex gap-3">
                                {[
                                    { label: 'VK', href: '#', color: '#4C75A3' },
                                    { label: 'IG', href: '#', color: '#E1306C' },
                                    { label: 'YT', href: '#', color: '#FF0000' },
                                ].map(s => (
                                    <a key={s.label} href={s.href}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform"
                                        style={{ background: `${s.color}22`, border: `1px solid ${s.color}44` }}>
                                        {s.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal details */}
                <div className="pt-8 border-t border-white/10">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'ИНН', value: '7825329987' },
                            { label: 'КПП', value: '780701001' },
                            { label: 'ОГРН', value: '1127847368890' },
                            { label: 'БИК', value: '044030653' },
                        ].map(d => (
                            <div key={d.label} className="flex items-center gap-2">
                                <span className="text-white/30 text-xs">{d.label}:</span>
                                <span className="text-white/50 text-xs font-mono">{d.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded bg-[#c8a96e] flex items-center justify-center">
                                <span className="text-[#1a1008] font-bold text-xs">ЦСИ</span>
                            </div>
                            <p className="text-white/30 text-xs">© 2008–2026 Центр Столярных Изделий. Все права защищены.</p>
                        </div>
                        <p className="text-white/20 text-xs">г. Санкт-Петербург</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}