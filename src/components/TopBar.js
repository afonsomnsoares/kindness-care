import React from 'react';
import { useTranslation } from 'react-i18next';
import './TopBar.css';
import { FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaInstagram } from 'react-icons/fa';

function TopBar() {
  const { t } = useTranslation();

  return (
    <div className="topbar">
      <div className="topbar-container">
        <div className="topbar-item">
          <FaMapMarkerAlt className="topbar-icon" aria-hidden="true" />
          <span>{t('topbar.locations')} <strong>{t('topbar.cities')}</strong></span>
        </div>

        <div className="topbar-item">
          <FaCalendarAlt className="topbar-icon" aria-hidden="true" />
          <span>{t('topbar.availability')} <strong> {t('topbar.allDays')}</strong></span>
        </div>

        <div className="topbar-contacts">
          <div className="topbar-item">
            <FaPhone className="topbar-icon" aria-hidden="true" />
            <a href="tel:+351968844420"><strong>+351 968 844 420</strong></a>
          </div>
          
          <div className="topbar-separator"></div>
          
          <div className="topbar-item">
            <FaPhone className="topbar-icon" aria-hidden="true" />
            <a href="tel:+351933929761"><strong>+351 933 929 761</strong></a>
          </div>

          <div className="topbar-separator"></div>

          <a
            className="topbar-social"
            href="https://www.instagram.com/kindnesscare.pt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default TopBar;