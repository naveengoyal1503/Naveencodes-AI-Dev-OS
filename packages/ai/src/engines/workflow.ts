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
  }
];
