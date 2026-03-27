import { BrainCircuit, GitBranch, ShieldCheck, Sparkles } from "lucide-react";

import { generateNextGenAutonomousReport } from "@naveencodes/ai";

import { NextGenAutonomousCenter } from "../../components/intelligence/next-gen-autonomous-center";
import { AppShell } from "../../components/shell/app-shell";
import { SurfaceCard } from "../../components/ui/card";

export default function AutonomousPage() {
  const starterReport = generateNextGenAutonomousReport({
    url: "http://localhost:3001",
    goal: "increase conversion",
    featureRequest: "add login system",
    issueSummary: "Investigate the most important regression and confirm the safest fix path.",
    cloneUrl: "https://example.com",
    clientCommand: "show me the best next improvements",
    productPrompt: "give SaaS idea",
    incidentSummary: "Production alert triggered after a route latency spike.",
    competitorUrl: "https://example-competitor.com",
    sitePurpose: "autonomous AI control plane for growth, QA, and deployment",
    keywords: ["autonomous QA", "growth engineering", "technical SEO"]
  });

  return (
    <AppShell>
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.9rem] border border-black/5 bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-950/15 dark:border-white/10">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Part 7 autonomous layer</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Next-gen AI workspace for planning, debugging, health scoring, and self-healing execution.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            This workspace combines codebase understanding, bug reproduction, AI thinking, version-control safety, device testing, compliance, client assistance,
            and product strategy into one operational report.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sky-100">Health score orchestration</span>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-emerald-100">Self-healing loops</span>
            <span className="rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-2 text-fuchsia-100">AI team simulation</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Health score", value: String(starterReport.health_score), detail: starterReport.predictions.releaseReadiness, icon: ShieldCheck },
            { label: "Fix candidates", value: String(starterReport.fixes.length), detail: "Auto bug and self-heal paths", icon: Sparkles },
            { label: "AI team roles", value: String(starterReport.ai_team.length), detail: "Developer, QA, SEO, Designer", icon: BrainCircuit },
            { label: "Git safety", value: String(starterReport.version_control.riskyCommits.length), detail: "Recent commits flagged for review", icon: GitBranch }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-[1.5rem] border border-black/5 bg-white/90 p-5 shadow-lg shadow-slate-300/10 dark:border-white/10 dark:bg-slate-900/70"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  <Icon className="size-4 text-sky-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-4">
        <SurfaceCard title="Autonomous mandate" description="Part 7 output stays grounded in health score, issues, suggestions, fixes, and predictions.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[starterReport.predictions.performanceRisk, starterReport.predictions.scalingRisk, starterReport.predictions.revenueOpportunity, starterReport.predictions.releaseReadiness].map(
              (item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              )
            )}
          </div>
        </SurfaceCard>
      </div>

      <div className="mt-4">
        <NextGenAutonomousCenter starterReport={starterReport} />
      </div>
    </AppShell>
  );
}
