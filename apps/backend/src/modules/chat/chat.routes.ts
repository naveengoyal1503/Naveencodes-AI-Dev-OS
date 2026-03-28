import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { interpretCommand } from "@naveencodes/ai";

import { requireAuthenticatedUser } from "../../infrastructure/auth-context.js";
import { runAiChatCompletion } from "../../infrastructure/ai-provider.js";
import { buildAuditSummary, createBrowserConnection } from "../../infrastructure/browser-audit.js";
import { createActivityLog, getActiveProject, getUserApiKey, listProjectsByUser } from "../../infrastructure/repositories.js";
import { writeRuntimeLog } from "../../infrastructure/runtime-log.js";
import { decryptSecret } from "../../infrastructure/secrets.js";

const commandSchema = z.object({
  command: z.string().min(3),
  url: z.string().url().optional()
});

function chooseWorkflow(command: string) {
  const normalized = command.toLowerCase();

  if (normalized.includes("seo")) return { workflow: "seo_full_scan", title: "SEO workflow" };
  if (normalized.includes("performance")) return { workflow: "performance_scan", title: "Performance workflow" };
  if (normalized.includes("checkout") || normalized.includes("cart")) {
    return { workflow: "ecommerce_flow_test", title: "Ecommerce flow workflow" };
  }
  if (normalized.includes("ui") || normalized.includes("layout")) {
    return { workflow: "ui_responsive_test", title: "UI workflow" };
  }
  if (normalized.includes("analyze") || normalized.includes("audit") || normalized.includes("browser")) {
    return { workflow: "browser_analysis", title: "Browser analysis workflow" };
  }

  return { workflow: "assistant_command", title: "AI assistant workflow" };
}

function commandNeedsBrowserExecution(command: string) {
  const normalized = command.toLowerCase();

  return [
    "analyze",
    "audit",
    "browser",
    "seo",
    "performance",
    "ui",
    "checkout",
    "console",
    "network",
    "fix",
    "test"
  ].some((keyword) => normalized.includes(keyword));
}

async function handleCommand(app: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
  const session = requireAuthenticatedUser(app, request, reply);
  if (!session) {
    return;
  }

  const payload = commandSchema.parse(request.body);
  const projects = await listProjectsByUser(app.db, session.id);
  const activeProject = await getActiveProject(app.db, session.id);
  const targetUrl = payload.url ?? activeProject?.targetUrl ?? projects[0]?.targetUrl ?? app.config.QA_DEFAULT_TARGET_URL;
  const workflow = chooseWorkflow(payload.command);
  const intent = interpretCommand(payload.command);
  const storedKey = await getUserApiKey(app.db, session.id, app.config.AI_PROVIDER);

  if (!storedKey) {
    return reply.status(400).send({
      message: `No ${app.config.AI_PROVIDER} API key configured for this workspace`
    });
  }

  let browserContext = "";
  let browser = null as null | {
    session: string;
    finalUrl: string;
    consoleCount: number;
    requestCount: number;
    toolCalls: unknown[];
  };

  if (commandNeedsBrowserExecution(payload.command)) {
    try {
      const artifacts = await createBrowserConnection(app).collectAuditArtifacts(targetUrl, {
        info: (context, message) => app.log.info(context, message),
        warn: (context, message) => app.log.warn(context, message),
        error: (context, message) => app.log.error(context, message)
      });
      const summary = buildAuditSummary(targetUrl, artifacts);

      browserContext = `\nReal browser audit context:\n${summary.prompt}`;
      browser = {
        session: artifacts.session.id,
        finalUrl: artifacts.finalUrl,
        consoleCount: artifacts.consoleMessages.length,
        requestCount: artifacts.networkRequests.length,
        toolCalls: artifacts.toolCalls
      };

      await writeRuntimeLog({
        type: "mcp_call",
        message: "Chat command used browser runtime",
        context: {
          command: payload.command,
          targetUrl,
          userId: session.id,
          toolCalls: artifacts.toolCalls
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Browser runtime unavailable";

      await writeRuntimeLog({
        type: "error",
        message: "Chat command browser execution failed",
        context: {
          command: payload.command,
          targetUrl,
          userId: session.id,
          error: message
        }
      });

      app.log.error({ error, targetUrl, command: payload.command }, "Chat command browser execution failed");
      return reply.status(503).send({
        command: payload.command,
        workflow,
        intent,
        error: "browser_runtime_unavailable",
        message
      });
    }
  }

  const aiResponse = await runAiChatCompletion({
    env: app.config,
    apiKey: decryptSecret(storedKey, app.config.ENCRYPTION_SECRET),
    prompt: [
      "You are the AI command engine for a production SaaS platform.",
      "Return concise JSON-compatible prose with three short action items.",
      `User command: ${payload.command}`,
      `Workflow: ${workflow.workflow}`,
      `Target URL: ${targetUrl}`,
      browserContext,
      "Respond with: summary paragraph, then actions prefixed with '- '."
    ].join("\n")
  });

  const [summaryLine, ...actionLines] = aiResponse
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const actions = actionLines
    .filter((line) => line.startsWith("-"))
    .map((line) => line.replace(/^-+\s*/, ""))
    .slice(0, 3);

  await createActivityLog(app.db, {
    id: crypto.randomUUID(),
    userId: session.id,
    type: "chat.command",
    title: payload.command,
    status: "completed",
    metadataJson: JSON.stringify({
      workflow: workflow.workflow,
      targetUrl
    })
  });

  return {
    command: payload.command,
    workflow,
    intent,
    browser,
    response: {
      title: workflow.title,
      summary: summaryLine ?? aiResponse,
      actions: actions.length > 0 ? actions : ["Review the returned analysis", "Apply the recommended fixes", "Run a follow-up validation"],
      affectedArea: workflow.workflow
    }
  };
}

export async function registerChatRoutes(app: FastifyInstance) {
  app.post("/api/chat", async (request, reply) => handleCommand(app, request, reply));
  app.post("/api/chat/command", async (request, reply) => handleCommand(app, request, reply));
}
