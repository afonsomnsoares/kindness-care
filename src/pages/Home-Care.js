import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './Home-Care.css';
import homeCareImage from '../images/image-5.jpg';

function HomeCare() {
  const { t } = useTranslation();
  const homeCareSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Apoio Domiciliário",
    "description": "Serviço de apoio domiciliário profissional com cuidados pessoais, assistência com refeições, companhia e supervisão.",
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
    <div className="home-care-page">
      <MetaTags
        title="Apoio Domiciliário Profissional | Cuidados em Casa"
        description="Serviço de apoio domiciliário especializado em Braga, Guimarães e Viana do Castelo. Cuidados pessoais, assistência com refeições e companhia profissional 24h."
        url={useLocalizedPath('homeCare')}
        schema={homeCareSchema}
      />
      {/* Hero Section */}
      <section className="home-care-hero-section">
        <div className="home-care-hero-background">
          <div className="home-care-hero-overlay"></div>
        </div>

        <div className="home-care-hero-content">
          <div className="home-care-hero-text">
            <h1 className="home-care-hero-title">{t('homeCare.hero.title')}</h1>
            <p className="home-care-hero-subtitle">
              {t('homeCare.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="home-care-content-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="home-care-content">
              <div className="home-care-grid">
                {/* Texto */}
                <div className="home-care-text">
                  <h2 className="home-care-title">{t('homeCare.content.title')}</h2>
                  <p className="home-care-description">
                    {t('homeCare.content.description')}
                  </p>
                </div>

                {/* Imagem */}
                <div className="home-care-image">
                  <img loading="lazy" src={homeCareImage}
                    alt={t('homeCare.content.alt')}
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

export default HomeCare;