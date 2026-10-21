import routes from '../i18n/routes.js';
import { absoluteUrl } from './site.js';

/**
 * sitemap.xml com todas as páginas de src/i18n/routes.js, nos dois idiomas,
 * cada uma com as ligações para a versão no outro idioma. É gerado no build
 * (ver src/pages/sitemap.xml.js), por isso nunca fica desatualizado.
 */
export function buildSitemap() {
  const entries = Object.keys(routes.pt).flatMap((key) => {
    const alternates = [
      ...Object.keys(routes).map(
        (lang) =>
          `    <xhtml:link rel="alternate" hreflang="${lang}" href="${absoluteUrl(routes[lang][key])}" />`
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(routes.pt[key])}" />`,
    ].join('\n');

    return Object.keys(routes).map(
      (lang) =>
        `  <url>\n    <loc>${absoluteUrl(routes[lang][key])}</loc>\n${alternates}\n  </url>`
    );
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
}
