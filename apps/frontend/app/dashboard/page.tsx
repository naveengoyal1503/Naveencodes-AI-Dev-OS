import { ArrowUpRight, FolderKanban, Radar, ShieldAlert, Zap } from "lucide-react";

import { generateAdvancedIntelligenceReport } from "@naveencodes/ai";

import { MetricAreaChart } from "../../components/charts/metric-area-chart";
import { AdvancedIntelligenceCenter } from "../../components/intelligence/advanced-intelligence-center";
import { MetricBarChart } from "../../components/charts/metric-bar-chart";
import { AppShell } from "../../components/shell/app-shell";
import { SurfaceCard } from "../../components/ui/card";

const summary = [
  { label: "Total projects", value: "12", detail: "Multi-site portfolio under active management", icon: FolderKanban },
  { label: "Active scans", value: "04", detail: "Browser QA and SEO sweeps running now", icon: Radar },
  { label: "Errors detected", value: "09", detail: "Critical and warning issues tracked live", icon: ShieldAlert },
  { label: "Performance score", value: "91", detail: "Average quality score across active sites", icon: Zap }
];

const trendData = [
  { label: "Mon", primary: 82, secondary: 88 },
  { label: "Tue", primary: 84, secondary: 89 },
  { label: "Wed", primary: 86, secondary: 90 },
  { label: "Thu", primary: 89, secondary: 92 },
  { label: "Fri", primary: 91, secondary: 94 }
];

const errorData = [
  { label: "Console", value: 4 },
  { label: "API", value: 3 },
  { label: "UI", value: 5 },
  { label: "SEO", value: 2 }
];

const feed = [
  { title: "SEO analyzer resolved missing canonical issue on homepage", time: "6 min ago" },
  { title: "Checkout monitoring detected latency regression on staging", time: "18 min ago" },
  { title: "Client workspace switched active site to Docs Portal", time: "25 min ago" },
  { title: "Auto-fix engine generated patch plan for duplicate footer block", time: "43 min ago" }
];

export default function DashboardPage() {
  const starterReport = generateAdvancedIntelligenceReport({
    url: "http://localhost:3000",
    competitorUrl: "https://example-competitor.com",
    sitePurpose: "enterprise QA and AI SaaS platform",
    keywords: ["browser QA", "technical SEO", "performance engineering"]
  });

  return (
    <AppShell>
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.9rem] border border-black/5 bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-950/15 dark:border-white/10">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Dashboard overview</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Enterprise dashboard for browser QA, AI workflows, and client operations.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            The control plane now includes executive metrics, live quality trends, alerting, multi-project switching, AI chat workflow triggers, and specialized workspaces for SEO, performance, UI, ecommerce, and client management.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-emerald-100">AI chat panel</span>
            <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sky-100">Realtime monitoring</span>
            <span className="rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-2 text-fuchsia-100">Client workspace</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {summary.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-[1.5rem] border border-black/5 bg-white/90 p-5 shadow-lg shadow-slate-300/10 dark:border-white/10 dark:bg-slate-900/70"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  <Icon className="size-4 text-emerald-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard title="Quality trend" description="Performance and SEO movement across the active portfolio.">
          <MetricAreaChart data={trendData} primaryLabel="Performance" secondaryLabel="SEO" />
        </SurfaceCard>

        <SurfaceCard title="Error distribution" description="Which issue groups are currently driving intervention work.">
          <MetricBarChart data={errorData} color="#f97316" />
        </SurfaceCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SurfaceCard title="Activity feed" description="Recent automation events, operator actions, and workflow outcomes.">
          <div className="space-y-3">
            {feed.map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{item.time}</p>
                  </div>
                  <ArrowUpRight className="mt-1 size-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Workspace focus" description="Specialized panels available from the navigation.">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Live monitoring with logs and charts",
              "SEO analyzer with structured suggestions",
              "Performance diagnostics and optimization guidance",
              "UI check workspace for layout and responsive issues",
              "Ecommerce flow validation for cart and checkout",
              "Reports and client-facing history"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                {item}
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <div className="mt-4">
        <AdvancedIntelligenceCenter starterReport={starterReport} />
      </div>
    </AppShell>
  );
}
