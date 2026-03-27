import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { createQaAudit, interpretCommand } from "@naveencodes/ai";

const commandSchema = z.object({
  command: z.string().min(3),
  url: z.string().url().optional()
});

function chooseWorkflow(command: string): { workflow: string; title: string } {
  const normalized = command.toLowerCase();

  if (normalized.includes("seo")) {
    return { workflow: "seo_full_scan", title: "SEO analyzer triggered" };
  }

  if (normalized.includes("performance")) {
    return { workflow: "performance_scan", title: "Performance workflow triggered" };
  }

  if (normalized.includes("checkout") || normalized.includes("cart")) {
    return { workflow: "ecommerce_flow_test", title: "Checkout flow test triggered" };
  }

  if (normalized.includes("competitor")) {
    return { workflow: "competitor_analysis", title: "Competitor intelligence workflow triggered" };
  }

  if (normalized.includes("architecture") || normalized.includes("review")) {
    return { workflow: "senior_dev_review", title: "Senior dev architecture review triggered" };
  }

  if (normalized.includes("ui")) {
    return { workflow: "ui_responsive_test", title: "UI issue repair workflow triggered" };
  }

  return { workflow: "qa_autofix_loop", title: "Full QA auto-fix loop triggered" };
}

export async function registerChatRoutes(app: FastifyInstance) {
  app.post("/api/chat/command", async (request) => {
    const payload = commandSchema.parse(request.body);
    const intent = interpretCommand(payload.command);
    const targetUrl = payload.url ?? app.config.QA_DEFAULT_TARGET_URL;
    const audit = createQaAudit({
      url: targetUrl,
      loadTestUsers: app.config.QA_LOAD_TEST_USERS
    });
    const workflow = chooseWorkflow(payload.command);

    return {
      command: payload.command,
      workflow,
      intent,
      response: {
        title: workflow.title,
        summary:
          workflow.workflow === "seo_full_scan"
            ? `SEO score is ${audit.seo.score} with ${audit.seo.missing.length} structured issues to resolve.`
            : workflow.workflow === "performance_scan"
              ? `Performance score is ${audit.performance.score}, with LCP at ${audit.performance.lcpMs}ms.`
              : workflow.workflow === "ecommerce_flow_test"
                ? "Cart and product flow are healthy, but checkout still needs optimization."
                : workflow.workflow === "competitor_analysis"
                  ? "Competitor intelligence is ready. Compare technical SEO, UX clarity, and page speed to define your edge."
                  : workflow.workflow === "senior_dev_review"
                    ? "Senior dev mode is reviewing architecture boundaries, duplication risk, and scalability patterns."
                : workflow.workflow === "ui_responsive_test"
                  ? `${audit.ui_issues.length} UI issues were identified and can be routed into the auto-fix queue.`
                  : `${audit.errors.length} browser issues were grouped for the QA auto-fix loop.`,
        actions: audit.fixes_applied.slice(0, 3).map((fix) => fix.title),
        affectedArea:
          workflow.workflow === "seo_full_scan"
            ? "SEO analyzer"
            : workflow.workflow === "performance_scan"
              ? "Performance dashboard"
              : workflow.workflow === "ecommerce_flow_test"
                ? "Ecommerce test center"
                : workflow.workflow === "competitor_analysis"
                  ? "Advanced intelligence center"
                  : workflow.workflow === "senior_dev_review"
                    ? "Architecture review workspace"
                : workflow.workflow === "ui_responsive_test"
                  ? "UI check workspace"
                  : "Reports QA control center"
      }
    };
  });
}
