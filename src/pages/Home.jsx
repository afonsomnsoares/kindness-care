import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalizedRoutes } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import './Home.css';
import { FaHome, FaUserNurse, FaUserMd, FaHandsHelping, FaBaby, FaHotel, FaWhatsapp } from 'react-icons/fa';
import heroImage from '../images/image-1.webp';
import sobreNos1 from '../images/image-3.webp';
import sobreNos2 from '../images/image-2.webp';
import parceiro1 from '../images/partner-1.webp';
import parceiro2 from '../images/partner-2.webp';
import parceiro3 from '../images/partner-3.webp';
import parceiro4 from '../images/image-11.webp';

function Home() {
  const { t } = useTranslation();
  const r = useLocalizedRoutes();
  const whatsappUrl = `https://wa.me/351968844420?text=${encodeURIComponent(t('home.whatsappMessage'))}`;

  const parceiros = [
    { id: 1, nome: t('home.partners.names.0'), imagem: parceiro1 },
    { id: 2, nome: t('home.partners.names.1'), imagem: parceiro2 },
    { id: 3, nome: t('home.partners.names.2'), imagem: parceiro3 },
    { id: 4, nome: t('home.partners.names.3'), imagem: parceiro4 },
  ];

  const services = [
    {
      icon: FaHome,
      titleKey: 'home.services.cards.0.title',
      descKey: 'home.services.cards.0.description',
      featuresKeys: ['home.services.cards.0.features.0', 'home.services.cards.0.features.1', 'home.services.cards.0.features.2', 'home.services.cards.0.features.3'],
      buttonKey: 'home.services.cards.0.button',
      path: r.homeCare,
    },
    {
      icon: FaUserNurse,
      titleKey: 'home.services.cards.1.title',
      descKey: 'home.services.cards.1.description',
      featuresKeys: ['home.services.cards.1.features.0', 'home.services.cards.1.features.1', 'home.services.cards.1.features.2', 'home.services.cards.1.features.3'],
      buttonKey: 'home.services.cards.1.button',
      path: r.nursing,
    },
    {
      icon: FaUserMd,
      titleKey: 'home.services.cards.2.title',
      descKey: 'home.services.cards.2.description',
      featuresKeys: ['home.services.cards.2.features.0', 'home.services.cards.2.features.1', 'home.services.cards.2.features.2', 'home.services.cards.2.features.3'],
      buttonKey: 'home.services.cards.2.button',
      path: r.medical,
    },
    {
      icon: FaHandsHelping,
      titleKey: 'home.services.cards.3.title',
      descKey: 'home.services.cards.3.description',
      featuresKeys: ['home.services.cards.3.features.0', 'home.services.cards.3.features.1', 'home.services.cards.3.features.2', 'home.services.cards.3.features.3'],
      buttonKey: 'home.services.cards.3.button',
      path: r.caregiver,
    },
    {
      icon: FaBaby,
      titleKey: 'home.services.cards.4.title',
      descKey: 'home.services.cards.4.description',
      featuresKeys: ['home.services.cards.4.features.0', 'home.services.cards.4.features.1', 'home.services.cards.4.features.2', 'home.services.cards.4.features.3'],
      buttonKey: 'home.services.cards.4.button',
      path: r.postpartum,
    },
    {
      icon: FaHotel,
      titleKey: 'home.services.cards.5.title',
      descKey: 'home.services.cards.5.description',
      featuresKeys: ['home.services.cards.5.features.0', 'home.services.cards.5.features.1', 'home.services.cards.5.features.2', 'home.services.cards.5.features.3', 'home.services.cards.5.features.4', 'home.services.cards.5.features.5'],
      buttonKey: 'home.services.cards.5.button',
      path: r.pousadas,
    },
  ];

  return (
    <div className="home-page">
      {/* Os dados estruturados da empresa estão em src/root.jsx (todas as páginas). */}
      <MetaTags page="home" />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img src={heroImage} alt={t('home.hero.title')} className="hero-image" fetchPriority="high" />
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

            <Link to={r.contacts} className="hero-contact-button">
              {t('home.hero.button')}
            </Link>
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
                    <service.icon />
                  </div>
                  <h3>{t(service.titleKey)}</h3>
                  <p>{t(service.descKey)}</p>
                  <ul className="service-features">
                    {service.featuresKeys.map((fk, fi) => (
                      <li key={fi}>{t(fk)}</li>
                    ))}
                  </ul>
                  <Link to={service.path} className="service-read-more">
                    {t(service.buttonKey)}
                  </Link>
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
                <p className="contact-card-info">{t('home.contactSection.phone.info')}</p>
                <p className="contact-description">
                  {t('home.contactSection.phone.description')}
                </p>
                <a href="tel:+351968844420" className="contact-button">
                  {t('home.contactSection.phone.button')}
                </a>
              </div>

              <div className="contact-card">
                <h3 className="contact-card-title">{t('home.contactSection.email.title')}</h3>
                <p className="contact-card-info">{t('home.contactSection.email.info')}</p>
                <p className="contact-description">
                  {t('home.contactSection.email.description')}
                </p>
                <a href="mailto:geral@kindnesscare.pt" className="contact-button">
                  {t('home.contactSection.email.button')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÍCONE DO WHATSAPP FLUTUANTE */}
      <a
        className="whatsapp-float"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('home.whatsappTooltip')}
      >
        <span className="whatsapp-tooltip" aria-hidden="true">{t('home.whatsappTooltip')}</span>
        <FaWhatsapp className="whatsapp-icon" aria-hidden="true" />
      </a>
    </div>
  );
}

export default Home;