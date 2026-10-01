import React, { useEffect, useMemo, useState } from 'react';
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from 'react-i18next';
import { MetaTags } from '../components/MetaTags';
import { Honeypot, PrivacyConsent } from '../components/FormFields';
import useContactForm from '../hooks/useContactForm';
import './Pousadas.css';

const INITIAL_DATA = {
  nome: '',
  morada: '',
  contactoTelefonico: '+351 ',
  pais: 'PT',
  email: '',
  pousada: '',
  dataInicio: '',
  dataFim: '',
  servicoSolicitado: '',
  consentimento: false
};

function buildPayload(formData) {
  return {
    _captcha: false,
    _subject: 'Pedido Pousadas de Portugal - ' + formData.nome,
    nome: formData.nome,
    email: formData.email,
    morada: formData.morada,
    pais: formData.pais,
    contacto: formData.contactoTelefonico,
    pousada: formData.pousada,
    check_in: formData.dataInicio,
    check_out: formData.dataFim,
    servico: formData.servicoSolicitado,
    consentimento: 'Aceitou a Política de Privacidade e o tratamento dos dados'
  };
}

// [código ISO do país, indicativo telefónico]. Os nomes dos países vêm do
// browser (Intl.DisplayNames), no idioma da página.
const COUNTRIES = [
  ['AF', '+93'], ['ZA', '+27'], ['AL', '+355'], ['DE', '+49'], ['AD', '+376'], ['AO', '+244'],
  ['AG', '+1-268'], ['SA', '+966'], ['DZ', '+213'], ['AR', '+54'], ['AM', '+374'], ['AU', '+61'],
  ['AT', '+43'], ['AZ', '+994'], ['BS', '+1-242'], ['BH', '+973'], ['BD', '+880'], ['BB', '+1-246'],
  ['BE', '+32'], ['BZ', '+501'], ['BJ', '+229'], ['BY', '+375'], ['BO', '+591'], ['BA', '+387'],
  ['BW', '+267'], ['BR', '+55'], ['BN', '+673'], ['BG', '+359'], ['BF', '+226'], ['BI', '+257'],
  ['BT', '+975'], ['CV', '+238'], ['CM', '+237'], ['KH', '+855'], ['CA', '+1'], ['QA', '+974'],
  ['KZ', '+7'], ['TD', '+235'], ['CL', '+56'], ['CN', '+86'], ['CY', '+357'], ['CO', '+57'],
  ['KM', '+269'], ['CD', '+243'], ['CG', '+242'], ['KP', '+850'], ['KR', '+82'], ['CR', '+506'],
  ['CI', '+225'], ['HR', '+385'], ['CU', '+53'], ['DK', '+45'], ['DM', '+1-767'], ['EG', '+20'],
  ['AE', '+971'], ['EC', '+593'], ['SK', '+421'], ['SI', '+386'], ['ES', '+34'], ['US', '+1'],
  ['EE', '+372'], ['SZ', '+268'], ['ET', '+251'], ['PH', '+63'], ['FI', '+358'], ['FR', '+33'],
  ['GA', '+241'], ['GM', '+220'], ['GH', '+233'], ['GE', '+995'], ['GR', '+30'], ['GD', '+1-473'],
  ['GT', '+502'], ['GN', '+224'], ['GW', '+245'], ['GQ', '+240'], ['GY', '+592'], ['HT', '+509'],
  ['HN', '+504'], ['HU', '+36'], ['IS', '+354'], ['IN', '+91'], ['ID', '+62'], ['IR', '+98'],
  ['IQ', '+964'], ['IE', '+353'], ['IL', '+972'], ['IT', '+39'], ['JP', '+81'], ['JO', '+962'],
  ['KE', '+254'], ['KW', '+965'], ['LA', '+856'], ['LV', '+371'], ['LB', '+961'], ['LR', '+231'],
  ['LY', '+218'], ['LT', '+370'], ['LU', '+352'], ['MG', '+261'], ['MY', '+60'], ['MW', '+265'],
  ['MV', '+960'], ['ML', '+223'], ['MT', '+356'], ['MA', '+212'], ['MU', '+230'], ['MR', '+222'],
  ['MX', '+52'], ['MZ', '+258'], ['MD', '+373'], ['MC', '+377'], ['MN', '+976'], ['ME', '+382'],
  ['NA', '+264'], ['NP', '+977'], ['NL', '+31'], ['NZ', '+64'], ['NG', '+234'], ['NO', '+47'],
  ['OM', '+968'], ['PK', '+92'], ['PA', '+507'], ['PY', '+595'], ['PE', '+51'], ['PL', '+48'],
  ['PT', '+351'], ['GB', '+44'], ['CZ', '+420'], ['RO', '+40'], ['RU', '+7'], ['RW', '+250'],
  ['SM', '+378'], ['ST', '+239'], ['SN', '+221'], ['RS', '+381'], ['SG', '+65'], ['SY', '+963'],
  ['SO', '+252'], ['LK', '+94'], ['SE', '+46'], ['CH', '+41'], ['TH', '+66'], ['TZ', '+255'],
  ['TL', '+670'], ['TG', '+228'], ['TT', '+1-868'], ['TN', '+216'], ['TR', '+90'], ['UA', '+380'],
  ['UG', '+256'], ['UY', '+598'], ['UZ', '+998'], ['VE', '+58'], ['VN', '+84'], ['ZM', '+260'],
  ['ZW', '+263'],
].map(([code, dialCode]) => ({ code, dialCode }));

/** Data de hoje (fuso horário local) no formato dos <input type="date">. */
function todayIso() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function countryNames(lang) {
  try {
    const names = new Intl.DisplayNames([lang], { type: 'region' });
    return (code) => names.of(code) || code;
  } catch {
    return (code) => code;
  }
}

function PousadasForm() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'pt';
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

  // A data de hoje e os nomes dos países dependem do browser (fuso horário,
  // versão do Intl). Só são calculados depois de a página arrancar, para o
  // HTML pré-renderizado no build ser igual ao primeiro render no browser.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const today = mounted ? todayIso() : undefined;

  const countryOptions = useMemo(() => {
    if (!mounted) return null;
    const nameOf = countryNames(lang);
    return COUNTRIES.map((country) => ({ ...country, name: nameOf(country.code) }))
      .sort((a, b) => a.name.localeCompare(b.name, lang));
  }, [mounted, lang]);

  const pousadasSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t('meta.pousadas.title'),
    "description": t('meta.pousadas.description'),
    "provider": {
      "@type": "LocalBusiness",
      "name": "Kindness & Care"
    },
    "serviceType": "Healthcare",
    "areaServed": [
      {"@type": "City", "name": "Viana do Castelo"},
      {"@type": "City", "name": "Guimarães"},
      {"@type": "City", "name": "Amares"}
    ]
  };

  const currentPais = COUNTRIES.find((p) => p.code === formData.pais);

  const handleCountryChange = (e) => {
    const pais = COUNTRIES.find((p) => p.code === e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      pais: pais.code,
      contactoTelefonico: pais.dialCode + ' '
    }));
  };

  // O número começa sempre pelo indicativo do país escolhido.
  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const { dialCode } = currentPais;
    const phoneNumber = value.startsWith(dialCode)
      ? value
      : dialCode + ' ' + value.replace(/^\+[\d-]*\s*/, '');

    setFormData((prevState) => ({
      ...prevState,
      contactoTelefonico: phoneNumber
    }));
  };

  return (
    <div className="pousadas-form-page">
      <MetaTags
        page="pousadas"
        schema={pousadasSchema}
      />
      {/* Hero Section */}
      <section className="pousadas-hero-section">
        <div className="pousadas-hero-background">
          <div className="pousadas-hero-overlay"></div>
        </div>

        <div className="pousadas-hero-content">
          <div className="pousadas-hero-text">
            <h1 className="pousadas-hero-title">{t('healthTourism.hero.title')}</h1>
            <p className="pousadas-hero-subtitle">
              {t('healthTourism.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pousadas-form-section">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="form-container">
              <h2 className="pousadas-form-title">{t('healthTourism.form.title')}</h2>
              <p className="form-subtitle">
                {t('healthTourism.form.subtitle')}
              </p>

              <form onSubmit={handleSubmit} className="pousadas-form">
                <Honeypot value={honeypot} onChange={setHoneypot} />

                {/* Nome */}
                <div className="pousadas-form-group">
                  <label htmlFor="nome" className="pousadas-form-label">
                    {t('healthTourism.form.name')}
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="pousadas-form-input"
                    required
                    aria-required="true"
                    autoComplete="name"
                    placeholder={t('healthTourism.form.namePlaceholder')}
                  />
                </div>

                {/* Morada */}
                <div className="pousadas-form-group">
                  <label htmlFor="morada" className="pousadas-form-label">
                    {t('healthTourism.form.address')}
                  </label>
                  <textarea
                    id="morada"
                    name="morada"
                    value={formData.morada}
                    onChange={handleChange}
                    className="pousadas-form-textarea"
                    required
                    aria-required="true"
                    autoComplete="street-address"
                    placeholder={t('healthTourism.form.addressPlaceholder')}
                    rows="3"
                  />
                </div>

                <div className="pousadas-form-row">
                  {/* Contacto telefónico, com o indicativo do país */}
                  <div className="pousadas-form-group">
                    <label htmlFor="contactoTelefonico" className="pousadas-form-label">
                      {t('healthTourism.form.phone')}
                    </label>
                    <div className="phone-input-with-dropdown">
                      <div className="phone-input-wrapper">
                        <div className="country-selector">
                          <ReactCountryFlag
                            countryCode={formData.pais}
                            svg
                            aria-hidden="true"
                            style={{
                              width: '20px',
                              height: '15px',
                              marginRight: '8px'
                            }}
                          />
                          <span className="dial-code">{currentPais.dialCode}</span>
                          <span className="country-arrow" aria-hidden="true">▼</span>
                          <select
                            className="country-select"
                            value={formData.pais}
                            onChange={handleCountryChange}
                            aria-label={t('healthTourism.form.country')}
                          >
                            {countryOptions ? (
                              countryOptions.map((pais) => (
                                <option key={pais.code} value={pais.code}>
                                  {pais.name} ({pais.dialCode})
                                </option>
                              ))
                            ) : (
                              <option value={formData.pais}>{currentPais.dialCode}</option>
                            )}
                          </select>
                        </div>
                        <input
                          type="tel"
                          id="contactoTelefonico"
                          name="contactoTelefonico"
                          value={formData.contactoTelefonico}
                          onChange={handlePhoneChange}
                          className="pousadas-form-input with-prefix"
                          required
                          aria-required="true"
                          autoComplete="tel"
                          placeholder={t('healthTourism.form.phonePlaceholder')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="pousadas-form-group">
                    <label htmlFor="email" className="pousadas-form-label">
                      {t('healthTourism.form.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pousadas-form-input"
                      required
                      aria-required="true"
                      autoComplete="email"
                      placeholder={t('healthTourism.form.emailPlaceholder')}
                    />
                  </div>
                </div>

                {/* Pousada */}
                <div className="pousadas-form-group">
                  <label htmlFor="pousada" className="pousadas-form-label">
                    {t('healthTourism.form.pousada')}
                  </label>
                  <select
                    id="pousada"
                    name="pousada"
                    value={formData.pousada}
                    onChange={handleChange}
                    className="pousadas-form-select"
                    required
                    aria-required="true"
                  >
                    <option value="">{t('healthTourism.form.pousadaPlaceholder')}</option>
                    <option value="Pousada de Viana do Castelo">Pousada de Viana do Castelo</option>
                    <option value="Pousada Mosteiro de Amares">Pousada Mosteiro de Amares</option>
                    <option value="Pousada Mosteiro de Guimarães">Pousada Mosteiro de Guimarães</option>
                    <option value="Pousada do Gerês">Pousada da Caniçada, Gerês</option>
                  </select>
                </div>

                {/* Duração da estadia: o check-in não pode ser no passado e o
                    check-out não pode ser antes do check-in. */}
                <div className="pousadas-form-row">
                  <div className="pousadas-form-group">
                    <label htmlFor="dataInicio" className="pousadas-form-label">
                      {t('healthTourism.form.checkIn')}
                    </label>
                    <input
                      type="date"
                      id="dataInicio"
                      name="dataInicio"
                      value={formData.dataInicio}
                      onChange={handleChange}
                      className="pousadas-form-input"
                      required
                      aria-required="true"
                      min={today}
                    />
                  </div>

                  <div className="pousadas-form-group">
                    <label htmlFor="dataFim" className="pousadas-form-label">
                      {t('healthTourism.form.checkOut')}
                    </label>
                    <input
                      type="date"
                      id="dataFim"
                      name="dataFim"
                      value={formData.dataFim}
                      onChange={handleChange}
                      className="pousadas-form-input"
                      required
                      aria-required="true"
                      min={formData.dataInicio || today}
                    />
                  </div>
                </div>

                {/* Serviço Solicitado */}
                <div className="pousadas-form-group">
                  <label htmlFor="servicoSolicitado" className="pousadas-form-label">
                    {t('healthTourism.form.service')}
                  </label>
                  <textarea
                    id="servicoSolicitado"
                    name="servicoSolicitado"
                    value={formData.servicoSolicitado}
                    onChange={handleChange}
                    className="pousadas-form-textarea"
                    required
                    aria-required="true"
                    placeholder={t('healthTourism.form.servicePlaceholder')}
                    rows="4"
                  />
                </div>

                <PrivacyConsent
                  checked={formData.consentimento}
                  onChange={handleChange}
                />

                {/* Submit Button */}
                <div className="pousadas-form-actions">
                  <button
                    type="submit"
                    className="pousadas-submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('healthTourism.form.submittingButton') : t('healthTourism.form.submitButton')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PousadasForm;
