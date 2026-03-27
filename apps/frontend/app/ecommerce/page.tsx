import { AppShell } from "../../components/shell/app-shell";
import { SurfaceCard } from "../../components/ui/card";

export default function EcommercePage() {
  return (
    <AppShell>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard title="Ecommerce test center" description="Product flow, cart behavior, checkout health, and order logs.">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Product flow", "Healthy"],
              ["Cart test", "Healthy"],
              ["Checkout status", "Warning"],
              ["Order logs", "Stable"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-black/5 bg-slate-50 px-5 py-5 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Order and checkout logs" description="Most recent commerce workflow events.">
          <div className="space-y-3">
            {[
              "Product detail loaded with 200 response and valid inventory payload.",
              "Cart quantity mutation returned expected totals and discount state.",
              "Checkout payment intent exceeded latency threshold on staging.",
              "Order confirmation webhook matched expected schema and completed."
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
