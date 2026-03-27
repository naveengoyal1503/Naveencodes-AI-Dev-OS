"use client";

import { useState, useTransition } from "react";
import { BrainCircuit, Layers3, Rocket, SearchCheck, ShieldCheck, WandSparkles } from "lucide-react";

import type { AdvancedIntelligenceReport } from "@naveencodes/ai";

import { AppButton } from "../ui/button";
import { SurfaceCard } from "../ui/card";
import { FieldShell, TextInput } from "../ui/form-field";

const endpoint = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface AdvancedIntelligenceCenterProps {
  starterReport: AdvancedIntelligenceReport;
}

export function AdvancedIntelligenceCenter({ starterReport }: AdvancedIntelligenceCenterProps) {
  const [url, setUrl] = useState("http://localhost:3000");
  const [competitorUrl, setCompetitorUrl] = useState("https://example-competitor.com");
  const [report, setReport] = useState<AdvancedIntelligenceReport>(starterReport);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const runAnalysis = () => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch(`${endpoint}/api/ai/intelligence`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url,
            competitorUrl,
            sitePurpose: "enterprise QA and AI SaaS platform",
            keywords: ["browser QA", "technical SEO", "performance engineering"]
          })
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = (await response.json()) as { report: AdvancedIntelligenceReport };
        setReport(payload.report);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to load intelligence report");
      }
    });
  };

  return (
    <section className="space-y-4">
      <SurfaceCard
        title="Advanced intelligence layer"
        description="Deep SEO, performance, UI, API, business, content, security, competitor, and senior-dev analysis from one AI engine bundle."
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <FieldShell label="Target URL">
              <TextInput value={url} onChange={(event) => setUrl(event.target.value)} />
            </FieldShell>
            <FieldShell label="Competitor URL">
              <TextInput value={competitorUrl} onChange={(event) => setCompetitorUrl(event.target.value)} />
            </FieldShell>
            <AppButton onClick={runAnalysis} disabled={isPending}>
              <BrainCircuit className="mr-2 size-4" />
              Run intelligence scan
            </AppButton>
            {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
          </div>

          <div className="rounded-[1.75rem] border border-emerald-300/20 bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Recommendations</p>
            <div className="mt-4 space-y-3">
              {report.recommendations.slice(0, 4).map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SurfaceCard title="Core engine output" description="Priority summaries from the strongest intelligence engines.">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "SEO score", value: String(report.seo.score), detail: report.seo.rankingPotential, icon: SearchCheck },
              { label: "Performance score", value: String(report.performance.score), detail: `${report.performance.bundleSizeKb}kb bundle`, icon: Rocket },
              { label: "Security posture", value: report.security.posture, detail: `${report.security.findings.length} findings`, icon: ShieldCheck },
              { label: "Self-learning", value: String(report.selfLearning.length), detail: "issue patterns remembered", icon: BrainCircuit }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-black/5 bg-slate-50 px-5 py-5 dark:border-white/10 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{item.label}</p>
                    <Icon className="size-4 text-emerald-500" />
                  </div>
                  <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Competitor and senior-dev mode" description="Strategic guidance beyond raw diagnostics.">
          <div className="space-y-4">
            <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Layers3 className="size-4 text-sky-500" />
                <p className="text-sm font-semibold">Beat strategy</p>
              </div>
              <div className="mt-3 space-y-2">
                {(report.competitor?.beatStrategy ?? ["Provide a competitor URL to enable comparison insights."]).map((item) => (
                  <div key={item} className="rounded-2xl border border-black/5 bg-white px-3 py-3 text-sm dark:border-white/10 dark:bg-slate-900">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
              <div className="flex items-center gap-2">
                <WandSparkles className="size-4 text-fuchsia-500" />
                <p className="text-sm font-semibold">Senior dev review</p>
              </div>
              <div className="mt-3 space-y-2">
                {report.seniorDev.patternRecommendations.map((item) => (
                  <div key={item} className="rounded-2xl border border-black/5 bg-white px-3 py-3 text-sm dark:border-white/10 dark:bg-slate-900">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <SurfaceCard title="Content and business intelligence" description="What to publish, how to position the site, and how to grow it.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              {report.content.articleIdeas.map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {report.business.monetizationOptions.map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Refactor and memory" description="Structural cleanup guidance and stored issue patterns.">
          <div className="space-y-4">
            <div className="space-y-2">
              {report.refactor.refactors.map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {report.selfLearning.map((item) => (
                <div key={item.memoryId} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
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
