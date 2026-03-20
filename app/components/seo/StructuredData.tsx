// app/components/seo/StructuredData.tsx
// ─── ИСПРАВЛЕНО: 3 бага в JSON-LD схемах ─────────────────────────────────────
//
// БАГ 4 (КРИТИЧНЫЙ): Фиктивный aggregateRating на Product-схеме.
//   ratingValue: '4.9', reviewCount: '127' — выдуманные числа.
//   Google НАКАЗЫВАЕТ за поддельные рейтинги в structured data.
//   Результат: manual action → потеря всех rich snippets для сайта.
//   ИСПРАВЛЕНИЕ: aggregateRating полностью удалён из Product-схемы.
//   Добавить обратно можно только с реальными отзывами на странице.
//
// БАГ 5: hasMap как массив — невалидный Schema.org.
//   Schema.org/hasMap принимает одиночный URL, не массив.
//   Валидатор schema.org помечал это как ошибку.
//   ИСПРАВЛЕНИЕ: один URL (Яндекс.Карты как основной для РФ).
//
// БАГ 6: Воскресенье opens/closes "00:00"/"00:00" → неверно означает "закрыто".
//   В Schema.org "00:00"-"00:00" = "открыт круглосуточно".
//   Чтобы указать выходной — нужно просто НЕ добавлять воскресенье.
//   ИСПРАВЛЕНИЕ: воскресенье удалено из openingHoursSpecification.

import { JsonLd } from './JsonLd';
import { ARTICLES, SERVICES } from '@/lib/data';

const BASE_URL = 'https://www.centersi.spb.ru';

// ─── 1. WebSite ───────────────────────────────────────────────────────────────
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'Центр Столярных Изделий',
  alternateName: ['ЦСИ', 'ЦСИ СПб', 'centersi.spb.ru'],
  url: BASE_URL,
  description: 'Производство изделий из натурального дерева в Санкт-Петербурге с 2008 года.',
  inLanguage: 'ru-RU',
  publisher: { '@id': `${BASE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

// ─── 2. LocalBusiness ────────────────────────────────────────────────────────
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'Центр Столярных Изделий',
  alternateName: 'ЦСИ',
  description: 'Производственная компания в Санкт-Петербурге. Изготовление лестниц, дверей, мебели, арок и декоративных элементов из натурального дерева по индивидуальным проектам с 2008 года.',
  url: BASE_URL,
  telephone: ['+7-812-612-15-15', '+7-812-907-44-03'],
  email: 's2277766@mail.ru',
  image: [
    `${BASE_URL}/images/og-image.jpg`,
    `${BASE_URL}/images/logo-black.png`,
    `${BASE_URL}/images/gallery/stair-1.jpg`,
    `${BASE_URL}/images/gallery/stair-2.jpg`,
    `${BASE_URL}/images/gallery/door-1.jpg`,
    `${BASE_URL}/images/gallery/furniture-1.jpg`,
  ],
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/images/logo-black.png`,
    width: 200,
    height: 160,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'шоссе Революции, д. 106',
    addressLocality: 'Санкт-Петербург',
    addressRegion: 'Санкт-Петербург',
    postalCode: '195279',
    addressCountry: 'RU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 59.965347,
    longitude: 30.471668,
  },
  // ИСПРАВЛЕНО БАГ 5: hasMap — одиночный URL, не массив
  hasMap: 'https://yandex.ru/maps/?pt=30.471668,59.965347&z=17',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '15:00',
    },
    // ИСПРАВЛЕНО БАГ 6: Воскресенье удалено — отсутствие = выходной.
    // Не добавляем Sunday, так как 00:00-00:00 = "открыт всю ночь" (неверно).
  ],
  priceRange: '₽₽₽',
  currenciesAccepted: 'RUB',
  paymentAccepted: 'Наличные, безналичный расчёт, банковский перевод',
  foundingDate: '2008',
  areaServed: [
    { '@type': 'City',               name: 'Санкт-Петербург' },
    { '@type': 'AdministrativeArea', name: 'Ленинградская область' },
  ],
  sameAs: [
    'https://vk.com/csi_spb',
    'https://t.me/csi_spb',
    'https://centersi.spb.ru',
  ],
  knowsAbout: [
    'Деревянные лестницы на заказ',
    'Межкомнатные двери из массива',
    'Мебель на заказ из дерева',
    'Деревянные арки и порталы',
    'Перила и ограждения лестниц',
    'Кессонные потолки из дерева',
    'Библиотеки и стеллажи',
    'Дуб, ясень, бук, сосна, лиственница, орех',
  ],
  slogan: 'Создаём красоту из дерева с 2008 года',
  taxID: '7825329987',
  identifier: [
    { '@type': 'PropertyValue', name: 'ИНН',  value: '7825329987'    },
    { '@type': 'PropertyValue', name: 'КПП',  value: '780701001'     },
    { '@type': 'PropertyValue', name: 'ОГРН', value: '1127847368890' },
  ],
};

// ─── 3. Organization ─────────────────────────────────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Центр Столярных Изделий',
  alternateName: 'ЦСИ',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/images/logo-black.png`,
    width: 200,
    height: 160,
  },
  description: 'Производственная компания в Санкт-Петербурге. Изготовление столярных изделий из натурального дерева с 2008 года.',
  foundingDate: '2008',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'шоссе Революции, д. 106',
    addressLocality: 'Санкт-Петербург',
    addressCountry: 'RU',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+7-812-612-15-15',
      contactType: 'customer service',
      areaServed: 'RU',
      availableLanguage: 'Russian',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    },
    {
      '@type': 'ContactPoint',
      email: 's2277766@mail.ru',
      contactType: 'customer service',
      areaServed: 'RU',
    },
  ],
  sameAs: ['https://vk.com/csi_spb', 'https://t.me/csi_spb'],
  taxID: '7825329987',
};

// ─── 4. BreadcrumbList ────────────────────────────────────────────────────────
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная',    item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'О компании', item: `${BASE_URL}/#about` },
    { '@type': 'ListItem', position: 3, name: 'Услуги',     item: `${BASE_URL}/#services` },
    { '@type': 'ListItem', position: 4, name: 'Галерея',    item: `${BASE_URL}/#gallery` },
    { '@type': 'ListItem', position: 5, name: 'Блог',       item: `${BASE_URL}/#articles` },
    { '@type': 'ListItem', position: 6, name: 'Контакты',   item: `${BASE_URL}/#contact` },
  ],
};

// ─── 5. Services ItemList ─────────────────────────────────────────────────────
const servicesListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${BASE_URL}/#services-list`,
  name: 'Услуги Центра Столярных Изделий',
  description: 'Перечень столярных изделий из натурального дерева на заказ в Санкт-Петербурге',
  numberOfItems: SERVICES.length,
  itemListElement: SERVICES.map((service, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      '@id': `${BASE_URL}/#service-${service.id}`,
      name: service.title,
      description: service.desc,
      serviceType: 'Изготовление столярных изделий из натурального дерева',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'City', name: 'Санкт-Петербург' },
      url: `${BASE_URL}/#services`,
      offers: {
        '@type': 'Offer',
        url: `${BASE_URL}/#contact`,
        priceCurrency: 'RUB',
        priceSpecification: {
          '@type': 'PriceSpecification',
          description: 'Цена индивидуальна. Бесплатный расчёт по телефону.',
        },
        availability: 'https://schema.org/InStock',
        seller: { '@id': `${BASE_URL}/#organization` },
      },
    },
  })),
};

// ─── 6. Articles ItemList ─────────────────────────────────────────────────────
const articlesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Блог Центра Столярных Изделий',
  url: `${BASE_URL}/#articles`,
  itemListElement: ARTICLES.map((article, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${BASE_URL}/#article-${article.id}`,
      headline: article.title,
      description: article.excerpt,
      image: {
        '@type': 'ImageObject',
        url: `${BASE_URL}${article.image}`,
        width: 800,
        height: 500,
      },
      datePublished: articleDateToISO(article.date),
      dateModified:  articleDateToISO(article.date),
      author: {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
      },
      publisher: {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/logo-black.png` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/#articles` },
      articleSection: article.tag,
      inLanguage: 'ru-RU',
    },
  })),
};

// ─── 7. FAQPage — Rich Snippets в выдаче ─────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${BASE_URL}/#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Из каких пород дерева вы изготавливаете изделия?',
      acceptedAnswer: { '@type': 'Answer', text: 'Мы работаем с ценными породами: дуб, ясень, бук, сосна, лиственница, орех. Подбираем породу под требования проекта и бюджет клиента.' },
    },
    {
      '@type': 'Question',
      name: 'Сколько стоит деревянная лестница на заказ в Санкт-Петербурге?',
      acceptedAnswer: { '@type': 'Answer', text: 'Стоимость рассчитывается индивидуально — зависит от конструкции (маршевая, винтовая, на больцах), породы дерева, размеров и дополнительных элементов. Позвоните по +7 (812) 612-15-15 для бесплатного расчёта.' },
    },
    {
      '@type': 'Question',
      name: 'Вы осуществляете доставку и монтаж изделий?',
      acceptedAnswer: { '@type': 'Answer', text: 'Да, выполняем доставку и профессиональный монтаж всех изделий по Санкт-Петербургу и Ленинградской области. Работаем под ключ — от проекта до сдачи.' },
    },
    {
      '@type': 'Question',
      name: 'Какая гарантия на столярные изделия из дерева?',
      acceptedAnswer: { '@type': 'Answer', text: 'Предоставляем официальную гарантию 2 года на все изготовленные изделия. Дефекты материала или сборки устраняем бесплатно.' },
    },
    {
      '@type': 'Question',
      name: 'Можно ли заказать изделие по индивидуальному проекту?',
      acceptedAnswer: { '@type': 'Answer', text: 'Да, это наша специализация. Мы работаем по чертежам заказчика, создаём 3D-визуализацию. Принимаем фото с Pinterest, из журналов или собственные эскизы.' },
    },
    {
      '@type': 'Question',
      name: 'Сколько времени занимает изготовление?',
      acceptedAnswer: { '@type': 'Answer', text: 'Сроки зависят от сложности. Лестницы — от 4 до 8 недель, двери — от 3 недель, мебель — от 4 недель. Точные сроки фиксируются в договоре.' },
    },
    {
      '@type': 'Question',
      name: 'Где находится Центр Столярных Изделий?',
      acceptedAnswer: { '@type': 'Answer', text: 'Адрес: Санкт-Петербург, шоссе Революции, д. 106. Режим работы: Пн–Пт 9:00–18:00, Сб 10:00–15:00. Телефон: +7 (812) 612-15-15.' },
    },
    {
      '@type': 'Question',
      name: 'Что лучше для лестницы — дуб или ясень?',
      acceptedAnswer: { '@type': 'Answer', text: 'Оба отличны. Дуб — классика, устойчивее к влаге, выраженная текстура. Ясень — чуть прочнее, гибче (идеален для гнутых поручней), светлее. Для современных интерьеров — ясень, для классики — дуб.' },
    },
  ],
};

// ─── 8. Product — ИСПРАВЛЕНО: убран aggregateRating ──────────────────────────
// ИСПРАВЛЕНО БАГ 4: aggregateRating с фиктивными числами (127 отзывов, 4.9)
// полностью удалён. Google карает за поддельные рейтинги.
// Добавить обратно можно только когда:
//   а) На странице есть видимые отзывы клиентов
//   б) Рейтинг подсчитан реально
const mainProductSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${BASE_URL}/#product-stairs`,
  name: 'Деревянные лестницы на заказ в Санкт-Петербурге',
  description: 'Маршевые, винтовые, на больцах — лестницы из дуба, ясеня и бука. Полный цикл: проект, производство, монтаж по СПб и ЛО. Гарантия 2 года.',
  image: [
    `${BASE_URL}/images/gallery/stair-1.jpg`,
    `${BASE_URL}/images/gallery/stair-2.jpg`,
    `${BASE_URL}/images/gallery/stair-3.jpg`,
    `${BASE_URL}/images/gallery/stair-4.jpg`,
  ],
  brand: { '@type': 'Brand', name: 'Центр Столярных Изделий' },
  manufacturer: { '@id': `${BASE_URL}/#organization` },
  material: ['Дуб', 'Ясень', 'Бук', 'Сосна', 'Лиственница', 'Нержавеющая сталь'],
  offers: {
    '@type': 'Offer',
    url: `${BASE_URL}/#contact`,
    priceCurrency: 'RUB',
    priceSpecification: {
      '@type': 'PriceSpecification',
      description: 'Цена индивидуальна. Звоните: +7 (812) 612-15-15',
    },
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': `${BASE_URL}/#organization` },
    areaServed: { '@type': 'City', name: 'Санкт-Петербург' },
    deliveryLeadTime: {
      '@type': 'QuantitativeValue',
      minValue: 4,
      maxValue: 8,
      unitCode: 'WEE',
    },
    warranty: {
      '@type': 'WarrantyPromise',
      durationOfWarranty: { '@type': 'QuantitativeValue', value: 2, unitCode: 'ANN' },
      warrantyScope: 'https://schema.org/LabourAndParts',
    },
  },
  // aggregateRating — УДАЛЁН до появления реальных отзывов на странице
};

// ─── Helper ───────────────────────────────────────────────────────────────────
function articleDateToISO(russianDate: string): string {
  const months: Record<string, string> = {
    'января': '01', 'февраля': '02', 'марта': '03', 'апреля': '04',
    'мая': '05', 'июня': '06', 'июля': '07', 'августа': '08',
    'сентября': '09', 'октября': '10', 'ноября': '11', 'декабря': '12',
  };
  const parts = russianDate.split(' ');
  if (parts.length !== 3) return new Date().toISOString();
  const [day, monthRu, year] = parts;
  const month = months[monthRu.toLowerCase()] ?? '01';
  return `${year}-${month}-${day.padStart(2, '0')}T12:00:00+03:00`;
}

export default function StructuredData() {
  return (
    <>
      <JsonLd data={websiteSchema}       id="ld-website"      />
      <JsonLd data={localBusinessSchema} id="ld-localbusiness" />
      <JsonLd data={organizationSchema}  id="ld-organization"  />
      <JsonLd data={breadcrumbSchema}    id="ld-breadcrumb"    />
      <JsonLd data={servicesListSchema}  id="ld-services"      />
      <JsonLd data={articlesSchema}      id="ld-articles"      />
      <JsonLd data={faqSchema}           id="ld-faq"           />
      <JsonLd data={mainProductSchema}   id="ld-main-product"  />
    </>
  );
}