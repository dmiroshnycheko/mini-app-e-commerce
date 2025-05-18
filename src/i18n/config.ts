import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en/translation.json';
import ruTranslation from './locales/ru/translation.json';
import ukTranslation from './locales/uk/translation.json';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ru: { translation: ruTranslation },
      uk: { translation: ukTranslation },
    },
    lng: "en", // Язык по умолчанию — английский
    fallbackLng: 'en', // Default to Ukrainian
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React handles XSS
    },
  });

export default i18next;