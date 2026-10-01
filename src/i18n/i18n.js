import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationPT from './locales/pt/common.json';
import translationEN from './locales/en/common.json';

const resources = {
  pt: { translation: translationPT },
  en: { translation: translationEN },
};

// Uma instância por idioma. O idioma vem sempre do URL (ver langFromPath em
// routes.js e o I18nextProvider em src/root.jsx), e não do browser, para que
// a página pré-renderizada no build e a página no browser coincidam.
function createI18n(lng) {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en'],
    interpolation: {
      escapeValue: false,
    },
    // Os recursos estão todos em memória: inicializa de forma síncrona.
    initAsync: false,
  });
  return instance;
}

const instances = {
  pt: createI18n('pt'),
  en: createI18n('en'),
};

export function getI18n(lang) {
  return instances[lang] || instances.pt;
}
