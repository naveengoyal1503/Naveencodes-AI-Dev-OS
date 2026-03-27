import type { DesignGenerationInput, DesignTokenScale, ResponsiveBlueprint, SupportedProjectType } from "./types";

const projectPalettes: Record<SupportedProjectType, DesignTokenScale> = {
  blog: {
    spacing: ["4", "8", "12", "16", "24", "32", "48", "72"],
    typography: ["12", "14", "16", "20", "28", "40", "56"],
    palette: {
      base: "#0f172a",
      surface: "#ffffff",
      accent: "#d97706",
      muted: "#64748b",
      highlight: "#fef3c7"
    }
  },
  ecommerce: {
    spacing: ["4", "8", "12", "16", "20", "28", "40", "64"],
    typography: ["12", "14", "16", "18", "24", "32", "48"],
    palette: {
      base: "#052e16",
      surface: "#ffffff",
      accent: "#22c55e",
      muted: "#475569",
      highlight: "#dcfce7"
    }
  },
  saas: {
    spacing: ["4", "8", "12", "16", "24", "32", "48", "80"],
    typography: ["12", "14", "16", "20", "28", "36", "52"],
    palette: {
      base: "#020617",
      surface: "#f8fafc",
      accent: "#0ea5e9",
      muted: "#64748b",
      highlight: "#dbeafe"
    }
  },
  landing: {
    spacing: ["4", "8", "12", "16", "24", "40", "56", "88"],
    typography: ["12", "14", "16", "22", "32", "48", "72"],
    palette: {
      base: "#111827",
      surface: "#fffaf0",
      accent: "#ef4444",
      muted: "#6b7280",
      highlight: "#fee2e2"
    }
  },
  admin: {
    spacing: ["4", "8", "12", "16", "20", "24", "32", "48"],
    typography: ["12", "13", "15", "18", "24", "30", "42"],
    palette: {
      base: "#0f172a",
      surface: "#f8fafc",
      accent: "#8b5cf6",
      muted: "#64748b",
      highlight: "#ede9fe"
    }
  }
};

export function createResponsiveBlueprint(projectType: SupportedProjectType): ResponsiveBlueprint {
  const common = {
    mobile: ["Single-column priority layout", "Sticky bottom actions", "Reduced navigation depth"],
    tablet: ["Two-column content regions", "Compact navigation rail", "Persistent filter access"],
    desktop: ["Wide data canvas", "Sidebar plus utility panel", "Dense content with stronger hierarchy"]
  };

  if (projectType === "ecommerce") {
    return {
      mobile: [...common.mobile, "Swipeable product galleries", "Full-width purchase CTA"],
      tablet: [...common.tablet, "Product grid with promo blocks"],
      desktop: [...common.desktop, "Merchandising rail and cart preview"]
    };
  }

  return common;
}

export function generateDesignSystem(input: DesignGenerationInput) {
  const projectType = input.projectType;
  return {
    tokens: projectPalettes[projectType],
    guidance: [
      "Use mobile-first spacing and component density.",
      "Keep typography scale deliberate and non-generic.",
      `Design tone: ${input.tone ?? "premium SaaS"}`
    ],
    responsive: createResponsiveBlueprint(projectType)
  };
}
