import type { FastifyInstance } from "fastify";

export async function registerNotificationRoutes(app: FastifyInstance) {
  app.get("/api/notifications", async () => ({
    webhook: app.config.ALERT_WEBHOOK_URL,
    items: [
      { id: crypto.randomUUID(), severity: "critical", title: "Failed deployment on preview", channel: "webhook" },
      { id: crypto.randomUUID(), severity: "warning", title: "Checkout latency alert on staging", channel: "dashboard" },
      { id: crypto.randomUUID(), severity: "info", title: "Client report PDF generated", channel: "dashboard" }
    ]
  }));
}
