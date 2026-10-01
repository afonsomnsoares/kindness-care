import { useTranslation } from 'react-i18next';
import routes from '../i18n/routes';
import { BASE_URL, absoluteUrl } from '../lib/site';

/**
 * Meta tags por página. `page` é a chave da rota em src/i18n/routes.js;
 * o título e a descrição vêm de `meta.<page>` nos ficheiros de tradução,
 * no idioma atual. O React 19 coloca estas tags no <head>, tanto no
 * pré-render do build como no browser.
 */
export function MetaTags({
  page,
  image = `${BASE_URL}/og-image.jpg`,
  type = 'website',
  schema = null
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'pt';
  const fullUrl = absoluteUrl(routes[lang][page] || '/');
  const fullTitle = page
    ? `${t(`meta.${page}.title`)} | Kindness & Care`
    : t('meta.default.title');
  const description = page ? t(`meta.${page}.description`) : undefined;
  const locale = lang === 'en' ? 'en_GB' : 'pt_PT';
  const alternateLocale = lang === 'en' ? 'pt_PT' : 'en_GB';

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={fullUrl} />

      {/* Versões noutros idiomas */}
      {page && (
        <>
          <link rel="alternate" hrefLang="pt" href={absoluteUrl(routes.pt[page])} />
          <link rel="alternate" hrefLang="en" href={absoluteUrl(routes.en[page])} />
          <link rel="alternate" hrefLang="x-default" href={absoluteUrl(routes.pt[page])} />
        </>
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content={alternateLocale} />
      <meta property="og:site_name" content="Kindness & Care" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
}
