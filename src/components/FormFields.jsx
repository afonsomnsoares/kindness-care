import React from 'react';
import { Link } from 'react-router';
import { Trans } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import './FormFields.css';

/**
 * Campo-armadilha anti-spam (ver src/hooks/useAntiSpam.js): invisível para
 * as pessoas, mas preenchido pelos bots. O nome não se parece com nenhum
 * campo real ("empresa", "website", ...) para o preenchimento automático do
 * browser não o preencher e fazer perder mensagens verdadeiras.
 */
export function Honeypot({ value, onChange }) {
  return (
    <div className="form-honeypot" aria-hidden="true">
      <label htmlFor="kc-hp-field">Não preencha este campo</label>
      <input
        type="text"
        id="kc-hp-field"
        name="kc_hp_field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

/**
 * Consentimento obrigatório para o tratamento dos dados enviados (podem
 * incluir dados de saúde, que o RGPD só permite tratar com consentimento
 * explícito).
 */
export function PrivacyConsent({ checked, onChange }) {
  const privacyPath = useLocalizedPath('privacy');

  return (
    <div className="form-consent">
      <input
        type="checkbox"
        id="consentimento"
        name="consentimento"
        checked={checked}
        onChange={onChange}
        required
        aria-required="true"
      />
      <label htmlFor="consentimento">
        <Trans
          i18nKey="forms.consent"
          components={{
            privacyLink: <Link to={privacyPath} target="_blank" rel="noopener noreferrer" />,
          }}
        />
      </label>
    </div>
  );
}
