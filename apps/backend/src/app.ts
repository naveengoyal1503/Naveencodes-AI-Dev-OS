import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";

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

  app.get("/health", async () => ({
    status: "ok",
    services: {
      api: "ready",
      postgres: "configured",
      redis: "configured",
      websocket: "enabled",
      qa: "enabled",
      rateLimit: "enabled"
    }
  }));

  return app;
}
