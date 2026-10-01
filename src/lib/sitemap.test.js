import routes from '../i18n/routes';
import { buildSitemap } from './sitemap';

test('o sitemap inclui todas as páginas, em PT e em EN', () => {
  const sitemap = buildSitemap();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const pageCount = Object.keys(routes.pt).length;
  expect(locs).toHaveLength(pageCount * 2);
  expect(locs).toContain('https://www.kindnesscare.pt');
  expect(locs).toContain('https://www.kindnesscare.pt/contactos');
  expect(locs).toContain('https://www.kindnesscare.pt/en/contacts');
  expect(sitemap).toContain(
    '<xhtml:link rel="alternate" hreflang="en" href="https://www.kindnesscare.pt/en/history" />'
  );
});
