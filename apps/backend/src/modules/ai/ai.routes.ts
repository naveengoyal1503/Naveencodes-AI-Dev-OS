import type { FastifyInstance } from "fastify";
import { z } from "zod";

import {
  analyzeAutoRefactor,
  analyzeCompetitorIntelligence,
  analyzeSeniorDevMode,
  convertDesignToCode,
  generateAdvancedIntelligenceReport,
  generateContentIntelligence,
  generateDesignSystem,
  generateProjectBlueprint,
  getTranslationBundles,
  interpretCommand,
  workflowRegistry,
  captureSelfLearningInsights
} from "@naveencodes/ai";
import { createChromeDevtoolsConnection } from "@naveencodes/mcp";

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
}
