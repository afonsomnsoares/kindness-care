import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import useContactForm from '../hooks/useContactForm';
import { whatsAppHref } from '../utils/whatsapp';
import './Contacts.css';

const INITIAL_DATA = {
  nome: '',
  email: '',
  telefone: '',
  assunto: '',
  urgencia: '',
  mensagem: '',
  privacy: false,
};

function buildPayload(formData) {
  return {
    _type: 'contacto',
    nome: formData.nome,
    email: formData.email,
    telefone: formData.telefone,
    assunto: formData.assunto,
    urgencia: formData.urgencia,
    mensagem: formData.urgencia === 'hoje'
      ? `URGENTE — apoio hoje\n${formData.mensagem}`
      : formData.mensagem,
    privacy: Boolean(formData.privacy),
  };
}

function Contacts() {
  const { t } = useTranslation();
  const privacyPath = useLocalizedPath('privacy');
  const contactsPath = useLocalizedPath('contacts');
  const pousadasPath = useLocalizedPath('pousadas');
  const [params] = useSearchParams();
  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    isSubmitting,
    honeypot,
    setHoneypot,
  } = useContactForm({
    initialData: INITIAL_DATA,
    buildPayload,
    successKey: 'contacts.form.successToast',
    errorKey: 'contacts.form.errorToast',
  });

  useEffect(() => {
    const assunto = params.get('assunto');
    if (assunto) {
      setFormData((prev) => ({ ...prev, assunto }));
    }
  }, [params, setFormData]);

  const whatsappUrl = whatsAppHref(t('contacts.form.whatsappMessage'));
  const needsToday = formData.urgencia === 'hoje';
  const wantsPousadas = formData.assunto === 'pousadas';

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": t('contacts.seoTitle'),
    "description": t('contacts.seoDescription'),
    "url": `https://www.kindnesscare.pt${contactsPath}`,
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Kindness & Care",
      "telephone": ["+351968844420", "+351933929761"],
      "email": "geral@kindnesscare.pt",
      "areaServed": ["Braga", "Porto", "Viana do Castelo"]
    }
  };

  return (
    <div className="contacts-page">
      <MetaTags
        title={t('contacts.seoTitle')}
        description={t('contacts.seoDescription')}
        url={contactsPath}
        schema={contactSchema}
      />

      <PageHero
        title={t('contacts.hero.title')}
        subtitle={t('contacts.hero.subtitle')}
      />

      <section className="page-section page-section-muted">
        <div className="page-shell contacts-layout">
          <div className="page-prose">
            <h2 className="page-block-title">{t('contacts.info.title')}</h2>
            <p>{t('contacts.info.description')}</p>
            <p className="contacts-response-time">{t('contacts.info.responseTime')}</p>

            <div className="contacts-direct">
              <p className="contacts-direct-label">{t('contacts.info.directTitle')}</p>
              <div className="contacts-direct-actions">
                <a className="btn-primary" href="tel:+351968844420">
                  {t('contacts.info.callButton')}
                </a>
                <a
                  className="btn-secondary contacts-whatsapp-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('contacts.info.whatsappButton')}
                </a>
              </div>
            </div>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92V19.92C22 20.52 21.53 21 20.94 21C10.47 21 2 12.53 2 3.06C2 2.47 2.48 2 3.08 2H6.08C6.67 2 7.15 2.48 7.15 3.08C7.15 4.03 7.3 4.96 7.59 5.84C7.71 6.21 7.62 6.62 7.35 6.9L5.45 8.8C7.06 12.13 9.87 14.94 13.2 16.55L15.1 14.65C15.38 14.37 15.79 14.28 16.16 14.41C17.04 14.7 17.97 14.85 18.92 14.85C19.52 14.85 20 15.33 20 15.92Z" stroke="#094352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3>{t('contacts.methods.phone')}</h3>
                  <p><a href="tel:+351968844420">+351 968 844 420</a></p>
                  <p><a href="tel:+351933929761">+351 933 929 761</a></p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12.04 2C6.58 2 2.15 6.3 2.15 11.6c0 1.9.55 3.68 1.5 5.22L2 22l5.36-1.57c1.45.73 3.1 1.14 4.84 1.14h.01c5.46 0 9.89-4.3 9.89-9.6C22.1 6.3 17.5 2 12.04 2z" stroke="#094352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3>{t('contacts.methods.whatsapp')}</h3>
                  <p>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      {t('contacts.methods.whatsappText')}
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#094352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="#094352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3>{t('contacts.methods.email')}</h3>
                  <p><a href="mailto:geral@kindnesscare.pt">geral@kindnesscare.pt</a></p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#094352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#094352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3>{t('contacts.methods.area')}</h3>
                  <p>{t('contacts.methods.areaText')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contacts-form-panel">
            <h2 className="page-block-title">{t('contacts.form.title')}</h2>
            <form onSubmit={handleSubmit} className="page-form">
              <div className="honeypot-field" aria-hidden="true">
                <label htmlFor="empresa">{t('contacts.form.honeypot')}</label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="page-form-row">
                <div className="page-form-group">
                  <label htmlFor="nome">{t('contacts.form.nameLabel')} *</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    autoComplete="name"
                    placeholder={t('contacts.form.namePlaceholder')}
                  />
                </div>
                <div className="page-form-group">
                  <label htmlFor="email">{t('contacts.form.emailLabel')} *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    autoComplete="email"
                    placeholder={t('contacts.form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="page-form-row">
                <div className="page-form-group">
                  <label htmlFor="telefone">{t('contacts.form.phoneLabel')} *</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    aria-required="true"
                    aria-describedby="telefone-hint"
                    placeholder={t('contacts.form.phonePlaceholder')}
                  />
                  <p id="telefone-hint" className="form-hint">{t('contacts.form.phoneHint')}</p>
                </div>
                <div className="page-form-group">
                  <label htmlFor="assunto">{t('contacts.form.subjectLabel')} *</label>
                  <select
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    required
                    aria-required="true"
                  >
                    <option value="">{t('contacts.form.subjectPlaceholder')}</option>
                    <option value="apoio-domiciliario">{t('contacts.form.subjects.homeCare')}</option>
                    <option value="enfermagem">{t('contacts.form.subjects.nursing')}</option>
                    <option value="medicina">{t('contacts.form.subjects.medical')}</option>
                    <option value="cuidador">{t('contacts.form.subjects.caregiver')}</option>
                    <option value="pos-parto">{t('contacts.form.subjects.postpartum')}</option>
                    <option value="pousadas">{t('contacts.form.subjects.pousadas')}</option>
                    <option value="longevidade">{t('contacts.form.subjects.longevity')}</option>
                    <option value="academia">{t('contacts.form.subjects.academy')}</option>
                    <option value="outro">{t('contacts.form.subjects.other')}</option>
                  </select>
                </div>
              </div>

              <div className="page-form-group">
                <label htmlFor="urgencia">{t('contacts.form.urgencyLabel')}</label>
                <select id="urgencia" name="urgencia" value={formData.urgencia || ''} onChange={handleChange}>
                  <option value="">{t('contacts.form.urgencyInfo')}</option>
                  <option value="hoje">{t('contacts.form.urgencyToday')}</option>
                </select>
              </div>

              {needsToday ? (
                <div className="contacts-urgency-notice" role="status">
                  <p>{t('contacts.form.urgencyNotice')}</p>
                  <div className="contacts-direct-actions">
                    <a className="btn-primary" href="tel:+351968844420">
                      {t('contacts.info.callButton')}
                    </a>
                    <a
                      className="btn-secondary contacts-whatsapp-btn"
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('contacts.info.whatsappButton')}
                    </a>
                  </div>
                </div>
              ) : null}

              {wantsPousadas ? (
                <div className="contacts-urgency-notice" role="status">
                  <p>{t('contacts.form.pousadasNotice')}</p>
                  <div className="contacts-direct-actions">
                    <Link className="btn-primary" to={pousadasPath}>
                      {t('contacts.form.pousadasButton')}
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="page-form-group">
                    <label htmlFor="mensagem">{t('contacts.form.messageLabel')} *</label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      placeholder={t('contacts.form.messagePlaceholder')}
                      rows="6"
                    />
                  </div>

                  <label className="page-form-privacy" htmlFor="privacy">
                    <input
                      type="checkbox"
                      id="privacy"
                      name="privacy"
                      checked={Boolean(formData.privacy)}
                      onChange={handleChange}
                      required
                      aria-required="true"
                    />
                    <span>
                      {t('contacts.form.privacy')}{' '}
                      <Link to={privacyPath}>{t('footer.privacy')}</Link>
                    </span>
                  </label>

                  <div className="page-form-actions">
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? t('contacts.form.submittingButton') : t('contacts.form.submitButton')}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contacts;
