import { ChartNoAxesColumn, Rocket, ShieldCheck, Sparkles } from "lucide-react";

import { generateFutureEcosystemReport } from "@naveencodes/ai";

import { FutureEcosystemCenter } from "../../components/intelligence/future-ecosystem-center";
import { AppShell } from "../../components/shell/app-shell";
import { SurfaceCard } from "../../components/ui/card";

export default function EcosystemPage() {
  const starterReport = generateFutureEcosystemReport({
    url: "http://localhost:3001",
    goal: "increase conversion",
    featureRequest: "add login system",
    issueSummary: "Use future intelligence to reduce risk before release.",
    cloneUrl: "https://example.com",
    clientCommand: "show me the strongest next actions",
    productPrompt: "give SaaS idea",
    incidentSummary: "Stress-test the platform against failures, growth, and future product expansion.",
    competitorUrl: "https://example-competitor.com",
    sitePurpose: "future AI ecosystem for growth, QA, and deployment",
    keywords: ["future AI", "growth engineering", "ecosystem automation"],
    startupPrompt: "build a startup",
    videoSource: "loom://product-demo",
    projects: ["main site", "client portal", "autonomous workspace"],
    regions: ["India", "Europe", "North America"],
    personalityMode: "senior_dev"
  });

  return (
    <AppShell>
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.9rem] border border-black/5 bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-950/15 dark:border-white/10">
          <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-300">Part 8 ecosystem layer</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Future AI ecosystem for experiments, resilience, policy, delivery, and startup creation.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            This workspace extends autonomous AI into digital twins, predictive modeling, chaos testing, collaboration, legal policy generation, CDN delivery, personality modes,
            and startup-building execution.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-2 text-fuchsia-100">Digital twin experiments</span>
            <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sky-100">Chaos and predictive AI</span>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-emerald-100">Startup builder</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Status", value: starterReport.ecosystem_status, detail: `${starterReport.future_predictions.length} future predictions`, icon: ShieldCheck },
            { label: "Experiments", value: String(starterReport.experiments.length), detail: "Twin, conversion, and chaos labs", icon: Sparkles },
            { label: "Projects", value: String(starterReport.learning_data.cross_site_projects), detail: "Cross-site intelligence inputs", icon: ChartNoAxesColumn },
            { label: "Startup", value: starterReport.startup_builder.idea, detail: "Auto-built business concept", icon: Rocket }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-[1.5rem] border border-black/5 bg-white/90 p-5 shadow-lg shadow-slate-300/10 dark:border-white/10 dark:bg-slate-900/70"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  <Icon className="size-4 text-fuchsia-500" />
                </div>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-4">
        <SurfaceCard title="Ecosystem objective" description="Part 8 output stays grounded in future predictions, improvements, experiments, learning data, and ecosystem status.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[...starterReport.future_predictions.slice(0, 2), ...starterReport.improvements.slice(0, 2)].map((item) => (
              <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                {item}
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <div className="mt-4">
        <FutureEcosystemCenter starterReport={starterReport} />
      </div>
    </AppShell>
  );
}
