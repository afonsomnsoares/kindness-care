import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import './ServicePage.css';
import tourismImage from '../images/health-tourism.webp';

function HealthTourismService() {
  const { t } = useTranslation();
  const pousadasPath = useLocalizedPath('pousadas');
  const healthTourismPath = useLocalizedPath('healthTourism');
  const features = t('healthTourismService.content.features', { returnObjects: true });
  const featureList = Array.isArray(features) ? features : [];

  const healthTourismSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t('healthTourismService.hero.title'),
    "description": t('healthTourismService.seoDescription'),
    "provider": {
      "@type": "LocalBusiness",
      "name": "Kindness & Care",
      "url": "https://www.kindnesscare.pt"
    },
    "areaServed": [
      {"@type": "City", "name": "Viana do Castelo"},
      {"@type": "City", "name": "Porto"},
      {"@type": "City", "name": "Santa Maria do Bouro"}
    ],
    "serviceType": t('healthTourismService.hero.title')
  };

  return (
    <div className="service-page">
      <MetaTags
        title={t('healthTourismService.seoTitle')}
        description={t('healthTourismService.seoDescription')}
        url={healthTourismPath}
        schema={healthTourismSchema}
      />

      <PageHero
        title={t('healthTourismService.hero.title')}
        subtitle={t('healthTourismService.hero.subtitle')}
      />

      <section className="page-section">
        <div className="page-shell page-split">
          <div className="page-prose">
            <p>{t('healthTourismService.content.description')}</p>

            <p>{t('healthTourismService.content.intro')}</p>
            <ul>
              {featureList.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="page-split-media">
            <img
              loading="lazy"
              src={tourismImage}
              alt={t('healthTourismService.content.alt')}
            />
          </div>
        </div>
      </section>

      <section className="page-cta-band">
        <div className="page-shell">
          <h3>{t('healthTourismService.cta.title')}</h3>
          <p>{t('healthTourismService.cta.text')}</p>
          <Link className="btn-primary" to={pousadasPath}>
            {t('healthTourismService.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HealthTourismService;
