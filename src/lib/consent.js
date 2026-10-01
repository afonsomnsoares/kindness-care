export const CONSENT_KEY = 'cookieConsent';
export const CONSENT_ACCEPTED = 'accepted';
export const CONSENT_REJECTED = 'rejected';
export const CONSENT_EVENT = 'kindnesscare:consent';
export const CONSENT_OPEN_EVENT = 'kindnesscare:consent-open';

export function getConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function saveConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {}
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Volta a mostrar o aviso de cookies (ligação "Definições de cookies" no rodapé). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
