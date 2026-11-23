import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COUNTRY_DIAL_CODES, findCountryByCode } from '../data/countryDialCodes';
import './PhoneCountryInput.css';

function flagSrc(code) {
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

function PhoneCountryInput({
  id,
  name,
  value,
  countryCode,
  onCountryChange,
  onPhoneChange,
  placeholder,
  countryLabel,
  required = false,
}) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);
  const searchRef = useRef(null);

  const locale = i18n.language?.startsWith('en') ? 'en' : 'pt';
  const regionNames = useMemo(
    () => new Intl.DisplayNames([locale], { type: 'region' }),
    [locale]
  );

  const selected = findCountryByCode(countryCode) || findCountryByCode('PT');

  const countries = useMemo(() => {
    const items = COUNTRY_DIAL_CODES.map((country) => ({
      ...country,
      label: regionNames.of(country.code) || country.code,
    }));
    items.sort((a, b) => {
      if (a.code === 'PT') return -1;
      if (b.code === 'PT') return 1;
      return a.label.localeCompare(b.label, locale);
    });
    return items;
  }, [locale, regionNames]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (country) =>
        country.label.toLowerCase().includes(q)
        || country.dialCode.includes(q)
        || country.code.toLowerCase().includes(q)
    );
  }, [countries, query]);

  useEffect(() => {
    if (!open) return undefined;
    searchRef.current?.focus();
    const onPointer = (event) => {
      if (!(event.target instanceof Element) || !rootRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selectCountry = (country) => {
    onCountryChange(country);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="phone-country-input" ref={rootRef}>
      <div className="phone-country-controls">
        <button
          type="button"
          className="phone-country-trigger"
          aria-label={countryLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <img
            className="phone-country-flag"
            src={flagSrc(selected.code)}
            alt=""
            width="20"
            height="15"
            loading="lazy"
          />
          <span className="phone-country-dial">{selected.dialCode}</span>
          <span className="phone-country-chevron" aria-hidden="true" />
        </button>

        <input
          type="tel"
          id={id}
          name={name}
          value={value}
          onChange={onPhoneChange}
          autoComplete="tel"
          required={required}
          aria-required={required}
          placeholder={placeholder}
        />
      </div>

      {open ? (
        <div className="phone-country-menu" role="listbox" aria-label={countryLabel}>
          <input
            ref={searchRef}
            type="search"
            className="phone-country-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={countryLabel}
            aria-label={countryLabel}
          />
          <ul className="phone-country-list">
            {filtered.map((country) => (
              <li key={country.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={country.code === selected.code}
                  className={
                    country.code === selected.code
                      ? 'phone-country-option is-selected'
                      : 'phone-country-option'
                  }
                  onClick={() => selectCountry(country)}
                >
                  <img
                    className="phone-country-flag"
                    src={flagSrc(country.code)}
                    alt=""
                    width="20"
                    height="15"
                    loading="lazy"
                  />
                  <span className="phone-country-name">{country.label}</span>
                  <span className="phone-country-option-dial">{country.dialCode}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default PhoneCountryInput;
