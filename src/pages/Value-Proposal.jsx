import React from 'react';
import { useTranslation } from 'react-i18next';
import { MetaTags } from '../components/MetaTags';
import './Value-Proposal.css';
import { FaUserCog, FaGraduationCap, FaChartLine, FaBookOpen, FaComments, FaStar } from 'react-icons/fa';

const icons = [
  FaUserCog, FaGraduationCap, FaChartLine,
  FaBookOpen, FaComments, FaStar
];

function ValueProposal() {
  const { t } = useTranslation();
  const cards = t('valueProposal.cards', { returnObjects: true });
  const valueSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kindness & Care",
    "url": "https://www.kindnesscare.pt",
    "description": "Proposta de valor: Serviço personalizado, profissionais qualificados, transparência, treinamento contínuo, serviço aberto e avaliação de satisfação."
  };

  return (
    <div className="value-proposal-page">
      <MetaTags
        page="valueProposal"
        schema={valueSchema}
      />
      {/* Hero Section */}
      <section className="value-hero-section">
        <div className="value-hero-background">
          <div className="value-hero-overlay"></div>
        </div>

        <div className="value-hero-content">
          <div className="value-hero-text">
            <h1 className="value-hero-title">{t('valueProposal.hero.title')}</h1>
            <p className="value-hero-subtitle">
              {t('valueProposal.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="value-cards-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="value-cards-grid">
              {cards.map((card, idx) => (
                <div key={idx} className="value-card">
                  <div className="value-card-icon">
                    {React.createElement(icons[idx])}
                  </div>
                  <h3 className="value-card-title">{card.title}</h3>
                  <p className="value-card-description">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ValueProposal;