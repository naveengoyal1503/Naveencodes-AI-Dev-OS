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
  | "auto_refactor"
  | "codebase_understanding"
  | "auto_bug_reproducer"
  | "ai_thinking_engine"
  | "smart_version_control"
  | "goal_based_execution"
  | "auto_feature_generator"
  | "global_site_health"
  | "real_device_testing"
  | "integration_engine"
  | "architect_mode"
  | "simulation_engine"
  | "website_clone_engine"
  | "memory_engine"
  | "self_healing_engine"
  | "client_ai_assistant"
  | "product_strategist_ai"
  | "compliance_engine"
  | "ai_team_system"
  | "next_gen_autonomous"
  | "digital_twin_engine"
  | "predictive_ai_engine"
  | "human_behavior_simulator"
  | "chaos_engine"
  | "code_style_enforcer"
  | "ai_app_store"
  | "auto_backend_generator"
  | "data_model_designer"
  | "conversion_optimization_engine"
  | "video_to_website_engine"
  | "debug_history_system"
  | "cross_site_intelligence"
  | "team_collaboration_system"
  | "auto_update_engine"
  | "knowledge_base_engine"
  | "voice_dev_mode"
  | "legal_policy_engine"
  | "cdn_optimizer"
  | "ai_personality_system"
  | "auto_startup_builder"
  | "future_ai_ecosystem";

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

export type IntegrationSourceName = "github" | "vercel" | "chrome_devtools" | "search_console" | "stripe" | "alerts";

export interface RepoSignals {
  rootPath?: string;
  workspacePackages: string[];
  projectAreas: string[];
  recentCommits: string[];
  changedFiles: string[];
  dirty: boolean;
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

export interface NextGenIntelligenceInput extends AdvancedIntelligenceInput {
  goal?: string;
  featureRequest?: string;
  issueSummary?: string;
  cloneUrl?: string;
  clientCommand?: string;
  productPrompt?: string;
  incidentSummary?: string;
  integrationSources?: IntegrationSourceName[];
  userPreferences?: string[];
  repoSignals?: RepoSignals;
}

export interface CodebaseDependencyNode {
  name: string;
  type: "app" | "package" | "service";
  dependsOn: string[];
}

export interface CodebaseUnderstandingReport {
  dependencyGraph: CodebaseDependencyNode[];
  componentUsage: string[];
  dataFlow: string[];
  apiRelationships: string[];
  impactAnalysis: string[];
  safeChangeSuggestions: string[];
}

export interface BugReproductionReport {
  bugTitle: string;
  confirmed: boolean;
  severity: Severity;
  reproductionSteps: string[];
  observedSignals: string[];
  proposedFixes: string[];
}

export interface ThinkingStep {
  title: string;
  action: string;
  validation: string;
}

export interface ThinkingEngineReport {
  objective: string;
  plan: ThinkingStep[];
  executionNotes: string[];
}

export interface VersionControlInsight {
  branchStrategy: string;
  riskyCommits: string[];
  rollbackSuggestions: string[];
  releaseNotes: string[];
}

export interface GoalExecutionReport {
  goal: string;
  actions: string[];
  expectedImpact: string[];
  successMetrics: string[];
}

export interface FeatureGenerationReport {
  feature: string;
  backendChanges: string[];
  frontendChanges: string[];
  dataModelChanges: string[];
  testPlan: string[];
}

export interface GlobalHealthScoreReport {
  overall: number;
  breakdown: {
    seo: number;
    performance: number;
    ui: number;
    security: number;
  };
  summary: string;
}

export interface DeviceSimulationResult {
  device: string;
  profile: "mobile" | "tablet" | "desktop";
  network: string;
  cpu: string;
  risk: string;
}

export interface IntegrationEngineReport {
  sources: Array<{
    name: IntegrationSourceName;
    status: "connected" | "configured" | "needs_attention";
    observation: string;
  }>;
  recommendations: string[];
}

export interface ArchitectModeReport {
  architectureSummary: string[];
  scaleRecommendations: string[];
  patternRecommendations: string[];
}

export interface SimulationEngineReport {
  trafficGrowth: string[];
  failurePredictions: string[];
  stressPlan: string[];
}

export interface WebsiteCloneReport {
  sourceUrl: string;
  structureInsights: string[];
  improvements: string[];
  generatedModules: string[];
}

export interface MemoryEngineReport {
  storedPatterns: SelfLearningInsight[];
  userPreferences: string[];
  nextBestActions: string[];
}

export interface SelfHealingReport {
  issueDetected: string;
  autoFixPlan: string[];
  redeployPlan: string[];
}

export interface ClientAssistantReport {
  command: string;
  guidance: string[];
  suggestedActions: string[];
}

export interface ProductStrategistReport {
  prompt: string;
  idea: string;
  marketAngle: string[];
  buildPlan: string[];
  launchPlan: string[];
}

export interface ComplianceReport {
  gdpr: string[];
  cookies: string[];
  privacy: string[];
  actions: string[];
}

export interface AITeamContribution {
  role: "AI Developer" | "AI QA" | "AI SEO" | "AI Designer";
  contribution: string[];
}

export interface NextGenPredictions {
  performanceRisk: string;
  releaseReadiness: string;
  revenueOpportunity: string;
  scalingRisk: string;
}

export interface NextGenAutonomousReport {
  health_score: number;
  issues: string[];
  suggestions: string[];
  fixes: string[];
  predictions: NextGenPredictions;
  codebase: CodebaseUnderstandingReport;
  bug_reproduction: BugReproductionReport;
  thinking: ThinkingEngineReport;
  version_control: VersionControlInsight;
  goal_execution: GoalExecutionReport;
  feature_generation: FeatureGenerationReport;
  global_health: GlobalHealthScoreReport;
  device_testing: DeviceSimulationResult[];
  integrations: IntegrationEngineReport;
  architecture: ArchitectModeReport;
  simulation: SimulationEngineReport;
  clone_engine: WebsiteCloneReport;
  memory: MemoryEngineReport;
  self_healing: SelfHealingReport;
  client_assistant: ClientAssistantReport;
  strategist: ProductStrategistReport;
  compliance: ComplianceReport;
  ai_team: AITeamContribution[];
}

export type PersonalityMode = "beginner" | "senior_dev" | "strict_reviewer";

export interface FutureEcosystemInput extends NextGenIntelligenceInput {
  videoSource?: string;
  projects?: string[];
  regions?: string[];
  personalityMode?: PersonalityMode;
  startupPrompt?: string;
}

export interface DigitalTwinExperiment {
  name: string;
  goal: string;
  safetyRail: string;
}

export interface DigitalTwinReport {
  twinSummary: string[];
  experiments: DigitalTwinExperiment[];
  abTests: string[];
}

export interface PredictiveAiReport {
  future_predictions: string[];
  riskWindows: string[];
  mitigations: string[];
}

export interface HumanBehaviorSimulationReport {
  behaviorPatterns: string[];
  rageClickRisks: string[];
  dropOffSignals: string[];
}

export interface ChaosEngineReport {
  chaosScenarios: string[];
  resilienceChecks: string[];
  recoveryActions: string[];
}

export interface CodeStyleEnforcerReport {
  standards: string[];
  naming: string[];
  fixes: string[];
}

export interface AiAppStoreReport {
  marketplaceStatus: string;
  extensionHooks: string[];
  recommendedAddOns: string[];
}

export interface AutoBackendGeneratorReport {
  apis: string[];
  dbSchema: string[];
  adminPanel: string[];
}

export interface DataModelDesignerReport {
  entities: string[];
  relations: string[];
  indexes: string[];
  scalingStrategy: string[];
}

export interface ConversionOptimizationReport {
  ctaImprovements: string[];
  uxOptimizations: string[];
  engagementIdeas: string[];
}

export interface VideoToWebsiteReport {
  inputSource: string;
  extractedScenes: string[];
  generatedSections: string[];
  codeTargets: string[];
}

export interface DebugHistoryEntry {
  issue: string;
  fix: string;
  timeline: string;
}

export interface DebugHistoryReport {
  entries: DebugHistoryEntry[];
  recurringPatterns: string[];
}

export interface CrossSiteIntelligenceReport {
  projectsAnalyzed: string[];
  bestPractices: string[];
  transferSuggestions: string[];
}

export interface TeamCollaborationReport {
  collaborationModes: string[];
  sharedProjectFlows: string[];
  comments: string[];
}

export interface AutoUpdateReport {
  dependencyStrategy: string[];
  compatibilityChecks: string[];
  preventionRules: string[];
}

export interface KnowledgeBaseReport {
  documentation: string[];
  apiDocs: string[];
  guides: string[];
}

export interface VoiceDevModeReport {
  commands: string[];
  mappedActions: string[];
  confidenceNotes: string[];
}

export interface LegalPolicyReport {
  privacyPolicy: string[];
  termsOfService: string[];
  cookiePolicy: string[];
}

export interface CdnOptimizerReport {
  regions: string[];
  routing: string[];
  caching: string[];
}

export interface AiPersonalitySystemReport {
  activeMode: PersonalityMode;
  modeTraits: string[];
  guardrails: string[];
}

export interface AutoStartupBuilderReport {
  startupPrompt: string;
  idea: string;
  uiDirection: string[];
  productBuild: string[];
  deployPlan: string[];
  marketingPlan: string[];
}

export interface FutureLearningData {
  memory_patterns: number;
  debug_entries: number;
  cross_site_projects: number;
  preferences: string[];
}

export interface FutureEcosystemReport {
  future_predictions: string[];
  improvements: string[];
  experiments: string[];
  learning_data: FutureLearningData;
  ecosystem_status: "active" | "evolving" | "needs_attention";
  autonomous: NextGenAutonomousReport;
  digital_twin: DigitalTwinReport;
  predictive_ai: PredictiveAiReport;
  human_behavior: HumanBehaviorSimulationReport;
  chaos_engine: ChaosEngineReport;
  code_style: CodeStyleEnforcerReport;
  app_store: AiAppStoreReport;
  auto_backend: AutoBackendGeneratorReport;
  data_model: DataModelDesignerReport;
  conversion: ConversionOptimizationReport;
  video_to_website: VideoToWebsiteReport;
  debug_history: DebugHistoryReport;
  cross_site: CrossSiteIntelligenceReport;
  collaboration: TeamCollaborationReport;
  auto_update: AutoUpdateReport;
  knowledge_base: KnowledgeBaseReport;
  voice_dev: VoiceDevModeReport;
  legal_policy: LegalPolicyReport;
  cdn_optimizer: CdnOptimizerReport;
  personality: AiPersonalitySystemReport;
  startup_builder: AutoStartupBuilderReport;
}
