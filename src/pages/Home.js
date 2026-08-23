import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import heroImage from '../images/image-1.webp';
import sobreNos1 from '../images/image-3.webp';
import sobreNos2 from '../images/image-2.webp';
import parceiro1 from '../images/partner-1.webp';
import parceiro2 from '../images/partner-2.webp';
import parceiro3 from '../images/partner-3.webp';
import parceiro4 from '../images/image-11.webp';

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const contactsPath = useLocalizedPath('contacts');

  const handleContactClick = () => {
    navigate(contactsPath);
  };

  const handleServiceClick = (servicePath) => {
    navigate(servicePath);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '351968844420';
    const message = t('home.whatsappMessage');
    const encodedMessage = encodeURIComponent(message);

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const parceiros = [
    { id: 1, nome: t('home.partners.names.0'), imagem: parceiro1 },
    { id: 2, nome: t('home.partners.names.1'), imagem: parceiro2 },
    { id: 3, nome: t('home.partners.names.2'), imagem: parceiro3 },
    { id: 4, nome: t('home.partners.names.3'), imagem: parceiro4 },
  ];

  const services = [
    {
      icon: 'fa-home',
      titleKey: 'home.services.cards.0.title',
      descKey: 'home.services.cards.0.description',
      featuresKeys: ['home.services.cards.0.features.0', 'home.services.cards.0.features.1', 'home.services.cards.0.features.2', 'home.services.cards.0.features.3'],
      buttonKey: 'home.services.cards.0.button',
      path: useLocalizedPath('homeCare'),
    },
    {
      icon: 'fa-user-nurse',
      titleKey: 'home.services.cards.1.title',
      descKey: 'home.services.cards.1.description',
      featuresKeys: ['home.services.cards.1.features.0', 'home.services.cards.1.features.1', 'home.services.cards.1.features.2', 'home.services.cards.1.features.3'],
      buttonKey: 'home.services.cards.1.button',
      path: useLocalizedPath('nursing'),
    },
    {
      icon: 'fa-user-md',
      titleKey: 'home.services.cards.2.title',
      descKey: 'home.services.cards.2.description',
      featuresKeys: ['home.services.cards.2.features.0', 'home.services.cards.2.features.1', 'home.services.cards.2.features.2', 'home.services.cards.2.features.3'],
      buttonKey: 'home.services.cards.2.button',
      path: useLocalizedPath('medical'),
    },
    {
      icon: 'fa-hands-helping',
      titleKey: 'home.services.cards.3.title',
      descKey: 'home.services.cards.3.description',
      featuresKeys: ['home.services.cards.3.features.0', 'home.services.cards.3.features.1', 'home.services.cards.3.features.2', 'home.services.cards.3.features.3'],
      buttonKey: 'home.services.cards.3.button',
      path: useLocalizedPath('caregiver'),
    },
    {
      icon: 'fa-baby',
      titleKey: 'home.services.cards.4.title',
      descKey: 'home.services.cards.4.description',
      featuresKeys: ['home.services.cards.4.features.0', 'home.services.cards.4.features.1', 'home.services.cards.4.features.2', 'home.services.cards.4.features.3'],
      buttonKey: 'home.services.cards.4.button',
      path: useLocalizedPath('postpartum'),
    },
    {
      icon: 'fa-hotel',
      titleKey: 'home.services.cards.5.title',
      descKey: 'home.services.cards.5.description',
      featuresKeys: ['home.services.cards.5.features.0', 'home.services.cards.5.features.1', 'home.services.cards.5.features.2', 'home.services.cards.5.features.3', 'home.services.cards.5.features.4', 'home.services.cards.5.features.5'],
      buttonKey: 'home.services.cards.5.button',
      path: useLocalizedPath('pousadas'),
    },
  ];

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Kindness & Care",
    "description": "Serviço de Apoio Domiciliário com profissionais de saúde especializados. Enfermagem, reabilitação, assistência médica e turismo de saúde 24h.",
    "url": "https://www.kindnesscare.pt",
    "telephone": "+351968844420",
    "email": "geral@kindnesscare.pt",
    "logo": "https://www.kindnesscare.pt/logo.webp",
    "image": "https://www.kindnesscare.pt/og-image.jpg",
    "foundingDate": "2025",
    "areaServed": ["Braga", "Guimarães", "Viana do Castelo"],
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Braga",
      "addressCountry": "PT"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <div className="home-page">
      <MetaTags
        title="Serviço de Apoio Domiciliário | Enfermagem 24h"
        description="Kindness & Care oferece cuidados de enfermagem, reabilitação, assistência médica e turismo de saúde em Braga, Guimarães e Viana do Castelo. Profissionais especializados disponíveis 24h."
        url="/"
        schema={homeSchema}
      />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img loading="lazy" src={heroImage} alt={t('home.hero.title')} className="hero-image" />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-main-title">
              {t('home.hero.title')}
            </h1>
            <h2 className="hero-subtitle">
              {t('home.hero.subtitle')}
            </h2>

            <p className="hero-description">
              {t('home.hero.description')}
            </p>

            <button className="hero-contact-button" onClick={handleContactClick}>
              {t('home.hero.button')}
            </button>
          </div>
        </div>
      </section>

      {/* Seção Sobre Nós */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="sobre-nos-container">
            <div className="sobre-nos-imagens">
              <div className="imagem-principal">
                <img loading="lazy" src={sobreNos1} alt={t('home.about.alt1')} />
              </div>
              <div className="imagem-secundaria">
                <img loading="lazy" src={sobreNos2} alt={t('home.about.alt2')} />
              </div>
            </div>

            <div className="sobre-nos-texto">
              <h2 className="sobre-nos-titulo">{t('home.about.title')}</h2>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <p key={i} className="sobre-nos-paragrafo">
                  {t(`home.about.paragraphs.${i}`)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO SERVIÇOS */}
      <section className="services-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="services-title">{t('home.services.title')}</h2>
              <p className="services-subtitle">
                {t('home.services.subtitle')}
              </p>
            </div>

            <div className="services-grid">
              {services.map((service, idx) => (
                <div key={idx} className="service-card">
                  <div className="service-icon">
                    <i className={`fas ${service.icon}`}></i>
                  </div>
                  <h3>{t(service.titleKey)}</h3>
                  <p>{t(service.descKey)}</p>
                  <ul className="service-features">
                    {service.featuresKeys.map((fk, fi) => (
                      <li key={fi}>{t(fk)}</li>
                    ))}
                  </ul>
                  <button
                    className="service-read-more"
                    onClick={() => handleServiceClick(service.path)}
                  >
                    {t(service.buttonKey)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO PARCEIROS */}
      <section className="partners-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="partners-title">{t('home.partners.title')}</h2>
              <p className="partners-subtitle">
                {t('home.partners.subtitle')}
              </p>
            </div>

            <div className="partners-grid">
              {parceiros.map((parceiro) => (
                <div key={parceiro.id} className="partner-item">
                  <img loading="lazy"
                    src={parceiro.imagem}
                    alt={parceiro.nome}
                    className="partner-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO CONTACTO */}
      <section className="contact-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="contact-title">{t('home.contactSection.title')}</h2>
              <p className="contact-subtitle">
                {t('home.contactSection.subtitle')}
              </p>
            </div>

            <div className="contact-cards">
              <div className="contact-card">
                <h3 className="contact-card-title">{t('home.contactSection.phone.title')}</h3>
                <p className="contact-info">{t('home.contactSection.phone.info')}</p>
                <p className="contact-description">
                  {t('home.contactSection.phone.description')}
                </p>
                <button
                  className="contact-button"
                  onClick={() => window.open('tel:+351968844420')}
                >
                  {t('home.contactSection.phone.button')}
                </button>
              </div>

              <div className="contact-card">
                <h3 className="contact-card-title">{t('home.contactSection.email.title')}</h3>
                <p className="contact-info">{t('home.contactSection.email.info')}</p>
                <p className="contact-description">
                  {t('home.contactSection.email.description')}
                </p>
                <button
                  className="contact-button"
                  onClick={() => window.open('mailto:geral@kindnesscare.pt')}
                >
                  {t('home.contactSection.email.button')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÍCONE DO WHATSAPP FLUTUANTE */}
      <div className="whatsapp-float" onClick={handleWhatsAppClick}>
        <span className="whatsapp-tooltip">{t('home.whatsappTooltip')}</span>
        <i className="fab fa-whatsapp whatsapp-icon"></i>
      </div>
    </div>
  );
}

export default Home;