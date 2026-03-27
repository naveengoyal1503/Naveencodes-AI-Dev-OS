import type { FastifyInstance } from "fastify";

import { createQaAudit } from "@naveencodes/ai";

export async function registerDashboardRoutes(app: FastifyInstance) {
  app.get("/api/dashboard/overview", async () => {
    const audit = createQaAudit({
      url: app.config.QA_DEFAULT_TARGET_URL,
      loadTestUsers: app.config.QA_LOAD_TEST_USERS
    });

    return {
      metrics: {
        totalProjects: 12,
        activeScans: 4,
        errorsDetected: audit.errors.length,
        performanceScore: audit.performance.score,
        seoScore: audit.seo.score
      },
      performanceTrend: [
        { label: "Mon", performance: 82, seo: 88, errors: 9 },
        { label: "Tue", performance: 84, seo: 89, errors: 7 },
        { label: "Wed", performance: 86, seo: 91, errors: 6 },
        { label: "Thu", performance: 88, seo: 92, errors: 4 },
        { label: "Fri", performance: 91, seo: 94, errors: 3 }
      ],
      activityFeed: [
        { id: crypto.randomUUID(), title: "SEO analyzer completed for homepage", time: "6 min ago", type: "seo" },
        { id: crypto.randomUUID(), title: "Checkout flow retest finished successfully", time: "18 min ago", type: "qa" },
        { id: crypto.randomUUID(), title: "Performance score improved after image compression", time: "42 min ago", type: "performance" },
        { id: crypto.randomUUID(), title: "New staging project added to client workspace", time: "1 hr ago", type: "project" }
      ],
      alerts: audit.alerts
    };
  });

  app.get("/api/dashboard/monitoring", async () => ({
    console: [
      { id: crypto.randomUUID(), level: "warning", message: "Hydration mismatch prevented analytics widget render.", time: "12:05:22" },
      { id: crypto.randomUUID(), level: "info", message: "Navigation panel refreshed successfully.", time: "12:05:29" },
      { id: crypto.randomUUID(), level: "error", message: "Checkout telemetry request timed out after 1200ms.", time: "12:05:33" }
    ],
    network: [
      { id: crypto.randomUUID(), path: "/api/projects", status: 200, latencyMs: 182 },
      { id: crypto.randomUUID(), path: "/api/qa/run", status: 200, latencyMs: 328 },
      { id: crypto.randomUUID(), path: "/api/orders", status: 504, latencyMs: 1210 }
    ],
    performanceSeries: [
      { label: "09:00", requests: 42, lcp: 2.1 },
      { label: "10:00", requests: 58, lcp: 2.3 },
      { label: "11:00", requests: 64, lcp: 2.0 },
      { label: "12:00", requests: 78, lcp: 2.5 }
    ]
  }));

  app.get("/api/dashboard/ecommerce", async () => ({
    status: {
      productFlow: "healthy",
      cart: "healthy",
      checkout: "warning",
      orderLogs: "stable"
    },
    logs: [
      { id: crypto.randomUUID(), title: "Product detail loaded with 200 response", status: "passed" },
      { id: crypto.randomUUID(), title: "Cart quantity mutation returned valid payload", status: "passed" },
      { id: crypto.randomUUID(), title: "Checkout payment intent exceeded latency threshold", status: "warning" },
      { id: crypto.randomUUID(), title: "Order confirmation webhook matched expected schema", status: "passed" }
    ]
  }));
}
