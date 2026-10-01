import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './CookieConsent.css';
import {
  CONSENT_ACCEPTED,
  CONSENT_OPEN_EVENT,
  CONSENT_REJECTED,
  getConsent,
  saveConsent,
} from '../lib/consent';

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const open = () => setVisible(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);

    let timer;
    if (!getConsent()) {
      timer = setTimeout(open, 1000);
    }

    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, open);
      clearTimeout(timer);
    };
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
    <div className="cookie-banner" role="dialog" aria-label={t('cookies.label')}>
      <div className="cookie-banner-content">
        <p>{t('cookies.message')}</p>
        <div className="cookie-banner-actions">
          <button className="cookie-btn cookie-btn-accept" onClick={accept}>
            {t('cookies.accept')}
          </button>
          <button className="cookie-btn cookie-btn-reject" onClick={reject}>
            {t('cookies.decline')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
