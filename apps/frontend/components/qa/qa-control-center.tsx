"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { Activity, Bug, Gauge, Radar, RefreshCcw, ShieldCheck, Siren, Wrench } from "lucide-react";

import type { QaAlert, QaAuditResult, QaFixPlan, QaLoadTestResult, QaMonitorSession, QaSecurityFinding } from "@naveencodes/ai";

import { AppButton } from "../ui/button";
import { SurfaceCard } from "../ui/card";
import { FieldShell, TextInput } from "../ui/form-field";
import { Modal } from "../ui/modal";

const endpoint = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface QAControlCenterProps {
  starterAudit: QaAuditResult;
  starterMonitor: QaMonitorSession;
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${endpoint}${path}`);
  if (!response.ok) throw new Error(`Request failed with ${response.status}`);
  return response.json() as Promise<T>;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${endpoint}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error(`Request failed with ${response.status}`);
  return response.json() as Promise<T>;
}

function SummaryPill({ label, value, tone }: { label: string; value: string; tone: "emerald" | "amber" | "rose" | "sky" }) {
  const tones = {
    emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-700 dark:text-amber-200",
    rose: "border-rose-400/20 bg-rose-400/10 text-rose-700 dark:text-rose-200",
    sky: "border-sky-400/20 bg-sky-400/10 text-sky-700 dark:text-sky-200"
  };

  return (
    <div className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tones[tone]}`}>
      {label}: {value}
    </div>
  );
}

function FindingList<T extends { id: string; summary?: string; title?: string; recommendation?: string; severity?: string; details?: string }>({
  items,
  emptyText
}: {
  items: T[];
  emptyText: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">{emptyText}</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{item.title ?? item.summary}</p>
            {item.severity && (
              <span className="rounded-full border border-black/5 bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] dark:border-white/10 dark:bg-slate-900">
                {item.severity}
              </span>
            )}
          </div>
          {(item.details || item.recommendation) && (
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.details ?? item.recommendation}</p>
          )}
          {item.recommendation && item.details && (
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{item.recommendation}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function QAControlCenter({ starterAudit, starterMonitor }: QAControlCenterProps) {
  const [targetUrl, setTargetUrl] = useState(starterAudit.url);
  const [report, setReport] = useState<QaAuditResult>(starterAudit);
  const [fixes, setFixes] = useState<QaFixPlan[]>(starterAudit.fixes_applied);
  const [monitor, setMonitor] = useState<QaMonitorSession>(starterMonitor);
  const [loadTest, setLoadTest] = useState<QaLoadTestResult>(starterAudit.load_test);
  const [security, setSecurity] = useState<QaSecurityFinding[]>(starterAudit.security);
  const [alerts, setAlerts] = useState<QaAlert[]>(starterAudit.alerts);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [fixModalOpen, setFixModalOpen] = useState(false);
  const deferredTargetUrl = useDeferredValue(targetUrl);

  const runAudit = () => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await postJson<{ audit: QaAuditResult }>("/api/qa/run", { url: deferredTargetUrl });
        setReport(response.audit);
        setFixes(response.audit.fixes_applied);
        setLoadTest(response.audit.load_test);
        setSecurity(response.audit.security);
        setAlerts(response.audit.alerts);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to run QA audit");
      }
    });
  };

  const runAutoFix = () => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await postJson<{ fixes: QaFixPlan[] }>("/api/qa/autofix", { report });
        setFixes(response.fixes);
        setFixModalOpen(true);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to generate auto-fix plan");
      }
    });
  };

  const runRetest = () => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await postJson<{ retest: QaAuditResult["retest"] }>("/api/qa/retest", { report, maxPasses: 3 });
        setReport((current) => ({ ...current, retest: response.retest, status: response.retest.status }));
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to complete retest loop");
      }
    });
  };

  const loadMonitor = () => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await getJson<{ monitor: QaMonitorSession }>(`/api/qa/live?url=${encodeURIComponent(deferredTargetUrl)}`);
        setMonitor(response.monitor);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to load monitor configuration");
      }
    });
  };

  const runLoadTest = () => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await postJson<{ loadTest: QaLoadTestResult }>("/api/qa/load-test", {
          url: deferredTargetUrl,
          virtualUsers: 48
        });
        setLoadTest(response.loadTest);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to run load test");
      }
    });
  };

  const runSecurityScan = () => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await postJson<{ findings: QaSecurityFinding[] }>("/api/qa/security-scan", {
          url: deferredTargetUrl,
          securitySurface: {
            exposedEndpoints: ["/api/projects", "/api/reports"],
            authRoutesProtected: true,
            inputValidation: true,
            suspiciousPatterns: []
          }
        });
        setSecurity(response.findings);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to run security scan");
      }
    });
  };

  const criticalCount = report.errors.filter((item) => item.severity === "critical").length;
  const warningCount = report.errors.filter((item) => item.severity === "warning").length;

  return (
    <>
      <section className="space-y-4">
        <SurfaceCard
          title="Part 3 control center"
          description="Run MCP-backed QA sweeps, inspect browser issues, generate auto-fix plans, and keep a live monitor session ready for regressions."
          className="overflow-hidden"
        >
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <FieldShell label="Target URL" hint="Use the local project URL or any monitored environment.">
                <TextInput value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} />
              </FieldShell>

              <div className="flex flex-wrap gap-3">
                <AppButton onClick={runAudit} disabled={isPending}>
                  <Radar className="mr-2 size-4" />
                  Run QA sweep
                </AppButton>
                <AppButton variant="secondary" onClick={runAutoFix} disabled={isPending}>
                  <Wrench className="mr-2 size-4" />
                  Generate fixes
                </AppButton>
                <AppButton variant="ghost" onClick={runRetest} disabled={isPending}>
                  <RefreshCcw className="mr-2 size-4" />
                  Retest loop
                </AppButton>
              </div>

              <div className="flex flex-wrap gap-3">
                <AppButton variant="ghost" onClick={loadMonitor} disabled={isPending}>
                  <Activity className="mr-2 size-4" />
                  Load monitor
                </AppButton>
                <AppButton variant="ghost" onClick={runLoadTest} disabled={isPending}>
                  <Gauge className="mr-2 size-4" />
                  Load test
                </AppButton>
                <AppButton variant="ghost" onClick={runSecurityScan} disabled={isPending}>
                  <ShieldCheck className="mr-2 size-4" />
                  Security scan
                </AppButton>
              </div>

              {error && <p className="rounded-2xl border border-rose-300/40 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">{error}</p>}
            </div>

            <div className="rounded-[1.75rem] border border-emerald-300/20 bg-slate-950 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Live audit summary</p>
              <h3 className="mt-3 text-3xl font-semibold">{report.status.toUpperCase()}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Auto-fix mode is prepared with {fixes.length} generated plans and monitor heartbeats every {monitor.heartbeatMs}ms.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <SummaryPill label="Critical" value={String(criticalCount)} tone={criticalCount > 0 ? "rose" : "emerald"} />
                <SummaryPill label="Warnings" value={String(warningCount)} tone="amber" />
                <SummaryPill label="API issues" value={String(report.api_issues.length)} tone="sky" />
                <SummaryPill label="SEO" value={String(report.seo.score)} tone="emerald" />
              </div>
            </div>
          </div>
        </SurfaceCard>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <SurfaceCard title="Error tracker" description="Console, DOM, image, and browser-level failures grouped by severity.">
            <FindingList items={report.errors} emptyText="No browser issues detected." />
          </SurfaceCard>

          <div className="space-y-4">
            <SurfaceCard title="Performance engine" description="Core loading metrics, blocking resources, and heavy asset pressure.">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">LCP</p>
                  <p className="mt-2 text-2xl font-semibold">{report.performance.lcpMs}ms</p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">CLS</p>
                  <p className="mt-2 text-2xl font-semibold">{report.performance.cls}</p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">TTFB</p>
                  <p className="mt-2 text-2xl font-semibold">{report.performance.ttfbMs}ms</p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Score</p>
                  <p className="mt-2 text-2xl font-semibold">{report.performance.score}</p>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard title="SEO and session health" description="Meta coverage, heading validity, alt coverage, and user journey resilience.">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-sm font-semibold">SEO score: {report.seo.score}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    H1 count {report.seo.h1Count}, missing alt {report.seo.missingAltCount}, heading order {report.seo.headingOrderValid ? "valid" : "needs work"}.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-sm font-semibold">Session tracking</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Conversion risk is <span className="font-semibold">{report.session.conversionRisk}</span> with {report.session.dropPoints.length} detected drop points.
                  </p>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <SurfaceCard title="API and network analyzer" description="Failed routes, slow requests, and payload-risk hotspots.">
            <FindingList items={report.api_issues} emptyText="No API issues detected." />
          </SurfaceCard>

          <SurfaceCard title="Auto-fix engine" description="Generated patches, verification steps, and retest-ready recovery plans.">
            <div className="space-y-3">
              {fixes.map((fix) => (
                <div key={fix.id} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <div className="flex items-center gap-2">
                    <Wrench className="size-4 text-emerald-500" />
                    <p className="text-sm font-semibold">{fix.title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{fix.patchSummary}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{fix.affectedFiles.join(" | ")}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <SurfaceCard title="Live monitor mode" description="Channels and heartbeat configuration for realtime browser health streaming.">
            <div className="space-y-3">
              <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                <p className="font-semibold">{monitor.url}</p>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Heartbeat every {monitor.heartbeatMs}ms</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {monitor.channels.map((channel) => (
                  <span key={channel} className="rounded-full border border-black/5 bg-slate-50 px-3 py-1 text-xs dark:border-white/10 dark:bg-slate-950/40">
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard title="Load test engine" description="Concurrent pressure simulation and breaking-point visibility.">
            <div className="space-y-3 text-sm">
              <p className="font-semibold">{loadTest.virtualUsers} virtual users</p>
              <p className="text-slate-600 dark:text-slate-300">Average {loadTest.avgResponseTimeMs}ms, peak {loadTest.peakResponseTimeMs}ms, error rate {loadTest.errorRate}</p>
              <p className="text-slate-600 dark:text-slate-300">{loadTest.breakingPoint}</p>
            </div>
          </SurfaceCard>

          <SurfaceCard title="Security and alerts" description="Security scan findings and smart alert output for operator action.">
            <div className="space-y-4">
              <div className="space-y-3">
                {security.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-sky-500" />
                      <p className="text-sm font-semibold">{item.summary}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.recommendation}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                    <div className="flex items-center gap-2">
                      <Siren className="size-4 text-rose-500" />
                      <p className="text-sm font-semibold">{alert.message}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{alert.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </SurfaceCard>
        </div>

        <SurfaceCard title="QA test suites" description="Homepage, navigation, form, and load-readiness flows generated for browser execution.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {report.test_suites.map((suite) => (
              <div key={suite.id} className="rounded-[1.5rem] border border-black/5 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <Bug className="size-4 text-fuchsia-500" />
                  <p className="text-sm font-semibold">{suite.name}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{suite.description}</p>
                <ul className="mt-3 space-y-1 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  {suite.actions.map((action) => (
                    <li key={`${suite.id}-${action.label}`}>{action.type}: {action.label}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </section>

      <Modal open={fixModalOpen} title="Generated auto-fix plan" onClose={() => setFixModalOpen(false)}>
        <div className="space-y-4">
          {fixes.map((fix) => (
            <div key={fix.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-sm font-semibold text-white">{fix.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{fix.rootCause}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">{fix.affectedFiles.join(" | ")}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
