"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getMessages,
  type Locale,
  type Messages,
} from "../../lib/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: <Key extends keyof Messages>(key: Key) => Messages[Key];
  supportedLocales: Locale[];
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  const value = useMemo<I18nContextValue>(() => {
    const messages = getMessages(locale);
    return {
      locale,
      setLocale,
      supportedLocales: SUPPORTED_LOCALES,
      t: (key) => messages[key],
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}

