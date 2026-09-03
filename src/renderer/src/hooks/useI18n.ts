import { useState, useCallback } from 'react';
import itTranslations from '../i18n/it.json';
import enTranslations from '../i18n/en.json';
import { Language } from '../types';

const translations: Record<Language, any> = {
  it: itTranslations,
  en: enTranslations,
};

export function useI18n(initialLang: Language = 'it') {
  const [lang, setLang] = useState<Language>(initialLang);

  const t = useCallback((keyPath: string): string => {
    const keys = keyPath.split('.');
    let current: any = translations[lang] || translations.it;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // fallback to Italian
        let fallback: any = translations.it;
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return keyPath;
          }
        }
        return typeof fallback === 'string' ? fallback : keyPath;
      }
    }

    return typeof current === 'string' ? current : keyPath;
  }, [lang]);

  return { lang, setLang, t };
}
