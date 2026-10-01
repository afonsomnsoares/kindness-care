import React, { useState, useRef, useEffect } from 'react';
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from 'react-i18next';
import { MetaTags } from '../components/MetaTags';
import useContactForm from '../hooks/useContactForm';
import './Health-Tourism.css';

const INITIAL_DATA = {
  nome: '',
  morada: '',
  contactoTelefonico: '+351 ',
  pais: 'PT',
  email: '',
  pousada: '',
  dataInicio: '',
  dataFim: '',
  servicoSolicitado: ''
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
    servico: formData.servicoSolicitado
  };
}

function PousadasForm() {
  const { t } = useTranslation();
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

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const pousadasSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Pousadas de Portugal - Serviço de Saúde",
    "description": "Solicite serviços de saúde e bem-estar durante sua estadia em Pousadas de Portugal. Enfermagem, reabilitação, assistência médica.",
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

  const paises = [
    { code: 'AF', name: 'Afeganistão', dialCode: '+93'},
  { code: 'ZA', name: 'África do Sul', dialCode: '+27' },
  { code: 'AL', name: 'Albânia', dialCode: '+355' },
  { code: 'DE', name: 'Alemanha', dialCode: '+49' },
  { code: 'AD', name: 'Andorra', dialCode: '+376' },
  { code: 'AO', name: 'Angola', dialCode: '+244' },
  { code: 'AG', name: 'Antígua e Barbuda', dialCode: '+1-268' },
  { code: 'SA', name: 'Arábia Saudita', dialCode: '+966' },
  { code: 'DZ', name: 'Argélia', dialCode: '+213' },
  { code: 'AR', name: 'Argentina', dialCode: '+54' },
  { code: 'AM', name: 'Arménia', dialCode: '+374' },
  { code: 'AU', name: 'Austrália', dialCode: '+61' },
  { code: 'AT', name: 'Áustria', dialCode: '+43' },
  { code: 'AZ', name: 'Azerbaijão', dialCode: '+994' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1-242' },
  { code: 'BH', name: 'Barém', dialCode: '+973' },
  { code: 'BD', name: 'Bangladeche', dialCode: '+880' },
  { code: 'BB', name: 'Barbados', dialCode: '+1-246' },
  { code: 'BE', name: 'Bélgica', dialCode: '+32' },
  { code: 'BZ', name: 'Belize', dialCode: '+501' },
  { code: 'BJ', name: 'Benim', dialCode: '+229' },
  { code: 'BY', name: 'Bielorrússia', dialCode: '+375' },
  { code: 'BO', name: 'Bolívia', dialCode: '+591' },
  { code: 'BA', name: 'Bósnia e Herzegovina', dialCode: '+387' },
  { code: 'BW', name: 'Botsuana', dialCode: '+267' },
  { code: 'BR', name: 'Brasil', dialCode: '+55' },
  { code: 'BN', name: 'Brunei', dialCode: '+673' },
  { code: 'BG', name: 'Bulgária', dialCode: '+359' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226' },
  { code: 'BI', name: 'Burundi', dialCode: '+257' },
  { code: 'BT', name: 'Butão', dialCode: '+975' },
  { code: 'CV', name: 'Cabo Verde', dialCode: '+238' },
  { code: 'CM', name: 'Camarões', dialCode: '+237' },
  { code: 'KH', name: 'Camboja', dialCode: '+855' },
  { code: 'CA', name: 'Canadá', dialCode: '+1' },
  { code: 'QA', name: 'Catar', dialCode: '+974' },
  { code: 'KZ', name: 'Cazaquistão', dialCode: '+7' },
  { code: 'TD', name: 'Chade', dialCode: '+235' },
  { code: 'CL', name: 'Chile', dialCode: '+56' },
  { code: 'CN', name: 'China', dialCode: '+86' },
  { code: 'CY', name: 'Chipre', dialCode: '+357' },
  { code: 'CO', name: 'Colômbia', dialCode: '+57' },
  { code: 'KM', name: 'Comores', dialCode: '+269' },
  { code: 'CD', name: 'Congo (R.D.)', dialCode: '+243' },
  { code: 'CG', name: 'Congo', dialCode: '+242' },
  { code: 'KP', name: 'Coreia do Norte', dialCode: '+850' },
  { code: 'KR', name: 'Coreia do Sul', dialCode: '+82' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506' },
  { code: 'CI', name: 'Costa do Marfim', dialCode: '+225' },
  { code: 'HR', name: 'Croácia', dialCode: '+385' },
  { code: 'CU', name: 'Cuba', dialCode: '+53' },
  { code: 'DK', name: 'Dinamarca', dialCode: '+45' },
  { code: 'DM', name: 'Dominica', dialCode: '+1-767' },
  { code: 'EG', name: 'Egito', dialCode: '+20' },
  { code: 'AE', name: 'Emirados Árabes Unidos', dialCode: '+971' },
  { code: 'EC', name: 'Equador', dialCode: '+593' },
  { code: 'SK', name: 'Eslováquia', dialCode: '+421' },
  { code: 'SI', name: 'Eslovénia', dialCode: '+386' },
  { code: 'ES', name: 'Espanha', dialCode: '+34' },
  { code: 'US', name: 'EUA', dialCode: '+1' },
  { code: 'EE', name: 'Estónia', dialCode: '+372' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268' },
  { code: 'ET', name: 'Etiópia', dialCode: '+251' },
  { code: 'PH', name: 'Filipinas', dialCode: '+63' },
  { code: 'FI', name: 'Finlândia', dialCode: '+358' },
  { code: 'FR', name: 'França', dialCode: '+33' },
  { code: 'GA', name: 'Gabão', dialCode: '+241' },
  { code: 'GM', name: 'Gâmbia', dialCode: '+220' },
  { code: 'GH', name: 'Gana', dialCode: '+233' },
  { code: 'GE', name: 'Geórgia', dialCode: '+995' },
  { code: 'GR', name: 'Grécia', dialCode: '+30' },
  { code: 'GD', name: 'Granada', dialCode: '+1-473' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502' },
  { code: 'GN', name: 'Guiné', dialCode: '+224' },
  { code: 'GW', name: 'Guiné-Bissau', dialCode: '+245' },
  { code: 'GQ', name: 'Guiné Equatorial', dialCode: '+240' },
  { code: 'GY', name: 'Guiana', dialCode: '+592' },
  { code: 'HT', name: 'Haiti', dialCode: '+509' },
  { code: 'HN', name: 'Honduras', dialCode: '+504' },
  { code: 'HU', name: 'Hungria', dialCode: '+36' },
  { code: 'IS', name: 'Islândia', dialCode: '+354' },
  { code: 'IN', name: 'Índia', dialCode: '+91' },
  { code: 'ID', name: 'Indonésia', dialCode: '+62' },
  { code: 'IR', name: 'Irão', dialCode: '+98' },
  { code: 'IQ', name: 'Iraque', dialCode: '+964' },
  { code: 'IE', name: 'Irlanda', dialCode: '+353' },
  { code: 'IL', name: 'Israel', dialCode: '+972' },
  { code: 'IT', name: 'Itália', dialCode: '+39' },
  { code: 'JP', name: 'Japão', dialCode: '+81' },
  { code: 'JO', name: 'Jordânia', dialCode: '+962' },
  { code: 'KE', name: 'Quénia', dialCode: '+254' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965' },
  { code: 'LA', name: 'Laos', dialCode: '+856' },
  { code: 'LV', name: 'Letónia', dialCode: '+371' },
  { code: 'LB', name: 'Líbano', dialCode: '+961' },
  { code: 'LR', name: 'Libéria', dialCode: '+231' },
  { code: 'LY', name: 'Líbia', dialCode: '+218' },
  { code: 'LT', name: 'Lituânia', dialCode: '+370' },
  { code: 'LU', name: 'Luxemburgo', dialCode: '+352' },
  { code: 'MG', name: 'Madagáscar', dialCode: '+261' },
  { code: 'MY', name: 'Malásia', dialCode: '+60' },
  { code: 'MW', name: 'Maláui', dialCode: '+265' },
  { code: 'MV', name: 'Maldivas', dialCode: '+960' },
  { code: 'ML', name: 'Mali', dialCode: '+223' },
  { code: 'MT', name: 'Malta', dialCode: '+356' },
  { code: 'MA', name: 'Marrocos', dialCode: '+212' },
  { code: 'MU', name: 'Maurícia', dialCode: '+230' },
  { code: 'MR', name: 'Mauritânia', dialCode: '+222' },
  { code: 'MX', name: 'México', dialCode: '+52' },
  { code: 'MZ', name: 'Moçambique', dialCode: '+258' },
  { code: 'MD', name: 'Moldávia', dialCode: '+373' },
  { code: 'MC', name: 'Mónaco', dialCode: '+377' },
  { code: 'MN', name: 'Mongólia', dialCode: '+976' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382' },
  { code: 'NA', name: 'Namíbia', dialCode: '+264' },
  { code: 'NP', name: 'Nepal', dialCode: '+977' },
  { code: 'NL', name: 'Holanda', dialCode: '+31' },
  { code: 'NZ', name: 'Nova Zelândia', dialCode: '+64' },
  { code: 'NG', name: 'Nigéria', dialCode: '+234' },
  { code: 'NO', name: 'Noruega', dialCode: '+47' },
  { code: 'OM', name: 'Omã', dialCode: '+968' },
  { code: 'PK', name: 'Paquistão', dialCode: '+92' },
  { code: 'PA', name: 'Panamá', dialCode: '+507' },
  { code: 'PY', name: 'Paraguai', dialCode: '+595' },
  { code: 'PE', name: 'Peru', dialCode: '+51' },
  { code: 'PL', name: 'Polónia', dialCode: '+48' },
  { code: 'PT', name: 'Portugal', dialCode: '+351' },
  { code: 'GB', name: 'Reino Unido', dialCode: '+44' },
  { code: 'CZ', name: 'República Checa', dialCode: '+420' },
  { code: 'RO', name: 'Roménia', dialCode: '+40' },
  { code: 'RU', name: 'Rússia', dialCode: '+7' },
  { code: 'RW', name: 'Ruanda', dialCode: '+250' },
  { code: 'SM', name: 'San Marino', dialCode: '+378' },
  { code: 'ST', name: 'São Tomé e Príncipe', dialCode: '+239' },
  { code: 'SN', name: 'Senegal', dialCode: '+221' },
  { code: 'RS', name: 'Sérvia', dialCode: '+381' },
  { code: 'SG', name: 'Singapura', dialCode: '+65' },
  { code: 'SY', name: 'Síria', dialCode: '+963' },
  { code: 'SO', name: 'Somália', dialCode: '+252' },
  { code: 'LK', name: 'Sri Lanca', dialCode: '+94' },
  { code: 'SE', name: 'Suécia', dialCode: '+46' },
  { code: 'CH', name: 'Suíça', dialCode: '+41' },
  { code: 'TH', name: 'Tailândia', dialCode: '+66' },
  { code: 'TZ', name: 'Tanzânia', dialCode: '+255' },
  { code: 'TL', name: 'Timor-Leste', dialCode: '+670' },
  { code: 'TG', name: 'Togo', dialCode: '+228' },
  { code: 'TT', name: 'Trindade e Tobago', dialCode: '+1-868' },
  { code: 'TN', name: 'Tunísia', dialCode: '+216' },
  { code: 'TR', name: 'Turquia', dialCode: '+90' },
  { code: 'UA', name: 'Ucrânia', dialCode: '+380' },
  { code: 'UG', name: 'Uganda', dialCode: '+256' },
  { code: 'UY', name: 'Uruguai', dialCode: '+598' },
  { code: 'UZ', name: 'Uzbequistão', dialCode: '+998' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58' },
  { code: 'VN', name: 'Vietname', dialCode: '+84' },
  { code: 'ZM', name: 'Zâmbia', dialCode: '+260' },
  { code: 'ZW', name: 'Zimbabué', dialCode: '+263' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (pais) => {
    setFormData(prevState => ({
      ...prevState,
      pais: pais.code,
      contactoTelefonico: pais.dialCode + ' '
    }));
    setShowCountryDropdown(false);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const currentPais = paises.find(p => p.code === formData.pais);
    const phoneNumber = value.startsWith(currentPais.dialCode)
      ? value
      : currentPais.dialCode + ' ' + value.replace(/^\+\d+\s/, '');

    setFormData(prevState => ({
      ...prevState,
      contactoTelefonico: phoneNumber
    }));
  };

  const currentPais = paises.find(p => p.code === formData.pais);

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
              <h2 className="form-title">{t('healthTourism.form.title')}</h2>
              <p className="form-subtitle">
                {t('healthTourism.form.subtitle')}
              </p>

              <form onSubmit={handleSubmit} className="pousadas-form">
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
                {/* Nome */}
                <div className="form-group">
                  <label htmlFor="nome" className="form-label">
                    Nome *
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
                    placeholder="Digite o seu nome completo"
                  />
                </div>

                {/* Morada */}
                <div className="form-group">
                  <label htmlFor="morada" className="form-label">
                    Morada *
                  </label>
                  <textarea
                    id="morada"
                    name="morada"
                    value={formData.morada}
                    onChange={handleChange}
                    className="form-textarea"
                    required
                    aria-required="true"
                    placeholder="Digite a sua morada completa"
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  {/* Contacto Telefónico com Dropdown Integrado */}
                  <div className="form-group">
                    <label htmlFor="contactoTelefonico" className="form-label">
                      Contacto Telefónico *
                    </label>
                    <div className="phone-input-with-dropdown" ref={dropdownRef}>
                      <div className="phone-input-wrapper">
                        <button
                          type="button"
                          className="country-selector"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          aria-haspopup="listbox"
                          aria-expanded={showCountryDropdown}
                          aria-label={`País: ${currentPais?.name || formData.pais}`}
                        >
                          <ReactCountryFlag
                            countryCode={formData.pais}
                            svg
                            style={{
                              width: '20px',
                              height: '15px',
                              marginRight: '8px'
                            }}
                          />
                          <span className="dial-code">{currentPais?.dialCode}</span>
                          <span className="dropdown-arrow">▼</span>
                        </button>
                        <input
                          type="tel"
                          id="contactoTelefonico"
                          name="contactoTelefonico"
                          value={formData.contactoTelefonico}
                          onChange={handlePhoneChange}
                          className="form-input with-prefix"
                          required
                          aria-required="true"
                          placeholder="XXX XXX XXX"
                        />
                      </div>

                      {/* Dropdown de Países */}
                      {showCountryDropdown && (
                        <div className="country-dropdown">
                          {paises.map(pais => (
                            <div
                              key={pais.code}
                              className={`country-option ${formData.pais === pais.code ? 'selected' : ''}`}
                              onClick={() => handleCountrySelect(pais)}
                            >
                              <ReactCountryFlag
                                countryCode={pais.code}
                                svg
                                style={{
                                  width: '16px',
                                  height: '12px',
                                  marginRight: '10px'
                                }}
                              />
                              <span className="country-name">{pais.name}</span>
                              <span className="country-dial-code">{pais.dialCode}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
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

                {/* Pousada */}
                <div className="form-group">
                  <label htmlFor="pousada" className="form-label">
                    Pousada onde ficará hospedado *
                  </label>
                  <select
                    id="pousada"
                    name="pousada"
                    value={formData.pousada}
                    onChange={handleChange}
                    className="form-select"
                    required
                    aria-required="true"
                  >
                    <option value="">Selecione uma pousada</option>
                    <option value="Pousada de Viana do Castelo">Pousada de Viana do Castelo</option>
                    <option value="Pousada Mosteiro de Amares">Pousada Mosteiro de Amares</option>
                    <option value="Pousada Mosteiro de Guimarães">Pousada Mosteiro de Guimarães</option>
                    <option value="Pousada do Gerês">Pousada da Caniçada, Gerês</option>
                  </select>
                </div>

                {/* Duração da Estadia */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dataInicio" className="form-label">
                      Data de Check-in *
                    </label>
                    <input
                      type="date"
                      id="dataInicio"
                      name="dataInicio"
                      value={formData.dataInicio}
                      onChange={handleChange}
                      className="form-input"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dataFim" className="form-label">
                      Data de Check-out *
                    </label>
                    <input
                      type="date"
                      id="dataFim"
                      name="dataFim"
                      value={formData.dataFim}
                      onChange={handleChange}
                      className="form-input"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                {/* Serviço Solicitado */}
                <div className="form-group">
                  <label htmlFor="servicoSolicitado" className="form-label">
                    Serviço solicitado *
                  </label>
                  <textarea
                    id="servicoSolicitado"
                    name="servicoSolicitado"
                    value={formData.servicoSolicitado}
                    onChange={handleChange}
                    className="form-textarea"
                    required
                    aria-required="true"
                    placeholder="Descreva o serviço que necessita"
                    rows="4"
                  />
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-button"
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