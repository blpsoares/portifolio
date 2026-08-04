import React, { createContext, useContext, useState } from 'react';
import en from './en';
import pt from './pt';

export type Locale = 'en' | 'pt';

const translations = { en, pt } as const;

export type Translations = typeof en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: en,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locale');
      if (saved === 'en' || saved === 'pt') return saved;
      // No stored preference: honor the browser instead of assuming English.
      // Defaulting to 'en' meant a visitor with a pt-BR browser landed on the
      // English site, and the AI was then instructed to "always respond in
      // English" even when they wrote in Portuguese.
      const nav = navigator.language || (navigator.languages && navigator.languages[0]);
      if (nav && nav.toLowerCase().startsWith('pt')) return 'pt';
    }
    return 'en';
  });

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
