import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { languageFromPathname } from '../i18n/language';
import './CookieConsent.css';
import {
  CONSENT_ACCEPTED,
  CONSENT_REJECTED,
  saveConsent,
} from '../lib/consent';

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [focusNonce, setFocusNonce] = useState(0);
  const acceptRef = useRef(null);
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const location = useLocation();
  const isEnglish = languageFromPathname(location.pathname) === 'en';

  useEffect(() => {
    const open = () => {
      const active = document.activeElement;
      const dialog = dialogRef.current;
      if (active instanceof HTMLElement && !dialog?.contains(active)) {
        returnFocusRef.current = active;
      }
      setVisible(true);
      setFocusNonce((nonce) => nonce + 1);
    };
    let consent = null;
    try {
      consent = localStorage.getItem('cookieConsent');
    } catch {
      consent = null;
    }
    window.addEventListener('kc-open-cookies', open);
    let timer;
    if (!consent) timer = setTimeout(open, 1000);
    return () => {
      window.removeEventListener('kc-open-cookies', open);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    acceptRef.current?.focus({ preventScroll: true });
    const dialog = dialogRef.current;
    const onKey = (event) => {
      if (event.key !== 'Tab' || !dialog) return;
      const items = [...dialog.querySelectorAll('a[href], button:not([disabled])')];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!dialog.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, focusNonce]);

  useEffect(() => {
    document.documentElement.classList.toggle('cookie-open', visible);
    return () => document.documentElement.classList.remove('cookie-open');
  }, [visible]);

  const closeBanner = (value) => {
    saveConsent(value);
    setVisible(false);
    const back = returnFocusRef.current;
    returnFocusRef.current = null;
    if (back instanceof HTMLElement && document.contains(back)) {
      back.focus();
    }
  };

  const accept = () => closeBanner(CONSENT_ACCEPTED);
  const reject = () => closeBanner(CONSENT_REJECTED);

  if (!visible) return null;

  return (
    <div
      ref={dialogRef}
      className="cookie-banner"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-text"
    >
      <div className="cookie-banner-content">
        <p id="cookie-consent-text">
          {isEnglish
            ? 'We use essential cookies and, only if you accept, analytics cookies (Google Analytics) to improve the site. Read the '
            : 'Utilizamos cookies essenciais e, apenas se aceitar, cookies de analytics (Google Analytics) para melhorar o site. Consulte a '}
          <Link to={isEnglish ? '/en/privacy' : '/privacidade'}>
            {isEnglish ? 'privacy policy' : 'política de privacidade'}
          </Link>
          .
        </p>
        <div className="cookie-banner-actions">
          <button ref={acceptRef} type="button" className="cookie-btn cookie-btn-accept" onClick={accept}>
            {isEnglish ? 'Accept' : 'Aceitar'}
          </button>
          <button type="button" className="cookie-btn cookie-btn-reject" onClick={reject}>
            {isEnglish ? 'Decline' : 'Recusar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
