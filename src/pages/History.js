import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './History.css';

function History() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const contactsPath = useLocalizedPath('contacts');

  const handleContactClick = () => {
    navigate(contactsPath);
  };

  const sections = t('history.sections', { returnObjects: true });

  const historyPath = useLocalizedPath('history');
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
        title="Nossa História | Da Frustração à Transformação"
        description="Conheça a jornada de Kindness & Care: como a perda pessoal transformou-se numa missão para oferecer cuidados domiciliários com excelência técnica e humanidade."
        url={historyPath}
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
                            <i className={`fas ${cIdx === 0 ? 'fa-stethoscope' : cIdx === 1 ? 'fa-heart' : 'fa-user-friends'}`}></i>
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
                <button className="history-cta-button" onClick={handleContactClick}>
                  {t('history.cta.button')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default History;