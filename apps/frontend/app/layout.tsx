import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { getTranslationBundles } from "@naveencodes/ai";

import { LocaleProvider } from "../components/i18n/locale-provider";
import { ThemeProvider } from "../components/theme/theme-provider";
import { siteConfig } from "../lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description
};

export default function RootLayout({ children }: PropsWithChildren) {
  const bundles = getTranslationBundles();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LocaleProvider bundles={bundles}>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
