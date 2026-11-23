import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, MessagesSquare, Settings, Star, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import './ValueProposal.css';

const icons = [Settings, GraduationCap, TrendingUp, BookOpen, MessagesSquare, Star];

function ValueProposal() {
  const { t } = useTranslation();
  const valuePath = useLocalizedPath('valueProposal');
  const contactsPath = useLocalizedPath('contacts');
  const cards = t('valueProposal.cards', { returnObjects: true });

  const valueSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": t('valueProposal.seoTitle'),
    "description": t('valueProposal.seoDescription'),
    "url": `https://www.kindnesscare.pt${valuePath}`,
    "about": {
      "@type": "Organization",
      "name": "Kindness & Care",
      "url": "https://www.kindnesscare.pt"
    }
  };

  return (
    <div className="value-proposal-page">
      <MetaTags
        title={t('valueProposal.seoTitle')}
        description={t('valueProposal.seoDescription')}
        url={valuePath}
        schema={valueSchema}
      />

      <PageHero
        title={t('valueProposal.hero.title')}
        subtitle={t('valueProposal.hero.subtitle')}
      />

      <section className="page-section page-section-muted">
        <div className="page-shell">
          <h2 className="page-block-title">{t('valueProposal.hero.title')}</h2>
          <div className="feature-grid">
            {Array.isArray(cards) && cards.map((card, idx) => {
              const Icon = icons[idx] || Star;
              return (
                <article key={card.title} className="feature-item">
                  <div className="feature-item-icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-cta-band">
        <div className="page-shell">
          <h2>{t('valueProposal.cta.title')}</h2>
          <p>{t('valueProposal.cta.text')}</p>
          <Link className="btn-primary" to={contactsPath}>
            {t('valueProposal.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ValueProposal;
