import { MetricAreaChart } from "../../components/charts/metric-area-chart";
import { MetricBarChart } from "../../components/charts/metric-bar-chart";
import { AppShell } from "../../components/shell/app-shell";
import { SurfaceCard } from "../../components/ui/card";

const performanceSeries = [
  { label: "09:00", primary: 42, secondary: 2.1 },
  { label: "10:00", primary: 58, secondary: 2.3 },
  { label: "11:00", primary: 64, secondary: 2.0 },
  { label: "12:00", primary: 78, secondary: 2.5 }
];

const requestSeries = [
  { label: "200", value: 84 },
  { label: "300", value: 14 },
  { label: "400", value: 9 },
  { label: "500", value: 3 }
];

const logs = [
  ["warning", "Hydration mismatch prevented analytics widget render."],
  ["info", "Navigation panel refreshed successfully."],
  ["error", "Checkout telemetry request timed out after 1200ms."],
  ["info", "Live monitor heartbeat confirmed MCP session health."]
];

export default function MonitoringPage() {
  return (
    <AppShell>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <SurfaceCard title="Live monitoring" description="Realtime logs, API calls, and request/performance visibility from the active site.">
          <MetricAreaChart data={performanceSeries} primaryLabel="Requests" secondaryLabel="LCP" />
        </SurfaceCard>
        <SurfaceCard title="Request mix" description="Current request distribution and error pressure.">
          <MetricBarChart data={requestSeries} color="#0ea5e9" />
        </SurfaceCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Console stream" description="Browser logs grouped as operators would see them in a live session.">
          <div className="space-y-3">
            {logs.map(([level, message]) => (
              <div key={message} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{level}</p>
                <p className="mt-2 text-sm leading-6">{message}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
        <SurfaceCard title="API calls" description="Important request telemetry for the active monitoring window.">
          <div className="space-y-3">
            {[
              ["/api/projects", "200", "182ms"],
              ["/api/qa/run", "200", "328ms"],
              ["/api/orders", "504", "1210ms"],
              ["/api/alerts", "200", "165ms"]
            ].map(([path, status, latency]) => (
              <div key={path} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{path}</p>
                  <span className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-semibold dark:border-white/10 dark:bg-slate-900">
                    {status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{latency}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
