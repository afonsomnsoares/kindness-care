import { buildSitemap } from '../lib/sitemap';

/** /sitemap.xml, gerado no build a partir de src/i18n/routes.js. */
export function GET() {
  return new Response(buildSitemap(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
