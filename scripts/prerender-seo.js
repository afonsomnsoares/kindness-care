/**
 * Post-build SEO prerender:
 * - Writes route-specific HTML shells with title/description/canonical/hreflang
 * - Injects company, page and breadcrumb JSON-LD (not company markup alone)
 * - Regenerates sitemap.xml with all PT + EN locs
 *
 * Company fields mirror src/seo/organization.js. Run after `react-scripts build`.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'build');
const pagesConfig = JSON.parse(
  fs.readFileSync(path.join(root, 'src/seo/pages.json'), 'utf8')
);
const pt = {
  ...JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/locales/pt/common.json'), 'utf8')),
  ...JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/locales/pt/pillars.json'), 'utf8')),
};
const en = {
  ...JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/locales/en/common.json'), 'utf8')),
  ...JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/locales/en/pillars.json'), 'utf8')),
};

const BASE = pagesConfig.baseUrl;
const today = new Date().toISOString().slice(0, 10);
const ALL_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function cities(names) {
  return names.map((name) => ({ '@type': 'City', name }));
}

const HOME_CITIES = cities(['Braga', 'Porto', 'Viana do Castelo']);
const STAY_CITIES = cities(['Viana do Castelo', 'Porto', 'Santa Maria do Bouro']);
const SERVICE_AREA = {
  homeCare: HOME_CITIES,
  nursing: HOME_CITIES,
  medical: HOME_CITIES,
  caregiver: HOME_CITIES,
  postpartum: HOME_CITIES,
  healthTourism: STAY_CITIES,
  pousadas: STAY_CITIES,
};

function abs(routePath) {
  if (!routePath || routePath === '/') return BASE;
  return `${BASE}${routePath}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonForHtml(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function alwaysOpenHours() {
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ALL_WEEK,
    opens: '00:00',
    closes: '23:59',
  };
}

function sectionFor(locale, page) {
  if (page.pillar) return (locale.pillars && locale.pillars[page.pillar]) || {};
  return locale[page.i18nKey] || {};
}

function getSeo(section) {
  const title = section.seoTitle || section.hero?.title || 'Kindness & Care';
  const description =
    section.seoDescription ||
    section.hero?.subtitle ||
    section.content?.description ||
    '';
  return { title, description };
}

function organizationNode(lang) {
  const isEn = lang === 'en';
  return {
    '@type': ['LocalBusiness', 'MedicalBusiness'],
    '@id': `${BASE}/#organization`,
    name: 'Kindness & Care',
    alternateName: 'Kindness Care',
    description: isEn
      ? 'Home care, longevity, training and support during stays in Braga, Porto and Viana do Castelo. University of Minho spin-off. Phone line available 24 hours. Visits by appointment.'
      : 'Cuidados em casa, longevidade, formação e apoio em estadias em Braga, Porto e Viana do Castelo. Spin-off da Universidade do Minho. Linha telefónica 24 horas. Visitas mediante marcação.',
    url: BASE,
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
    logo: `${BASE}/logo.jpg`,
    image: pagesConfig.defaultImage,
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
    areaServed: HOME_CITIES,
    openingHoursSpecification: alwaysOpenHours(),
    sameAs: ['https://www.instagram.com/kindnesscare.pt'],
  };
}

function websiteNode(lang) {
  return {
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    name: 'Kindness & Care',
    url: BASE,
    inLanguage: lang === 'en' ? 'en-GB' : 'pt-PT',
    publisher: { '@id': `${BASE}/#organization` },
  };
}

function webPageNode({ type = 'WebPage', title, description, canonical, lang, extra = {} }) {
  return {
    '@type': type,
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: lang === 'en' ? 'en-GB' : 'pt-PT',
    isPartOf: { '@id': `${BASE}/#website` },
    about: { '@id': `${BASE}/#organization` },
    ...extra,
  };
}

function breadcrumbNode(lang, title, canonical) {
  const homeUrl = lang === 'en' ? `${BASE}/en` : BASE;
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kindness & Care', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: title, item: canonical },
    ],
  };
}

function serviceNode({ name, description, area, canonical }) {
  return {
    '@type': 'Service',
    name,
    description,
    url: canonical,
    provider: { '@id': `${BASE}/#organization` },
    areaServed: area,
    serviceType: name,
  };
}

function buildGraph({ page, lang, section, title, description, canonical }) {
  const org = organizationNode(lang);
  const nodes = [org, websiteNode(lang)];

  if (page.key === 'history') {
    org.parentOrganization = {
      '@type': 'CollegeOrUniversity',
      name: 'Universidade do Minho',
    };
    nodes.push(webPageNode({
      type: 'AboutPage',
      title,
      description,
      canonical,
      lang,
      extra: { mainEntity: { '@id': `${BASE}/#organization` } },
    }));
  } else if (page.key === 'contacts') {
    nodes.push(webPageNode({
      type: 'ContactPage',
      title,
      description,
      canonical,
      lang,
      extra: { mainEntity: { '@id': `${BASE}/#organization` } },
    }));
  } else if (page.key === 'mission') {
    org.slogan = description;
    nodes.push(webPageNode({ title, description, canonical, lang }));
  } else if (SERVICE_AREA[page.key]) {
    const name = page.key === 'pousadas'
      ? (section.seoTitle || title)
      : (section.hero && section.hero.title) || title;
    nodes.push(serviceNode({
      name,
      description,
      area: SERVICE_AREA[page.key],
      canonical,
    }));
    nodes.push(webPageNode({ title, description, canonical, lang }));
  } else if (page.key === 'testimonials') {
    const items = Array.isArray(section.items) ? section.items : [];
    if (items.length) {
      org.review = items.map((item) => ({
        '@type': 'Review',
        reviewBody: item.text,
        author: { '@type': 'Person', name: item.author },
        publisher: { '@type': 'Organization', name: 'Kindness & Care' },
      }));
    }
    nodes.push(webPageNode({ title, description, canonical, lang }));
  } else {
    nodes.push(webPageNode({ title, description, canonical, lang }));
  }

  if (page.key !== 'home') nodes.push(breadcrumbNode(lang, title, canonical));

  return { '@context': 'https://schema.org', '@graph': nodes };
}

function injectHead(html, { lang, title, description, canonical, ptUrl, enUrl, schema }) {
  const fullTitle = /kindness\s*(&|and)\s*care/i.test(title) ? title : `${title} | Kindness & Care`;
  const locale = lang === 'en' ? 'en_GB' : 'pt_PT';
  const altLocale = lang === 'en' ? 'pt_PT' : 'en_GB';

  let next = html.replace(/<html[^>]*>/, `<html lang="${lang}">`);
  next = next.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);
  next = next.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );
  next = next.replace(
    /<meta name="robots" content="[^"]*"\s*\/?>/,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`
  );

  // Remove static homepage-only hreflang/canonical/og blocks; re-inject accurate ones.
  next = next.replace(/<!-- Hreflang -->[\s\S]*?<!-- Canonical -->[\s\S]*?<link rel="canonical"[^>]*>/, '');
  next = next.replace(/<link rel="canonical"[^>]*>/g, '');
  next = next.replace(/<link rel="alternate"[^>]*>/g, '');
  next = next.replace(/<meta property="og:[^"]+" content="[^"]*"\s*\/?>/g, '');
  next = next.replace(/<meta name="twitter:[^"]+" content="[^"]*"\s*\/?>/g, '');
  next = next.replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, '');

  const headInject = `
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="pt" href="${ptUrl}" />
    <link rel="alternate" hreflang="en" href="${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="${ptUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${pagesConfig.defaultImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="${locale}" />
    <meta property="og:locale:alternate" content="${altLocale}" />
    <meta property="og:site_name" content="Kindness & Care" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${pagesConfig.defaultImage}" />
    <script type="application/ld+json" data-prerender-seo="true">${jsonForHtml(schema)}</script>
  `;

  next = next.replace('</head>', `${headInject}\n  </head>`);

  const noscript = `<noscript><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div></noscript>`;
  next = next.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript);

  return next;
}

function writeRouteHtml(routePath, html) {
  if (routePath === '/') {
    fs.writeFileSync(path.join(buildDir, 'index.html'), html);
    return;
  }
  const dir = path.join(buildDir, routePath.replace(/^\//, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

function routeFile(routePath) {
  if (routePath === '/') return path.join(buildDir, 'index.html');
  return path.join(buildDir, routePath.replace(/^\//, ''), 'index.html');
}

function assertPagesInApp() {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const routePaths = new Set([...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((match) => match[1]));
  const missing = [];
  for (const page of pagesConfig.pages) {
    for (const lang of ['pt', 'en']) {
      if (!routePaths.has(page[lang])) missing.push(page[lang]);
    }
  }
  if (missing.length) {
    console.error(`pages.json routes missing from App.js: ${missing.join(', ')}`);
    process.exit(1);
  }
}

function assertShell(routePath, html) {
  const canonical = abs(routePath);
  const problems = [];
  if (!html.includes(`<html lang="${routePath === '/en' || routePath.startsWith('/en/') ? 'en' : 'pt'}">`)) {
    problems.push('lang');
  }
  if (!html.includes(`rel="canonical" href="${canonical}"`)) problems.push('canonical');
  if (!html.includes('hreflang="pt"') || !html.includes('hreflang="en"') || !html.includes('hreflang="x-default"')) {
    problems.push('hreflang');
  }
  if (!html.includes('<title>') || html.includes('<title></title>')) problems.push('title');
  if (!html.includes('"@type":"WebPage"') && !html.includes('"@type":"AboutPage"') && !html.includes('"@type":"ContactPage"')) {
    problems.push('page schema');
  }
  if (routePath !== '/' && routePath !== '/en' && !html.includes('BreadcrumbList')) problems.push('breadcrumb');
  if (problems.length) {
    console.error(`prerender shell incomplete for ${routePath}: ${problems.join(', ')}`);
    process.exit(1);
  }
}

function buildSitemap() {
  const urls = [];
  for (const page of pagesConfig.pages) {
    for (const lang of ['pt', 'en']) {
      const loc = abs(page[lang]);
      urls.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="pt" href="${abs(page.pt)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${abs(page.en)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(page.pt)}" />
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), xml);
  fs.writeFileSync(path.join(root, 'public/sitemap.xml'), xml);
  console.log(`sitemap.xml updated (${urls.length} URLs)`);
}

function main() {
  if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
    console.error('build/index.html missing. Run react-scripts build first.');
    process.exit(1);
  }

  assertPagesInApp();

  const template = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');

  for (const page of pagesConfig.pages) {
    for (const lang of ['pt', 'en']) {
      const locale = lang === 'en' ? en : pt;
      const section = sectionFor(locale, page);
      const { title, description } = getSeo(section);
      if (!section.seoTitle || !section.seoDescription) {
        console.warn(`Missing seo copy for ${page.key} (${lang})`);
      }
      const routePath = page[lang];
      const canonical = abs(routePath);
      const html = injectHead(template, {
        lang,
        title,
        description,
        canonical,
        ptUrl: abs(page.pt),
        enUrl: abs(page.en),
        schema: buildGraph({ page, lang, section, title, description, canonical }),
      });
      assertShell(routePath, html);
      writeRouteHtml(routePath, html);
      console.log(`prerendered ${routePath}`);
    }
  }

  buildSitemap();
  console.log('SEO prerender complete.');
}

main();
