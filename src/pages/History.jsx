import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './History.css';
import { FaStethoscope, FaHeart, FaUserFriends } from 'react-icons/fa';

function History() {
  const { t } = useTranslation();
  const contactsPath = useLocalizedPath('contacts');

  const sections = t('history.sections', { returnObjects: true });

  const historySchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kindness & Care",
    "url": "https://www.kindnesscare.pt",
    "foundingDate": "2025",
    "description": "A história de Kindness & Care: da frustração à transformação, criando um serviço que combina excelência técnica com humanidade genuína.",
    "parentOrganization": {
      "@type": "EducationalOrganization",
      "name": "Universidade do Minho"
    }
  };

  return (
    <div className="history-page">
      <MetaTags
        page="history"
        schema={historySchema}
      />
      {/* Hero Section da História */}
      <section className="history-hero-section">
        <div className="history-hero-background">
          <div className="history-hero-overlay"></div>
        </div>

        <div className="history-hero-content">
          <div className="history-hero-text">
            <h1 className="history-hero-title">{t('history.hero.title')}</h1>
            <p className="history-hero-subtitle">
              {t('history.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal da História */}
      <section className="history-content-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="history-content">
              {sections.map((section, idx) => (
                <div key={idx} className="history-section">
                  <h2 className="history-section-title">{section.title}</h2>
                  {section.paragraphs && (
                    <div className="history-section-content">
                      {section.paragraphs.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  {section.commitments && (
                    <div className="commitment-grid">
                      {section.commitments.map((commitment, cIdx) => (
                        <div key={cIdx} className="commitment-item">
                          <div className="commitment-icon">
                            {cIdx === 0 ? <FaStethoscope /> : cIdx === 1 ? <FaHeart /> : <FaUserFriends />}
                          </div>
                          <h3>{commitment.title}</h3>
                          <p>{commitment.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Chamada para Ação */}
              <div className="history-cta-section">
                <h2 className="history-cta-title">{t('history.cta.title')}</h2>
                <p className="history-cta-text">
                  {t('history.cta.text')}
                </p>
                <Link to={contactsPath} className="history-cta-button">
                  {t('history.cta.button')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default History;