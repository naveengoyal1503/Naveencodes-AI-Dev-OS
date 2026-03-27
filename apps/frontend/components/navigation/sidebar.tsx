"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ChartNoAxesColumn,
  FileBarChart2,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  MousePointerClick,
  ReceiptText,
  Search,
  Settings,
  ShieldUser,
  ShoppingCart
} from "lucide-react";

import { dashboardNavigation } from "@naveencodes/core";

const icons = {
  "/dashboard": LayoutDashboard,
  "/projects": FolderKanban,
  "/monitoring": Activity,
  "/seo": Search,
  "/performance": Gauge,
  "/ui-check": MousePointerClick,
  "/ecommerce": ShoppingCart,
  "/reports": FileBarChart2,
  "/client": ShieldUser,
  "/settings": Settings,
  "/explanation": ReceiptText
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full max-w-72 flex-col justify-between rounded-[2rem] border border-white/10 bg-slate-950/85 p-5 text-slate-100 shadow-2xl shadow-slate-950/30 backdrop-blur xl:sticky xl:top-6">
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
            <ChartNoAxesColumn className="size-3.5" />
            SaaS Control Plane
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight">NaveenCodes AI Dev OS</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Premium browser intelligence, client operations, and AI workflows from one enterprise workspace.
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {dashboardNavigation.map((item) => {
            const Icon = icons[item.href as keyof typeof icons] ?? LayoutDashboard;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                className={`block rounded-2xl border px-4 py-3 transition ${
                  active
                    ? "border-emerald-300/40 bg-emerald-300/15 text-white shadow-lg shadow-emerald-500/10"
                    : "border-white/5 bg-white/[0.03] text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-4" />
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">System objective</p>
        <p className="mt-2 leading-6">
          Run scans, monitor sites, trigger AI workflows, and manage multiple client properties from one interface.
        </p>
      </div>
    </aside>
  );
}
