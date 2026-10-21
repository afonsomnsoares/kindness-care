import React, { useMemo } from 'react';
import { createT } from '../../i18n/translate';
import useContactForm from '../../hooks/useContactForm';
import { Honeypot, PrivacyConsent } from './FormFields';
import { ToastProvider } from './Toast';

const INITIAL_DATA = {
  nome: '',
  email: '',
  telefone: '',
  assunto: '',
  mensagem: '',
  consentimento: false
};

// Valores enviados no email (em PT, para a equipa); o texto visível vem das
// traduções em contacts.form.subjects.
const SUBJECTS = [
  { value: 'apoio-domiciliario', key: 'homeCare' },
  { value: 'enfermagem', key: 'nursing' },
  { value: 'medicina', key: 'medical' },
  { value: 'cuidador', key: 'caregiver' },
  { value: 'pos-parto', key: 'postpartum' },
  { value: 'pousadas', key: 'pousadas' },
  { value: 'outro', key: 'other' },
];

function buildPayload(formData) {
  return {
    _captcha: false,
    _subject: 'Novo Contacto Website - ' + formData.nome,
    nome: formData.nome,
    email: formData.email,
    telefone: formData.telefone || 'Não fornecido',
    assunto: formData.assunto,
    mensagem: formData.mensagem,
    consentimento: 'Aceitou a Política de Privacidade e o tratamento dos dados'
  };
}

/**
 * Formulário da página de Contactos (componente interativo: o resto da
 * página é HTML estático, em src/views/Contacts.astro). `messages` são as
 * traduções de que precisa (ver pickMessages em src/i18n/i18n.js).
 */
export default function ContactForm({ messages, privacyPath }) {
  const t = useMemo(() => createT(messages), [messages]);

  return (
    <ToastProvider closeLabel={t('common.close')}>
      <ContactFormFields t={t} privacyPath={privacyPath} />
    </ToastProvider>
  );
}

function ContactFormFields({ t, privacyPath }) {
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
    t,
  });

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nome" className="form-label">
            {t('contacts.form.name')}
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
            placeholder={t('contacts.form.namePlaceholder')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            {t('contacts.form.email')}
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
            placeholder={t('contacts.form.emailPlaceholder')}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="telefone" className="form-label">
            {t('contacts.form.phone')}
          </label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="form-input"
            placeholder={t('contacts.form.phonePlaceholder')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="assunto" className="form-label">
            {t('contacts.form.subject')}
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
            <option value="">{t('contacts.form.subjectPlaceholder')}</option>
            {SUBJECTS.map(({ value, key }) => (
              <option key={value} value={value}>
                {t(`contacts.form.subjects.${key}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="mensagem" className="form-label">
          {t('contacts.form.message')}
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          value={formData.mensagem}
          onChange={handleChange}
          className="form-textarea"
          required
          aria-required="true"
          placeholder={t('contacts.form.messagePlaceholder')}
          rows="6"
        />
      </div>

      <PrivacyConsent
        checked={formData.consentimento}
        onChange={handleChange}
        text={t('forms.consent')}
        privacyPath={privacyPath}
      />

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
  );
}
