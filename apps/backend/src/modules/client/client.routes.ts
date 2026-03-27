import type { FastifyInstance } from "fastify";

export async function registerClientRoutes(app: FastifyInstance) {
  app.get("/api/client/panel", async () => ({
    user: {
      name: "Workspace Owner",
      role: "admin",
      email: "owner@naveencodes.com"
    },
    multiSite: {
      totalSites: 3,
      activeSite: "NaveenCodes.com",
      switchesThisWeek: 9
    },
    history: [
      { id: crypto.randomUUID(), title: "Performance scan completed", date: "2026-03-27", status: "completed" },
      { id: crypto.randomUUID(), title: "SEO issue backlog exported", date: "2026-03-26", status: "completed" },
      { id: crypto.randomUUID(), title: "Client commerce staging connected", date: "2026-03-25", status: "completed" }
    ],
    alerts: [
      { id: crypto.randomUUID(), severity: "warning", message: "Checkout latency increased on staging." },
      { id: crypto.randomUUID(), severity: "info", message: "New client report is available for download." }
    ]
  }));
}
