import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// Load translation files
import fr from '../locales/messages/fr-Fr';
import en from '../locales/messages/en-US';

// Define the fallback language
const fallbackLanguage = { languageTag: 'en', isRTL: false };
// Check what the best supported language is based off of the device languages
// IMPORTANT: forced to fr for now, to restore: swap sides of ||
const defaultLanguage = RNLocalize.findBestAvailableLanguage(['fr', 'en']) || fallbackLanguage; // add language key here
console.log('defaultLanguage :>> ', defaultLanguage);
// Initialize the internationalization library
i18n.use(initReactI18next).init({
  lng: defaultLanguage.languageTag,
  resources: {
    fr: {
      translation: fr,
    },
    en: {
      translation: en,
    },
    // add languages here
  },
  nsSeparator: false,
  keySeparator: false,
  fallbackLng: false,
  // debug: true,
});

export default i18n;
