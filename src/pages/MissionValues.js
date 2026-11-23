import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Handshake, Heart, Lightbulb, Star, Target, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import './MissionValues.css';

function MissionValues() {
  const { t } = useTranslation();
  const missionPath = useLocalizedPath('mission');
  const contactsPath = useLocalizedPath('contacts');
  const missionCards = t('missionValues.mission.cards', { returnObjects: true });
  const objectives = t('missionValues.objectives.cards', { returnObjects: true });
  const values = t('missionValues.values.items', { returnObjects: true });
  const valueIcons = [Award, Heart, Lightbulb, Handshake, TrendingUp, Users];

  const missionSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": t('missionValues.seoTitle'),
    "description": t('missionValues.seoDescription'),
    "url": `https://www.kindnesscare.pt${missionPath}`,
    "about": {
      "@type": "Organization",
      "name": "Kindness & Care",
      "url": "https://www.kindnesscare.pt",
      "slogan": t('missionValues.seoDescription')
    }
  };

  return (
    <div className="mission-values-page">
      <MetaTags
        title={t('missionValues.seoTitle')}
        description={t('missionValues.seoDescription')}
        url={missionPath}
        schema={missionSchema}
      />

      <PageHero
        title={t('missionValues.hero.title')}
        subtitle={t('missionValues.hero.subtitle')}
      />

      <section className="page-section">
        <div className="page-shell">
          <div className="page-section-intro">
            <h2>{t('missionValues.mission.title')}</h2>
          </div>
          <div className="feature-grid feature-grid-2">
            {Array.isArray(missionCards) && missionCards.map((card, idx) => {
              const Icon = idx === 0 ? Star : Target;
              return (
                <article key={card} className="feature-item">
                  <div className="feature-item-icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <p>{card}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-section page-section-muted">
        <div className="page-shell">
          <div className="page-section-intro">
            <h2>{t('missionValues.objectives.title')}</h2>
          </div>
          <div className="feature-grid feature-grid-2">
            {Array.isArray(objectives) && objectives.map((obj) => (
              <article key={obj.title} className="feature-item">
                <span className="feature-number">{obj.number}</span>
                <h3>{obj.title}</h3>
                <p>{obj.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="page-shell">
          <div className="page-section-intro">
            <h2>{t('missionValues.values.title')}</h2>
          </div>
          <div className="feature-grid">
            {Array.isArray(values) && values.map((item, idx) => {
              const Icon = valueIcons[idx] || Heart;
              return (
                <article key={item.title} className="feature-item">
                  <div className="feature-item-icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-cta-band">
        <div className="page-shell">
          <h3>{t('missionValues.cta.title')}</h3>
          <p>{t('missionValues.cta.text')}</p>
          <Link className="btn-primary" to={contactsPath}>
            {t('missionValues.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default MissionValues;
