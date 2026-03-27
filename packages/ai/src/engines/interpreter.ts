import type { CommandIntent, SupportedProjectType } from "./types";

const projectTypeKeywords: Record<SupportedProjectType, string[]> = {
  blog: ["blog", "article", "content", "news", "seo"],
  ecommerce: ["ecommerce", "store", "product", "cart", "checkout", "order"],
  saas: ["saas", "dashboard", "subscription", "workspace", "analytics"],
  landing: ["landing", "marketing", "launch", "campaign"],
  admin: ["admin", "panel", "backoffice", "crm", "ops"]
};

function detectProjectType(input: string): SupportedProjectType {
  const normalized = input.toLowerCase();

  for (const [projectType, keywords] of Object.entries(projectTypeKeywords) as [
    SupportedProjectType,
    string[]
  ][]) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return projectType;
    }
  }

  return "saas";
}

function detectAction(input: string): CommandIntent["action"] {
  const normalized = input.toLowerCase();

  if (normalized.includes("figma") || normalized.includes("design image")) {
    return "convert_figma";
  }

  if (normalized.includes("improve ui") || normalized.includes("improve design")) {
    return "generate_design";
  }

  if (normalized.includes("design")) {
    return "generate_design";
  }

  return "generate_project";
}

export function interpretCommand(command: string): CommandIntent {
  const projectType = detectProjectType(command);
  const action = detectAction(command);
  const detectedEntities = command
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 4)
    .slice(0, 8);

  const suggestedTechStack =
    projectType === "blog"
      ? ["Next.js", "Markdown CMS", "Search", "SEO metadata"]
      : projectType === "ecommerce"
        ? ["Next.js", "Fastify", "Cart state", "Payments-ready APIs"]
        : projectType === "landing"
          ? ["Next.js", "Motion system", "Lead capture forms", "SEO pages"]
          : projectType === "admin"
            ? ["Next.js", "Fastify", "Tables", "RBAC"]
            : ["Next.js", "Fastify", "Auth", "Settings", "Data views"];

  return {
    action,
    projectType,
    confidence: 0.88,
    detectedEntities,
    suggestedTechStack
  };
}
