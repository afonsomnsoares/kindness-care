import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import './ServicePage.css';
import homeCareImage from '../images/home-care.webp';

function HomeCare() {
  const { t } = useTranslation();
  const homeCarePath = useLocalizedPath('homeCare');

  const homeCareSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t('homeCare.hero.title'),
    "description": t('homeCare.seoDescription'),
    "provider": {
      "@type": "LocalBusiness",
      "name": "Kindness & Care",
      "url": "https://www.kindnesscare.pt"
    },
    "areaServed": [
      {"@type": "City", "name": "Braga"},
      {"@type": "City", "name": "Porto"},
      {"@type": "City", "name": "Viana do Castelo"}
    ],
    "serviceType": t('homeCare.hero.title')
  };

  return (
    <div className="service-page">
      <MetaTags
        title={t('homeCare.seoTitle')}
        description={t('homeCare.seoDescription')}
        url={homeCarePath}
        schema={homeCareSchema}
      />

      <PageHero
        title={t('homeCare.hero.title')}
        subtitle={t('homeCare.hero.subtitle')}
      />

      <section className="page-section">
        <div className="page-shell page-split">
          <div className="page-prose">
            <h2 className="page-block-title">{t('homeCare.content.title')}</h2>
            <p>{t('homeCare.content.description')}</p>
          </div>
          <div className="page-split-media">
            <img
              loading="lazy"
              src={homeCareImage}
              alt={t('homeCare.content.alt')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeCare;
