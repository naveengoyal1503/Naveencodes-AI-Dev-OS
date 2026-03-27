import { MetricAreaChart } from "../../components/charts/metric-area-chart";
import { AppShell } from "../../components/shell/app-shell";
import { SurfaceCard } from "../../components/ui/card";

const loadSeries = [
  { label: "Mon", primary: 2.6, secondary: 0.12 },
  { label: "Tue", primary: 2.3, secondary: 0.11 },
  { label: "Wed", primary: 2.2, secondary: 0.1 },
  { label: "Thu", primary: 2.1, secondary: 0.09 },
  { label: "Fri", primary: 2.0, secondary: 0.08 }
];

export default function PerformancePage() {
  return (
    <AppShell>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <SurfaceCard title="Performance diagnostics" description="Core web vitals, graph trends, and optimization guidance.">
          <MetricAreaChart data={loadSeries} primaryLabel="LCP" secondaryLabel="CLS" />
        </SurfaceCard>
        <SurfaceCard title="Vitals summary" description="Current production vitals for the active site.">
          <div className="grid gap-4">
            {[
              ["LCP", "2.0s"],
              ["CLS", "0.08"],
              ["TTFB", "420ms"],
              ["Render blocking", "2 resources"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-black/5 bg-slate-50 px-5 py-5 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
      <div className="mt-4">
        <SurfaceCard title="Optimization suggestions" description="Where the next gains are most likely to come from.">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              "Compress the hero image and move it behind a responsive source set.",
              "Defer a non-critical analytics widget until after interaction.",
              "Split one checkout dependency to reduce render-blocking pressure."
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                {item}
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
