import enTranslations from '../data/translations/en.json';
import arTranslations from '../data/translations/ar.json';

export const getTranslations = (language = 'en') => {
  return language === 'ar' ? arTranslations : enTranslations;
};