export type WorkflowName =
  | "full_site_audit"
  | "seo_full_scan"
  | "performance_scan"
  | "ui_responsive_test"
  | "ecommerce_flow_test"
  | "error_monitor_live"
  | "qa_autofix_loop"
  | "live_monitor_mode"
  | "load_test_engine"
  | "security_scan"
  | "competitor_analysis"
  | "content_generation"
  | "senior_dev_review"
  | "auto_refactor";

export type SupportedProjectType =
  | "blog"
  | "ecommerce"
  | "saas"
  | "landing"
  | "admin";

export type SupportedLocale = "en" | "hi" | "es";
export type Severity = "critical" | "warning" | "info";
export type QaStatus = "stable" | "monitoring" | "unstable";

export interface WorkflowDefinition {
  name: WorkflowName;
  description: string;
  module: string;
}

export interface CommandIntent {
  action: "generate_project" | "generate_design" | "convert_figma" | "improve_ui";
  projectType: SupportedProjectType;
  confidence: number;
  detectedEntities: string[];
  suggestedTechStack: string[];
}

export interface ProjectGenerationInput {
  idea: string;
  techPreference?: string;
  locale?: SupportedLocale;
}

export interface GeneratedFileBlueprint {
  path: string;
  purpose: string;
}

export interface GeneratedRouteBlueprint {
  path: string;
  title: string;
  purpose: string;
}

export interface GeneratedComponentBlueprint {
  name: string;
  type: "layout" | "navigation" | "content" | "commerce" | "form" | "data" | "utility";
  description: string;
}

export interface GeneratedApiBlueprint {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  purpose: string;
}

export interface BusinessSuggestionSet {
  categories: string[];
  contentStructure: string[];
  monetizationOptions: string[];
  seoKeywords: string[];
}

export interface DesignTokenScale {
  spacing: string[];
  typography: string[];
  palette: Record<string, string>;
}

export interface ResponsiveBlueprint {
  mobile: string[];
  tablet: string[];
  desktop: string[];
}

export interface TranslationBundle {
  locale: SupportedLocale;
  messages: Record<string, string>;
}

export interface GeneratedProjectBlueprint {
  projectType: SupportedProjectType;
  idea: string;
  appName: string;
  summary: string;
  architecture: string[];
  folders: string[];
  files: GeneratedFileBlueprint[];
  routes: GeneratedRouteBlueprint[];
  components: GeneratedComponentBlueprint[];
  apis: GeneratedApiBlueprint[];
  responsive: ResponsiveBlueprint;
  designTokens: DesignTokenScale;
  business: BusinessSuggestionSet;
  translations: TranslationBundle[];
}

export interface FigmaConversionInput {
  figmaLink?: string;
  designImage?: string;
  notes?: string;
}

export interface FigmaConversionResult {
  sourceType: "figma" | "image" | "notes";
  extraction: {
    layout: string[];
    spacing: string[];
    typography: string[];
    colors: string[];
  };
  components: GeneratedComponentBlueprint[];
  generatedReactComponent: string;
}

export interface DesignGenerationInput {
  projectType: SupportedProjectType;
  tone?: string;
}

export interface QaNetworkRequest {
  url: string;
  method: string;
  status: number;
  latencyMs: number;
  sizeKb?: number;
  responsePreview?: string;
}

export interface QaDomSnapshot {
  title?: string;
  metaDescription?: string;
  canonical?: string;
  h1Count?: number;
  headingOrderValid?: boolean;
  missingAltCount?: number;
  layoutIssues?: string[];
  duplicateElements?: string[];
  missingSeoElements?: string[];
}

export interface QaImageAsset {
  src: string;
  status: "ok" | "broken" | "missing-cdn";
  alt?: string;
}

export interface QaIssue {
  id: string;
  title: string;
  severity: Severity;
  category:
    | "console"
    | "javascript"
    | "network"
    | "ui"
    | "visual"
    | "seo"
    | "image"
    | "security"
    | "session";
  details: string;
  location?: string;
  recommendation: string;
  evidence?: string;
  autoFixable: boolean;
}

export interface QaNetworkIssue {
  id: string;
  path: string;
  method: string;
  status: number;
  latencyMs: number;
  severity: Severity;
  summary: string;
  payloadRisk: "low" | "medium" | "high";
}

export interface QaPerformanceSummary {
  lcpMs: number;
  cls: number;
  ttfbMs: number;
  totalRequests: number;
  renderBlockingResources: number;
  largeAssets: number;
  score: number;
}

export interface QaSeoSummary {
  titlePresent: boolean;
  metaDescriptionPresent: boolean;
  canonicalPresent: boolean;
  h1Count: number;
  headingOrderValid: boolean;
  missingAltCount: number;
  missing: string[];
  score: number;
}

export interface QaFixPlan {
  id: string;
  title: string;
  rootCause: string;
  patchSummary: string;
  affectedFiles: string[];
  verificationSteps: string[];
  canAutoApply: boolean;
}

export interface QaUserAction {
  type: "navigate" | "click" | "scroll" | "fill" | "submit";
  label: string;
  target?: string;
  value?: string;
}

export interface QaTestSuite {
  id: string;
  name: string;
  description: string;
  actions: QaUserAction[];
}

export interface QaMonitorSession {
  id: string;
  url: string;
  startedAt: string;
  channels: string[];
  heartbeatMs: number;
  checks: string[];
}

export interface QaLoadTestResult {
  virtualUsers: number;
  avgResponseTimeMs: number;
  peakResponseTimeMs: number;
  errorRate: number;
  bottlenecks: string[];
  breakingPoint: string;
}

export interface QaSecurityFinding {
  id: string;
  type: "xss" | "sql_injection" | "auth" | "exposed_endpoint" | "validation";
  severity: Severity;
  summary: string;
  recommendation: string;
}

export interface QaSessionTracking {
  completedSteps: string[];
  dropPoints: string[];
  brokenJourneys: string[];
  conversionRisk: "low" | "medium" | "high";
}

export interface QaAlert {
  id: string;
  severity: Severity;
  trigger: string;
  message: string;
  action: string;
}

export interface QaRetestResult {
  iterations: number;
  remainingCriticalIssues: number;
  status: QaStatus;
  resolvedIssueIds: string[];
}

export interface QaAuditInput {
  url: string;
  consoleMessages?: string[];
  networkRequests?: QaNetworkRequest[];
  dom?: QaDomSnapshot;
  images?: QaImageAsset[];
  performance?: Partial<QaPerformanceSummary>;
  loadTestUsers?: number;
  securitySurface?: {
    exposedEndpoints?: string[];
    authRoutesProtected?: boolean;
    inputValidation?: boolean;
    suspiciousPatterns?: string[];
  };
}

export interface QaAuditResult {
  url: string;
  errors: QaIssue[];
  fixes_applied: QaFixPlan[];
  performance: QaPerformanceSummary;
  seo: QaSeoSummary;
  ui_issues: QaIssue[];
  api_issues: QaNetworkIssue[];
  image_issues: QaIssue[];
  security: QaSecurityFinding[];
  test_suites: QaTestSuite[];
  live_monitor: QaMonitorSession;
  load_test: QaLoadTestResult;
  session: QaSessionTracking;
  alerts: QaAlert[];
  retest: QaRetestResult;
  status: QaStatus;
}

export interface AdvancedIntelligenceInput {
  url: string;
  qaAudit?: QaAuditResult;
  sitePurpose?: string;
  keywords?: string[];
  competitorUrl?: string;
  screenshotNotes?: string[];
}

export interface SeoIntelligenceReport {
  score: number;
  issues: string[];
  improvements: string[];
  keywordUsage: string[];
  internalLinking: string[];
  structuredData: string[];
  rankingPotential: "low" | "medium" | "high";
  indexingReadiness: string;
}

export interface PerformanceIntelligenceReport {
  score: number;
  bottlenecks: string[];
  optimizationSteps: string[];
  bundleSizeKb: number;
  renderBlockingResources: number;
  imageOptimization: string[];
}

export interface UiUxIntelligenceReport {
  issues: string[];
  improvements: string[];
  layoutStrategy: string[];
  hierarchyObservations: string[];
}

export interface ApiIntelligenceReport {
  issues: string[];
  slowEndpoints: string[];
  failedEndpoints: string[];
  cachingStrategies: string[];
  optimizationSuggestions: string[];
}

export interface EcommerceIntelligenceReport {
  issues: string[];
  checkoutHealth: "healthy" | "warning" | "critical";
  pricingIntegrity: string;
  conversionSuggestions: string[];
}

export interface CompetitorIntelligenceReport {
  competitorUrl: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  beatStrategy: string[];
}

export interface VisualIntelligenceReport {
  issues: string[];
  screenshotInsights: string[];
  alignmentGuidance: string[];
}

export interface SecurityIntelligenceReport {
  findings: string[];
  fixes: string[];
  posture: "guarded" | "watch" | "exposed";
}

export interface ContentIntelligenceReport {
  titles: string[];
  metaDescriptions: string[];
  headings: string[];
  schema: string[];
  articleIdeas: string[];
}

export interface AutoRefactorReport {
  issues: string[];
  refactors: string[];
  architectureImprovements: string[];
}

export interface SelfLearningInsight {
  memoryId: string;
  issuePattern: string;
  previousFix: string;
  confidence: number;
}

export interface SeniorDevReview {
  architectureRisks: string[];
  patternRecommendations: string[];
  preventionNotes: string[];
}

export interface AdvancedIntelligenceReport {
  seo: SeoIntelligenceReport;
  performance: PerformanceIntelligenceReport;
  ui: UiUxIntelligenceReport;
  api: ApiIntelligenceReport;
  ecommerce: EcommerceIntelligenceReport;
  security: SecurityIntelligenceReport;
  business: BusinessSuggestionSet;
  competitor: CompetitorIntelligenceReport | null;
  visual: VisualIntelligenceReport;
  load: QaLoadTestResult;
  content: ContentIntelligenceReport;
  refactor: AutoRefactorReport;
  session: QaSessionTracking;
  selfLearning: SelfLearningInsight[];
  seniorDev: SeniorDevReview;
  alerts: QaAlert[];
  recommendations: string[];
}
