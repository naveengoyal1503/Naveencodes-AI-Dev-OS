import type { FastifyInstance } from "fastify";
import { z } from "zod";

import {
  buildLiveMonitorMode,
  createQaAudit,
  createQATestSuites,
  generateAutoFixPlans,
  runLoadTestEngine,
  runRetestLoop,
  runSecurityScanner
} from "@naveencodes/ai";
import { createChromeDevtoolsConnection } from "@naveencodes/mcp";
import { createQaAuditReport } from "@naveencodes/reports";

const qaRunSchema = z.object({
  url: z.string().url().optional(),
  consoleMessages: z.array(z.string()).optional(),
  networkRequests: z
    .array(
      z.object({
        url: z.string(),
        method: z.string().default("GET"),
        status: z.number().int(),
        latencyMs: z.number(),
        sizeKb: z.number().optional(),
        responsePreview: z.string().optional()
      })
    )
    .optional(),
  dom: z
    .object({
      title: z.string().optional(),
      metaDescription: z.string().optional(),
      canonical: z.string().optional(),
      h1Count: z.number().optional(),
      headingOrderValid: z.boolean().optional(),
      missingAltCount: z.number().optional(),
      layoutIssues: z.array(z.string()).optional(),
      duplicateElements: z.array(z.string()).optional(),
      missingSeoElements: z.array(z.string()).optional()
    })
    .optional(),
  images: z
    .array(
      z.object({
        src: z.string(),
        status: z.enum(["ok", "broken", "missing-cdn"]),
        alt: z.string().optional()
      })
    )
    .optional(),
  performance: z
    .object({
      lcpMs: z.number().optional(),
      cls: z.number().optional(),
      ttfbMs: z.number().optional(),
      totalRequests: z.number().optional(),
      renderBlockingResources: z.number().optional(),
      largeAssets: z.number().optional(),
      score: z.number().optional()
    })
    .optional()
});

const autofixSchema = z.object({
  issues: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        severity: z.enum(["critical", "warning", "info"]),
        category: z.enum(["console", "javascript", "network", "ui", "visual", "seo", "image", "security", "session"]),
        details: z.string(),
        location: z.string().optional(),
        recommendation: z.string(),
        evidence: z.string().optional(),
        autoFixable: z.boolean()
      })
    )
    .optional(),
  report: z.any().optional()
});

const retestSchema = z.object({
  report: z.any(),
  maxPasses: z.number().int().min(1).max(5).optional()
});

const loadTestSchema = z.object({
  url: z.string().url().optional(),
  virtualUsers: z.number().int().min(1).max(500).optional()
});

const securitySchema = z.object({
  url: z.string().url().optional(),
  securitySurface: z
    .object({
      exposedEndpoints: z.array(z.string()).optional(),
      authRoutesProtected: z.boolean().optional(),
      inputValidation: z.boolean().optional(),
      suspiciousPatterns: z.array(z.string()).optional()
    })
    .optional()
});

export async function registerQaRoutes(app: FastifyInstance) {
  app.get("/api/qa/presets", async () => {
    const connection = createChromeDevtoolsConnection({
      browserUrl: app.config.MCP_BROWSER_URL,
      command: app.config.MCP_SERVER_COMMAND,
      args: app.config.MCP_SERVER_ARGS.split(",")
    });

    return {
      targetUrl: app.config.QA_DEFAULT_TARGET_URL,
      safeMode: app.config.QA_AUTO_FIX_SAFE_MODE,
      mcpSession: connection.createSession(app.config.QA_DEFAULT_TARGET_URL),
      testSuites: createQATestSuites(app.config.QA_DEFAULT_TARGET_URL),
      liveMonitor: buildLiveMonitorMode(app.config.QA_DEFAULT_TARGET_URL)
    };
  });

  app.post("/api/qa/run", async (request) => {
    const payload = qaRunSchema.parse(request.body);
    const targetUrl = payload.url ?? app.config.QA_DEFAULT_TARGET_URL;
    const audit = createQaAudit({
      ...payload,
      url: targetUrl,
      loadTestUsers: app.config.QA_LOAD_TEST_USERS
    });

    return {
      audit,
      report: createQaAuditReport({
        id: crypto.randomUUID(),
        projectId: "qa-runtime",
        audit: {
          url: audit.url,
          status: audit.status,
          criticalErrors: audit.errors.filter((issue) => issue.severity === "critical").length,
          warnings: audit.errors.filter((issue) => issue.severity === "warning").length,
          apiIssues: audit.api_issues.length,
          uiIssues: audit.ui_issues.length,
          seoScore: audit.seo.score,
          performanceScore: audit.performance.score,
          fixesGenerated: audit.fixes_applied.length
        }
      })
    };
  });

  app.post("/api/qa/autofix", async (request) => {
    const payload = autofixSchema.parse(request.body);
    const issues = payload.issues ?? payload.report?.errors ?? [];

    return {
      safeMode: app.config.QA_AUTO_FIX_SAFE_MODE,
      fixes: generateAutoFixPlans(issues)
    };
  });

  app.post("/api/qa/retest", async (request) => {
    const payload = retestSchema.parse(request.body);
    return {
      retest: runRetestLoop(payload.report, payload.maxPasses)
    };
  });

  app.get("/api/qa/live", async (request) => {
    const query = z.object({ url: z.string().url().optional() }).parse(request.query);

    return {
      monitor: buildLiveMonitorMode(query.url ?? app.config.QA_DEFAULT_TARGET_URL),
      websocket: "/ws/monitor"
    };
  });

  app.post("/api/qa/load-test", async (request) => {
    const payload = loadTestSchema.parse(request.body);
    return {
      loadTest: runLoadTestEngine(
        payload.url ?? app.config.QA_DEFAULT_TARGET_URL,
        payload.virtualUsers ?? app.config.QA_LOAD_TEST_USERS
      )
    };
  });

  app.post("/api/qa/security-scan", async (request) => {
    const payload = securitySchema.parse(request.body);
    return {
      findings: runSecurityScanner({
        url: payload.url ?? app.config.QA_DEFAULT_TARGET_URL,
        securitySurface: payload.securitySurface
      })
    };
  });
}
