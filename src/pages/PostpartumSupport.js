import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import './ServicePage.css';
import postpartumImage from '../images/postpartum-support.webp';

function PostpartumSupport() {
  const { t } = useTranslation();
  const postpartumPath = useLocalizedPath('postpartum');

  const postpartumSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t('postpartumSupport.hero.title'),
    "description": t('postpartumSupport.seoDescription'),
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
    "serviceType": t('postpartumSupport.hero.title')
  };

  return (
    <div className="service-page">
      <MetaTags
        title={t('postpartumSupport.seoTitle')}
        description={t('postpartumSupport.seoDescription')}
        url={postpartumPath}
        schema={postpartumSchema}
      />

      <PageHero
        title={t('postpartumSupport.hero.title')}
        subtitle={t('postpartumSupport.hero.subtitle')}
      />

      <section className="page-section">
        <div className="page-shell page-split">
          <div className="page-prose">
            <h2 className="page-block-title">{t('postpartumSupport.content.title')}</h2>
            <p>{t('postpartumSupport.content.description')}</p>
          </div>
          <div className="page-split-media">
            <img
              loading="lazy"
              src={postpartumImage}
              alt={t('postpartumSupport.content.alt')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default PostpartumSupport;
