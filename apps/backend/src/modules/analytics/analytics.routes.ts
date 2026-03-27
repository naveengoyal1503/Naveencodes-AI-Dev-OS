import type { FastifyInstance } from "fastify";

export async function registerAnalyticsRoutes(app: FastifyInstance) {
  app.get("/api/analytics/overview", async () => ({
    users: {
      total: 124,
      activeToday: 38,
      newThisWeek: 17
    },
    features: [
      { name: "QA scans", usage: 72 },
      { name: "SEO analyzer", usage: 61 },
      { name: "AI chat", usage: 44 },
      { name: "Client workspace", usage: 29 }
    ],
    projectPerformance: [
      { project: "NaveenCodes.com", performance: 91, seo: 94 },
      { project: "Client Commerce QA", performance: 84, seo: 88 },
      { project: "Docs Portal", performance: 93, seo: 90 }
    ]
  }));
}
