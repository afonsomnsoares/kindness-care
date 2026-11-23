import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import './ServicePage.css';
import nursingImage from '../images/nursing-rehabilitation.webp';

function NursingRehabilitation() {
  const { t } = useTranslation();
  const nursingPath = useLocalizedPath('nursing');

  const nursingSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t('nursingRehabilitation.hero.title'),
    "description": t('nursingRehabilitation.seoDescription'),
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
    "serviceType": t('nursingRehabilitation.hero.title')
  };

  return (
    <div className="service-page">
      <MetaTags
        title={t('nursingRehabilitation.seoTitle')}
        description={t('nursingRehabilitation.seoDescription')}
        url={nursingPath}
        schema={nursingSchema}
      />

      <PageHero
        title={t('nursingRehabilitation.hero.title')}
        subtitle={t('nursingRehabilitation.hero.subtitle')}
      />

      <section className="page-section">
        <div className="page-shell page-split">
          <div className="page-prose">
            <h2 className="page-block-title">{t('nursingRehabilitation.content.title')}</h2>
            <p>{t('nursingRehabilitation.content.description')}</p>
          </div>
          <div className="page-split-media">
            <img
              loading="lazy"
              src={nursingImage}
              alt={t('nursingRehabilitation.content.alt')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default NursingRehabilitation;
