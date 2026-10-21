import {
  CONSENT_ACCEPTED,
  CONSENT_OPEN_EVENT,
  CONSENT_REJECTED,
  getConsent,
  saveConsent,
} from '../lib/consent.js';

/**
 * Aviso de cookies (src/components/CookieConsent.astro): aparece `delay` ms
 * depois de a página abrir se o visitante ainda não escolheu, e volta a
 * aparecer com "Definições de cookies", no rodapé.
 */
export function initCookieConsent(root = document, delay = 1000) {
  const banner = root.querySelector('[data-cookie-banner]');
  const show = () => { banner.hidden = false; };
  const choose = (value) => {
    saveConsent(value);
    banner.hidden = true;
  };

  banner.querySelector('[data-cookie-accept]').addEventListener('click', () => choose(CONSENT_ACCEPTED));
  banner.querySelector('[data-cookie-reject]').addEventListener('click', () => choose(CONSENT_REJECTED));

  // "Definições de cookies", no rodapé.
  window.addEventListener(CONSENT_OPEN_EVENT, show);

  if (!getConsent()) {
    setTimeout(show, delay);
  }
}
