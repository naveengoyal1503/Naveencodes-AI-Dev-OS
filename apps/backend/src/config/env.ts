import "dotenv/config";

import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:4000"),
  JWT_SECRET: z.string().min(8),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  MCP_BROWSER_URL: z.string().url(),
  MCP_SERVER_COMMAND: z.string().min(1),
  MCP_SERVER_ARGS: z.string().min(1),
  QA_DEFAULT_TARGET_URL: z.string().url().default("http://localhost:3000"),
  QA_LOAD_TEST_USERS: z.coerce.number().default(25),
  QA_AUTO_FIX_SAFE_MODE: z.enum(["strict", "balanced", "aggressive"]).default("balanced"),
  FRONTEND_BASE_URL: z.string().url().default("http://localhost:3000"),
  BACKEND_BASE_URL: z.string().url().default("http://localhost:4000"),
  PREVIEW_BASE_DOMAIN: z.string().default("preview.naveencodes.dev"),
  PRODUCTION_BASE_DOMAIN: z.string().default("app.naveencodes.dev"),
  VERCEL_TEAM_SLUG: z.string().default("naveencodes"),
  GITHUB_REPO_URL: z.string().url().default("https://github.com/naveengoyal1503/Naveencodes-AI-Dev-OS"),
  GITHUB_DEFAULT_BRANCH: z.string().default("main"),
  PAYMENT_PROVIDER: z.string().default("stripe"),
  STRIPE_PUBLIC_KEY: z.string().default("pk_test_change_me"),
  STRIPE_SECRET_KEY: z.string().default("sk_test_change_me"),
  ALERT_WEBHOOK_URL: z.string().url().default("https://hooks.example.com/naveencodes-ai"),
  SERVE_FRONTEND_STATIC: z.coerce.boolean().default(false),
  FRONTEND_STATIC_DIR: z.string().default("apps/frontend/out")
});

export type BackendEnv = z.infer<typeof schema>;

export function getEnv(): BackendEnv {
  return schema.parse(process.env);
}
