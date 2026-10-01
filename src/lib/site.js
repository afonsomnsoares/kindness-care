/** Endereço público do site: meta tags, dados estruturados e sitemap. */
export const BASE_URL = 'https://www.kindnesscare.pt';

export function absoluteUrl(path) {
  return path === '/' ? BASE_URL : `${BASE_URL}${path}`;
}
