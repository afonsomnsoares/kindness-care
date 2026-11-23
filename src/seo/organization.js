export const BASE_URL = 'https://www.kindnesscare.pt';
export const SITE_NAME = 'Kindness & Care';
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;
export const LOGO_URL = `${BASE_URL}/logo.jpg`;

const ALL_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function alwaysOpenHours() {
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ALL_WEEK,
    opens: '00:00',
    closes: '23:59',
  };
}

export function getOrganizationSchema(lang = 'pt') {
  const isEn = lang === 'en';
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MedicalBusiness'],
    '@id': `${BASE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: 'Kindness Care',
    description: isEn
      ? 'Home care, longevity, training and support during stays in Braga, Porto and Viana do Castelo. University of Minho spin-off. Phone line available 24 hours. Visits by appointment.'
      : 'Cuidados em casa, longevidade, formação e apoio em estadias em Braga, Porto e Viana do Castelo. Spin-off da Universidade do Minho. Linha telefónica 24 horas. Visitas mediante marcação.',
    url: BASE_URL,
    telephone: '+351968844420',
    email: 'geral@kindnesscare.pt',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+351968844420',
        contactType: 'customer service',
        availableLanguage: ['Portuguese', 'English'],
        hoursAvailable: alwaysOpenHours(),
        description: isEn ? 'Phone and WhatsApp line' : 'Linha telefónica e WhatsApp',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+351933929761',
        contactType: 'customer service',
        availableLanguage: ['Portuguese', 'English'],
      },
    ],
    logo: LOGO_URL,
    image: DEFAULT_OG_IMAGE,
    foundingDate: '2025',
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Braga',
      addressRegion: 'Braga',
      addressCountry: 'PT',
    },
    areaServed: [
      { '@type': 'City', name: 'Braga' },
      { '@type': 'City', name: 'Porto' },
      { '@type': 'City', name: 'Viana do Castelo' },
    ],
    openingHoursSpecification: alwaysOpenHours(),
    sameAs: ['https://www.instagram.com/kindnesscare.pt'],
  };
}

export function getWebsiteSchema(lang = 'pt') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: SITE_NAME,
    url: BASE_URL,
    inLanguage: lang === 'en' ? 'en-GB' : 'pt-PT',
    publisher: { '@id': `${BASE_URL}/#organization` },
  };
}

export function getServiceSchema({ name, description, cities, lang = 'pt' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: cities.map((city) => ({ '@type': 'City', name: city })),
    serviceType: lang === 'en' ? 'Healthcare' : 'Cuidados de saúde',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: BASE_URL,
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: '+351968844420',
        contactType: 'customer service',
        availableLanguage: ['Portuguese', 'English'],
      },
    },
  };
}

export function getBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
