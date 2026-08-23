import React from 'react';
import { useTranslation } from 'react-i18next';
import './Legal.css';

function Privacy() {
  const { t } = useTranslation();
  const sections = t('privacy.sections', { returnObjects: true });

  return (
    <div className="legal-page">
      <section className="legal-hero-section">
        <div className="legal-hero-background">
          <div className="legal-hero-overlay"></div>
        </div>
        <div className="legal-hero-content">
          <h1 className="legal-hero-title">{t('privacy.hero.title')}</h1>
          <p className="legal-hero-subtitle">{t('privacy.hero.subtitle')}</p>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="legal-container">
          <p className="legal-updated">{t('privacy.updated')}</p>

          {sections.map((section, idx) => (
            <React.Fragment key={idx}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item, lIdx) => (
                    <li key={lIdx}>{item}</li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Privacy;