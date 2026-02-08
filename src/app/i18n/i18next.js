import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, languages, defaultNS, cookieName } from '@i18n/settings';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(async (language, namespace) => {
      try {
        return await import(`@i18n/locales/${language}/${namespace}.json`);
      } catch {
        return {};
      }
    }),
  )
  .init({
    debug: false,
    supportedLngs: languages,
    fallbackLng,
    lng: undefined,
    fallbackNS: defaultNS,
    defaultNS,
    detection: {
      order: ['cookie', 'path'],
      lookupCookie: cookieName,
      cookieOptions: { path: '/', sameSite: 'strict' },
      caches: ['cookie'],
      checkWhitelist: true,
    },
    ns: [
      defaultNS,
      'admin',
      'dashboard-my-store',
      'dashboard',
      'error',
      'faqs',
      'header-json',
      'home',
      'meta',
      'next-auth',
      'payment',
      'reset-password',
      'store-categories',
      'store-item-categories',
      'store',
      'verify-email',
    ],
    preload: typeof window === 'undefined' ? languages : [],
    react: {
      useSuspense: true,
    },
  });

export default i18next;
