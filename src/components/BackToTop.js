import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { languageFromPathname } from '../i18n/language';
import { FaArrowUp } from 'react-icons/fa';
import './BackToTop.css';

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const isEnglish = languageFromPathname(location.pathname) === 'en';

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      tabIndex={visible ? 0 : -1}
      aria-label={isEnglish ? 'Back to top' : 'Voltar ao topo'}
    >
      <FaArrowUp aria-hidden="true" />
    </button>
  );
}

export default BackToTop;
