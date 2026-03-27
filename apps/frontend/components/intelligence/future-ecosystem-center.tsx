"use client";

import { useState, useTransition } from "react";
import { BrainCircuit, Rocket, ShieldCheck, Sparkles } from "lucide-react";

import type { FutureEcosystemReport, PersonalityMode } from "@naveencodes/ai";

import { getApiBaseUrl } from "../../lib/api";
import { AppButton } from "../ui/button";
import { SurfaceCard } from "../ui/card";
import { FieldShell, TextArea, TextInput } from "../ui/form-field";

const endpoint = getApiBaseUrl();

interface FutureEcosystemCenterProps {
  starterReport: FutureEcosystemReport;
}

export function FutureEcosystemCenter({ starterReport }: FutureEcosystemCenterProps) {
  const [url, setUrl] = useState("http://localhost:3001");
  const [startupPrompt, setStartupPrompt] = useState("build a startup");
  const [videoSource, setVideoSource] = useState("loom://product-demo");
  const [projects, setProjects] = useState("main site, client portal, autonomous workspace");
  const [regions, setRegions] = useState("India, Europe, North America");
  const [personalityMode, setPersonalityMode] = useState<PersonalityMode>("senior_dev");
  const [incidentSummary, setIncidentSummary] = useState("Stress-test the platform against failures, growth, and future product expansion.");
  const [report, setReport] = useState<FutureEcosystemReport>(starterReport);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const runAnalysis = () => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch(`${endpoint}/api/ai/future-ecosystem`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url,
            goal: "increase conversion",
            featureRequest: "add login system",
            issueSummary: "Use future intelligence to reduce risk before release.",
            cloneUrl: "https://example.com",
            clientCommand: "show me the strongest next actions",
            productPrompt: "give SaaS idea",
            incidentSummary,
            competitorUrl: "https://example-competitor.com",
            sitePurpose: "future AI ecosystem for growth, QA, and deployment",
            keywords: ["future AI", "growth engineering", "ecosystem automation"],
            startupPrompt,
            videoSource,
            projects: projects.split(",").map((item) => item.trim()).filter(Boolean),
            regions: regions.split(",").map((item) => item.trim()).filter(Boolean),
            personalityMode
          })
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = (await response.json()) as { report: FutureEcosystemReport };
        setReport(payload.report);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to load future ecosystem report");
      }
    });
  };

  return (
    <section className="space-y-4">
      <SurfaceCard
        title="Future AI ecosystem"
        description="Digital twins, predictive AI, chaos testing, app store logic, startup building, policy generation, CDN optimization, and cross-site intelligence."
      >
        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldShell label="Target URL">
              <TextInput value={url} onChange={(event) => setUrl(event.target.value)} />
            </FieldShell>
            <FieldShell label="Startup prompt">
              <TextInput value={startupPrompt} onChange={(event) => setStartupPrompt(event.target.value)} />
            </FieldShell>
            <FieldShell label="Video source">
              <TextInput value={videoSource} onChange={(event) => setVideoSource(event.target.value)} />
            </FieldShell>
            <FieldShell label="Personality mode">
              <select
                value={personalityMode}
                onChange={(event) => setPersonalityMode(event.target.value as PersonalityMode)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="beginner">Beginner</option>
                <option value="senior_dev">Senior Dev</option>
                <option value="strict_reviewer">Strict Reviewer</option>
              </select>
            </FieldShell>
            <div className="md:col-span-2">
              <FieldShell label="Projects">
                <TextInput value={projects} onChange={(event) => setProjects(event.target.value)} />
              </FieldShell>
            </div>
            <div className="md:col-span-2">
              <FieldShell label="Regions">
                <TextInput value={regions} onChange={(event) => setRegions(event.target.value)} />
              </FieldShell>
            </div>
            <div className="md:col-span-2">
              <FieldShell label="Incident or stress summary">
                <TextArea value={incidentSummary} onChange={(event) => setIncidentSummary(event.target.value)} />
              </FieldShell>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-fuchsia-300/20 bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300">Ecosystem output</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Status", value: report.ecosystem_status, detail: `${report.future_predictions.length} predictions`, icon: ShieldCheck },
                { label: "Experiments", value: String(report.experiments.length), detail: "digital twin and conversion lab", icon: Sparkles },
                { label: "Learning data", value: String(report.learning_data.memory_patterns), detail: "memory patterns retained", icon: BrainCircuit },
                { label: "Startup plan", value: report.startup_builder.idea, detail: "auto-builder ready", icon: Rocket }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-300">{item.label}</p>
                      <Icon className="size-4 text-fuchsia-300" />
                    </div>
                    <p className="mt-2 text-xl font-semibold">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <AppButton onClick={runAnalysis} disabled={isPending}>
                <Sparkles className="mr-2 size-4" />
                Run future ecosystem report
              </AppButton>
            </div>
            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SurfaceCard title="Required output" description="Prompt-level ecosystem output with predictions, improvements, experiments, learning data, and status.">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {report.future_predictions.map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {report.improvements.map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-white px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-900">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Digital twin and chaos lab" description="Safe experimentation, predictive risk, simulated behavior, and resilience testing.">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {report.experiments.map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {report.chaos_engine.chaosScenarios.map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-white px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-900">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Cross-site, collaboration, and knowledge" description="Transfer learnings across projects and turn them into documentation.">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {report.cross_site.transferSuggestions.map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {report.knowledge_base.documentation.concat(report.knowledge_base.guides).slice(0, 4).map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-white px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-900">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Policies, personality, CDN, and startup builder" description="Governance, delivery, communication style, and product creation from one ecosystem layer.">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {report.legal_policy.privacyPolicy.concat(report.cdn_optimizer.routing).slice(0, 4).map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-black/5 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-900">
              <p className="text-sm font-semibold">{report.startup_builder.idea}</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {report.startup_builder.marketingPlan.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Personality: {report.personality.activeMode}</p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </section>
  );
}
