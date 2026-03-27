import Link from "next/link";
import { ArrowRight, Bot, ChartColumn, ShieldCheck, Sparkles } from "lucide-react";

export function ExplanationPage() {
  const features = [
    "Browser-driven testing with Chrome DevTools MCP",
    "AI project generation and design-to-code workflows",
    "Realtime monitoring, alerts, and auto-fix planning",
    "Client workspace with multi-site management",
    "SEO, performance, UI, and ecommerce-focused diagnostics",
    "Executive dashboards, reports, and activity feeds"
  ];

  const steps = [
    "Connect sites and configure MCP browser access",
    "Run scans, monitor issues, and visualize quality metrics",
    "Trigger AI workflows from natural-language commands",
    "Review fixes, retest loops, and client-ready reports"
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_30%),linear-gradient(180deg,_#f8fbff_0%,_#eef4fb_45%,_#e0ebf9_100%)] px-4 py-6 text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.16),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[2rem] border border-black/5 bg-white/78 p-8 shadow-2xl shadow-slate-400/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/55">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-200">
                <Sparkles className="size-3.5" />
                NaveenCodes AI Dev OS
              </div>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
                Enterprise QA, AI automation, and client operations from one control plane.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
                NaveenCodes AI Dev OS is a premium SaaS workspace for running browser-driven tests, diagnosing SEO and performance issues, generating project structures, and operating multiple client sites through a single, AI-assisted dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                  Open dashboard
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/client" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-5 py-3 text-sm font-semibold dark:border-white/10 dark:bg-slate-950/60">
                  Open client workspace
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.75rem] border border-black/5 bg-slate-950 p-6 text-white dark:border-white/10">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Bot className="size-4" />
                  <p className="text-xs uppercase tracking-[0.18em]">How it works</p>
                </div>
                <div className="mt-4 space-y-3">
                  {steps.map((step, index) => (
                    <div key={step} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Step {index + 1}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-black/5 bg-white/78 p-6 shadow-lg shadow-slate-300/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/55">
            <ChartColumn className="size-5 text-sky-500" />
            <h2 className="mt-4 text-xl font-semibold">Why it is useful</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Teams get one place to see health metrics, investigate failures, prioritize fixes, and report outcomes without hopping between disconnected tools.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-black/5 bg-white/78 p-6 shadow-lg shadow-slate-300/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/55">
            <ShieldCheck className="size-5 text-emerald-500" />
            <h2 className="mt-4 text-xl font-semibold">Real-world use cases</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Audit ecommerce checkouts, monitor client sites, catch regressions before deploy, and surface performance or SEO risks before they hit revenue.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-black/5 bg-white/78 p-6 shadow-lg shadow-slate-300/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/55">
            <Sparkles className="size-5 text-fuchsia-500" />
            <h2 className="mt-4 text-xl font-semibold">How to use</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Add a site, run scans, inspect reports, and use the AI command panel to trigger targeted workflows like improving SEO or testing checkout.
            </p>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-black/5 bg-white/78 p-8 shadow-lg shadow-slate-300/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/55">
          <h2 className="text-3xl font-semibold">Features overview</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200">
                {feature}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
