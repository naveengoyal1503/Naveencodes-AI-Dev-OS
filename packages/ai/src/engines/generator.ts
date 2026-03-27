import { getTranslationBundles } from "./i18n";
import { generateDesignSystem } from "./design";
import type {
  BusinessSuggestionSet,
  GeneratedApiBlueprint,
  GeneratedComponentBlueprint,
  GeneratedFileBlueprint,
  GeneratedProjectBlueprint,
  GeneratedRouteBlueprint,
  ProjectGenerationInput,
  SupportedProjectType
} from "./types";
import { interpretCommand } from "./interpreter";

export function createBusinessSuggestions(projectType: SupportedProjectType): BusinessSuggestionSet {
  switch (projectType) {
    case "blog":
      return {
        categories: ["Engineering", "WordPress", "Performance", "Architecture"],
        contentStructure: ["Hero story", "Featured posts", "Category hubs", "Author trust section"],
        monetizationOptions: ["Lead generation", "Consulting inquiries", "Sponsored content"],
        seoKeywords: ["wordpress plugin development", "php performance", "scalable wordpress architecture"]
      };
    case "ecommerce":
      return {
        categories: ["Featured products", "Collections", "Deals", "Reviews"],
        contentStructure: ["Hero merchandising", "Collection grid", "Trust block", "Checkout reassurance"],
        monetizationOptions: ["Direct sales", "Bundles", "Upsells", "Subscriptions"],
        seoKeywords: ["buy online", "best ecommerce store", "fast checkout experience"]
      };
    case "landing":
      return {
        categories: ["Benefits", "Proof", "Pricing", "FAQ"],
        contentStructure: ["Hero CTA", "Value narrative", "Use cases", "Conversion footer"],
        monetizationOptions: ["Lead capture", "Consultation booking", "Product launch funnel"],
        seoKeywords: ["conversion landing page", "growth campaign", "product launch website"]
      };
    case "admin":
      return {
        categories: ["Operations", "Team management", "Audit logs", "Integrations"],
        contentStructure: ["Overview KPIs", "Workflow tables", "Permissions", "Alerts"],
        monetizationOptions: ["Seat-based pricing", "Enterprise contracts", "Premium analytics"],
        seoKeywords: ["admin dashboard", "operations software", "workflow management"]
      };
    case "saas":
    default:
      return {
        categories: ["Overview", "Analytics", "Automation", "Settings"],
        contentStructure: ["Hero metrics", "Feature modules", "Pricing cues", "Customer proof"],
        monetizationOptions: ["Subscriptions", "Usage-based billing", "Premium support"],
        seoKeywords: ["saas dashboard", "automation software", "ai developer platform"]
      };
  }
}

function createRoutes(projectType: SupportedProjectType): GeneratedRouteBlueprint[] {
  const base = [
    { path: "/", title: "Home", purpose: "Primary entry point and conversion surface" }
  ];

  if (projectType === "blog") {
    return [
      ...base,
      { path: "/blog", title: "Blog listing", purpose: "Lists latest and featured articles" },
      { path: "/blog/[slug]", title: "Blog detail", purpose: "Article detail page with SEO metadata" },
      { path: "/category/[slug]", title: "Category archive", purpose: "Topic-focused archive listing" },
      { path: "/search", title: "Search", purpose: "Cross-site content discovery" }
    ];
  }

  if (projectType === "ecommerce") {
    return [
      ...base,
      { path: "/products", title: "Product listing", purpose: "Browse and filter products" },
      { path: "/products/[slug]", title: "Product detail", purpose: "Product description and purchase CTA" },
      { path: "/cart", title: "Cart", purpose: "Review and update cart items" },
      { path: "/checkout", title: "Checkout", purpose: "Order placement workflow" }
    ];
  }

  if (projectType === "admin") {
    return [
      ...base,
      { path: "/dashboard", title: "Dashboard", purpose: "Admin KPIs and alerts" },
      { path: "/users", title: "Users", purpose: "User and permission management" },
      { path: "/settings", title: "Settings", purpose: "Operational controls" }
    ];
  }

  if (projectType === "landing") {
    return [
      ...base,
      { path: "/pricing", title: "Pricing", purpose: "Plan comparison and purchase intent" },
      { path: "/contact", title: "Contact", purpose: "Lead capture and qualification" }
    ];
  }

  return [
    ...base,
    { path: "/dashboard", title: "Dashboard", purpose: "Operational cockpit with data views" },
    { path: "/settings", title: "Settings", purpose: "Account and workspace controls" },
    { path: "/reports", title: "Reports", purpose: "Generated output and saved artifacts" }
  ];
}

function createComponents(projectType: SupportedProjectType): GeneratedComponentBlueprint[] {
  const base: GeneratedComponentBlueprint[] = [
    { name: "HeroSection", type: "layout", description: "Primary positioning block with intent-specific CTA." },
    { name: "SectionCard", type: "content", description: "Reusable content card with title, body, and actions." },
    { name: "SmartForm", type: "form", description: "Validated form shell for capture, checkout, or settings." },
    { name: "ModalShell", type: "utility", description: "Overlay container for confirmations and previews." },
    { name: "PrimaryButton", type: "utility", description: "Default call-to-action button with premium states." }
  ];

  const projectSpecific: Record<SupportedProjectType, GeneratedComponentBlueprint[]> = {
    blog: [
      { name: "PostCard", type: "content", description: "Card for article previews, tags, and publish metadata." },
      { name: "CategoryRail", type: "navigation", description: "Category switcher and sticky topic navigation." }
    ],
    ecommerce: [
      { name: "ProductCard", type: "commerce", description: "Merchandising card with price, rating, and stock state." },
      { name: "CheckoutSummary", type: "commerce", description: "Order total, shipping, and promotion summary." }
    ],
    saas: [
      { name: "MetricCard", type: "data", description: "KPI surface with trend and status indicators." },
      { name: "CommandBar", type: "navigation", description: "Prompt-driven AI action bar." }
    ],
    landing: [
      { name: "TestimonialRail", type: "content", description: "Proof strip with customer outcomes." },
      { name: "PricingPanel", type: "content", description: "Offer comparison block with conversion CTA." }
    ],
    admin: [
      { name: "DataTable", type: "data", description: "Admin table with filters, status pills, and bulk actions." },
      { name: "RoleSelector", type: "form", description: "Permission-aware role assignment control." }
    ]
  };

  return [...base, ...projectSpecific[projectType]];
}

function createApis(projectType: SupportedProjectType): GeneratedApiBlueprint[] {
  const base: GeneratedApiBlueprint[] = [
    { method: "GET", path: "/api/health", purpose: "Platform health and configuration readiness." }
  ];

  if (projectType === "blog") {
    return [
      ...base,
      { method: "GET", path: "/api/posts", purpose: "Paginated post listing and search." },
      { method: "GET", path: "/api/posts/:slug", purpose: "Blog article detail response." },
      { method: "GET", path: "/api/categories", purpose: "Category navigation and counts." }
    ];
  }

  if (projectType === "ecommerce") {
    return [
      ...base,
      { method: "GET", path: "/api/products", purpose: "Product catalog and filters." },
      { method: "POST", path: "/api/cart", purpose: "Cart updates and quantity changes." },
      { method: "POST", path: "/api/orders", purpose: "Order creation and checkout finalization." }
    ];
  }

  return [
    ...base,
    { method: "GET", path: "/api/dashboard", purpose: "Dashboard summary metrics and feed data." },
    { method: "GET", path: "/api/settings", purpose: "Workspace settings retrieval." }
  ];
}

function createFolders(projectType: SupportedProjectType): string[] {
  return [
    "app/",
    "components/ui/",
    "components/sections/",
    "hooks/",
    "lib/",
    "lib/i18n/",
    `lib/templates/${projectType}/`,
    "server/api/"
  ];
}

function createFiles(projectType: SupportedProjectType): GeneratedFileBlueprint[] {
  return [
    { path: `app/(marketing)/page.tsx`, purpose: "Primary generated entry page." },
    { path: `components/ui/button.tsx`, purpose: "Reusable auto-component button system." },
    { path: `components/ui/card.tsx`, purpose: "Reusable card system with multiple densities." },
    { path: `components/ui/modal.tsx`, purpose: "Reusable modal and sheet behavior." },
    { path: `components/ui/form-field.tsx`, purpose: "Typed form primitive with labels and errors." },
    { path: `lib/templates/${projectType}/project.config.ts`, purpose: "Template-specific structure configuration." },
    { path: "lib/i18n/messages.ts", purpose: "Multi-language message bundles and locale metadata." },
    { path: "server/api/index.ts", purpose: "Generated API surface for the project template." }
  ];
}

function createSummary(projectType: SupportedProjectType, idea: string): string {
  const intros: Record<SupportedProjectType, string> = {
    blog: "Content-led publishing system",
    ecommerce: "Conversion-first commerce platform",
    saas: "Subscription SaaS workspace",
    landing: "Campaign-grade marketing site",
    admin: "Operational admin platform"
  };

  return `${intros[projectType]} generated from idea: ${idea}`;
}

export function generateProjectBlueprint(input: ProjectGenerationInput): GeneratedProjectBlueprint {
  const command = interpretCommand(input.idea);
  const projectType = command.projectType;
  const design = generateDesignSystem({ projectType, tone: "modern SaaS" });

  return {
    projectType,
    idea: input.idea,
    appName: input.idea
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || `${projectType}-project`,
    summary: createSummary(projectType, input.idea),
    architecture: [
      "Next.js frontend with route groups and reusable section primitives",
      "Typed API layer for dynamic content and generation workflows",
      "Shared design tokens, i18n bundles, and business strategy metadata"
    ],
    folders: createFolders(projectType),
    files: createFiles(projectType),
    routes: createRoutes(projectType),
    components: createComponents(projectType),
    apis: createApis(projectType),
    responsive: design.responsive,
    designTokens: design.tokens,
    business: createBusinessSuggestions(projectType),
    translations: getTranslationBundles()
  };
}
