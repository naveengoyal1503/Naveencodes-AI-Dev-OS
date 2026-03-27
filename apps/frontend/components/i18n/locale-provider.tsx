"use client";

import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

import type { SupportedLocale, TranslationBundle } from "@naveencodes/ai";

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  bundles,
  children
}: PropsWithChildren<{ bundles: TranslationBundle[] }>) {
  const [locale, setLocale] = useState<SupportedLocale>("en");

  const value = useMemo<LocaleContextValue>(() => {
    const dictionary = bundles.find((bundle) => bundle.locale === locale)?.messages ?? {};
    return {
      locale,
      setLocale,
      t: (key: string) => dictionary[key] ?? key
    };
  }, [bundles, locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }
  return context;
}
