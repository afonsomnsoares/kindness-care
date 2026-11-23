import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import './ServicePage.css';
import medicalImage from '../images/medical-assistance.webp';

function MedicalAssistance() {
  const { t } = useTranslation();
  const medicalPath = useLocalizedPath('medical');

  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t('medicalAssistance.hero.title'),
    "description": t('medicalAssistance.seoDescription'),
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
    "serviceType": t('medicalAssistance.hero.title')
  };

  return (
    <div className="service-page">
      <MetaTags
        title={t('medicalAssistance.seoTitle')}
        description={t('medicalAssistance.seoDescription')}
        url={medicalPath}
        schema={medicalSchema}
      />

      <PageHero
        title={t('medicalAssistance.hero.title')}
        subtitle={t('medicalAssistance.hero.subtitle')}
      />

      <section className="page-section">
        <div className="page-shell page-split">
          <div className="page-prose">
            <h2 className="page-block-title">{t('medicalAssistance.content.title')}</h2>
            <p>{t('medicalAssistance.content.description')}</p>
          </div>
          <div className="page-split-media">
            <img
              loading="lazy"
              src={medicalImage}
              alt={t('medicalAssistance.content.alt')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default MedicalAssistance;
