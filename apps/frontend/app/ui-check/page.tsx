import { AppShell } from "../../components/shell/app-shell";
import { SurfaceCard } from "../../components/ui/card";

export default function UICheckPage() {
  return (
    <AppShell>
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SurfaceCard title="UI check" description="Layout issues, responsive mismatches, and visual bug reports across the active site.">
          <div className="space-y-3">
            {[
              "Tablet breakpoint wraps the command rail into two uneven rows.",
              "Footer newsletter block appears twice on the same route.",
              "Checkout summary column overflows on narrow laptop widths.",
              "A sticky header shadow clips at the top of Safari mobile."
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-950/40">
                {item}
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Responsive and visual bug reports" description="Impact-oriented view of UI defects.">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Responsive issues", "04", "Tablet hero alignment and mobile overflow remain the biggest risks."],
              ["Visual bugs", "03", "Duplicate footer section and clipped header shadow need layout cleanup."],
              ["Spacing issues", "05", "Gap consistency drops inside analytics cards and commerce summary areas."],
              ["Duplicate elements", "02", "Repeated subscribe block and duplicated badge group in footer."]
            ].map(([label, value, detail]) => (
              <div key={label} className="rounded-2xl border border-black/5 bg-slate-50 px-5 py-5 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{detail}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
