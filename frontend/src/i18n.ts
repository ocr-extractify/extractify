import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en_texts } from "./i18n/en";
import { pt_texts } from "./i18n/pt";
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: en_texts
  },
  pt: {
    translation: pt_texts
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    supportedLngs: ['en', 'pt'],
    interpolation: {
      escapeValue: false // react already safes from xss
    }
});

export default i18n;