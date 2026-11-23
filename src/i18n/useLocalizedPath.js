import { useLocation } from 'react-router-dom';
import routes from './routes';
import { languageFromPathname } from './language';

export function useLocalizedPath(key) {
  const { pathname } = useLocation();
  const lang = languageFromPathname(pathname);
  return routes[lang][key] || '/';
}

export function localizePath(pathname, targetLang) {
  const target = targetLang?.startsWith('en') ? 'en' : 'pt';
  const clean = pathname.replace(/\/+$/, '') || '/';
  const key = Object.keys(routes.pt).find(
    (k) => routes.pt[k] === clean || routes.en[k] === clean
  );
  return key ? routes[target][key] : routes[target].home;
}

export default routes;