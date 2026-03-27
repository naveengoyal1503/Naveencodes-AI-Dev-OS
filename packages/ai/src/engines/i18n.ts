import type { SupportedLocale, TranslationBundle } from "./types";

const translations: Record<SupportedLocale, Record<string, string>> = {
  en: {
    dashboardTitle: "AI Command Center",
    buildProject: "Build project",
    designMode: "Design mode",
    output: "Generated blueprint"
  },
  hi: {
    dashboardTitle: "AI Command Center",
    buildProject: "Project banao",
    designMode: "Design mode",
    output: "Generated blueprint"
  },
  es: {
    dashboardTitle: "AI Command Center",
    buildProject: "Crear proyecto",
    designMode: "Modo de diseno",
    output: "Plano generado"
  }
};

export function getTranslationBundles(): TranslationBundle[] {
  return (Object.keys(translations) as SupportedLocale[]).map((locale) => ({
    locale,
    messages: translations[locale]
  }));
}
