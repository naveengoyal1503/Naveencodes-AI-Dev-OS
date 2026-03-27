import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { generateProjectBlueprint } from "@naveencodes/ai";

const deploySchema = z.object({
  projectName: z.string().min(2),
  branch: z.string().default("main"),
  mode: z.enum(["preview", "production"]).default("preview")
});

const autoProductSchema = z.object({
  idea: z.string().min(3),
  techPreference: z.string().optional()
});

const gitSchema = z.object({
  branchName: z.string().min(2),
  updateType: z.enum(["initial setup", "UI added", "AI engine added", "fix update"]).default("fix update")
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

function buildPreviewUrl(projectName: string, previewBaseDomain: string): string {
  return `https://${slugify(projectName)}-${previewBaseDomain}`;
}

function buildProductionUrl(projectName: string, productionBaseDomain: string): string {
  return `https://${slugify(projectName)}.${productionBaseDomain}`;
}

export async function registerDeploymentRoutes(app: FastifyInstance) {
  app.get("/api/deployment/overview", async () => ({
    repository: app.config.GITHUB_REPO_URL,
    defaultBranch: app.config.GITHUB_DEFAULT_BRANCH,
    frontendPlatform: "Vercel",
    backendPlatform: "Node Server",
    continuousDeployment: "enabled",
    previews: {
      domain: app.config.PREVIEW_BASE_DOMAIN
    },
    production: {
      domain: app.config.PRODUCTION_BASE_DOMAIN
    },
    history: [
      {
        id: crypto.randomUUID(),
        project: "NaveenCodes.com",
        environment: "preview",
        status: "deployed",
        commit: "7b81318",
        url: buildPreviewUrl("naveencodes", app.config.PREVIEW_BASE_DOMAIN)
      },
      {
        id: crypto.randomUUID(),
        project: "NaveenCodes.com",
        environment: "production",
        status: "ready",
        commit: app.config.GITHUB_DEFAULT_BRANCH,
        url: buildProductionUrl("naveencodes", app.config.PRODUCTION_BASE_DOMAIN)
      }
    ]
  }));

  app.post("/api/deployment/deploy", async (request) => {
    const payload = deploySchema.parse(request.body);
    const previewUrl = buildPreviewUrl(payload.projectName, app.config.PREVIEW_BASE_DOMAIN);
    const productionUrl = buildProductionUrl(payload.projectName, app.config.PRODUCTION_BASE_DOMAIN);

    return {
      status: "deployed",
      build: "completed",
      frontend: {
        provider: "Vercel",
        url: payload.mode === "preview" ? previewUrl : productionUrl
      },
      backend: {
        provider: "Node Server",
        url: `${app.config.BACKEND_BASE_URL}/api`
      },
      previewUrl,
      productionUrl,
      liveUrl: payload.mode === "preview" ? previewUrl : productionUrl
    };
  });

  app.post("/api/deployment/preview", async (request) => {
    const payload = deploySchema.parse(request.body);
    return {
      previewUrl: buildPreviewUrl(payload.projectName, app.config.PREVIEW_BASE_DOMAIN),
      shareable: true,
      environment: "staging"
    };
  });

  app.post("/api/deployment/git", async (request) => {
    const payload = gitSchema.parse(request.body);
    return {
      repository: app.config.GITHUB_REPO_URL,
      branch: payload.branchName,
      commitMessage: payload.updateType,
      autoPush: true,
      versionControl: {
        branchCreation: "supported",
        fixUpdates: "supported",
        deploymentHooks: "supported"
      }
    };
  });

  app.post("/api/deployment/auto-product", async (request) => {
    const payload = autoProductSchema.parse(request.body);
    const blueprint = generateProjectBlueprint({
      idea: payload.idea,
      techPreference: payload.techPreference,
      locale: "en"
    });
    const previewUrl = buildPreviewUrl(blueprint.appName, app.config.PREVIEW_BASE_DOMAIN);
    const productionUrl = buildProductionUrl(blueprint.appName, app.config.PRODUCTION_BASE_DOMAIN);

    return {
      product: blueprint,
      deployment: {
        previewUrl,
        productionUrl,
        status: "ready-to-deploy"
      }
    };
  });
}
