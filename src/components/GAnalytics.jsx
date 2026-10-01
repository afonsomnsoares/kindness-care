import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { CONSENT_ACCEPTED, CONSENT_EVENT, getConsent } from '../lib/consent';

const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XVYPEPGDFX';

function loadGa() {
  if (document.getElementById('ga-script-src')) return;

  const script1 = document.createElement('script');
  script1.id = 'ga-script-src';
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script1.async = true;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.id = 'ga-config';
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_path: window.location.pathname,
    });
  `;
  document.head.appendChild(script2);
}

// Apaga os cookies do Google Analytics (_ga, _ga_XXXX) quando o visitante
// recusa ou retira o consentimento. O GA cria-os no domínio principal
// (.kindnesscare.pt), por isso tentamos cada nível do domínio atual.
function clearGaCookies() {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  if (names.length === 0) return;

  const parts = window.location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i++) {
    const domain = parts.slice(i).join('.');
    domains.push(`; domain=${domain}`, `; domain=.${domain}`);
  }

  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

function GAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const disableKey = `ga-disable-${GA_MEASUREMENT_ID}`;

    const applyConsent = () => {
      if (getConsent() === CONSENT_ACCEPTED) {
        window[disableKey] = false;
        loadGa();
      } else {
        window[disableKey] = true;
        clearGaCookies();
      }
    };

    applyConsent();
    window.addEventListener(CONSENT_EVENT, applyConsent);

    return () => window.removeEventListener(CONSENT_EVENT, applyConsent);
  }, []);

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname,
      });
    }
  }, [location.pathname]);

  return null;
}

export default GAnalytics;
