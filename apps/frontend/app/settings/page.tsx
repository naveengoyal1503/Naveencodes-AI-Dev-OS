import { AppShell } from "../../components/shell/app-shell";
import { BillingCenter } from "../../components/ops/billing-center";
import { PluginMarketplace } from "../../components/ops/plugin-marketplace";
import { ApiAccessPanel } from "../../components/settings/api-access-panel";
import { SurfaceCard } from "../../components/ui/card";

const rows = [
  {
    title: "Profile",
    detail: "Workspace owner preferences, role mapping, and notification destinations."
  },
  {
    title: "API keys",
    detail: "OpenAI, MCP, analytics, and commerce integration secrets with rotation policies."
  },
  {
    title: "Integrations",
    detail: "Chrome DevTools MCP, webhooks, email delivery, and client reporting destinations."
  },
  {
    title: "Automation defaults",
    detail: "Safe mode, retest depth, preferred scan presets, and load-test concurrency rules."
  }
];

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard
          title="Settings"
          description="Profile controls, API key management, and integration preferences for enterprise operation."
          className="rounded-[1.75rem]"
        >
          <div className="space-y-3">
            {rows.map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Configuration posture" description="Current environment and operator readiness.">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Auth", "JWT login/register and workspace-aware client access"],
              ["MCP", "Chrome DevTools command path configured locally"],
              ["Alerts", "Critical issue and API failure alerts enabled"],
              ["Reports", "QA reports and automation history available"],
              ["Client mode", "Multi-site workspace and history views available"],
              ["AI workflows", "Natural-language chat commands mapped to workflows"]
            ].map(([label, detail]) => (
              <div key={label} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{detail}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </section>

      <div className="mt-4 space-y-4">
        <ApiAccessPanel />
        <BillingCenter />
        <PluginMarketplace />
        <SurfaceCard title="Production security" description="Rate limits, environment variables, and secret management posture.">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              "Global API rate limiting enabled in Fastify.",
              "Environment variables centralized in backend config parsing.",
              "Secret keys separated into .env and deployment provider settings."
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
