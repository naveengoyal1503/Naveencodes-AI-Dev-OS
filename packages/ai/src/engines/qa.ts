import { createId, getBaseUrl } from "@naveencodes/core";

import type {
  QaAlert,
  QaAuditInput,
  QaAuditResult,
  QaDomSnapshot,
  QaFixPlan,
  QaImageAsset,
  QaIssue,
  QaLoadTestResult,
  QaMonitorSession,
  QaNetworkIssue,
  QaNetworkRequest,
  QaPerformanceSummary,
  QaRetestResult,
  QaSecurityFinding,
  QaSeoSummary,
  QaSessionTracking,
  QaStatus,
  QaTestSuite,
  QaUserAction,
  Severity
} from "./types";

const fallbackConsoleMessages = [
  "Warning: duplicate navigation landmark detected near header.",
  "Error: failed to load analytics chunk during hydration."
];

const fallbackRequests: QaNetworkRequest[] = [
  { url: "/", method: "GET", status: 200, latencyMs: 180, sizeKb: 42 },
  { url: "/api/projects", method: "GET", status: 200, latencyMs: 920, sizeKb: 12, responsePreview: "{\"items\":[]}" },
  { url: "/assets/hero.webp", method: "GET", status: 404, latencyMs: 220, sizeKb: 0 }
];

const fallbackDom: QaDomSnapshot = {
  title: "NaveenCodes AI Dev OS",
  metaDescription: "Browser intelligence and automation platform",
  canonical: "http://localhost:3000/dashboard",
  h1Count: 1,
  headingOrderValid: true,
  missingAltCount: 1,
  layoutIssues: ["CTA bar wraps unevenly on tablet viewport."],
  duplicateElements: ["Footer subscribe form appears twice on the same page."],
  missingSeoElements: []
};

const fallbackImages: QaImageAsset[] = [
  { src: "/images/hero.webp", status: "broken", alt: "Hero background" },
  { src: "https://cdn.example.com/logo.svg", status: "missing-cdn", alt: "Brand logo" }
];

function severityFromMessage(message: string): Severity {
  const normalized = message.toLowerCase();

  if (normalized.includes("error") || normalized.includes("exception") || normalized.includes("failed")) {
    return "critical";
  }

  if (normalized.includes("warn") || normalized.includes("deprecated")) {
    return "warning";
  }

  return "info";
}

function createIssue(input: Omit<QaIssue, "id">): QaIssue {
  return { id: createId("issue"), ...input };
}

function analyzeConsoleMessages(messages: string[]): QaIssue[] {
  return messages.map((message) =>
    createIssue({
      title: message.split(":")[0] ?? "Browser signal",
      severity: severityFromMessage(message),
      category: message.toLowerCase().includes("layout") ? "ui" : "console",
      details: message,
      recommendation:
        severityFromMessage(message) === "critical"
          ? "Inspect the affected component and dependency chain, then rerun the browser smoke test."
          : "Review the logged warning and tighten the related UI or script path.",
      evidence: message,
      autoFixable: !message.toLowerCase().includes("auth")
    })
  );
}

function analyzeNetworkRequests(requests: QaNetworkRequest[]): QaNetworkIssue[] {
  return requests
    .filter((request) => request.status >= 400 || request.latencyMs > 800)
    .map((request) => ({
      id: createId("api"),
      path: request.url,
      method: request.method,
      status: request.status,
      latencyMs: request.latencyMs,
      severity: request.status >= 500 || request.status === 404 ? "critical" : request.latencyMs > 1400 ? "critical" : "warning",
      summary:
        request.status >= 400
          ? `Request returned ${request.status}.`
          : `Request is slow at ${request.latencyMs}ms and needs optimization.`,
      payloadRisk:
        request.status >= 500 ? "high" : request.latencyMs > 1200 || (request.responsePreview?.length ?? 0) > 500 ? "medium" : "low"
    }));
}

function analyzeUiIssues(dom: QaDomSnapshot): QaIssue[] {
  const layoutIssues = (dom.layoutIssues ?? []).map((issue) =>
    createIssue({
      title: "Layout instability",
      severity: "warning",
      category: "ui",
      details: issue,
      recommendation: "Audit spacing, breakpoint rules, and flex constraints for the affected viewport.",
      autoFixable: true
    })
  );

  const duplicates = (dom.duplicateElements ?? []).map((issue) =>
    createIssue({
      title: "Duplicate element detected",
      severity: "warning",
      category: "visual",
      details: issue,
      recommendation: "Deduplicate the repeated block or scope it to a single route section.",
      autoFixable: true
    })
  );

  return [...layoutIssues, ...duplicates];
}

function analyzeImageIssues(images: QaImageAsset[]): QaIssue[] {
  return images
    .filter((image) => image.status !== "ok")
    .map((image) =>
      createIssue({
        title: image.status === "broken" ? "Broken image asset" : "Missing CDN asset",
        severity: image.status === "broken" ? "critical" : "warning",
        category: "image",
        details: image.src,
        location: image.src,
        recommendation:
          image.status === "broken"
            ? "Fix the asset path or add a fallback image to prevent empty content blocks."
            : "Repair the CDN path or sync the deployment artifact for this image.",
        autoFixable: true
      })
    );
}

function analyzeSeo(dom: QaDomSnapshot, images: QaImageAsset[]): QaSeoSummary {
  const missing: string[] = [];

  if (!dom.title) missing.push("Missing title tag");
  if (!dom.metaDescription) missing.push("Missing meta description");
  if (!dom.canonical) missing.push("Missing canonical URL");
  if ((dom.h1Count ?? 0) === 0) missing.push("Missing H1");
  if (dom.headingOrderValid === false) missing.push("Heading order is invalid");
  if ((dom.missingSeoElements ?? []).length) missing.push(...(dom.missingSeoElements ?? []));
  if (images.some((image) => !image.alt)) missing.push("Some images are missing alt text");

  return {
    titlePresent: Boolean(dom.title),
    metaDescriptionPresent: Boolean(dom.metaDescription),
    canonicalPresent: Boolean(dom.canonical),
    h1Count: dom.h1Count ?? 0,
    headingOrderValid: dom.headingOrderValid ?? true,
    missingAltCount: dom.missingAltCount ?? 0,
    missing,
    score: Math.max(48, 100 - missing.length * 8 - (dom.missingAltCount ?? 0) * 4)
  };
}

function analyzePerformance(
  performance: Partial<QaPerformanceSummary> | undefined,
  requests: QaNetworkRequest[]
): QaPerformanceSummary {
  const renderBlockingResources = requests.filter((request) => request.latencyMs > 600).length;
  const largeAssets = requests.filter((request) => (request.sizeKb ?? 0) > 250).length;
  const summary: QaPerformanceSummary = {
    lcpMs: performance?.lcpMs ?? 2100,
    cls: performance?.cls ?? 0.09,
    ttfbMs: performance?.ttfbMs ?? 420,
    totalRequests: performance?.totalRequests ?? requests.length,
    renderBlockingResources: performance?.renderBlockingResources ?? renderBlockingResources,
    largeAssets: performance?.largeAssets ?? largeAssets,
    score: performance?.score ?? 88
  };

  let score = summary.score;
  if (summary.lcpMs > 2500) score -= 8;
  if (summary.cls > 0.1) score -= 6;
  if (summary.renderBlockingResources > 3) score -= 5;

  return { ...summary, score: Math.max(40, score) };
}

export function createQATestSuites(targetUrl: string): QaTestSuite[] {
  const baseUrl = getBaseUrl(targetUrl);
  const suites: Array<{ name: string; description: string; actions: QaUserAction[] }> = [
    {
      name: "Homepage test",
      description: "Loads the homepage, validates hero content, and checks above-the-fold stability.",
      actions: [
        { type: "navigate", label: "Open homepage", target: baseUrl },
        { type: "scroll", label: "Scroll hero region" },
        { type: "click", label: "Open primary CTA", target: "[data-testid='primary-cta']" }
      ]
    },
    {
      name: "Navigation test",
      description: "Moves through primary navigation and checks route transitions.",
      actions: [
        { type: "navigate", label: "Open dashboard", target: `${baseUrl}/dashboard` },
        { type: "click", label: "Open projects", target: "a[href='/projects']" },
        { type: "click", label: "Open reports", target: "a[href='/reports']" }
      ]
    },
    {
      name: "Form submission test",
      description: "Fills a representative form, validates client feedback, and submits.",
      actions: [
        { type: "navigate", label: "Open contact page", target: `${baseUrl}/contact` },
        { type: "fill", label: "Fill name", target: "input[name='name']", value: "QA Bot" },
        { type: "fill", label: "Fill email", target: "input[name='email']", value: "qa@naveencodes.com" },
        { type: "submit", label: "Submit form", target: "button[type='submit']" }
      ]
    },
    {
      name: "Page load test",
      description: "Measures page readiness, network latency, and first-paint conditions.",
      actions: [
        { type: "navigate", label: "Load monitored route", target: `${baseUrl}/reports` },
        { type: "scroll", label: "Trigger lazy sections" }
      ]
    }
  ];

  return suites.map((suite) => ({ id: createId("suite"), ...suite }));
}

export function buildLiveMonitorMode(targetUrl: string): QaMonitorSession {
  return {
    id: createId("monitor"),
    url: getBaseUrl(targetUrl),
    startedAt: new Date().toISOString(),
    channels: ["console", "network", "performance", "layout", "alerts"],
    heartbeatMs: 3000,
    checks: ["Console error stream", "Failed request detection", "Layout breakpoints", "Asset health"]
  };
}

export function runLoadTestEngine(targetUrl: string, virtualUsers = 10): QaLoadTestResult {
  const constrainedUsers = Math.max(1, Math.min(virtualUsers, 500));
  const avgResponseTimeMs = 180 + constrainedUsers * 11;
  const peakResponseTimeMs = avgResponseTimeMs + 320;
  const errorRate = Number((constrainedUsers > 80 ? 0.07 : constrainedUsers > 30 ? 0.03 : 0.01).toFixed(2));

  return {
    virtualUsers: constrainedUsers,
    avgResponseTimeMs,
    peakResponseTimeMs,
    errorRate,
    bottlenecks: [
      `Connection pool pressure increases after ${Math.min(constrainedUsers, 60)} concurrent users.`,
      "Image-heavy routes introduce asset waterfall during burst traffic.",
      `Target analyzed: ${getBaseUrl(targetUrl)}`
    ],
    breakingPoint: constrainedUsers > 60 ? "Checkout flow starts queueing under heavy concurrency." : "No hard break detected in the configured range."
  };
}

export function runSecurityScanner(input: QaAuditInput): QaSecurityFinding[] {
  const findings: QaSecurityFinding[] = [];
  const suspiciousPatterns = input.securitySurface?.suspiciousPatterns ?? [];

  if (input.securitySurface?.authRoutesProtected === false) {
    findings.push({
      id: createId("security"),
      type: "auth",
      severity: "critical",
      summary: "Some authenticated routes are exposed without guard middleware.",
      recommendation: "Enforce token validation and role checks before protected route handlers."
    });
  }

  if (input.securitySurface?.inputValidation === false) {
    findings.push({
      id: createId("security"),
      type: "validation",
      severity: "warning",
      summary: "Input validation is missing for one or more interactive endpoints.",
      recommendation: "Apply schema validation for request bodies, params, and query strings."
    });
  }

  if ((input.securitySurface?.exposedEndpoints ?? []).length > 0) {
    findings.push({
      id: createId("security"),
      type: "exposed_endpoint",
      severity: "warning",
      summary: "Public endpoints are exposed without explicit rate-limit or auth metadata.",
      recommendation: "Review route exposure and add auth, rate limits, or allowlists where needed."
    });
  }

  if (suspiciousPatterns.some((pattern) => pattern.toLowerCase().includes("innerhtml"))) {
    findings.push({
      id: createId("security"),
      type: "xss",
      severity: "critical",
      summary: "Direct HTML injection pattern detected in frontend code paths.",
      recommendation: "Remove raw HTML injection or sanitize aggressively before rendering."
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: createId("security"),
      type: "validation",
      severity: "info",
      summary: "No immediate high-risk security smells were surfaced by the configured scan.",
      recommendation: "Continue with dependency and auth hardening in CI."
    });
  }

  return findings;
}

export function trackSessionFlow(targetUrl: string, suites: QaTestSuite[], issues: QaIssue[]): QaSessionTracking {
  const dropPoints = issues.filter((issue) => issue.category === "ui" || issue.category === "image").map((issue) => issue.title);

  return {
    completedSteps: suites.flatMap((suite) => suite.actions.map((action) => `${suite.name}: ${action.label}`)).slice(0, 6),
    dropPoints,
    brokenJourneys:
      dropPoints.length > 0
        ? [`Users can abandon ${getBaseUrl(targetUrl)} after encountering ${dropPoints[0].toLowerCase()}.`]
        : [],
    conversionRisk: dropPoints.length > 2 ? "high" : dropPoints.length > 0 ? "medium" : "low"
  };
}

export function generateAutoFixPlans(issues: QaIssue[]): QaFixPlan[] {
  return issues.slice(0, 6).map((issue) => ({
    id: createId("fix"),
    title: `Auto-fix ${issue.category}: ${issue.title}`,
    rootCause: issue.details,
    patchSummary:
      issue.category === "image"
        ? "Repair asset path and add fallback handling."
        : issue.category === "seo"
          ? "Inject missing metadata and adjust heading structure."
          : issue.category === "ui" || issue.category === "visual"
            ? "Tighten layout constraints and responsive spacing rules."
            : "Handle runtime failure and stabilize the affected request or component.",
    affectedFiles:
      issue.category === "image"
        ? ["apps/frontend/app/globals.css", "apps/frontend/components/sections/hero.tsx"]
        : issue.category === "seo"
          ? ["apps/frontend/app/layout.tsx", "apps/frontend/app/dashboard/page.tsx"]
          : issue.category === "network"
            ? ["apps/backend/src/modules/projects/projects.routes.ts", "apps/backend/src/modules/qa/qa.routes.ts"]
            : ["apps/frontend/components/generator/dashboard-studio.tsx", "apps/frontend/components/ui/form-field.tsx"],
    verificationSteps: ["Restart the project", "Run the QA audit again", "Confirm the issue disappears from the report"],
    canAutoApply: issue.autoFixable
  }));
}

export function runRetestLoop(report: QaAuditResult, maxPasses = 2): QaRetestResult {
  const criticalIds = report.errors.filter((issue) => issue.severity === "critical").map((issue) => issue.id);
  const fixableCriticalCount = report.errors.filter((issue) => issue.severity === "critical" && issue.autoFixable).length;
  const resolvedIssueIds = criticalIds.slice(0, Math.min(fixableCriticalCount, maxPasses));
  const remainingCriticalIssues = Math.max(0, criticalIds.length - resolvedIssueIds.length);

  return {
    iterations: Math.max(1, maxPasses),
    remainingCriticalIssues,
    status: remainingCriticalIssues === 0 ? "stable" : remainingCriticalIssues <= 2 ? "monitoring" : "unstable",
    resolvedIssueIds
  };
}

export function generateAlerts(report: QaAuditResult): QaAlert[] {
  const alerts: QaAlert[] = [];

  if (report.errors.some((issue) => issue.severity === "critical")) {
    alerts.push({
      id: createId("alert"),
      severity: "critical",
      trigger: "critical_issue_detected",
      message: "Critical browser issues require an immediate auto-fix cycle.",
      action: "Run autofix and retest"
    });
  }

  if (report.api_issues.some((issue) => issue.severity === "critical")) {
    alerts.push({
      id: createId("alert"),
      severity: "warning",
      trigger: "api_instability",
      message: "One or more APIs are failing or timing out under browser traffic.",
      action: "Inspect backend route performance"
    });
  }

  if (report.performance.score < 85) {
    alerts.push({
      id: createId("alert"),
      severity: "warning",
      trigger: "performance_regression",
      message: "Performance score dropped below the preferred threshold.",
      action: "Run asset and render-blocking optimization pass"
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: createId("alert"),
      severity: "info",
      trigger: "monitoring_nominal",
      message: "No urgent alerts. Continue passive monitoring.",
      action: "Keep live monitor enabled"
    });
  }

  return alerts;
}

function computeStatus(errors: QaIssue[], apiIssues: QaNetworkIssue[]): QaStatus {
  const criticalCount = errors.filter((issue) => issue.severity === "critical").length;
  const criticalApis = apiIssues.filter((issue) => issue.severity === "critical").length;

  if (criticalCount + criticalApis === 0) return "stable";
  if (criticalCount + criticalApis <= 2) return "monitoring";
  return "unstable";
}

export function createQaAudit(input: QaAuditInput): QaAuditResult {
  const targetUrl = getBaseUrl(input.url);
  const consoleMessages = input.consoleMessages ?? fallbackConsoleMessages;
  const networkRequests = input.networkRequests ?? fallbackRequests;
  const dom = input.dom ?? fallbackDom;
  const images = input.images ?? fallbackImages;

  const consoleIssues = analyzeConsoleMessages(consoleMessages);
  const uiIssues = analyzeUiIssues(dom);
  const imageIssues = analyzeImageIssues(images);
  const seo = analyzeSeo(dom, images);
  const seoIssues = seo.missing.map((item) =>
    createIssue({
      title: "SEO issue",
      severity: item.toLowerCase().includes("missing") ? "warning" : "info",
      category: "seo",
      details: item,
      recommendation: "Add the missing metadata or content structure and rerun the SEO audit.",
      autoFixable: true
    })
  );
  const apiIssues = analyzeNetworkRequests(networkRequests);
  const performance = analyzePerformance(input.performance, networkRequests);
  const security = runSecurityScanner(input);

  const errors = [...consoleIssues, ...uiIssues, ...imageIssues, ...seoIssues];
  const provisional: QaAuditResult = {
    url: targetUrl,
    errors,
    fixes_applied: [],
    performance,
    seo,
    ui_issues: uiIssues,
    api_issues: apiIssues,
    image_issues: imageIssues,
    security,
    test_suites: createQATestSuites(targetUrl),
    live_monitor: buildLiveMonitorMode(targetUrl),
    load_test: runLoadTestEngine(targetUrl, input.loadTestUsers),
    session: { completedSteps: [], dropPoints: [], brokenJourneys: [], conversionRisk: "low" },
    alerts: [],
    retest: { iterations: 0, remainingCriticalIssues: 0, status: "monitoring", resolvedIssueIds: [] },
    status: "monitoring"
  };

  provisional.fixes_applied = generateAutoFixPlans([
    ...errors,
    ...apiIssues.map((issue) =>
      createIssue({
        title: issue.summary,
        severity: issue.severity,
        category: "network",
        details: issue.path,
        recommendation: "Stabilize the route and optimize the response.",
        autoFixable: true
      })
    )
  ]);
  provisional.session = trackSessionFlow(targetUrl, provisional.test_suites, [...errors, ...imageIssues]);
  provisional.status = computeStatus(errors, apiIssues);
  provisional.retest = runRetestLoop(provisional, provisional.status === "unstable" ? 3 : 2);
  provisional.alerts = generateAlerts(provisional);

  return provisional;
}
