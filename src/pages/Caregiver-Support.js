import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './Caregiver-Support.css';
import caregiverImage from '../images/image-8.jpg';

function CaregiverSupport() {
  const { t } = useTranslation();
  const caregiverSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Apoio ao Cuidador e Família",
    "description": "Suporte especializado para cuidadores familiares com orientação, treinamento e apoio emocional.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Kindness & Care"
    },
    "areaServed": [
      {"@type": "City", "name": "Braga"},
      {"@type": "City", "name": "Guimarães"},
      {"@type": "City", "name": "Viana do Castelo"}
    ],
    "serviceType": "Healthcare"
  };

  return (
    <div className="caregiver-support-page">
      <MetaTags
        title="Apoio ao Cuidador e Família | Orientação Especializada"
        description="Apoio especializado para cuidadores familiares com treinamento, orientação e suporte emocional em Braga, Guimarães e Viana do Castelo."
        url={useLocalizedPath('caregiver')}
        schema={caregiverSchema}
      />
      {/* Hero Section */}
      <section className="caregiver-hero-section">
        <div className="caregiver-hero-background">
          <div className="caregiver-hero-overlay"></div>
        </div>

        <div className="caregiver-hero-content">
          <div className="caregiver-hero-text">
            <h1 className="caregiver-hero-title">{t('caregiverSupport.hero.title')}</h1>
            <p className="caregiver-hero-subtitle">
              {t('caregiverSupport.hero.subtitle')}
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
                  <h2 className="caregiver-title">{t('caregiverSupport.content.title')}</h2>
                  <p className="caregiver-description">
                    {t('caregiverSupport.content.description')}
                  </p>
                </div>

                {/* Imagem */}
                <div className="caregiver-image">
                  <img loading="lazy" src={caregiverImage}
                    alt={t('caregiverSupport.content.alt')}
                    className="support-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CaregiverSupport;