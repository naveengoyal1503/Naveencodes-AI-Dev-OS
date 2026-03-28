import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import staticSite from "@fastify/static";
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createChromeDevtoolsConnection } from "@naveencodes/mcp";

import { getEnv } from "./config/env.js";
import { createDatabasePool, createRedisClient } from "./infrastructure/db.js";
import { registerAnalyticsRoutes } from "./modules/analytics/analytics.routes.js";
import { registerAuthRoutes } from "./modules/auth/auth.routes.js";
import { registerAiRoutes } from "./modules/ai/ai.routes.js";
import { registerBillingRoutes } from "./modules/billing/billing.routes.js";
import { registerChatRoutes } from "./modules/chat/chat.routes.js";
import { registerClientRoutes } from "./modules/client/client.routes.js";
import { registerDashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { registerDeploymentRoutes } from "./modules/deployment/deployment.routes.js";
import { registerNotificationRoutes } from "./modules/notifications/notifications.routes.js";
import { registerPluginRoutes } from "./modules/plugins/plugins.routes.js";
import { registerProjectRoutes } from "./modules/projects/projects.routes.js";
import { registerQaRoutes } from "./modules/qa/qa.routes.js";
import { registerReportRoutes } from "./modules/reports/reports.routes.js";
import { registerWebsocket } from "./plugins/websocket.js";

declare module "fastify" {
  interface FastifyInstance {
    config: ReturnType<typeof getEnv>;
  }
}

function getProcessEnvRecord() {
  return Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
}

function normalizeStaticPath(root: string, requestedPath: string) {
  const relativePath = requestedPath.replace(/^[/\\]+/, "");
  const absolutePath = path.resolve(root, relativePath);

  if (!absolutePath.startsWith(root)) {
    return null;
  }

  return {
    absolutePath,
    relativePath: relativePath.split(path.sep).join("/")
  };
}

function isFilePath(targetPath: string) {
  return existsSync(targetPath) && statSync(targetPath).isFile();
}

export async function buildServer() {
  const env = getEnv();
  const app = Fastify({
    logger: true
  });

  app.decorate("config", env);

  const pool = createDatabasePool(env);
  const redis = createRedisClient(env);

  app.addHook("onClose", async () => {
    await pool.end();
    if (redis.status !== "end") {
      await redis.quit();
    }
  });

  await app.register(cors, {
    origin: [env.APP_URL]
  });

  await app.register(rateLimit, {
    global: true,
    max: 150,
    timeWindow: "1 minute"
  });

  await registerWebsocket(app);
  await registerAuthRoutes(app);
  await registerProjectRoutes(app);
  await registerDashboardRoutes(app);
  await registerDeploymentRoutes(app);
  await registerBillingRoutes(app);
  await registerAnalyticsRoutes(app);
  await registerPluginRoutes(app);
  await registerNotificationRoutes(app);
  await registerClientRoutes(app);
  await registerReportRoutes(app);
  await registerAiRoutes(app);
  await registerChatRoutes(app);
  await registerQaRoutes(app);

  if (env.SERVE_FRONTEND_STATIC) {
    const staticRoot = path.resolve(process.cwd(), env.FRONTEND_STATIC_DIR);

    if (existsSync(staticRoot)) {
      await app.register(staticSite, {
        root: staticRoot,
        prefix: "/",
        index: false,
        wildcard: false
      });

      app.get("/", async (_request, reply) => {
        const html = await readFile(path.join(staticRoot, "index.html"), "utf8");
        reply.type("text/html; charset=utf-8");
        return html;
      });

      app.setNotFoundHandler(async (request, reply) => {
        if (request.method !== "GET" && request.method !== "HEAD") {
          reply.code(404);
          return { message: "Not Found" };
        }

        const pathname = new URL(request.url, env.APP_URL).pathname;

        if (pathname.startsWith("/api/") || pathname.startsWith("/ws/") || pathname === "/health") {
          reply.code(404);
          return { message: "Not Found" };
        }

        const directMatch = normalizeStaticPath(staticRoot, pathname);
        if (directMatch && isFilePath(directMatch.absolutePath)) {
          await reply.sendFile(directMatch.relativePath);
          return;
        }

        const htmlMatch = normalizeStaticPath(staticRoot, path.join(pathname, "index.html"));
        if (htmlMatch && isFilePath(htmlMatch.absolutePath)) {
          const html = await readFile(htmlMatch.absolutePath, "utf8");
          reply.type("text/html; charset=utf-8");
          return html;
        }

        reply.code(404);
        return { message: "Not Found" };
      });
    } else {
      app.log.warn({ staticRoot }, "Configured frontend static directory was not found.");
    }
  }

  app.get("/health", async () => ({
    status: "ok",
    services: {
      api: "ready",
      postgres: "configured",
      redis: "configured",
      websocket: "enabled",
      qa: "enabled",
      rateLimit: "enabled"
    },
    browser: await createChromeDevtoolsConnection({
      browserUrl: env.MCP_BROWSER_URL,
      command: env.MCP_SERVER_COMMAND,
      args: env.MCP_SERVER_ARGS.split(",").filter(Boolean),
      chromeExecutablePath: env.CHROME_EXECUTABLE_PATH,
      remoteDebuggingPort: env.CHROME_REMOTE_DEBUGGING_PORT,
      headless: env.CHROME_HEADLESS,
      userDataDir: env.CHROME_USER_DATA_DIR,
      startupTimeoutMs: env.CHROME_STARTUP_TIMEOUT_MS,
      maxConcurrentSessions: env.QA_MAX_PARALLEL_SESSIONS,
      chromeArgs: env.CHROME_EXTRA_ARGS.split(",").filter(Boolean),
      env: getProcessEnvRecord()
    }).getHealth(app.log)
  }));

  return app;
}
