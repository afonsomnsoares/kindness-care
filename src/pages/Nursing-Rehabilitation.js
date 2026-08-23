import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './Nursing-Rehabilitation.css';
import nursingImage from '../images/image-6.jpg';

function NursingRehabilitation() {
  const { t } = useTranslation();
  const nursingSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Enfermagem e Reabilitação",
    "description": "Serviço especializado de enfermagem e reabilitação com foco na recuperação funcional e mobilidade.",
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
    <div className="nursing-rehabilitation-page">
      <MetaTags
        title="Enfermagem e Reabilitação | Recuperação Funcional"
        description="Serviço de enfermagem especializada e reabilitação em casa. Cuidados de reabilitação motora e respiratória em Braga, Guimarães e Viana do Castelo."
        url={useLocalizedPath('nursing')}
        schema={nursingSchema}
      />
      {/* Hero Section */}
      <section className="nursing-hero-section">
        <div className="nursing-hero-background">
          <div className="nursing-hero-overlay"></div>
        </div>

        <div className="nursing-hero-content">
          <div className="nursing-hero-text">
            <h1 className="nursing-hero-title">{t('nursingRehabilitation.hero.title')}</h1>
            <p className="nursing-hero-subtitle">
              {t('nursingRehabilitation.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="nursing-content-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="nursing-content">
              <div className="nursing-grid">
                {/* Texto */}
                <div className="nursing-text">
                  <h2 className="nursing-title">{t('nursingRehabilitation.content.title')}</h2>
                  <p className="nursing-description">
                    {t('nursingRehabilitation.content.description')}
                  </p>
                </div>

                {/* Imagem */}
                <div className="nursing-image">
                  <img loading="lazy" src={nursingImage}
                    alt={t('nursingRehabilitation.content.alt')}
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

export default NursingRehabilitation;