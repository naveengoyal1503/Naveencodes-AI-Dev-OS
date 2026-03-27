"use client";

import type { PropsWithChildren } from "react";

import { AIChatPanel } from "../chat/ai-chat-panel";
import { ProjectSwitcher } from "../dashboard/project-switcher";
import { LanguageSwitcher } from "../i18n/language-switcher";
import { ThemeToggle } from "../theme/theme-toggle";
import { Sidebar } from "../navigation/sidebar";
import { useLocale } from "../i18n/locale-provider";

export function AppShell({ children }: PropsWithChildren) {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_34%),linear-gradient(180deg,_#f4f7fb_0%,_#edf2f9_44%,_#e2ecf8_100%)] px-4 py-4 text-slate-900 dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#0f172a_44%,_#111827_100%)] dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6 xl:flex-row">
        <Sidebar />

        <main className="flex-1 rounded-[2rem] border border-black/5 bg-white/75 p-6 shadow-2xl shadow-slate-400/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/55">
          <div className="mb-8 flex flex-col gap-4 border-b border-black/5 pb-6 dark:border-white/10 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">
                Enterprise Foundation
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t("dashboardTitle")}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                A production-ready control plane for projects, reports, AI services, and MCP-driven browser intelligence.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <ProjectSwitcher />
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {children}
        </main>
      </div>

      <AIChatPanel />
    </div>
  );
}
