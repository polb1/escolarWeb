import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEs from './locales/es/common.json';
import commonCa from './locales/ca/common.json';

export type AppLanguage = 'es' | 'ca';

export const SUPPORTED_LANGUAGES: AppLanguage[] = ['es', 'ca'];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { common: commonEs },
      ca: { common: commonCa }
    },
    fallbackLng: 'es',
    supportedLngs: SUPPORTED_LANGUAGES,
    defaultNS: 'common',
    ns: ['common'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'estudiaweb.language',
      caches: ['localStorage']
    }
  });

export default i18n;
