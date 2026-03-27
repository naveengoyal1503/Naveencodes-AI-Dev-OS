"use client";

import { useEffect, useState, useTransition } from "react";

import { AppButton } from "../ui/button";
import { SurfaceCard } from "../ui/card";

const endpoint = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface BillingPlan {
  id: "free" | "pro" | "enterprise";
  name: string;
  priceMonthly: number;
  scans: number;
  projects: number;
}

export function BillingCenter() {
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [usage, setUsage] = useState<{ currentPlan: string; usage: { scansUsed: number; scansLimit: number; projectsUsed: number; projectsLimit: number } } | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch(`${endpoint}/api/billing/plans`).then((response) => response.json()).then((payload: { plans: BillingPlan[] }) => setPlans(payload.plans));
    fetch(`${endpoint}/api/billing/usage`).then((response) => response.json()).then((payload) => setUsage(payload));
  }, []);

  const checkout = (plan: BillingPlan["id"]) => {
    startTransition(async () => {
      const response = await fetch(`${endpoint}/api/billing/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ plan })
      });

      const payload = (await response.json()) as { checkoutUrl: string };
      setCheckoutUrl(payload.checkoutUrl);
    });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <SurfaceCard title="SaaS billing" description="Subscription plans, usage tracking, and payment gateway integration.">
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-5 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{plan.name}</p>
              <p className="mt-2 text-3xl font-semibold">${plan.priceMonthly}</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{plan.scans} scans / {plan.projects} projects</p>
              <AppButton onClick={() => checkout(plan.id)} disabled={isPending} className="mt-4 w-full justify-center" variant={plan.id === "pro" ? "primary" : "secondary"}>
                Choose {plan.name}
              </AppButton>
            </div>
          ))}
        </div>
      </SurfaceCard>
      <SurfaceCard title="Usage tracking" description="Current plan consumption and upgrade path.">
        {usage ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-sm font-semibold">Current plan: {usage.currentPlan}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Scans {usage.usage.scansUsed}/{usage.usage.scansLimit} | Projects {usage.usage.projectsUsed}/{usage.usage.projectsLimit}
              </p>
            </div>
            {checkoutUrl ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-sm text-emerald-700 dark:text-emerald-200">
                Checkout ready: {checkoutUrl}
              </div>
            ) : null}
          </div>
        ) : null}
      </SurfaceCard>
    </div>
  );
}
