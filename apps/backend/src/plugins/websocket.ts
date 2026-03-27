import type { FastifyInstance } from "fastify";
import websocket from "@fastify/websocket";

import { buildLiveMonitorMode, createQaAudit } from "@naveencodes/ai";

export async function registerWebsocket(app: FastifyInstance) {
  await app.register(websocket);

  app.get("/ws/health", { websocket: true }, (socket) => {
    socket.send(JSON.stringify({ type: "connected", message: "Realtime channel ready" }));
  });

  app.get("/ws/monitor", { websocket: true }, (socket, request) => {
    const params = new URL(request.url ?? "/ws/monitor", app.config.APP_URL).searchParams;
    const targetUrl = params.get("url") ?? app.config.QA_DEFAULT_TARGET_URL;

    socket.send(
      JSON.stringify({
        type: "connected",
        monitor: buildLiveMonitorMode(targetUrl)
      })
    );

    const interval = setInterval(() => {
      const audit = createQaAudit({
        url: targetUrl
      });

      socket.send(
        JSON.stringify({
          type: "qa:update",
          status: audit.status,
          criticalErrors: audit.errors.filter((issue) => issue.severity === "critical").length,
          apiIssues: audit.api_issues.length,
          alerts: audit.alerts.slice(0, 2)
        })
      );
    }, 3000);

    socket.on("close", () => {
      clearInterval(interval);
    });
  });
}
