import i18next from 'i18next';
import translationPT from './locales/pt/common.json';
import translationEN from './locales/en/common.json';

const resources = {
  pt: { translation: translationPT },
  en: { translation: translationEN },
};

// Uma instância por idioma. As traduções só são usadas no build, para gerar
// o HTML de cada página: o idioma vem sempre do URL (ver langFromPath em
// routes.js), e o i18next não é enviado para o browser.
function createI18n(lng) {
  const instance = i18next.createInstance();
  instance.init({
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

/** Função de tradução de um idioma: getT('en')('nav.home'). */
export function getT(lang) {
  return getI18n(lang).getFixedT(lang);
}

/**
 * Só as traduções indicadas (ex.: ['contacts.form', 'forms']), para passar a
 * um componente interativo (React) sem enviar o ficheiro inteiro para o
 * browser. Ler com createT (src/i18n/translate.js).
 */
export function pickMessages(lang, keys) {
  const all = resources[lang]?.translation ?? resources.pt.translation;
  const picked = {};
  for (const key of keys) {
    const parts = key.split('.');
    let source = all;
    let target = picked;
    parts.forEach((part, i) => {
      source = source?.[part];
      if (i === parts.length - 1) {
        target[part] = source;
      } else {
        target = target[part] ??= {};
      }
    });
  }
  return picked;
}
