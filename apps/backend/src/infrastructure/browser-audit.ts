import type { FastifyInstance } from "fastify";

import { createQaAudit } from "@naveencodes/ai";
import { createChromeDevtoolsConnection, type BrowserAuditArtifacts } from "@naveencodes/mcp";

function getProcessEnvRecord() {
  return Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
}

export function createBrowserConnection(app: FastifyInstance) {
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

export function convertArtifactsToAuditInput(artifacts: BrowserAuditArtifacts, loadTestUsers: number) {
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

export function buildAuditSummary(targetUrl: string, artifacts: BrowserAuditArtifacts) {
  const audit = createQaAudit(convertArtifactsToAuditInput(artifacts, 25));

  return {
    audit,
    prompt: [
      `Target URL: ${targetUrl}`,
      `Final URL: ${artifacts.finalUrl}`,
      `Title: ${artifacts.dom.title ?? "n/a"}`,
      `Meta description: ${artifacts.dom.metaDescription ?? "n/a"}`,
      `Canonical: ${artifacts.dom.canonical ?? "n/a"}`,
      `Console messages: ${artifacts.consoleMessages.map((message) => message.details ?? message.summary).join(" | ") || "none"}`,
      `Network issues: ${artifacts.networkRequests
        .filter((request) => request.status >= 400)
        .map((request) => `${request.method} ${request.url} -> ${request.status}`)
        .join(" | ") || "none"}`,
      `Performance: score ${artifacts.performance.score}, LCP ${artifacts.performance.lcpMs}ms, CLS ${artifacts.performance.cls}, TTFB ${artifacts.performance.ttfbMs}ms`,
      `SEO gaps: ${audit.seo.missing.join(" | ") || "none"}`,
      `UI issues: ${audit.ui_issues.map((issue) => issue.details).join(" | ") || "none"}`
    ].join("\n")
  };
}
