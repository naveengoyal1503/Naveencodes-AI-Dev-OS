"use client";

import { useState, useTransition } from "react";
import { BrainCircuit, Bug, GitBranch, ShieldCheck, Sparkles, Target } from "lucide-react";

import type { NextGenAutonomousReport } from "@naveencodes/ai";

import { AppButton } from "../ui/button";
import { SurfaceCard } from "../ui/card";
import { FieldShell, TextArea, TextInput } from "../ui/form-field";

const endpoint = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface NextGenAutonomousCenterProps {
  starterReport: NextGenAutonomousReport;
}

export function NextGenAutonomousCenter({ starterReport }: NextGenAutonomousCenterProps) {
  const [url, setUrl] = useState("http://localhost:3001");
  const [goal, setGoal] = useState("increase conversion");
  const [featureRequest, setFeatureRequest] = useState("add login system");
  const [issueSummary, setIssueSummary] = useState("Investigate the most important active regression and confirm the safest fix path.");
  const [cloneUrl, setCloneUrl] = useState("https://example.com");
  const [clientCommand, setClientCommand] = useState("show me the best next improvements");
  const [productPrompt, setProductPrompt] = useState("give SaaS idea");
  const [incidentSummary, setIncidentSummary] = useState("Production alert triggered after a route latency spike.");
  const [report, setReport] = useState<NextGenAutonomousReport>(starterReport);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const runAnalysis = () => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch(`${endpoint}/api/ai/next-gen`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url,
            goal,
            featureRequest,
            issueSummary,
            cloneUrl,
            clientCommand,
            productPrompt,
            incidentSummary,
            competitorUrl: "https://example-competitor.com",
            sitePurpose: "autonomous AI control plane for growth, QA, and deployment",
            keywords: ["autonomous QA", "growth engineering", "technical SEO"]
          })
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = (await response.json()) as { report: NextGenAutonomousReport };
        setReport(payload.report);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to load autonomous report");
      }
    });
  };

  return (
    <section className="space-y-4">
      <SurfaceCard
        title="Next-gen autonomous AI"
        description="Codebase understanding, bug reproduction, planning, health scoring, self-healing, strategy, and multi-role AI execution from one orchestrated report."
      >
        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldShell label="Target URL">
              <TextInput value={url} onChange={(event) => setUrl(event.target.value)} />
            </FieldShell>
            <FieldShell label="Goal">
              <TextInput value={goal} onChange={(event) => setGoal(event.target.value)} />
            </FieldShell>
            <FieldShell label="Feature request">
              <TextInput value={featureRequest} onChange={(event) => setFeatureRequest(event.target.value)} />
            </FieldShell>
            <FieldShell label="Clone URL">
              <TextInput value={cloneUrl} onChange={(event) => setCloneUrl(event.target.value)} />
            </FieldShell>
            <FieldShell label="Client command">
              <TextInput value={clientCommand} onChange={(event) => setClientCommand(event.target.value)} />
            </FieldShell>
            <FieldShell label="Product prompt">
              <TextInput value={productPrompt} onChange={(event) => setProductPrompt(event.target.value)} />
            </FieldShell>
            <div className="md:col-span-2">
              <FieldShell label="Issue summary">
                <TextArea value={issueSummary} onChange={(event) => setIssueSummary(event.target.value)} />
              </FieldShell>
            </div>
            <div className="md:col-span-2">
              <FieldShell label="Incident summary">
                <TextArea value={incidentSummary} onChange={(event) => setIncidentSummary(event.target.value)} />
              </FieldShell>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-sky-300/20 bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Autonomous output</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Health score", value: String(report.health_score), detail: report.predictions.releaseReadiness, icon: ShieldCheck },
                { label: "Issue count", value: String(report.issues.length), detail: "top cross-engine blockers", icon: Bug },
                { label: "Fix paths", value: String(report.fixes.length), detail: "validated next actions", icon: Sparkles },
                { label: "AI team", value: String(report.ai_team.length), detail: "simulated contributors", icon: BrainCircuit }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-300">{item.label}</p>
                      <Icon className="size-4 text-sky-300" />
                    </div>
                    <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <AppButton onClick={runAnalysis} disabled={isPending}>
                <BrainCircuit className="mr-2 size-4" />
                Run autonomous report
              </AppButton>
            </div>
            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SurfaceCard title="Top output" description="Prompt-required executive output with issues, suggestions, fixes, and predictions.">
          <div className="space-y-4">
            <div className="space-y-2">
              {report.issues.map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {report.suggestions.slice(0, 4).map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-white px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-900">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Predictions and health" description="Release, scaling, performance, and revenue outlook plus the score breakdown.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-sm font-semibold">Health breakdown</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>SEO: {report.global_health.breakdown.seo}</p>
                <p>Performance: {report.global_health.breakdown.performance}</p>
                <p>UI: {report.global_health.breakdown.ui}</p>
                <p>Security: {report.global_health.breakdown.security}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-sm font-semibold">Predictions</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>{report.predictions.performanceRisk}</p>
                <p>{report.predictions.scalingRisk}</p>
                <p>{report.predictions.revenueOpportunity}</p>
              </div>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Codebase and bug reproducer" description="Dependency mapping, impact analysis, and reproducible debugging output.">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {report.codebase.safeChangeSuggestions.map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-black/5 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-900">
              <p className="text-sm font-semibold">{report.bug_reproduction.bugTitle}</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {report.bug_reproduction.reproductionSteps.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Thinking and version control" description="Plan-first execution and git-aware safety guidance.">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {report.thinking.plan.map((item) => (
                <div key={item.title} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.action}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{item.validation}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-black/5 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <GitBranch className="size-4 text-emerald-500" />
                <p className="text-sm font-semibold">Branch strategy</p>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{report.version_control.branchStrategy}</p>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Goal, feature, and clone engines" description="Business intent, feature implementation, and improved rebuild planning.">
          <div className="space-y-4">
            <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-fuchsia-500" />
                <p className="text-sm font-semibold">{report.goal_execution.goal}</p>
              </div>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {report.goal_execution.actions.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {report.feature_generation.frontendChanges.slice(0, 2).concat(report.feature_generation.backendChanges.slice(0, 2)).map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-white px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-900">
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-black/5 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-900">
              <p className="text-sm font-semibold">Clone engine</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{report.clone_engine.sourceUrl}</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {report.clone_engine.improvements.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Devices, integrations, and self-healing" description="Operational readiness across devices, external systems, and incident response.">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {report.device_testing.map((item) => (
                <div key={`${item.device}-${item.network}`} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-sm font-semibold">{item.device}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.risk}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {report.integrations.sources.map((item) => (
                <div key={item.name} className="rounded-2xl border border-black/5 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-900">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{item.status}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.observation}</p>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Compliance and AI team" description="Privacy readiness and multi-role AI contribution modeling.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              {[...report.compliance.gdpr, ...report.compliance.cookies].slice(0, 4).map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {report.ai_team.map((item) => (
                <div key={item.role} className="rounded-2xl border border-black/5 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-900">
                  <p className="text-sm font-semibold">{item.role}</p>
                  <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    {item.contribution.map((contribution) => (
                      <p key={contribution}>{contribution}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Memory, client assistant, and product strategist" description="Persistent learning and business-level planning from the same AI system.">
          <div className="space-y-4">
            <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-sm font-semibold">Client assistant</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {report.client_assistant.guidance.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-900">
              <p className="text-sm font-semibold">{report.strategist.idea}</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {report.strategist.launchPlan.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {report.memory.storedPatterns.map((item) => (
                <div key={item.memoryId} className="rounded-2xl border border-black/5 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-900">
                  <p className="text-sm font-semibold">{item.issuePattern}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.previousFix}</p>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </div>
    </section>
  );
}
