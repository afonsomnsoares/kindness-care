import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MetaTags } from '../components/MetaTags';
import PageHero from '../components/PageHero';
import useContactForm from '../hooks/useContactForm';
import PhoneCountryInput from '../components/PhoneCountryInput';
import { findCountryByCode } from '../data/countryDialCodes';
import { whatsAppHref } from '../utils/whatsapp';
import partnerImage from '../images/partner-pousadas-de-portugal.webp';
import './PousadasForm.css';

const INITIAL_DATA = {
  nome: '',
  contactoTelefonico: '+351 ',
  pais: 'PT',
  email: '',
  pousada: '',
  dataInicio: '',
  dataFim: '',
  servicoSolicitado: '',
  privacy: false,
};

function dayAfter(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return undefined;
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function buildPayload(formData) {
  return {
    _type: 'pousadas',
    nome: formData.nome,
    email: formData.email,
    pais: formData.pais,
    contacto: formData.contactoTelefonico,
    pousada: formData.pousada,
    check_in: formData.dataInicio,
    check_out: formData.dataFim,
    servico: formData.servicoSolicitado,
    mensagem: [
      'Pousadas de Portugal request',
      `Pousada: ${formData.pousada}`,
      `Service: ${formData.servicoSolicitado}`,
      `Check-in: ${formData.dataInicio}`,
      `Check-out: ${formData.dataFim}`,
      formData.pais ? `Country: ${formData.pais}` : null,
    ].filter(Boolean).join('\n'),
    privacy: Boolean(formData.privacy),
  };
}

function PousadasForm() {
  const { t } = useTranslation();
  const pousadasPath = useLocalizedPath('pousadas');
  const privacyPath = useLocalizedPath('privacy');
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
    successKey: 'healthTourism.form.successToast',
    errorKey: 'healthTourism.form.errorToast',
  });

  const whatsappUrl = whatsAppHref(t('healthTourism.form.whatsappMessage'));

  const pousadasSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t('healthTourism.seoTitle'),
    "description": t('healthTourism.seoDescription'),
    "provider": {
      "@type": "LocalBusiness",
      "name": "Kindness & Care",
      "url": "https://www.kindnesscare.pt"
    },
    "serviceType": t('healthTourism.seoTitle'),
    "areaServed": [
      {"@type": "City", "name": "Viana do Castelo"},
      {"@type": "City", "name": "Porto"},
      {"@type": "City", "name": "Santa Maria do Bouro"}
    ]
  };

  const handleCountryChange = (pais) => {
    setFormData((prev) => ({
      ...prev,
      pais: pais.code,
      contactoTelefonico: `${pais.dialCode} `,
    }));
  };

  const handlePhoneChange = (event) => {
    const value = event.target.value;
    const currentPais = findCountryByCode(formData.pais);
    if (!currentPais) {
      setFormData((prev) => ({ ...prev, contactoTelefonico: value }));
      return;
    }
    const dial = currentPais.dialCode;
    let rest = value;
    if (rest.startsWith(dial)) {
      rest = rest.slice(dial.length);
    } else if (rest.startsWith('+')) {
      rest = rest.replace(/^\+\S+\s*/, '');
    }
    setFormData((prev) => ({
      ...prev,
      contactoTelefonico: `${dial} ${rest.replace(/^\s+/, '')}`,
    }));
  };

  const validateBeforeSubmit = (form) => {
    const phone = form.elements.contactoTelefonico;
    const pais = findCountryByCode(formData.pais);
    const dialDigits = (pais?.dialCode || '').replace(/\D/g, '');
    const allDigits = String(formData.contactoTelefonico || '').replace(/\D/g, '');
    const national = allDigits.startsWith(dialDigits) ? allDigits.slice(dialDigits.length) : allDigits;
    if (phone) {
      phone.setCustomValidity(national.length >= 4 ? '' : t('healthTourism.form.phoneError'));
    }

    const checkout = form.elements.dataFim;
    if (checkout) {
      const datesOutOfOrder = formData.dataInicio && formData.dataFim && formData.dataFim <= formData.dataInicio;
      checkout.setCustomValidity(datesOutOfOrder ? t('healthTourism.form.dateError') : '');
    }
  };

  return (
    <div className="pousadas-form-page">
      <MetaTags
        title={t('healthTourism.seoTitle')}
        description={t('healthTourism.seoDescription')}
        url={pousadasPath}
        schema={pousadasSchema}
      />

      <PageHero
        title={t('healthTourism.hero.title')}
        subtitle={t('healthTourism.hero.subtitle')}
      />

      <section className="page-section page-section-muted pousadas-section">
        <div className="page-shell pousadas-layout">
          <aside className="pousadas-aside">
            <h2>{t('healthTourism.form.title')}</h2>
            <p>{t('healthTourism.form.subtitle')}</p>
            <p className="pousadas-story">{t('healthTourism.form.story')}</p>

            <figure className="pousadas-aside-media">
              <img
                src={partnerImage}
                alt={t('healthTourism.form.imageAlt')}
                loading="lazy"
              />
            </figure>

            <p className="pousadas-places-label">{t('healthTourism.form.placesLabel')}</p>
            <ul className="pousadas-places">
              <li>{t('healthTourism.form.pousadas.viana')}</li>
              <li>{t('healthTourism.form.pousadas.porto')}</li>
              <li>{t('healthTourism.form.pousadas.bouro')}</li>
            </ul>

            <div className="pousadas-direct">
              <p className="pousadas-direct-label">{t('healthTourism.form.directTitle')}</p>
              <div className="pousadas-direct-actions">
                <a className="btn-primary" href="tel:+351968844420">
                  {t('healthTourism.form.callButton')}
                </a>
                <a
                  className="btn-secondary pousadas-whatsapp-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('healthTourism.form.whatsappButton')}
                </a>
              </div>
            </div>
          </aside>

          <div className="form-container">
            <form
              onSubmit={(event) => {
                validateBeforeSubmit(event.currentTarget);
                if (!event.currentTarget.checkValidity()) {
                  event.preventDefault();
                  event.currentTarget.reportValidity();
                  return;
                }
                handleSubmit(event);
              }}
              className="pousadas-form page-form"
            >
              <div className="honeypot-field" aria-hidden="true">
                <label htmlFor="empresa">{t('healthTourism.form.honeypot')}</label>
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

              <div className="page-form-group">
                <label htmlFor="nome">{t('healthTourism.form.nameLabel')} *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  autoComplete="name"
                  placeholder={t('healthTourism.form.namePlaceholder')}
                />
              </div>

              <div className="page-form-row">
                <div className="page-form-group">
                  <label htmlFor="contactoTelefonico">{t('healthTourism.form.phoneLabel')} *</label>
                  <PhoneCountryInput
                    id="contactoTelefonico"
                    name="contactoTelefonico"
                    value={formData.contactoTelefonico}
                    countryCode={formData.pais}
                    onCountryChange={handleCountryChange}
                    onPhoneChange={handlePhoneChange}
                    placeholder={t('healthTourism.form.phonePlaceholder')}
                    countryLabel={t('healthTourism.form.countryLabel')}
                    required
                  />
                </div>

                <div className="page-form-group">
                  <label htmlFor="email">{t('healthTourism.form.emailLabel')} *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    autoComplete="email"
                    placeholder={t('healthTourism.form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="page-form-group">
                <label htmlFor="pousada">{t('healthTourism.form.pousadaLabel')} *</label>
                <select
                  id="pousada"
                  name="pousada"
                  value={formData.pousada}
                  onChange={handleChange}
                  required
                  aria-required="true"
                >
                  <option value="">{t('healthTourism.form.pousadaPlaceholder')}</option>
                  <option value={t('healthTourism.form.pousadas.viana')}>{t('healthTourism.form.pousadas.viana')}</option>
                  <option value={t('healthTourism.form.pousadas.porto')}>{t('healthTourism.form.pousadas.porto')}</option>
                  <option value={t('healthTourism.form.pousadas.bouro')}>{t('healthTourism.form.pousadas.bouro')}</option>
                </select>
              </div>

              <div className="page-form-row">
                <div className="page-form-group">
                  <label htmlFor="dataInicio">{t('healthTourism.form.checkInLabel')} *</label>
                  <input
                    type="date"
                    id="dataInicio"
                    name="dataInicio"
                    value={formData.dataInicio}
                    onChange={handleChange}
                    required
                    aria-required="true"
                  />
                </div>

                <div className="page-form-group">
                  <label htmlFor="dataFim">{t('healthTourism.form.checkOutLabel')} *</label>
                  <input
                    type="date"
                    id="dataFim"
                    name="dataFim"
                    value={formData.dataFim}
                    onChange={handleChange}
                    min={dayAfter(formData.dataInicio)}
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="page-form-group">
                <label htmlFor="servicoSolicitado">{t('healthTourism.form.serviceLabel')} *</label>
                <textarea
                  id="servicoSolicitado"
                  name="servicoSolicitado"
                  value={formData.servicoSolicitado}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  placeholder={t('healthTourism.form.servicePlaceholder')}
                  rows="4"
                />
              </div>

              <label className="page-form-privacy">
                <input
                  type="checkbox"
                  name="privacy"
                  checked={Boolean(formData.privacy)}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
                <span>
                  {t('healthTourism.form.privacyLabel')}{' '}
                  <Link to={privacyPath}>{t('healthTourism.form.privacyLink')}</Link>
                </span>
              </label>

              <div className="page-form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('healthTourism.form.submittingButton') : t('healthTourism.form.submitButton')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PousadasForm;
