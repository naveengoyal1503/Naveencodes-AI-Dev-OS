import type { FastifyInstance } from "fastify";
import { z } from "zod";

import {
  analyzeCodebaseUnderstanding,
  analyzeAutoRefactor,
  analyzeCompetitorIntelligence,
  analyzeSeniorDevMode,
  analyzeSmartVersionControl,
  buildAiAppStoreSystem,
  buildAiTeamSystem,
  buildArchitectMode,
  buildAutoBugReproducer,
  buildAutoFeatureGenerator,
  buildAutoBackendGenerator,
  buildAutoStartupBuilder,
  buildClientAssistant,
  buildCdnOptimizer,
  buildChaosEngine,
  buildComplianceEngine,
  buildConversionOptimizationEngine,
  buildCrossSiteIntelligence,
  buildDataModelDesigner,
  buildDebugHistorySystem,
  buildDigitalTwinEngine,
  buildHumanBehaviorSimulator,
  buildKnowledgeBaseEngine,
  buildLegalPolicyEngine,
  buildGoalBasedExecution,
  buildIntegrationEngine,
  buildMemoryEngine,
  buildPredictiveAiEngine,
  buildProductStrategist,
  buildRealDeviceTesting,
  buildSelfHealingEngine,
  buildSimulationEngine,
  buildThinkingEngine,
  buildTeamCollaborationSystem,
  buildVoiceDevMode,
  buildWebsiteCloneEngine,
  buildVideoToWebsiteEngine,
  buildAiPersonalitySystem,
  buildCodeStyleEnforcer,
  buildAutoUpdateEngine,
  calculateGlobalSiteHealth,
  convertDesignToCode,
  generateFutureEcosystemReport,
  generateAdvancedIntelligenceReport,
  generateContentIntelligence,
  generateDesignSystem,
  generateNextGenAutonomousReport,
  generateProjectBlueprint,
  getTranslationBundles,
  interpretCommand,
  workflowRegistry,
  captureSelfLearningInsights
} from "@naveencodes/ai";
import { createChromeDevtoolsConnection } from "@naveencodes/mcp";
import { getLocalRepoSignals } from "./repo-insights.js";

const commandSchema = z.object({
  command: z.string().min(3)
});

const projectGenerationSchema = z.object({
  idea: z.string().min(3),
  techPreference: z.string().optional(),
  locale: z.enum(["en", "hi", "es"]).optional()
});

const designSchema = z.object({
  projectType: z.enum(["blog", "ecommerce", "saas", "landing", "admin"]),
  tone: z.string().optional()
});

const figmaSchema = z.object({
  figmaLink: z.string().url().optional(),
  designImage: z.string().url().optional(),
  notes: z.string().optional()
});

const intelligenceSchema = z.object({
  url: z.string().url(),
  sitePurpose: z.string().optional(),
  competitorUrl: z.string().url().optional(),
  keywords: z.array(z.string()).optional(),
  screenshotNotes: z.array(z.string()).optional()
});

const nextGenSchema = intelligenceSchema.extend({
  goal: z.string().optional(),
  featureRequest: z.string().optional(),
  issueSummary: z.string().optional(),
  cloneUrl: z.string().url().optional(),
  clientCommand: z.string().optional(),
  productPrompt: z.string().optional(),
  incidentSummary: z.string().optional(),
  integrationSources: z.array(z.enum(["github", "vercel", "chrome_devtools", "search_console", "stripe", "alerts"])).optional(),
  userPreferences: z.array(z.string()).optional()
});

const futureSchema = nextGenSchema.extend({
  videoSource: z.string().optional(),
  projects: z.array(z.string()).optional(),
  regions: z.array(z.string()).optional(),
  personalityMode: z.enum(["beginner", "senior_dev", "strict_reviewer"]).optional(),
  startupPrompt: z.string().optional()
});

export async function registerAiRoutes(app: FastifyInstance) {
  app.get("/api/ai/workflows", async () => ({
    items: workflowRegistry
  }));

  app.get("/api/ai/mcp", async () => ({
    connection: createChromeDevtoolsConnection({
      browserUrl: app.config.MCP_BROWSER_URL,
      command: app.config.MCP_SERVER_COMMAND,
      args: app.config.MCP_SERVER_ARGS.split(",")
    }).toMcpJsonEntry()
  }));

  app.post("/api/ai/interpret", async (request) => {
    const payload = commandSchema.parse(request.body);
    return {
      intent: interpretCommand(payload.command)
    };
  });

  app.post("/api/ai/generate-project", async (request) => {
    const payload = projectGenerationSchema.parse(request.body);
    return {
      blueprint: generateProjectBlueprint(payload)
    };
  });

  app.post("/api/ai/generate-design", async (request) => {
    const payload = designSchema.parse(request.body);
    return {
      design: generateDesignSystem(payload)
    };
  });

  app.post("/api/ai/figma-to-code", async (request) => {
    const payload = figmaSchema.parse(request.body);
    return {
      result: convertDesignToCode(payload)
    };
  });

  app.get("/api/ai/i18n", async () => ({
    locales: getTranslationBundles()
  }));

  app.post("/api/ai/intelligence", async (request) => {
    const payload = intelligenceSchema.parse(request.body);
    return {
      report: generateAdvancedIntelligenceReport(payload)
    };
  });

  app.post("/api/ai/competitor", async (request) => {
    const payload = intelligenceSchema.parse(request.body);
    return {
      competitor: analyzeCompetitorIntelligence(payload)
    };
  });

  app.post("/api/ai/content", async (request) => {
    const payload = intelligenceSchema.parse(request.body);
    return {
      content: generateContentIntelligence(payload)
    };
  });

  app.post("/api/ai/refactor", async (request) => {
    const payload = intelligenceSchema.parse(request.body);
    return {
      refactor: analyzeAutoRefactor(payload),
      seniorDev: analyzeSeniorDevMode(payload)
    };
  });

  app.post("/api/ai/self-learning", async (request) => {
    const payload = intelligenceSchema.parse(request.body);
    return {
      memory: captureSelfLearningInsights(payload)
    };
  });

  app.post("/api/ai/next-gen", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      report: generateNextGenAutonomousReport({
        ...payload,
        repoSignals: getLocalRepoSignals()
      })
    };
  });

  app.post("/api/ai/codebase-understanding", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      codebase: analyzeCodebaseUnderstanding({
        ...payload,
        repoSignals: getLocalRepoSignals()
      })
    };
  });

  app.post("/api/ai/bug-reproducer", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      bug: buildAutoBugReproducer(payload)
    };
  });

  app.post("/api/ai/thinking", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      thinking: buildThinkingEngine(payload)
    };
  });

  app.post("/api/ai/version-control", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      versionControl: analyzeSmartVersionControl({
        ...payload,
        repoSignals: getLocalRepoSignals()
      })
    };
  });

  app.post("/api/ai/goal-execution", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      goalExecution: buildGoalBasedExecution(payload)
    };
  });

  app.post("/api/ai/feature-generator", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      feature: buildAutoFeatureGenerator(payload)
    };
  });

  app.post("/api/ai/health-score", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      health: calculateGlobalSiteHealth(payload)
    };
  });

  app.post("/api/ai/device-testing", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      devices: buildRealDeviceTesting(payload)
    };
  });

  app.post("/api/ai/integrations", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      integrations: buildIntegrationEngine({
        ...payload,
        repoSignals: getLocalRepoSignals()
      })
    };
  });

  app.post("/api/ai/architect", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      architecture: buildArchitectMode(payload)
    };
  });

  app.post("/api/ai/simulate", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      simulation: buildSimulationEngine(payload)
    };
  });

  app.post("/api/ai/clone", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      clone: buildWebsiteCloneEngine(payload)
    };
  });

  app.post("/api/ai/memory-engine", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      memory: buildMemoryEngine(payload)
    };
  });

  app.post("/api/ai/self-heal", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      selfHealing: buildSelfHealingEngine(payload)
    };
  });

  app.post("/api/ai/client-assistant", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      assistant: buildClientAssistant(payload)
    };
  });

  app.post("/api/ai/product-strategist", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      strategist: buildProductStrategist(payload)
    };
  });

  app.post("/api/ai/compliance", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      compliance: buildComplianceEngine(payload)
    };
  });

  app.post("/api/ai/ai-team", async (request) => {
    const payload = nextGenSchema.parse(request.body);
    return {
      team: buildAiTeamSystem(payload)
    };
  });

  app.post("/api/ai/future-ecosystem", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      report: generateFutureEcosystemReport({
        ...payload,
        repoSignals: getLocalRepoSignals()
      })
    };
  });

  app.post("/api/ai/digital-twin", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      digitalTwin: buildDigitalTwinEngine(payload)
    };
  });

  app.post("/api/ai/predictive", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      predictive: buildPredictiveAiEngine(payload)
    };
  });

  app.post("/api/ai/behavior-simulator", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      behavior: buildHumanBehaviorSimulator(payload)
    };
  });

  app.post("/api/ai/chaos", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      chaos: buildChaosEngine(payload)
    };
  });

  app.post("/api/ai/code-style", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      codeStyle: buildCodeStyleEnforcer({
        ...payload,
        repoSignals: getLocalRepoSignals()
      })
    };
  });

  app.post("/api/ai/app-store", async () => ({
    appStore: buildAiAppStoreSystem()
  }));

  app.post("/api/ai/backend-generator", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      backend: buildAutoBackendGenerator(payload)
    };
  });

  app.post("/api/ai/data-model", async () => ({
    dataModel: buildDataModelDesigner()
  }));

  app.post("/api/ai/conversion-optimizer", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      conversion: buildConversionOptimizationEngine(payload)
    };
  });

  app.post("/api/ai/video-to-website", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      video: buildVideoToWebsiteEngine(payload)
    };
  });

  app.post("/api/ai/debug-history", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      debugHistory: buildDebugHistorySystem(payload)
    };
  });

  app.post("/api/ai/cross-site", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      crossSite: buildCrossSiteIntelligence(payload)
    };
  });

  app.post("/api/ai/collaboration", async () => ({
    collaboration: buildTeamCollaborationSystem()
  }));

  app.post("/api/ai/auto-update", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      autoUpdate: buildAutoUpdateEngine({
        ...payload,
        repoSignals: getLocalRepoSignals()
      })
    };
  });

  app.post("/api/ai/knowledge-base", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      knowledgeBase: buildKnowledgeBaseEngine(payload)
    };
  });

  app.post("/api/ai/voice-dev", async () => ({
    voiceDev: buildVoiceDevMode()
  }));

  app.post("/api/ai/legal-policy", async () => ({
    legalPolicy: buildLegalPolicyEngine()
  }));

  app.post("/api/ai/cdn-optimizer", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      cdn: buildCdnOptimizer(payload)
    };
  });

  app.post("/api/ai/personality", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      personality: buildAiPersonalitySystem(payload)
    };
  });

  app.post("/api/ai/startup-builder", async (request) => {
    const payload = futureSchema.parse(request.body);
    return {
      startup: buildAutoStartupBuilder(payload)
    };
  });
}
