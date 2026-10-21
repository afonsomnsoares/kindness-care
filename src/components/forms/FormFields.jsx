import React from 'react';
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
 * explícito). `text` é a tradução forms.consent, em que
 * <privacyLink>...</privacyLink> marca a ligação para a política de privacidade.
 */
export function PrivacyConsent({ checked, onChange, text, privacyPath }) {
  const [, before = text, linkText, after = ''] =
    text.match(/^(.*?)<privacyLink>(.*?)<\/privacyLink>(.*)$/s) ?? [];

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
        {before}
        {linkText && (
          <a href={privacyPath} target="_blank" rel="noopener noreferrer">{linkText}</a>
        )}
        {after}
      </label>
    </div>
  );
}
