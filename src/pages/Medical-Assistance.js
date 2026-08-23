import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './Medical-Assistance.css';
import medicalImage from '../images/image-7.jpg';

function MedicalAssistance() {
  const { t } = useTranslation();
  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Assistência Médica Domiciliária",
    "description": "Consultas médicas profissionais no conforto da sua casa, com diagnóstico e acompanhamento especializado.",
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
    <div className="medical-assistance-page">
      <MetaTags
        title="Assistência Médica Domiciliária | Consultas em Casa"
        description="Consultas médicas especializadas no conforto da sua casa. Assistência médica profissional em Braga, Guimarães e Viana do Castelo."
        url={useLocalizedPath('medical')}
        schema={medicalSchema}
      />
      {/* Hero Section */}
      <section className="medical-hero-section">
        <div className="medical-hero-background">
          <div className="medical-hero-overlay"></div>
        </div>

        <div className="medical-hero-content">
          <div className="medical-hero-text">
            <h1 className="medical-hero-title">{t('medicalAssistance.hero.title')}</h1>
            <p className="medical-hero-subtitle">
              {t('medicalAssistance.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="medical-content-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="medical-content">
              <div className="medical-grid">
                {/* Texto */}
                <div className="medical-text">
                  <h2 className="medical-title">{t('medicalAssistance.content.title')}</h2>
                  <p className="medical-description">
                    {t('medicalAssistance.content.description')}
                  </p>
                </div>

                {/* Imagem */}
                <div className="medical-image">
                  <img loading="lazy" src={medicalImage}
                    alt={t('medicalAssistance.content.alt')}
                    className="care-image"
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

export default MedicalAssistance;