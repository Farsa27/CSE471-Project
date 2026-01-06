import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./translations/english.json";
import translationBN from "./translations/bangla.json";

const resources = {
  en: { translation: translationEN },
  bn: { translation: translationBN },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

