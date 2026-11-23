export function languageFromPathname(pathname) {
  const path = pathname == null
    ? (typeof window === 'undefined' ? '/' : (window.location.pathname || '/'))
    : (pathname || '/');
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'pt';
}
