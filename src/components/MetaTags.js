import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { languageFromPathname } from '../i18n/language';
import pagesConfig from '../seo/pages.json';
import {
  BASE_URL,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  getBreadcrumbSchema,
} from '../seo/organization';

const WEBPAGE_TYPES = new Set([
  'WebPage',
  'AboutPage',
  'ContactPage',
  'MedicalWebPage',
  'CollectionPage',
]);

function normalizePath(path = '/') {
  if (!path || path === '/') return '/';
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return withSlash.replace(/\/+$/, '') || '/';
}

function absoluteUrl(path) {
  const normalized = normalizePath(path);
  return normalized === '/' ? BASE_URL : `${BASE_URL}${normalized}`;
}

function findPageByPath(pathname) {
  const path = normalizePath(pathname);
  return pagesConfig.pages.find(
    (page) => normalizePath(page.pt) === path || normalizePath(page.en) === path
  );
}

function schemaTypes(schema) {
  if (!schema || typeof schema !== 'object') return [];
  const type = schema['@type'];
  if (Array.isArray(type)) return type;
  return type ? [type] : [];
}

export function MetaTags({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  schema = null,
  noindex = false,
}) {
  const { pathname } = useLocation();
  const path = normalizePath(pathname);
  const page = findPageByPath(path);
  const isEn = languageFromPathname(path) === 'en';
  const locale = isEn ? 'en_GB' : 'pt_PT';
  const alternateLocale = isEn ? 'pt_PT' : 'en_GB';
  const indexable = Boolean(page) && !noindex;
  const canonicalUrl = indexable ? absoluteUrl(isEn ? page.en : page.pt) : null;
  const fullTitle = title
    ? (/kindness\s*(&|and)\s*care/i.test(title) ? title : `${title} | ${SITE_NAME}`)
    : isEn
      ? 'Kindness & Care — Home Care | Braga, Porto, Viana do Castelo'
      : 'Kindness & Care — Serviço de Apoio Domiciliário | Braga, Porto, Viana do Castelo';
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
  const langCode = isEn ? 'en-GB' : 'pt-PT';

  const breadcrumbSchema = indexable && page.key !== 'home' && title
    ? getBreadcrumbSchema([
        { name: SITE_NAME, url: isEn ? absoluteUrl('/en') : BASE_URL },
        { name: title, url: canonicalUrl },
      ])
    : null;

  const webPageSchema = indexable && !schemaTypes(schema).some((item) => WEBPAGE_TYPES.has(item))
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title || fullTitle,
        ...(description ? { description } : {}),
        inLanguage: langCode,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        about: { '@id': `${BASE_URL}/#organization` },
      }
    : null;

  const schemas = [schema, webPageSchema, breadcrumbSchema].filter(Boolean);

  return (
    <Helmet>
      <html lang={isEn ? 'en' : 'pt'} />
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      {indexable && (
        <>
          <link rel="alternate" hrefLang="pt" href={absoluteUrl(page.pt)} />
          <link rel="alternate" hrefLang="en" href={absoluteUrl(page.en)} />
          <link rel="alternate" hrefLang="x-default" href={absoluteUrl(page.pt)} />
        </>
      )}

      <meta property="og:type" content={type} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content={alternateLocale} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      {canonicalUrl ? <meta name="twitter:url" content={canonicalUrl} /> : null}
      <meta name="twitter:title" content={fullTitle} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {schemas.map((item, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
