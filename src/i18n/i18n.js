import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationPT from './locales/pt/common.json';
import translationEN from './locales/en/common.json';
import pillarsPT from './locales/pt/pillars.json';
import pillarsEN from './locales/en/pillars.json';
import { languageFromPathname } from './language';

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: 'kcPath',
  lookup() {
    return languageFromPathname();
  },
});

const initialLanguage = languageFromPathname();

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: { ...translationPT, ...pillarsPT } },
      en: { translation: { ...translationEN, ...pillarsEN } },
    },
    lng: initialLanguage,
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en'],
    detection: {
      order: ['kcPath'],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;