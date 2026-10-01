import React from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { routeKeyForPath } from '../i18n/routes';
import { MetaTags } from './MetaTags';
import './ServicePage.css';
import homeCareImage from '../images/image-5.webp';
import nursingImage from '../images/image-6.webp';
import medicalImage from '../images/image-7.webp';
import caregiverImage from '../images/image-8.webp';
import postpartumImage from '../images/image-9.webp';

// Configuração de cada página de serviço. A chave é a mesma usada em
// src/i18n/routes.js; `i18nKey` é a secção correspondente em common.json.
const SERVICES = {
  homeCare: { i18nKey: 'homeCare', image: homeCareImage },
  nursing: { i18nKey: 'nursingRehabilitation', image: nursingImage },
  medical: { i18nKey: 'medicalAssistance', image: medicalImage },
  caregiver: { i18nKey: 'caregiverSupport', image: caregiverImage },
  postpartum: { i18nKey: 'postpartumSupport', image: postpartumImage },
};

function ServicePage() {
  const { t } = useTranslation();
  // A mesma página serve as cinco rotas de serviço: o serviço vem do URL.
  const service = routeKeyForPath(useLocation().pathname);
  const { i18nKey, image } = SERVICES[service];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t(`${i18nKey}.hero.title`),
    "description": t(`meta.${service}.description`),
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
    <div className="service-detail-page">
      <MetaTags page={service} schema={schema} />
      {/* Hero Section */}
      <section className="service-detail-hero-section">
        <div className="service-detail-hero-background">
          <div className="service-detail-hero-overlay"></div>
        </div>

        <div className="service-detail-hero-content">
          <div className="service-detail-hero-text">
            <h1 className="service-detail-hero-title">{t(`${i18nKey}.hero.title`)}</h1>
            <p className="service-detail-hero-subtitle">
              {t(`${i18nKey}.hero.subtitle`)}
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="service-detail-content-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="service-detail-content">
              <div className="service-detail-grid">
                {/* Texto */}
                <div className="service-detail-text">
                  <h2 className="service-detail-title">{t(`${i18nKey}.content.title`)}</h2>
                  <p className="service-detail-description">
                    {t(`${i18nKey}.content.description`)}
                  </p>
                </div>

                {/* Imagem */}
                <div className="service-detail-image">
                  <img loading="lazy" src={image}
                    alt={t(`${i18nKey}.content.alt`)}
                    className="service-detail-photo"
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

export default ServicePage;
