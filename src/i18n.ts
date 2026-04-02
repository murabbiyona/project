import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationUZ from './locales/uz.json';
import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';

const resources = {
  uz: { translation: translationUZ },
  en: { translation: translationEN },
  ru: { translation: translationRU }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'uz',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
