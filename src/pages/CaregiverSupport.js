import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import './ServicePage.css';
import caregiverImage from '../images/caregiver-support.webp';

function CaregiverSupport() {
  const { t } = useTranslation();
  const caregiverPath = useLocalizedPath('caregiver');

  const caregiverSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t('caregiverSupport.hero.title'),
    "description": t('caregiverSupport.seoDescription'),
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
    "serviceType": t('caregiverSupport.hero.title')
  };

  return (
    <div className="service-page">
      <MetaTags
        title={t('caregiverSupport.seoTitle')}
        description={t('caregiverSupport.seoDescription')}
        url={caregiverPath}
        schema={caregiverSchema}
      />

      <PageHero
        title={t('caregiverSupport.hero.title')}
        subtitle={t('caregiverSupport.hero.subtitle')}
      />

      <section className="page-section">
        <div className="page-shell page-split">
          <div className="page-prose">
            <h2 className="page-block-title">{t('caregiverSupport.content.title')}</h2>
            <p>{t('caregiverSupport.content.description')}</p>
          </div>
          <div className="page-split-media">
            <img
              loading="lazy"
              src={caregiverImage}
              alt={t('caregiverSupport.content.alt')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default CaregiverSupport;
