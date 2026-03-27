import type { FastifyInstance } from "fastify";
import { z } from "zod";

const checkoutSchema = z.object({
  plan: z.enum(["free", "pro", "enterprise"])
});

export async function registerBillingRoutes(app: FastifyInstance) {
  app.get("/api/billing/plans", async () => ({
    provider: app.config.PAYMENT_PROVIDER,
    plans: [
      { id: "free", name: "Free", priceMonthly: 0, scans: 10, projects: 1 },
      { id: "pro", name: "Pro", priceMonthly: 49, scans: 250, projects: 10 },
      { id: "enterprise", name: "Enterprise", priceMonthly: 199, scans: 2000, projects: 100 }
    ]
  }));

  app.get("/api/billing/usage", async () => ({
    currentPlan: "pro",
    usage: {
      scansUsed: 74,
      scansLimit: 250,
      projectsUsed: 4,
      projectsLimit: 10
    }
  }));

  app.post("/api/billing/checkout", async (request) => {
    const payload = checkoutSchema.parse(request.body);

    return {
      provider: app.config.PAYMENT_PROVIDER,
      plan: payload.plan,
      checkoutUrl: `https://checkout.example.com/${payload.plan}`,
      publicKey: app.config.STRIPE_PUBLIC_KEY
    };
  });
}
