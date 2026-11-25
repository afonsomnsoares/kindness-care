import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Stethoscope, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import founderArmandoManuel from '../images/founder-armando-manuel.webp';
import founderClaudiaOliveira from '../images/founder-claudia-oliveira.webp';
import './History.css';

const commitmentIcons = [Stethoscope, Heart, Users];

const founderPhotos = {
  armandoManuel: founderArmandoManuel,
  claudiaOliveira: founderClaudiaOliveira,
};

function History() {
  const { t } = useTranslation();
  const contactsPath = useLocalizedPath('contacts');
  const historyPath = useLocalizedPath('history');
  const sections = t('history.sections', { returnObjects: true });
  const founders = t('history.founders.people', { returnObjects: true });
  const foundersList = Array.isArray(founders) ? founders : [];

  const historySchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": t('history.seoTitle'),
    "description": t('history.seoDescription'),
    "url": `https://www.kindnesscare.pt${historyPath === '/' ? '' : historyPath}`,
    "mainEntity": {
      "@type": "Organization",
      "name": "Kindness & Care",
      "foundingDate": "2025",
      "parentOrganization": {
        "@type": "CollegeOrUniversity",
        "name": "Universidade do Minho"
      }
    }
  };

  return (
    <div className="history-page">
      <MetaTags
        title={t('history.seoTitle')}
        description={t('history.seoDescription')}
        url={historyPath}
        schema={historySchema}
      />

      <PageHero
        title={t('history.hero.title')}
        subtitle={t('history.hero.subtitle')}
      />

      <section className="page-section">
        <div className="page-shell-narrow page-prose">
          {Array.isArray(sections) && sections.map((section) => (
            <div key={section.title} className="history-block">
              <h2 className="page-block-title">{section.title}</h2>
              {section.paragraphs && section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.commitments && (
                <div className="feature-grid history-commitments">
                  {section.commitments.map((commitment, cIdx) => {
                    const Icon = commitmentIcons[cIdx] || Heart;
                    return (
                      <div key={commitment.title} className="feature-item">
                        <div className="feature-item-icon" aria-hidden="true">
                          <Icon />
                        </div>
                        <h3>{commitment.title}</h3>
                        <p>{commitment.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {foundersList.length > 0 ? (
            <div className="history-block history-founders">
              <h2 className="page-block-title">{t('history.founders.title')}</h2>
              <p>{t('history.founders.intro')}</p>
              <div className="founders-grid">
                {foundersList.map((person) => {
                  const photo = person.photoKey ? founderPhotos[person.photoKey] : null;
                  return (
                    <article key={`${person.role}-${person.name}`} className="founder-slot">
                      <div className={`founder-photo${photo ? ' has-image' : ''}${person.photoKey ? ` founder-photo-${person.photoKey}` : ''}`}>
                        {photo ? (
                          <img
                            src={photo}
                            alt={person.name}
                            width="220"
                            height="220"
                            loading="lazy"
                          />
                        ) : (
                          <span aria-hidden="true">{t('history.founders.photoPlaceholder')}</span>
                        )}
                      </div>
                      <h3>{person.name}</h3>
                      <p className="founder-role">{person.role}</p>
                      {person.bio ? <p className="founder-bio">{person.bio}</p> : null}
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="page-cta">
            <h2>{t('history.cta.title')}</h2>
            <p>{t('history.cta.text')}</p>
            <Link className="btn-primary" to={contactsPath}>
              {t('history.cta.button')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default History;
