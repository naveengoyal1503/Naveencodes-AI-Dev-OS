import { MetricBarChart } from "../../components/charts/metric-bar-chart";
import { AppShell } from "../../components/shell/app-shell";
import { SurfaceCard } from "../../components/ui/card";

const seoIssues = [
  "One image asset is missing alt text.",
  "Category page is missing an explicit canonical tag.",
  "Structured data is absent on one marketing subsection.",
  "Heading order drops from H2 to H4 in the docs template."
];

export default function SeoPage() {
  return (
    <AppShell>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard title="SEO analyzer" description="Score, meta diagnostics, heading issues, and remediation suggestions.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-slate-50 px-5 py-5 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">SEO score</p>
              <p className="mt-2 text-5xl font-semibold">94</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-slate-50 px-5 py-5 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Meta issues</p>
              <p className="mt-2 text-5xl font-semibold">03</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {seoIssues.map((issue) => (
              <div key={issue} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                {issue}
              </div>
            ))}
          </div>
        </SurfaceCard>
        <SurfaceCard title="SEO signals" description="Priority visibility by issue type.">
          <MetricBarChart
            data={[
              { label: "Meta", value: 3 },
              { label: "Headings", value: 2 },
              { label: "Schema", value: 1 },
              { label: "Alt", value: 1 }
            ]}
            color="#10b981"
          />
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
