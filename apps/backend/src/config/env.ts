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
  QA_AUTO_FIX_SAFE_MODE: z.enum(["strict", "balanced", "aggressive"]).default("balanced")
});

export type BackendEnv = z.infer<typeof schema>;

export function getEnv(): BackendEnv {
  return schema.parse(process.env);
}
