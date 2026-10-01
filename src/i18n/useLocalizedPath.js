import { useTranslation } from 'react-i18next';
import routes, { routeKeyForPath } from './routes';

/** Todos os caminhos no idioma atual (ex.: useLocalizedRoutes().contacts). */
export function useLocalizedRoutes() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'pt';
  return routes[lang];
}

export function useLocalizedPath(key) {
  return useLocalizedRoutes()[key] || '/';
}

export function localizePath(pathname, targetLang) {
  const target = targetLang?.startsWith('en') ? 'en' : 'pt';
  const key = routeKeyForPath(pathname);
  return key ? routes[target][key] : routes[target].home;
}

export default routes;