import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import { getOrganizationSchema, getWebsiteSchema } from '../seo/organization';
import './Home.css';
import heroImage from '../images/hero.webp';
import sobreNos1 from '../images/about-primary.webp';
import sobreNos2 from '../images/about-secondary.webp';
import parceiro1 from '../images/partner-pousadas-de-portugal.webp';
import parceiro2 from '../images/partner-universidade-do-minho.webp';
import parceiro3 from '../images/partner-snqtb-saude.webp';
import parceiro4 from '../images/partner-iasfa.webp';
import parceiro5 from '../images/partner-acfab.webp';
import pillarCare from '../images/page-care.webp';
import pillarLongevity from '../images/page-longevity.webp';
import pillarAcademy from '../images/page-academy.webp';
import pillarExperiences from '../images/page-experiences.webp';

function Home() {
  const { t, i18n } = useTranslation();
  const homePath = useLocalizedPath('home');
  const contactsPath = useLocalizedPath('contacts');
  const historyPath = useLocalizedPath('history');
  const testimonialsPath = useLocalizedPath('testimonials');
  const carePath = useLocalizedPath('care');
  const longevityPath = useLocalizedPath('longevity');
  const academyPath = useLocalizedPath('academy');
  const experiencesPath = useLocalizedPath('experiences');
  const lang = i18n.language?.startsWith('en') ? 'en' : 'pt';

  const pillars = [
    {
      id: 'care',
      titleKey: 'pillars.items.care.title',
      textKey: 'pillars.items.care.text',
      image: pillarCare,
      path: carePath,
    },
    {
      id: 'longevity',
      titleKey: 'pillars.items.longevity.title',
      textKey: 'pillars.items.longevity.text',
      image: pillarLongevity,
      path: longevityPath,
    },
    {
      id: 'academy',
      titleKey: 'pillars.items.academy.title',
      textKey: 'pillars.items.academy.text',
      image: pillarAcademy,
      path: academyPath,
    },
    {
      id: 'experiences',
      titleKey: 'pillars.items.experiences.title',
      textKey: 'pillars.items.experiences.text',
      image: pillarExperiences,
      path: experiencesPath,
    },
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = '351968844420';
    const message = t('home.whatsappMessage');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  };

  const parceiros = [
    { id: 1, nome: t('home.partners.names.0'), imagem: parceiro1 },
    { id: 2, nome: t('home.partners.names.1'), imagem: parceiro2 },
    { id: 3, nome: t('home.partners.names.2'), imagem: parceiro3 },
    { id: 4, nome: t('home.partners.names.3'), imagem: parceiro4 },
    { id: 5, nome: t('home.partners.names.4'), imagem: parceiro5 },
  ];

  const aboutParagraphs = t('home.about.paragraphs', { returnObjects: true });

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [getOrganizationSchema(lang), getWebsiteSchema(lang)],
  };

  return (
    <div className="home-page">
      <MetaTags
        title={t('home.seoTitle')}
        description={t('home.seoDescription')}
        url={homePath}
        schema={homeSchema}
      />

      <section className="hero-section">
        <div className="hero-background">
          <img src={heroImage} alt="" width="1920" height="1281" className="hero-image" fetchPriority="high" />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>

        <div className="hero-content">
          <p className="hero-brand">{t('home.hero.brand')}</p>
          <h1 className="hero-main-title">{t('home.hero.title')}</h1>
          <p className="hero-description">{t('home.hero.description')}</p>
          <div className="hero-actions">
            <Link className="hero-contact-button" to={contactsPath}>
              {t('home.hero.button')}
            </Link>
            <Link className="hero-secondary-button" to={carePath}>
              {t('home.hero.meet')}
            </Link>
          </div>
        </div>
      </section>

      <section className="pillars-section" aria-labelledby="pillars-title">
        <div className="home-shell">
          <div className="section-intro pillars-intro">
            <h2 id="pillars-title">{t('pillars.section.title')}</h2>
            <p>{t('pillars.section.subtitle')}</p>
          </div>

          <div className="pillars-puzzle">
            {pillars.map((pillar) => (
              <article key={pillar.id} className={`pillar-tile pillar-tile-${pillar.id}`}>
                <div className="pillar-tile-media">
                  <img loading="lazy" src={pillar.image} alt={t(pillar.titleKey)} />
                </div>
                <div className="pillar-tile-body">
                  <h3>{t(pillar.titleKey)}</h3>
                  <p>{t(pillar.textKey)}</p>
                  <Link className="pillar-explore" to={pillar.path}>
                    {t('pillars.section.explore')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="pillars-closing">{t('pillars.section.closing')}</p>
        </div>
      </section>

      <section className="about-section">
        <div className="home-shell">
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
              {Array.isArray(aboutParagraphs) && aboutParagraphs.map((paragraph) => (
                <p key={paragraph} className="sobre-nos-paragrafo">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="story-section">
        <div className="home-shell story-layout">
          <blockquote>
            <p>{t('home.story.quote')}</p>
            <footer>{t('home.story.attribution')}</footer>
          </blockquote>
          <div className="story-actions">
            <Link className="text-link" to={historyPath}>{t('home.story.historyLink')}</Link>
            <Link className="text-link" to={testimonialsPath}>{t('home.story.testimonialsLink')}</Link>
          </div>
        </div>
      </section>

      <section className="partners-section">
        <div className="home-shell">
          <div className="section-intro">
            <h2>{t('home.partners.title')}</h2>
            <p>{t('home.partners.subtitle')}</p>
          </div>
          <div className="partners-grid">
            {parceiros.map((parceiro) => (
              <div key={parceiro.id} className="partner-item">
                <img
                  loading="lazy"
                  src={parceiro.imagem}
                  alt={parceiro.nome}
                  className="partner-image"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-band">
        <div className="home-shell contact-band-inner">
          <div>
            <h2>{t('home.contactSection.title')}</h2>
            <p>{t('home.contactSection.subtitle')}</p>
          </div>
          <div className="contact-band-actions">
            <a className="hero-contact-button" href="tel:+351968844420">
              {t('home.contactSection.phone.button')}
            </a>
            <Link className="hero-secondary-button" to={contactsPath}>
              {t('home.contactSection.email.button')}
            </Link>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="whatsapp-float"
        onClick={handleWhatsAppClick}
        aria-label={t('home.whatsappTooltip')}
      >
        <span className="whatsapp-tooltip">{t('home.whatsappTooltip')}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>
    </div>
  );
}

export default Home;
