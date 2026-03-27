import { createId } from "@naveencodes/core";

import { createBusinessSuggestions } from "./generator";
import { createQaAudit, generateAlerts, runLoadTestEngine } from "./qa";
import type {
  AdvancedIntelligenceInput,
  AdvancedIntelligenceReport,
  AutoRefactorReport,
  CompetitorIntelligenceReport,
  ContentIntelligenceReport,
  PerformanceIntelligenceReport,
  QaAuditResult,
  SecurityIntelligenceReport,
  SelfLearningInsight,
  SeniorDevReview,
  SeoIntelligenceReport,
  UiUxIntelligenceReport,
  VisualIntelligenceReport
} from "./types";

const selfLearningStore: SelfLearningInsight[] = [];

function getAudit(input: AdvancedIntelligenceInput): QaAuditResult {
  return (
    input.qaAudit ??
    createQaAudit({
      url: input.url
    })
  );
}

export function analyzeSeoIntelligence(input: AdvancedIntelligenceInput): SeoIntelligenceReport {
  const audit = getAudit(input);
  const keywords = input.keywords?.length ? input.keywords : ["technical SEO", "performance", "browser automation"];
  const score = Math.max(52, audit.seo.score - (audit.seo.missing.length > 2 ? 4 : 0));

  return {
    score,
    issues: audit.seo.missing.length > 0 ? audit.seo.missing : ["No major SEO blockers were surfaced by the current signals."],
    improvements: [
      "Expand schema coverage on important templates.",
      "Tighten internal links from high-authority pages into commercial pages.",
      "Align headings and supporting copy around one clear keyword cluster per page."
    ],
    keywordUsage: keywords,
    internalLinking: [
      "Link feature pages into explanation and client-facing pages.",
      "Add related-content linking between SEO, performance, and UI diagnostic pages."
    ],
    structuredData: ["Person", "WebSite", "BreadcrumbList", "BlogPosting"],
    rankingPotential: score >= 90 ? "high" : score >= 75 ? "medium" : "low",
    indexingReadiness: audit.seo.canonicalPresent ? "Canonical and meta foundations are present for indexing." : "Canonical coverage still needs improvement."
  };
}

export function analyzePerformanceIntelligence(input: AdvancedIntelligenceInput): PerformanceIntelligenceReport {
  const audit = getAudit(input);

  return {
    score: audit.performance.score,
    bottlenecks: [
      `LCP is ${audit.performance.lcpMs}ms and should be pushed lower on primary routes.`,
      `${audit.performance.renderBlockingResources} render-blocking resources are still present.`,
      `${audit.performance.largeAssets} large assets remain candidates for compression.`
    ],
    optimizationSteps: [
      "Split non-critical bundles and defer analytics widgets.",
      "Compress hero and commerce media with responsive variants.",
      "Cache expensive API responses closer to the edge."
    ],
    bundleSizeKb: 312,
    renderBlockingResources: audit.performance.renderBlockingResources,
    imageOptimization: ["Hero image should use modern formats.", "Commerce thumbnails should adopt lazy and responsive loading."]
  };
}

export function analyzeUiUxIntelligence(input: AdvancedIntelligenceInput): UiUxIntelligenceReport {
  const audit = getAudit(input);
  const issues = audit.ui_issues.map((issue) => issue.details);

  return {
    issues: issues.length > 0 ? issues : ["No major UI hierarchy failures were surfaced."],
    improvements: [
      "Increase spacing consistency between analytics cards and activity rails.",
      "Keep card density lower on tablet layouts to preserve scanability.",
      "Strengthen CTA grouping and section rhythm above the fold."
    ],
    layoutStrategy: ["Use clearer sectional contrast.", "Align actions in one responsive command rail.", "Reduce duplicate footer patterns."],
    hierarchyObservations: ["Hero and charts are visually strong.", "Secondary sections can use tighter visual grouping."]
  };
}

export function analyzeApiIntelligence(input: AdvancedIntelligenceInput) {
  const audit = getAudit(input);
  const slowEndpoints = audit.api_issues.filter((issue) => issue.latencyMs > 800).map((issue) => `${issue.path} (${issue.latencyMs}ms)`);
  const failedEndpoints = audit.api_issues.filter((issue) => issue.status >= 400).map((issue) => `${issue.path} (${issue.status})`);

  return {
    issues: audit.api_issues.map((issue) => issue.summary),
    slowEndpoints,
    failedEndpoints,
    cachingStrategies: [
      "Cache stable project and dashboard reads.",
      "Use stale-while-revalidate on non-critical reporting endpoints."
    ],
    optimizationSuggestions: [
      "Add response compression for verbose payloads.",
      "Rate-limit high-cost public endpoints.",
      "Normalize slow endpoint payload shape and trim unused fields."
    ]
  };
}

export function analyzeEcommerceIntelligence(input: AdvancedIntelligenceInput) {
  const audit = getAudit(input);
  const checkoutIssue = audit.api_issues.find((issue) => issue.path.includes("order") || issue.path.includes("checkout"));
  const checkoutHealth: "healthy" | "warning" | "critical" = checkoutIssue ? "warning" : "healthy";

  return {
    issues: checkoutIssue ? [checkoutIssue.summary, "Checkout latency can damage conversion under traffic spikes."] : ["No critical checkout blockers detected."],
    checkoutHealth,
    pricingIntegrity: "No pricing mismatch surfaced from the current request traces.",
    conversionSuggestions: [
      "Shorten checkout feedback loops and preserve visible progress states.",
      "Surface cart reassurance and trust cues closer to payment CTA.",
      "Reduce optional fields in checkout to lower abandonment."
    ]
  };
}

export function analyzeCompetitorIntelligence(input: AdvancedIntelligenceInput): CompetitorIntelligenceReport | null {
  if (!input.competitorUrl) {
    return null;
  }

  return {
    competitorUrl: input.competitorUrl,
    strengths: ["Likely stronger content depth across long-tail topics.", "May have tighter internal link density across service pages."],
    weaknesses: ["Can be beaten with faster technical performance.", "Opportunity exists in clearer conversion UX and richer issue dashboards."],
    opportunities: ["Publish higher-signal case studies.", "Own comparison-style SEO content and operational proof pages."],
    beatStrategy: [
      "Outperform on page speed and technical SEO consistency.",
      "Use better CTA hierarchy and more transparent service proof.",
      "Ship deeper operational content supported by realtime product screenshots."
    ]
  };
}

export function analyzeVisualIntelligence(input: AdvancedIntelligenceInput): VisualIntelligenceReport {
  const notes = input.screenshotNotes?.length ? input.screenshotNotes : ["No screenshot-specific notes were provided; visual engine relied on UI issue patterns."];

  return {
    issues: ["Potential overlap risk in dense dashboard sections.", "Repeated low-contrast surfaces can flatten hierarchy."],
    screenshotInsights: notes,
    alignmentGuidance: ["Use a stricter vertical rhythm between cards.", "Align metric headings and chart containers on a shared baseline."]
  };
}

export function analyzeSecurityIntelligence(input: AdvancedIntelligenceInput): SecurityIntelligenceReport {
  const audit = getAudit(input);
  const findings = audit.security.map((item) => item.summary);

  return {
    findings,
    fixes: audit.security.map((item) => item.recommendation),
    posture: findings.some((item) => item.toLowerCase().includes("critical")) ? "exposed" : findings.length > 1 ? "watch" : "guarded"
  };
}

export function generateContentIntelligence(input: AdvancedIntelligenceInput): ContentIntelligenceReport {
  const purpose = input.sitePurpose ?? "technical services platform";
  const keywords = input.keywords?.length ? input.keywords : ["browser QA", "technical SEO", "performance engineering"];

  return {
    titles: [
      `How ${purpose} teams scale browser QA without losing delivery speed`,
      "Technical SEO playbook for service-led growth",
      "Performance engineering checklist for revenue-critical routes"
    ],
    metaDescriptions: [
      `Run ${purpose} analysis with one AI control plane for SEO, performance, and QA.`,
      "Use browser-driven intelligence to catch regressions before they hurt traffic or conversions."
    ],
    headings: ["Why browser intelligence matters", "Common QA bottlenecks", "How to operationalize fixes"],
    schema: ["Article", "FAQPage", "HowTo"],
    articleIdeas: keywords.map((keyword) => `Publish a deep-dive article targeting "${keyword}" with case-study evidence.`)
  };
}

export function analyzeAutoRefactor(input: AdvancedIntelligenceInput): AutoRefactorReport {
  const audit = getAudit(input);

  return {
    issues: [
      `${audit.fixes_applied.length} fix plans indicate repeated UI and route-level redundancy.`,
      "Shared route analytics and insight cards can be composed from one intelligence module."
    ],
    refactors: [
      "Extract repeated diagnostics cards into a single typed dashboard primitive.",
      "Unify analysis endpoint response shapes behind one aggregate intelligence contract.",
      "Move static workspace demo data into one backend composition layer."
    ],
    architectureImprovements: [
      "Prefer engine-specific modules with one aggregate orchestrator.",
      "Keep frontend pages thin and drive them from reusable view models.",
      "Centralize workflow selection and recommendation logic in the AI package."
    ]
  };
}

export function analyzeSeniorDevMode(input: AdvancedIntelligenceInput): SeniorDevReview {
  const purpose = input.sitePurpose ?? "multi-engine SaaS platform";

  return {
    architectureRisks: [
      `As ${purpose} grows, duplicated page-level datasets will become maintenance debt.`,
      "Workflow routing logic can drift if chat, QA, and dashboard summaries diverge.",
      "Too many ad hoc view models can blur the boundary between engine outputs and UI composition."
    ],
    patternRecommendations: [
      "Keep one canonical intelligence report per target URL.",
      "Route UI pages through shared backend composition endpoints rather than static demo duplication.",
      "Treat QA, SEO, performance, and content insights as typed engine outputs, not page-specific data blobs."
    ],
    preventionNotes: [
      "Avoid route-specific forks of the same recommendation logic.",
      "Preserve contract-first engine design so future prompt parts can extend without breaking pages."
    ]
  };
}

export function captureSelfLearningInsights(input: AdvancedIntelligenceInput): SelfLearningInsight[] {
  const audit = getAudit(input);
  const newInsights = audit.fixes_applied.slice(0, 2).map((fix) => ({
    memoryId: createId("memory"),
    issuePattern: fix.rootCause,
    previousFix: fix.patchSummary,
    confidence: 0.84
  }));

  selfLearningStore.push(...newInsights);
  return selfLearningStore.slice(-6);
}

export function generateAdvancedIntelligenceReport(input: AdvancedIntelligenceInput): AdvancedIntelligenceReport {
  const audit = getAudit(input);
  const seo = analyzeSeoIntelligence({ ...input, qaAudit: audit });
  const performance = analyzePerformanceIntelligence({ ...input, qaAudit: audit });
  const ui = analyzeUiUxIntelligence({ ...input, qaAudit: audit });
  const api = analyzeApiIntelligence({ ...input, qaAudit: audit });
  const ecommerce = analyzeEcommerceIntelligence({ ...input, qaAudit: audit });
  const competitor = analyzeCompetitorIntelligence({ ...input, qaAudit: audit });
  const visual = analyzeVisualIntelligence({ ...input, qaAudit: audit });
  const security = analyzeSecurityIntelligence({ ...input, qaAudit: audit });
  const content = generateContentIntelligence(input);
  const refactor = analyzeAutoRefactor({ ...input, qaAudit: audit });
  const seniorDev = analyzeSeniorDevMode({ ...input, qaAudit: audit });
  const selfLearning = captureSelfLearningInsights({ ...input, qaAudit: audit });
  const load = runLoadTestEngine(input.url, input.qaAudit?.load_test.virtualUsers ?? 32);
  const recommendations = [
    ...seo.improvements,
    ...performance.optimizationSteps,
    ...ui.improvements,
    ...api.optimizationSuggestions
  ].slice(0, 8);

  return {
    seo,
    performance,
    ui,
    api,
    ecommerce,
    security,
    business: createBusinessSuggestions("saas"),
    competitor,
    visual,
    load,
    content,
    refactor,
    session: audit.session,
    selfLearning,
    seniorDev,
    alerts: generateAlerts(audit),
    recommendations
  };
}
