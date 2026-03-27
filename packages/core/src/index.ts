export type UserRole = "admin" | "manager" | "member";

export interface AppEnv {
  NODE_ENV: string;
  PORT: number;
  APP_URL: string;
  NEXT_PUBLIC_API_URL: string;
  JWT_SECRET: string;
  DATABASE_URL: string;
  REDIS_URL: string;
  MCP_BROWSER_URL: string;
  MCP_SERVER_COMMAND: string;
  MCP_SERVER_ARGS: string;
  QA_DEFAULT_TARGET_URL: string;
  QA_LOAD_TEST_USERS: number;
  QA_AUTO_FIX_SAFE_MODE: string;
  FRONTEND_BASE_URL: string;
  BACKEND_BASE_URL: string;
  PREVIEW_BASE_DOMAIN: string;
  PRODUCTION_BASE_DOMAIN: string;
  VERCEL_TEAM_SLUG: string;
  GITHUB_REPO_URL: string;
  GITHUB_DEFAULT_BRANCH: string;
  PAYMENT_PROVIDER: string;
  STRIPE_PUBLIC_KEY: string;
  STRIPE_SECRET_KEY: string;
  ALERT_WEBHOOK_URL: string;
}

export interface NavItem {
  href: string;
  label: string;
  description: string;
}

export const dashboardNavigation: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Operational overview and health summaries."
  },
  {
    href: "/projects",
    label: "Projects",
    description: "Managed audit targets and execution history."
  },
  {
    href: "/monitoring",
    label: "Monitoring",
    description: "Realtime logs, requests, and system charts."
  },
  {
    href: "/seo",
    label: "SEO",
    description: "Technical SEO issues, score, and recommendations."
  },
  {
    href: "/performance",
    label: "Performance",
    description: "Core web vitals, load trends, and optimization hints."
  },
  {
    href: "/ui-check",
    label: "UI Check",
    description: "Layout, responsive, and visual regression review."
  },
  {
    href: "/ecommerce",
    label: "Ecommerce",
    description: "Product, cart, checkout, and order validation."
  },
  {
    href: "/reports",
    label: "Reports",
    description: "Generated audit outputs, live QA, and auto-fix runs."
  },
  {
    href: "/autonomous",
    label: "Autonomous",
    description: "Next-gen AI orchestration, planning, health, and strategy."
  },
  {
    href: "/ecosystem",
    label: "Ecosystem",
    description: "Future AI experiments, simulations, updates, and startup building."
  },
  {
    href: "/client",
    label: "Client",
    description: "Login, project history, and multi-site workspace."
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Workspace, auth, and MCP configuration."
  },
  {
    href: "/explanation",
    label: "Guide",
    description: "What the platform does and how to use it."
  }
];

export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function getBaseUrl(value: string): string {
  return value.replace(/\/$/, "");
}
