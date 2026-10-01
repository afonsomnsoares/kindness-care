import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './Health-Tourism-Service.css';
import caregiverImage from '../images/image-10.webp';

function HealthTourismService() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pousadasPath = useLocalizedPath('pousadas');
  const features = t('healthTourismService.content.features', { returnObjects: true });
  
  const healthTourismSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Turismo de Saúde e Bem-Estar",
    "description": "Serviço de cuidados personalizados de saúde durante estadia em Pousadas de Portugal, em parceria com marca icónica de hospitalidade portuguesa.",
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

  const handleFormClick = () => {
    navigate(pousadasPath);
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
      <div className="value-cta-section">
        <div className="value-cta-content">
          <h3 className="value-cta-title">{t('healthTourismService.cta.title')}</h3>
          <p className="value-cta-text">
            {t('healthTourismService.cta.text')}
          </p>
          <button
            className="value-cta-button"
            onClick={handleFormClick}
          >
            {t('healthTourismService.cta.button')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HealthTourismService;