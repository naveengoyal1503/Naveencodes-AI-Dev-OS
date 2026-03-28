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
import { createChromeDevtoolsConnection, type BrowserAuditArtifacts, type McpLoggerLike } from "@naveencodes/mcp";
import { createQaAuditReport } from "@naveencodes/reports";

import { writeRuntimeLog } from "../../infrastructure/runtime-log.js";

const qaRunSchema = z.object({
  url: z.string().url().optional()
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

function getProcessEnvRecord() {
  return Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
}

function buildConnection(app: FastifyInstance) {
  return createChromeDevtoolsConnection({
    browserUrl: app.config.MCP_BROWSER_URL,
    command: app.config.MCP_SERVER_COMMAND,
    args: app.config.MCP_SERVER_ARGS.split(",").filter(Boolean),
    chromeExecutablePath: app.config.CHROME_EXECUTABLE_PATH,
    remoteDebuggingPort: app.config.CHROME_REMOTE_DEBUGGING_PORT,
    headless: app.config.CHROME_HEADLESS,
    userDataDir: app.config.CHROME_USER_DATA_DIR,
    startupTimeoutMs: app.config.CHROME_STARTUP_TIMEOUT_MS,
    maxConcurrentSessions: app.config.QA_MAX_PARALLEL_SESSIONS,
    chromeArgs: app.config.CHROME_EXTRA_ARGS.split(",").filter(Boolean),
    env: getProcessEnvRecord()
  });
}

function buildLogger(app: FastifyInstance): McpLoggerLike {
  return {
    info: (payload, message) => app.log.info(payload, message),
    warn: (payload, message) => app.log.warn(payload, message),
    error: (payload, message) => app.log.error(payload, message),
    debug: (payload, message) => app.log.debug(payload, message)
  };
}

function convertArtifactsToAuditInput(artifacts: BrowserAuditArtifacts, loadTestUsers: number) {
  return {
    url: artifacts.finalUrl,
    consoleMessages: artifacts.consoleMessages.map((message) => message.details ?? message.summary),
    networkRequests: artifacts.networkRequests.map((request) => ({
      url: request.url,
      method: request.method,
      status: request.status,
      latencyMs: request.latencyMs,
      sizeKb: request.sizeKb,
      responsePreview: request.responsePreview
    })),
    dom: {
      title: artifacts.dom.title,
      metaDescription: artifacts.dom.metaDescription,
      canonical: artifacts.dom.canonical,
      h1Count: artifacts.dom.h1Count,
      headingOrderValid: artifacts.dom.headingOrderValid,
      missingAltCount: artifacts.dom.missingAltCount,
      layoutIssues: artifacts.dom.layoutIssues,
      duplicateElements: artifacts.dom.duplicateElements,
      missingSeoElements: artifacts.dom.missingSeoElements
    },
    images: artifacts.dom.images.map((image) => ({
      src: image.src,
      status: image.status,
      alt: image.alt
    })),
    performance: {
      lcpMs: artifacts.performance.lcpMs,
      cls: artifacts.performance.cls,
      ttfbMs: artifacts.performance.ttfbMs,
      totalRequests: artifacts.performance.totalRequests,
      renderBlockingResources: artifacts.performance.renderBlockingResources,
      largeAssets: artifacts.performance.largeAssets,
      score: artifacts.performance.score
    },
    loadTestUsers
  };
}

export async function registerQaRoutes(app: FastifyInstance) {
  app.get("/api/qa/presets", async () => {
    const connection = buildConnection(app);
    const health = await connection.getHealth(buildLogger(app));

    return {
      targetUrl: app.config.QA_DEFAULT_TARGET_URL,
      safeMode: app.config.QA_AUTO_FIX_SAFE_MODE,
      mcpSession: connection.createSession(app.config.QA_DEFAULT_TARGET_URL),
      mcpHealth: health,
      testSuites: createQATestSuites(app.config.QA_DEFAULT_TARGET_URL),
      liveMonitor: buildLiveMonitorMode(app.config.QA_DEFAULT_TARGET_URL)
    };
  });

  app.post("/api/qa/run", async (request, reply) => {
    const payload = qaRunSchema.parse(request.body);
    const targetUrl = payload.url ?? app.config.QA_DEFAULT_TARGET_URL;
    const connection = buildConnection(app);
    const logger = buildLogger(app);

    await writeRuntimeLog({
      type: "qa_run",
      message: "Browser QA run requested",
      context: { targetUrl }
    });

    try {
      const artifacts = await connection.collectAuditArtifacts(targetUrl, logger);
      const audit = createQaAudit(convertArtifactsToAuditInput(artifacts, app.config.QA_LOAD_TEST_USERS));

      await writeRuntimeLog({
        type: "mcp_call",
        message: "MCP audit completed",
        context: {
          targetUrl,
          sessionId: artifacts.session.id,
          toolCalls: artifacts.toolCalls
        }
      });

      return {
        audit,
        browser: {
          session: artifacts.session,
          finalUrl: artifacts.finalUrl,
          snapshotExcerpt: artifacts.dom.snapshotText.slice(0, 1200),
          consoleCount: artifacts.consoleMessages.length,
          requestCount: artifacts.networkRequests.length,
          toolCalls: artifacts.toolCalls
        },
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "QA browser runtime failed";
      app.log.error({ error, targetUrl }, "Real browser QA failed");

      await writeRuntimeLog({
        type: "error",
        message: "QA browser runtime failed",
        context: { targetUrl, error: message }
      });

      reply.code(503);
      return {
        error: "qa_runtime_unavailable",
        message,
        targetUrl
      };
    }
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
    const connection = buildConnection(app);

    return {
      monitor: buildLiveMonitorMode(query.url ?? app.config.QA_DEFAULT_TARGET_URL),
      mcpHealth: await connection.getHealth(buildLogger(app)),
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
