import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CONSENT_ACCEPTED, CONSENT_EVENT, getConsent } from '../lib/consent';

const GA_MEASUREMENT_ID =
  process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XVYPEPGDFX';

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
