import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from '../i18n/routes';
import { languageFromPathname } from '../i18n/language';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import './PillarPage.css';

function PillarPage({ pillarKey, image, imageAlt }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = languageFromPathname(pathname);
  const path = useLocalizedPath(pillarKey);
  const contactsPath = useLocalizedPath('contacts');
  const pousadasPath = useLocalizedPath('pousadas');
  const base = `pillars.${pillarKey}`;

  const intro = t(`${base}.intro`, { returnObjects: true });
  const areas = t(`${base}.areas`, { returnObjects: true });
  const closing = t(`${base}.closing`, { returnObjects: true });

  const introList = Array.isArray(intro) ? intro : [];
  const areasList = Array.isArray(areas) ? areas : [];
  const closingList = Array.isArray(closing) ? closing : [];

  return (
    <div className="pillar-page">
      <MetaTags
        title={t(`${base}.seoTitle`)}
        description={t(`${base}.seoDescription`)}
        url={path}
      />

      <PageHero
        title={t(`${base}.hero.title`)}
        subtitle={t(`${base}.hero.subtitle`)}
      />

      <section className="page-section">
        <div className="page-shell page-split pillar-page-split">
          <div className="page-prose">
            {introList.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {image ? (
            <div className="page-split-media">
              <img loading="lazy" src={image} alt={imageAlt || t(`${base}.imageAlt`)} />
            </div>
          ) : null}
        </div>
      </section>

      {areasList.length > 0 && (
        <section className="page-section page-section-muted">
          <div className="page-shell">
            <div className="page-section-intro">
              <h2>{t(`${base}.areasTitle`)}</h2>
            </div>
            <div className={`feature-grid ${areasList.length < 3 ? 'feature-grid-2' : ''}`}>
              {areasList.map((area) => {
                const features = Array.isArray(area.features) ? area.features : [];
                const areaPath = area.pathKey ? routes[lang][area.pathKey] : null;
                return (
                  <article key={area.title} className="feature-item pillar-area-card">
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                    {features.length > 0 && (
                      <ul className="pillar-area-features">
                        {features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    )}
                    {areaPath && (
                      <Link className="text-link" to={areaPath}>
                        {t('pillars.section.explore')}
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {closingList.length > 0 && (
        <section className="page-section page-section-muted">
          <div className="page-shell page-shell-narrow page-prose pillar-closing">
            {closingList.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="page-cta">
              {pillarKey === 'experiences' ? (
                <Link className="btn-primary" to={pousadasPath}>
                  {t(`${base}.cta`)}
                </Link>
              ) : (
                <Link
                  className="btn-primary"
                  to={`${contactsPath}?assunto=${pillarKey === 'longevity' ? 'longevidade' : pillarKey === 'academy' ? 'academia' : 'outro'}`}
                >
                  {t(`${base}.cta`)}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default PillarPage;
