import React from 'react';
import { useTranslation } from 'react-i18next';
import { MetaTags } from '../components/MetaTags';
import useContactForm from '../hooks/useContactForm';
import './Contacts.css';

const INITIAL_DATA = {
  nome: '',
  email: '',
  telefone: '',
  assunto: '',
  mensagem: ''
};

function buildPayload(formData) {
  return {
    _captcha: false,
    _subject: 'Novo Contacto Website - ' + formData.nome,
    nome: formData.nome,
    email: formData.email,
    telefone: formData.telefone || 'Não fornecido',
    assunto: formData.assunto,
    mensagem: formData.mensagem
  };
}

function Contacts() {
  const { t } = useTranslation();
  const {
    formData,
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

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contactos",
    "description": "Página de contactos da Kindness & Care",
    "organization": {
      "@type": "LocalBusiness",
      "name": "Kindness & Care",
      "telephone": "+351968844420",
      "email": "geral@kindnesscare.pt"
    }
  };

  return (
    <div className="contacts-page">
      <MetaTags
        page="contacts"
        schema={contactSchema}
      />
      {/* Hero Section */}
      <section className="contacts-hero-section">
        <div className="contacts-hero-background">
          <div className="contacts-hero-overlay"></div>
        </div>

        <div className="contacts-hero-content">
          <div className="contacts-hero-text">
            <h1 className="contacts-hero-title">{t('contacts.hero.title')}</h1>
            <p className="contacts-hero-subtitle">
              {t('contacts.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="contacts-content-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="contacts-grid">

              {/* Informações de Contacto */}
              <div className="contact-info">
                <h2 className="contact-info-title">{t('contacts.info.title')}</h2>
                <p className="contact-info-description">
                  {t('contacts.info.description')}
                </p>

                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="contact-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 16.92V19.92C22 20.52 21.53 21 20.94 21C10.47 21 2 12.53 2 3.06C2 2.47 2.48 2 3.08 2H6.08C6.67 2 7.15 2.48 7.15 3.08C7.15 4.03 7.3 4.96 7.59 5.84C7.71 6.21 7.62 6.62 7.35 6.9L5.45 8.8C7.06 12.13 9.87 14.94 13.2 16.55L15.1 14.65C15.38 14.37 15.79 14.28 16.16 14.41C17.04 14.7 17.97 14.85 18.92 14.85C19.52 14.85 20 15.33 20 15.92Z" stroke="#094352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="contact-details">
                      <h3>Telefone</h3>
                      <p>+351 968 844 420</p>
                    </div>
                  </div>

                  <div className="contact-method">
                    <div className="contact-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#094352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 6L12 13L2 6" stroke="#094352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="contact-details">
                      <h3>Email</h3>
                      <p>geral@kindnesscare.pt</p>
                    </div>
                  </div>

                  <div className="contact-method">
                    <div className="contact-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#094352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#094352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="contact-details">
                      <h3>Localização</h3>
                      <p>Braga | Guimarães | Viana do Castelo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulário de Contacto */}
              <div className="contact-form-container">
                <h2 className="form-title">{t('contacts.form.title')}</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                    <label htmlFor="empresa">Não preencha este campo</label>
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nome" className="form-label">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="form-input"
                        required
                        aria-required="true"
                        placeholder="O seu nome completo"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        required
                        aria-required="true"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="telefone" className="form-label">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="+351 XXX XXX XXX"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="assunto" className="form-label">
                        Assunto *
                      </label>
                      <select
                        id="assunto"
                        name="assunto"
                        value={formData.assunto}
                        onChange={handleChange}
                        className="form-select"
                        required
                        aria-required="true"
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="apoio-domiciliario">Apoio Domiciliário</option>
                        <option value="enfermagem">Enfermagem e Reabilitação</option>
                        <option value="medicina">Assistência Médica</option>
                        <option value="cuidador">Apoio ao Cuidador</option>
                        <option value="pos-parto">Apoio Pós-Parto</option>
                        <option value="pousadas">Pousadas de Portugal</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mensagem" className="form-label">
                      Mensagem *
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      className="form-textarea"
                      required
                      aria-required="true"
                      placeholder="Descreva como podemos ajudá-lo..."
                      rows="6"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('contacts.form.submittingButton') : t('contacts.form.submitButton')}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contacts;