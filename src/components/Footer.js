import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import routes from '../i18n/routes';

function Footer() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'pt';
  const r = routes[currentLang];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section footer-brand">
            <h3 className="footer-logo">Kindness & Care</h3>
            <p className="footer-description">{t('footer.description')}</p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link to={r.home}>{t('footer.home')}</Link></li>
              <li><Link to={r.history}>{t('footer.history')}</Link></li>
              <li><Link to={r.valueProposal}>{t('footer.valueProposal')}</Link></li>
              <li><Link to={r.mission}>{t('footer.mission')}</Link></li>
              <li><Link to={r.contacts}>{t('footer.contacts')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.services')}</h4>
            <ul className="footer-links">
              <li><Link to={r.homeCare}>{t('footer.homeCare')}</Link></li>
              <li><Link to={r.nursing}>{t('footer.nursing')}</Link></li>
              <li><Link to={r.medical}>{t('footer.medical')}</Link></li>
              <li><Link to={r.caregiver}>{t('footer.caregiver')}</Link></li>
              <li><Link to={r.postpartum}>{t('footer.postpartum')}</Link></li>
              <li><Link to={r.healthTourism}>{t('footer.healthTourism')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.contactTitle')}</h4>
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
          </div>
          <div className="footer-social">
            <a href="https://facebook.com/kindnesscare" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://instagram.com/kindnesscare" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://linkedin.com/company/kindnesscare" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;