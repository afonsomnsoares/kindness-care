import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './Health-Tourism-Service.css';
import caregiverImage from '../images/image-10.webp';

function HealthTourismService() {
  const { t } = useTranslation();
  const pousadasPath = useLocalizedPath('pousadas');
  const features = t('healthTourismService.content.features', { returnObjects: true });

  const healthTourismSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t('meta.healthTourism.title'),
    "description": t('meta.healthTourism.description'),
    "provider": {
      "@type": "LocalBusiness",
      "name": "Kindness & Care"
    },
    "areaServed": [
      {"@type": "City", "name": "Viana do Castelo"},
      {"@type": "City", "name": "Guimarães"},
      {"@type": "City", "name": "Amares"}
    ],
    "serviceType": "Healthcare"
  };

  return (
    <div className="caregiver-support-page">
      <MetaTags
        page="healthTourism"
        schema={healthTourismSchema}
      />
      {/* Hero Section */}
      <section className="caregiver-hero-section">
        <div className="caregiver-hero-background">
          <div className="caregiver-hero-overlay"></div>
        </div>

        <div className="caregiver-hero-content">
          <div className="caregiver-hero-text">
            <h1 className="caregiver-hero-title">{t('healthTourismService.hero.title')}</h1>
            <p className="caregiver-hero-subtitle">
              {t('healthTourismService.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="caregiver-content-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="caregiver-content">
              <div className="caregiver-grid">
                {/* Texto */}
                <div className="caregiver-text">
                  <h2 className="caregiver-title">{t('healthTourismService.content.title')}</h2>
                  <p className="caregiver-description">
                    {t('healthTourismService.content.description')}
                  </p>

                  <p className="caregiver-description">
                    {t('healthTourismService.content.intro')}
                  </p>

                  <ul className="caregiver-features">
                    {features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>

                {/* Imagem */}
                <div className="caregiver-image">
                  <img loading="lazy" src={caregiverImage}
                    alt={t('healthTourismService.content.alt')}
                    className="support-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Botão CTA */}
      <div className="tourism-cta-section">
        <div className="tourism-cta-content">
          <h3 className="tourism-cta-title">{t('healthTourismService.cta.title')}</h3>
          <p className="tourism-cta-text">
            {t('healthTourismService.cta.text')}
          </p>
          <Link to={pousadasPath} className="tourism-cta-button">
            {t('healthTourismService.cta.button')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HealthTourismService;