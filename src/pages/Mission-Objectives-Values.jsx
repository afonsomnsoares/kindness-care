import React from 'react';
import { useTranslation } from 'react-i18next';
import { MetaTags } from '../components/MetaTags';
import './Mission-Objectives-Values.css';
import { FaMedal, FaHeart, FaLightbulb, FaHandshake, FaChartLine, FaUsers, FaStar, FaBullseye } from 'react-icons/fa';

function MissionValues() {
  const { t } = useTranslation();
  const missionCards = t('missionValues.mission.cards', { returnObjects: true });
  const objectives = t('missionValues.objectives.cards', { returnObjects: true });
  const values = t('missionValues.values.items', { returnObjects: true });

  const missionSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kindness & Care",
    "url": "https://www.kindnesscare.pt",
    "mission": "Fornecer cuidados domiciliários de excelência com abordagem humanizada e baseada em conhecimento académico.",
    "description": "Missão, Objetivos e Valores: Excelência, Humanização, Inovação, Compromisso, Consistência e Comunidade"
  };

  const valueIcons = [
    FaMedal, FaHeart, FaLightbulb,
    FaHandshake, FaChartLine, FaUsers
  ];

  return (
    <div className="mission-values-page">
      <MetaTags
        page="mission"
        schema={missionSchema}
      />
      {/* Hero Section */}
      <section className="mission-hero-section">
        <div className="mission-hero-background">
          <div className="mission-hero-overlay"></div>
        </div>

        <div className="mission-hero-content">
          <div className="mission-hero-text">
            <h1 className="mission-hero-title">{t('missionValues.hero.title')}</h1>
            <p className="mission-hero-subtitle">
              {t('missionValues.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Missão Section */}
      <section className="mission-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="mission-content">
              <div className="section-header">
                <h2 className="section-title">{t('missionValues.mission.title')}</h2>
                <div className="section-divider"></div>
              </div>

              <div className="mission-grid">
                {missionCards.map((card, idx) => (
                  <div key={idx} className="mission-card">
                    <div className="mission-icon">
                      {idx === 0 ? <FaStar /> : <FaBullseye />}
                    </div>
                    <p>{card}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objetivos Section */}
      <section className="objectives-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="objectives-content">
              <div className="section-header">
                <h2 className="section-title">{t('missionValues.objectives.title')}</h2>
                <div className="section-divider"></div>
              </div>

              <div className="objectives-grid">
                {objectives.map((obj, idx) => (
                  <div key={idx} className="objective-card">
                    <div className="objective-number">{obj.number}</div>
                    <h3 className="objective-title">{obj.title}</h3>
                    <p className="objective-description">{obj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section className="values-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="values-content">
              <div className="section-header">
                <h2 className="section-title">{t('missionValues.values.title')}</h2>
                <div className="section-divider"></div>
              </div>

              <div className="values-grid">
                {values.map((item, idx) => (
                  <div key={idx} className="value-item">
                    <div className="value-icon">
                      {React.createElement(valueIcons[idx])}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MissionValues;