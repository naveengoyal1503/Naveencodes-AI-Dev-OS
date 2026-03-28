import "dotenv/config";

import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:4000"),
  JWT_SECRET: z.string().min(8).default("change-this-production-secret"),
  DATABASE_URL: z.string().min(1).default("postgres://127.0.0.1:5432/naveencodes_ai"),
  REDIS_URL: z.string().min(1).default("redis://127.0.0.1:6379"),
  MCP_BROWSER_URL: z.string().url().default("http://127.0.0.1:9222"),
  MCP_SERVER_COMMAND: z.string().min(1).default("npx"),
  MCP_SERVER_ARGS: z.string().min(1).default("-y,chrome-devtools-mcp@0.20.3,--headless,--browser-url=http://127.0.0.1:9222"),
  CHROME_EXECUTABLE_PATH: z.string().optional(),
  CHROME_REMOTE_DEBUGGING_PORT: z.coerce.number().default(9222),
  CHROME_HEADLESS: z.coerce.boolean().default(true),
  CHROME_USER_DATA_DIR: z.string().default(".runtime/chrome-profile"),
  CHROME_STARTUP_TIMEOUT_MS: z.coerce.number().default(30000),
  CHROME_EXTRA_ARGS: z.string().default(""),
  QA_MAX_PARALLEL_SESSIONS: z.coerce.number().default(3),
  APP_LOG_FILE: z.string().default("logs/runtime.jsonl"),
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
