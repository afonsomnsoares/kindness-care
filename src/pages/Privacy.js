import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import './Legal.css';

function Privacy() {
  const { t } = useTranslation();
  const privacyPath = useLocalizedPath('privacy');
  const sections = t('privacy.sections', { returnObjects: true });

  return (
    <div className="legal-page">
      <MetaTags
        title={t('privacy.seoTitle')}
        description={t('privacy.seoDescription')}
        url={privacyPath}
      />

      <PageHero
        title={t('privacy.hero.title')}
        subtitle={t('privacy.hero.subtitle')}
      />

      <section className="page-section page-section-muted">
        <div className="page-shell-narrow page-prose legal-body">
          <p className="legal-updated">{t('privacy.updated')}</p>
          {Array.isArray(sections) && sections.map((section) => (
            <div key={section.heading} className="legal-block">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Privacy;
