"use client";

import type { SupportedLocale } from "@naveencodes/ai";

import { useLocale } from "./locale-provider";

const languageOptions: { code: SupportedLocale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "HI" },
  { code: "es", label: "ES" }
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="inline-flex items-center rounded-full border border-black/10 bg-white/80 p-1 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
      {languageOptions.map((language) => (
        <button
          key={language.code}
          type="button"
          onClick={() => setLocale(language.code)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.18em] transition ${
            locale === language.code
              ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
