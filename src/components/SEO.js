/**
 * Document language follows the URL (/en and /en/* are English; everything
 * else stays Portuguese). Per-page title, description, canonical and hreflang
 * live in MetaTags. Static prerender JSON-LD is removed once React mounts so
 * Helmet does not leave a second copy in the DOM.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { languageFromPathname } from '../i18n/language';

function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.lang = languageFromPathname(pathname);
    document.querySelectorAll('script[data-prerender-seo]').forEach((node) => node.remove());
  }, [pathname]);

  return null;
}

export default SEO;
