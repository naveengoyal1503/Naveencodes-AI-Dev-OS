import "dotenv/config";

import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  APP_URL: z.string().url().default("http://localhost:3000"),
  FRONTEND_BASE_URL: z.string().url().default("http://localhost:3000"),
  BACKEND_BASE_URL: z.string().url().default("http://localhost:4000"),
  CORS_ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:4000"),
  JWT_SECRET: z.string().min(8).default("change-this-production-secret"),
  ENCRYPTION_SECRET: z.string().min(16).default("change-this-encryption-secret"),
  DB_HOST: z.string().default("127.0.0.1"),
  DB_PORT: z.coerce.number().default(3306),
  DB_NAME: z.string().default("naveencodes_ai"),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string().default(""),
  DB_CONNECTION_LIMIT: z.coerce.number().default(10),
  DB_SSL: z.coerce.boolean().default(false),
  REDIS_URL: z.string().min(1).default("redis://127.0.0.1:6379"),
  AI_PROVIDER: z.enum(["openai"]).default("openai"),
  AI_PROVIDER_BASE_URL: z.string().url().default("https://api.openai.com/v1"),
  AI_PROVIDER_MODEL: z.string().default("gpt-4.1-mini"),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().default(60000),
  AI_SYSTEM_PROMPT: z
    .string()
    .default("You are a senior AI software engineer. Give concise, production-focused analysis and remediation steps."),
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
