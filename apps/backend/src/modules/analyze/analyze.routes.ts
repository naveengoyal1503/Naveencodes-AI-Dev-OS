import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { requireAuthenticatedUser } from "../../infrastructure/auth-context.js";
import { runAiChatCompletion } from "../../infrastructure/ai-provider.js";
import { buildAuditSummary, createBrowserConnection } from "../../infrastructure/browser-audit.js";
import {
  createActivityLog,
  getActiveProject,
  getUserApiKey,
  listProjectsByUser
} from "../../infrastructure/repositories.js";
import { writeRuntimeLog } from "../../infrastructure/runtime-log.js";
import { decryptSecret } from "../../infrastructure/secrets.js";

const analyzeSchema = z.object({
  url: z.string().url().optional(),
  instruction: z.string().min(3).optional()
});

export async function registerAnalyzeRoutes(app: FastifyInstance) {
  app.post("/api/analyze", async (request, reply) => {
    const session = requireAuthenticatedUser(app, request, reply);
    if (!session) {
      return;
    }

    const payload = analyzeSchema.parse(request.body);
    const projects = await listProjectsByUser(app.db, session.id);
    const activeProject = await getActiveProject(app.db, session.id);
    const targetUrl = payload.url ?? activeProject?.targetUrl ?? projects[0]?.targetUrl ?? app.config.QA_DEFAULT_TARGET_URL;
    const storedKey = await getUserApiKey(app.db, session.id, app.config.AI_PROVIDER);

    if (!storedKey) {
      return reply.status(400).send({
        message: `No ${app.config.AI_PROVIDER} API key configured for this workspace`
      });
    }

    try {
      const connection = createBrowserConnection(app);
      const artifacts = await connection.collectAuditArtifacts(targetUrl, {
        info: (context, message) => app.log.info(context, message),
        warn: (context, message) => app.log.warn(context, message),
        error: (context, message) => app.log.error(context, message)
      });
      const summary = buildAuditSummary(targetUrl, artifacts);
      const analysis = await runAiChatCompletion({
        env: app.config,
        apiKey: decryptSecret(storedKey, app.config.ENCRYPTION_SECRET),
        prompt: [
          "You are analyzing a live website using real browser data collected through Chrome DevTools MCP.",
          "Return a concise, production-focused report with sections: Summary, Critical issues, Recommended fixes, Next actions.",
          payload.instruction ? `User instruction: ${payload.instruction}` : "User instruction: Analyze the website for architecture, SEO, UI, performance, and runtime issues.",
          "",
          summary.prompt
        ].join("\n")
      });

      await createActivityLog(app.db, {
        id: crypto.randomUUID(),
        userId: session.id,
        type: "analyze.run",
        title: `Analyzed ${targetUrl}`,
        status: "completed",
        metadataJson: JSON.stringify({
          targetUrl,
          finalUrl: artifacts.finalUrl,
          performanceScore: summary.audit.performance.score,
          seoScore: summary.audit.seo.score
        })
      });

      await writeRuntimeLog({
        type: "mcp_call",
        message: "Analyze route completed browser audit",
        context: {
          targetUrl,
          finalUrl: artifacts.finalUrl,
          toolCalls: artifacts.toolCalls,
          userId: session.id
        }
      });

      return {
        targetUrl,
        finalUrl: artifacts.finalUrl,
        analysis,
        audit: summary.audit,
        browser: {
          session: artifacts.session,
          toolCalls: artifacts.toolCalls,
          consoleCount: artifacts.consoleMessages.length,
          requestCount: artifacts.networkRequests.length,
          snapshotExcerpt: artifacts.dom.snapshotText.slice(0, 1200)
        }
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Analyze flow failed";

      await writeRuntimeLog({
        type: "error",
        message: "Analyze route failed",
        context: {
          userId: session.id,
          targetUrl,
          error: message
        }
      });

      app.log.error({ error, targetUrl, userId: session.id }, "Analyze route failed");
      return reply.status(503).send({
        message,
        targetUrl
      });
    }
  });
}
