import type { FastifyInstance } from "fastify";

import { createQaAudit } from "@naveencodes/ai";
import { createJsonReport, createQaAuditReport } from "@naveencodes/reports";

export async function registerReportRoutes(app: FastifyInstance) {
  const qaAudit = createQaAudit({
    url: app.config.QA_DEFAULT_TARGET_URL,
    loadTestUsers: app.config.QA_LOAD_TEST_USERS
  });

  app.get("/api/reports", async () => ({
    items: [
      createJsonReport({
        id: crypto.randomUUID(),
        projectId: "foundation",
        type: "foundation-status",
        summary: {
          health: "ready",
          packages: ["mcp", "ai", "core", "reports", "auth"]
        },
        errors: [],
        recommendations: ["Foundation and intelligence layers are ready for browser QA execution."]
      }),
      createQaAuditReport({
        id: crypto.randomUUID(),
        projectId: "qa-foundation",
        audit: {
          url: qaAudit.url,
          status: qaAudit.status,
          criticalErrors: qaAudit.errors.filter((issue) => issue.severity === "critical").length,
          warnings: qaAudit.errors.filter((issue) => issue.severity === "warning").length,
          apiIssues: qaAudit.api_issues.length,
          uiIssues: qaAudit.ui_issues.length,
          seoScore: qaAudit.seo.score,
          performanceScore: qaAudit.performance.score,
          fixesGenerated: qaAudit.fixes_applied.length
        },
        recommendations: [
          "Use /api/qa/run for live browser-oriented QA execution.",
          "Use /api/qa/autofix to generate file-level repair plans.",
          "Use /ws/monitor for realtime browser health streaming."
        ]
      })
    ]
  }));
}
