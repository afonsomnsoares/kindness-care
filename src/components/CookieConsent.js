import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './CookieConsent.css';
import {
  CONSENT_ACCEPTED,
  CONSENT_REJECTED,
  saveConsent,
} from '../lib/consent';

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    saveConsent(CONSENT_ACCEPTED);
    setVisible(false);
  };

  const reject = () => {
    saveConsent(CONSENT_REJECTED);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-banner-content">
        <p>
          {isEnglish
            ? 'We use cookies to improve your experience. By continuing, you agree to our use of cookies.'
            : 'Utilizamos cookies para melhorar a sua experiência. Ao continuar, concorda com o uso de cookies.'}
        </p>
        <div className="cookie-banner-actions">
          <button className="cookie-btn cookie-btn-accept" onClick={accept}>
            {isEnglish ? 'Accept' : 'Aceitar'}
          </button>
          <button className="cookie-btn cookie-btn-reject" onClick={reject}>
            {isEnglish ? 'Decline' : 'Recusar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;