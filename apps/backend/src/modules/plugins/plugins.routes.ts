import type { FastifyInstance } from "fastify";

export async function registerPluginRoutes(app: FastifyInstance) {
  app.get("/api/plugins", async () => ({
    items: [
      {
        id: "alerts-slack",
        name: "Slack Alerts",
        category: "notifications",
        status: "available",
        description: "Send deployment, error, and downtime alerts to Slack."
      },
      {
        id: "seo-export",
        name: "SEO Exporter",
        category: "reports",
        status: "installed",
        description: "Exports SEO findings into client-ready packages."
      },
      {
        id: "voice-pack",
        name: "Voice Command Pack",
        category: "interface",
        status: "available",
        description: "Adds browser voice commands for workflow execution."
      }
    ]
  }));
}
