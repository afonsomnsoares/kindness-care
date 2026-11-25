import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import './ServicePage.css';

function ServicePage({ i18nKey, image, contactSubject, pathKey }) {
  const { t } = useTranslation();
  const pagePath = useLocalizedPath(pathKey);
  const contactsPath = useLocalizedPath('contacts');
  const carePath = useLocalizedPath('care');

  const includes = t(`${i18nKey}.includes`, { returnObjects: true });
  const includeList = Array.isArray(includes) ? includes : [];
  const steps = t(`${i18nKey}.process.steps`, { returnObjects: true });
  const stepList = Array.isArray(steps) ? steps : [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t(`${i18nKey}.hero.title`),
    description: t(`${i18nKey}.seoDescription`),
    provider: {
      '@type': 'LocalBusiness',
      name: 'Kindness & Care',
      url: 'https://www.kindnesscare.pt',
    },
    areaServed: [
      { '@type': 'City', name: 'Braga' },
      { '@type': 'City', name: 'Porto' },
      { '@type': 'City', name: 'Viana do Castelo' },
    ],
    serviceType: t(`${i18nKey}.hero.title`),
  };

  return (
    <div className="service-page">
      <MetaTags
        title={t(`${i18nKey}.seoTitle`)}
        description={t(`${i18nKey}.seoDescription`)}
        url={pagePath}
        schema={schema}
      />

      <PageHero
        title={t(`${i18nKey}.hero.title`)}
        subtitle={t(`${i18nKey}.hero.subtitle`)}
      />

      <section className="page-section">
        <div className="page-shell page-split">
          <div className="page-prose">
            <p className="service-lead">{t(`${i18nKey}.content.description`)}</p>
            {includeList.length > 0 && (
              <>
                <h2 className="page-block-title service-includes-title">
                  {t(`${i18nKey}.includesTitle`)}
                </h2>
                <ul className="service-includes">
                  {includeList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="page-split-media">
            <img loading="lazy" src={image} alt={t(`${i18nKey}.content.alt`)} />
          </div>
        </div>
      </section>

      <section className="page-section page-section-muted" aria-labelledby="service-for-whom">
        <div className="page-shell page-shell-narrow">
          <p className="service-eyebrow">{t('servicePage.forWhomEyebrow')}</p>
          <h2 id="service-for-whom" className="page-block-title">
            {t('servicePage.forWhomTitle')}
          </h2>
          <p className="service-for-whom">{t(`${i18nKey}.forWhom`)}</p>
        </div>
      </section>

      {stepList.length > 0 && (
        <section className="page-section" aria-labelledby="service-process">
          <div className="page-shell">
            <div className="page-section-intro">
              <h2 id="service-process">{t(`${i18nKey}.process.title`)}</h2>
            </div>
            <ol className="service-steps">
              {stepList.map((step, index) => (
                <li key={step} className="service-step">
                  <span className="service-step-num" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="page-cta-band">
        <div className="page-shell">
          <h2>{t('servicePage.cta.title')}</h2>
          <p>{t('servicePage.cta.text')}</p>
          <div className="service-cta-actions">
            <Link
              className="btn-primary"
              to={`${contactsPath}?assunto=${contactSubject}`}
            >
              {t('servicePage.cta.button')}
            </Link>
            <Link className="btn-secondary service-cta-secondary" to={carePath}>
              {t('servicePage.backToCare')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicePage;
