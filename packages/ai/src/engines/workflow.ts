import type { WorkflowDefinition } from "./types";

export const workflowRegistry: WorkflowDefinition[] = [
  {
    name: "full_site_audit",
    description: "Runs the complete audit stack across SEO, UI, errors, and APIs.",
    module: "foundation.fullSiteAudit"
  },
  {
    name: "seo_full_scan",
    description: "Validates metadata, indexing, structured data, and technical SEO signals.",
    module: "seo.run"
  },
  {
    name: "performance_scan",
    description: "Captures browser performance telemetry and optimization opportunities.",
    module: "performance.run"
  },
  {
    name: "ui_responsive_test",
    description: "Checks responsive layouts and visual regressions across viewports.",
    module: "ui.run"
  },
  {
    name: "ecommerce_flow_test",
    description: "Executes purchase-flow smoke tests for ecommerce targets.",
    module: "commerce.run"
  },
  {
    name: "error_monitor_live",
    description: "Streams browser console and network failures in real time.",
    module: "errors.stream"
  },
  {
    name: "qa_autofix_loop",
    description: "Runs browser QA, generates fixes, and re-tests until stable.",
    module: "qa.autoFixLoop"
  },
  {
    name: "live_monitor_mode",
    description: "Keeps watching console, UI, and network signals in real time.",
    module: "qa.liveMonitor"
  },
  {
    name: "load_test_engine",
    description: "Simulates concurrent users to expose bottlenecks and breaking points.",
    module: "performance.load"
  },
  {
    name: "security_scan",
    description: "Scans exposed endpoints, input validation, and auth hardening.",
    module: "security.scan"
  },
  {
    name: "competitor_analysis",
    description: "Compares a target site against a competitor across SEO, UI, and performance.",
    module: "intelligence.competitor"
  },
  {
    name: "content_generation",
    description: "Generates SEO content plans, meta, headings, and schema ideas.",
    module: "intelligence.content"
  },
  {
    name: "senior_dev_review",
    description: "Reviews architecture with senior-engineer level pattern guidance.",
    module: "intelligence.seniorDev"
  },
  {
    name: "auto_refactor",
    description: "Suggests structural refactors and redundancy removal strategies.",
    module: "intelligence.refactor"
  },
  {
    name: "codebase_understanding",
    description: "Maps dependencies, component usage, data flow, and safe change impact.",
    module: "autonomous.codebase"
  },
  {
    name: "auto_bug_reproducer",
    description: "Reproduces an issue, confirms the bug, and prepares the fix path.",
    module: "autonomous.bugReproducer"
  },
  {
    name: "ai_thinking_engine",
    description: "Plans work before execution and validates each step.",
    module: "autonomous.thinking"
  },
  {
    name: "smart_version_control",
    description: "Uses git context to suggest safe branch, rollback, and release moves.",
    module: "autonomous.versionControl"
  },
  {
    name: "goal_based_execution",
    description: "Turns business goals like conversion growth into concrete execution plans.",
    module: "autonomous.goalExecution"
  },
  {
    name: "auto_feature_generator",
    description: "Transforms feature requests into backend, frontend, data, and test plans.",
    module: "autonomous.featureGenerator"
  },
  {
    name: "global_site_health",
    description: "Calculates one health score from SEO, performance, UI, and security.",
    module: "autonomous.health"
  },
  {
    name: "real_device_testing",
    description: "Simulates mobile, tablet, slow network, and CPU-constrained scenarios.",
    module: "autonomous.deviceTesting"
  },
  {
    name: "integration_engine",
    description: "Connects operational data sources and turns them into actionable analysis.",
    module: "autonomous.integrations"
  },
  {
    name: "architect_mode",
    description: "Reviews architecture, scale boundaries, and pattern choices.",
    module: "autonomous.architect"
  },
  {
    name: "simulation_engine",
    description: "Simulates traffic growth, predicts failures, and proposes stress plans.",
    module: "autonomous.simulation"
  },
  {
    name: "website_clone_engine",
    description: "Analyzes a source website and generates an improved version plan.",
    module: "autonomous.clone"
  },
  {
    name: "memory_engine",
    description: "Stores recurring issues, fixes, and user preferences for future work.",
    module: "autonomous.memory"
  },
  {
    name: "self_healing_engine",
    description: "Detects incidents, prepares auto-fix actions, and models redeploy flow.",
    module: "autonomous.selfHealing"
  },
  {
    name: "client_ai_assistant",
    description: "Provides simplified client-facing AI guidance and next actions.",
    module: "autonomous.clientAssistant"
  },
  {
    name: "product_strategist_ai",
    description: "Generates SaaS ideas, build plans, and launch guidance.",
    module: "autonomous.productStrategist"
  },
  {
    name: "compliance_engine",
    description: "Checks privacy, cookies, and GDPR-adjacent release readiness.",
    module: "autonomous.compliance"
  },
  {
    name: "ai_team_system",
    description: "Simulates AI developer, QA, SEO, and designer contributions.",
    module: "autonomous.aiTeam"
  },
  {
    name: "next_gen_autonomous",
    description: "Combines all Part 7 autonomous modules into one executive report.",
    module: "autonomous.orchestrator"
  },
  {
    name: "digital_twin_engine",
    description: "Builds a virtual replica to run safe UI, performance, and A/B experiments.",
    module: "ecosystem.digitalTwin"
  },
  {
    name: "predictive_ai_engine",
    description: "Predicts API, performance, and scaling issues before they surface.",
    module: "ecosystem.predictive"
  },
  {
    name: "human_behavior_simulator",
    description: "Models random clicks, scrolls, rage clicks, and drop-off behavior.",
    module: "ecosystem.behavior"
  },
  {
    name: "chaos_engine",
    description: "Injects failure scenarios to test resilience and recovery strategies.",
    module: "ecosystem.chaos"
  },
  {
    name: "code_style_enforcer",
    description: "Enforces code standards, naming conventions, and consistency rules.",
    module: "ecosystem.codeStyle"
  },
  {
    name: "ai_app_store",
    description: "Builds a plugin and add-on marketplace around the platform ecosystem.",
    module: "ecosystem.appStore"
  },
  {
    name: "auto_backend_generator",
    description: "Generates APIs, schema, and admin panel plans for full-stack projects.",
    module: "ecosystem.backendGenerator"
  },
  {
    name: "data_model_designer",
    description: "Designs scalable relations, indexes, and persistence strategies.",
    module: "ecosystem.dataModel"
  },
  {
    name: "conversion_optimization_engine",
    description: "Improves CTA placement, UX flow, and user engagement patterns.",
    module: "ecosystem.conversion"
  },
  {
    name: "video_to_website_engine",
    description: "Converts video input into UI sections and code targets.",
    module: "ecosystem.videoToWebsite"
  },
  {
    name: "debug_history_system",
    description: "Stores issue, fix, and timeline history for recurring debugging patterns.",
    module: "ecosystem.debugHistory"
  },
  {
    name: "cross_site_intelligence",
    description: "Transfers learnings and best practices across multiple projects.",
    module: "ecosystem.crossSite"
  },
  {
    name: "team_collaboration_system",
    description: "Supports shared projects, comments, and role-aware collaboration flows.",
    module: "ecosystem.collaboration"
  },
  {
    name: "auto_update_engine",
    description: "Updates dependencies, tests compatibility, and protects releases.",
    module: "ecosystem.autoUpdate"
  },
  {
    name: "knowledge_base_engine",
    description: "Generates documentation, API docs, and usage guides automatically.",
    module: "ecosystem.knowledgeBase"
  },
  {
    name: "voice_dev_mode",
    description: "Maps voice commands into development and platform actions.",
    module: "ecosystem.voiceDev"
  },
  {
    name: "legal_policy_engine",
    description: "Generates privacy, terms, and cookie policy foundations.",
    module: "ecosystem.legalPolicy"
  },
  {
    name: "cdn_optimizer",
    description: "Optimizes delivery routes and caching by user region.",
    module: "ecosystem.cdn"
  },
  {
    name: "ai_personality_system",
    description: "Switches between beginner, senior-dev, and strict-reviewer modes.",
    module: "ecosystem.personality"
  },
  {
    name: "auto_startup_builder",
    description: "Generates a startup idea, product, deployment, and marketing plan.",
    module: "ecosystem.startupBuilder"
  },
  {
    name: "future_ai_ecosystem",
    description: "Combines all Part 8 future ecosystem modules into one evolving report.",
    module: "ecosystem.orchestrator"
  }
];
