import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import routes from '../i18n/routes';
import { languageFromPathname } from '../i18n/language';

function Footer() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const r = routes[languageFromPathname(pathname)];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section footer-brand">
            <p className="footer-logo">Kindness & Care</p>
            <p className="footer-description">{t('footer.description')}</p>
          </div>

          <div className="footer-section">
            <h2 className="footer-heading">{t('footer.quickLinks')}</h2>
            <ul className="footer-links">
              <li><Link to={r.home}>{t('footer.home')}</Link></li>
              <li><Link to={r.history}>{t('footer.history')}</Link></li>
              <li><Link to={r.valueProposal}>{t('footer.valueProposal')}</Link></li>
              <li><Link to={r.mission}>{t('footer.mission')}</Link></li>
              <li><Link to={r.testimonials}>{t('nav.testimonials')}</Link></li>
              <li><Link to={r.contacts}>{t('footer.contacts')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h2 className="footer-heading">{t('footer.pillars')}</h2>
            <ul className="footer-links">
              <li><Link to={r.care}>{t('pillars.items.care.title')}</Link></li>
              <li><Link to={r.longevity}>{t('pillars.items.longevity.title')}</Link></li>
              <li><Link to={r.academy}>{t('pillars.items.academy.title')}</Link></li>
              <li><Link to={r.experiences}>{t('pillars.items.experiences.title')}</Link></li>
              <li><Link to={r.pousadas}>{t('nav.pousadasPortugal')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h2 className="footer-heading">{t('footer.contactTitle')}</h2>
            <ul className="footer-contact">
              <li><FaPhone className="footer-contact-icon" aria-hidden="true" /><a href="tel:+351968844420">{t('footer.phone1')}</a></li>
              <li><FaPhone className="footer-contact-icon" aria-hidden="true" /><a href="tel:+351933929761">{t('footer.phone2')}</a></li>
              <li><FaEnvelope className="footer-contact-icon" aria-hidden="true" /><a href="mailto:geral@kindnesscare.pt">{t('footer.email')}</a></li>
              <li><FaMapMarkerAlt className="footer-contact-icon" aria-hidden="true" /><span>{t('footer.location')}</span></li>
              <li><FaClock className="footer-contact-icon" aria-hidden="true" /><span>{t('footer.hours')}</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Kindness & Care — {t('footer.rights')}</p>
          <div className="footer-bottom-links">
            <Link to={r.privacy}>{t('footer.privacy')}</Link>
            <Link to={r.terms}>{t('footer.terms')}</Link>
            <button type="button" className="footer-cookie-button" onClick={() => window.dispatchEvent(new Event('kc-open-cookies'))}>
              {t('footer.cookies')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;