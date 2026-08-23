import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './Postpartum-Support.css';
import postpartumImage from '../images/image-9.jpg';

function PostpartumSupport() {
  const { t } = useTranslation();
  const postpartumSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Apoio Pós-Parto",
    "description": "Cuidados especializados para mãe e bebé durante o período pós-parto, promovendo recuperação e bem-estar familiar.",
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
    <div className="postpartum-support-page">
      <MetaTags
        title="Apoio Pós-Parto Especializado | Cuidados Mãe e Bebé"
        description="Cuidados especializados para mãe e recém-nascido após parto. Apoio profissional e orientação durante o período pós-parto em casa."
        url={useLocalizedPath('postpartum')}
        schema={postpartumSchema}
      />
      {/* Hero Section */}
      <section className="postpartum-hero-section">
        <div className="postpartum-hero-background">
          <div className="postpartum-hero-overlay"></div>
        </div>

        <div className="postpartum-hero-content">
          <div className="postpartum-hero-text">
            <h1 className="postpartum-hero-title">{t('postpartumSupport.hero.title')}</h1>
            <p className="postpartum-hero-subtitle">
              {t('postpartumSupport.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="postpartum-content-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="postpartum-content">
              <div className="postpartum-grid">
                {/* Texto */}
                <div className="postpartum-text">
                  <h2 className="postpartum-title">{t('postpartumSupport.content.title')}</h2>
                  <p className="postpartum-description">
                    {t('postpartumSupport.content.description')}
                  </p>
                </div>

                {/* Imagem */}
                <div className="postpartum-image">
                  <img loading="lazy" src={postpartumImage}
                    alt={t('postpartumSupport.content.alt')}
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

export default PostpartumSupport;