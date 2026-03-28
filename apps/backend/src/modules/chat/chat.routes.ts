import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { createQaAudit, interpretCommand } from "@naveencodes/ai";
import { createChromeDevtoolsConnection } from "@naveencodes/mcp";

import { writeRuntimeLog } from "../../infrastructure/runtime-log.js";

const commandSchema = z.object({
  command: z.string().min(3),
  url: z.string().url().optional()
});

function getProcessEnvRecord() {
  return Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
}

function chooseWorkflow(command: string): { workflow: string; title: string } {
  const normalized = command.toLowerCase();

  if (normalized.includes("autonomous") || normalized.includes("next-gen")) {
    return { workflow: "next_gen_autonomous", title: "Next-gen autonomous AI triggered" };
  }

  if (normalized.includes("ecosystem") || normalized.includes("future ai")) {
    return { workflow: "future_ai_ecosystem", title: "Future AI ecosystem triggered" };
  }

  if (normalized.includes("digital twin")) {
    return { workflow: "digital_twin_engine", title: "Digital twin engine triggered" };
  }

  if (normalized.includes("predict") || normalized.includes("future issue")) {
    return { workflow: "predictive_ai_engine", title: "Predictive AI engine triggered" };
  }

  if (normalized.includes("behavior") || normalized.includes("rage click")) {
    return { workflow: "human_behavior_simulator", title: "Human behavior simulator triggered" };
  }

  if (normalized.includes("chaos") || normalized.includes("downtime")) {
    return { workflow: "chaos_engine", title: "Chaos engine triggered" };
  }

  if (normalized.includes("style") || normalized.includes("format")) {
    return { workflow: "code_style_enforcer", title: "Code style enforcer triggered" };
  }

  if (normalized.includes("plugin") || normalized.includes("app store")) {
    return { workflow: "ai_app_store", title: "AI app store system triggered" };
  }

  if (normalized.includes("backend generator") || normalized.includes("api generator")) {
    return { workflow: "auto_backend_generator", title: "Auto backend generator triggered" };
  }

  if (normalized.includes("data model") || normalized.includes("schema")) {
    return { workflow: "data_model_designer", title: "Data model designer triggered" };
  }

  if (normalized.includes("video")) {
    return { workflow: "video_to_website_engine", title: "Video to website engine triggered" };
  }

  if (normalized.includes("cross-site") || normalized.includes("multi project")) {
    return { workflow: "cross_site_intelligence", title: "Cross-site intelligence triggered" };
  }

  if (normalized.includes("update dependencies") || normalized.includes("auto update")) {
    return { workflow: "auto_update_engine", title: "Auto update engine triggered" };
  }

  if (normalized.includes("knowledge base") || normalized.includes("docs")) {
    return { workflow: "knowledge_base_engine", title: "Knowledge base engine triggered" };
  }

  if (normalized.includes("voice")) {
    return { workflow: "voice_dev_mode", title: "Voice dev mode triggered" };
  }

  if (normalized.includes("policy") || normalized.includes("terms")) {
    return { workflow: "legal_policy_engine", title: "Legal policy engine triggered" };
  }

  if (normalized.includes("cdn") || normalized.includes("region")) {
    return { workflow: "cdn_optimizer", title: "CDN optimizer triggered" };
  }

  if (normalized.includes("personality") || normalized.includes("strict reviewer") || normalized.includes("beginner mode")) {
    return { workflow: "ai_personality_system", title: "AI personality system triggered" };
  }

  if (normalized.includes("startup")) {
    return { workflow: "auto_startup_builder", title: "Auto startup builder triggered" };
  }

  if (normalized.includes("codebase") || normalized.includes("dependency")) {
    return { workflow: "codebase_understanding", title: "Codebase understanding engine triggered" };
  }

  if (normalized.includes("bug") || normalized.includes("reproduce")) {
    return { workflow: "auto_bug_reproducer", title: "Auto bug reproducer triggered" };
  }

  if (normalized.includes("plan") || normalized.includes("thinking")) {
    return { workflow: "ai_thinking_engine", title: "AI thinking engine triggered" };
  }

  if (normalized.includes("git") || normalized.includes("rollback") || normalized.includes("branch")) {
    return { workflow: "smart_version_control", title: "Version control intelligence triggered" };
  }

  if (normalized.includes("goal") || normalized.includes("conversion")) {
    return { workflow: "goal_based_execution", title: "Goal-based execution triggered" };
  }

  if (normalized.includes("feature") || normalized.includes("login")) {
    return { workflow: "auto_feature_generator", title: "Auto feature generator triggered" };
  }

  if (normalized.includes("health score") || normalized.includes("health")) {
    return { workflow: "global_site_health", title: "Global site health calculation triggered" };
  }

  if (normalized.includes("device") || normalized.includes("mobile")) {
    return { workflow: "real_device_testing", title: "Real device testing triggered" };
  }

  if (normalized.includes("compliance") || normalized.includes("gdpr") || normalized.includes("privacy")) {
    return { workflow: "compliance_engine", title: "Compliance engine triggered" };
  }

  if (normalized.includes("clone")) {
    return { workflow: "website_clone_engine", title: "Website clone engine triggered" };
  }

  if (normalized.includes("memory")) {
    return { workflow: "memory_engine", title: "Memory engine triggered" };
  }

  if (normalized.includes("product") || normalized.includes("saas idea")) {
    return { workflow: "product_strategist_ai", title: "Product strategist AI triggered" };
  }

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

function buildConnection(app: FastifyInstance) {
  return createChromeDevtoolsConnection({
    browserUrl: app.config.MCP_BROWSER_URL,
    command: app.config.MCP_SERVER_COMMAND,
    args: app.config.MCP_SERVER_ARGS.split(",").filter(Boolean),
    chromeExecutablePath: app.config.CHROME_EXECUTABLE_PATH,
    remoteDebuggingPort: app.config.CHROME_REMOTE_DEBUGGING_PORT,
    headless: app.config.CHROME_HEADLESS,
    userDataDir: app.config.CHROME_USER_DATA_DIR,
    startupTimeoutMs: app.config.CHROME_STARTUP_TIMEOUT_MS,
    maxConcurrentSessions: app.config.QA_MAX_PARALLEL_SESSIONS,
    chromeArgs: app.config.CHROME_EXTRA_ARGS.split(",").filter(Boolean),
    env: getProcessEnvRecord()
  });
}

export async function registerChatRoutes(app: FastifyInstance) {
  app.post("/api/chat/command", async (request, reply) => {
    const payload = commandSchema.parse(request.body);
    const intent = interpretCommand(payload.command);
    const targetUrl = payload.url ?? app.config.QA_DEFAULT_TARGET_URL;
    const workflow = chooseWorkflow(payload.command);
    let audit = createQaAudit({
      url: targetUrl,
      consoleMessages: [],
      networkRequests: [],
      dom: {
        title: undefined,
        metaDescription: undefined,
        canonical: undefined,
        h1Count: 0,
        headingOrderValid: true,
        missingAltCount: 0,
        layoutIssues: [],
        duplicateElements: [],
        missingSeoElements: []
      },
      images: [],
      performance: {
        lcpMs: 0,
        cls: 0,
        ttfbMs: 0,
        totalRequests: 0,
        renderBlockingResources: 0,
        largeAssets: 0,
        score: 100
      },
      loadTestUsers: app.config.QA_LOAD_TEST_USERS
    });

    await writeRuntimeLog({
      type: "user_command",
      message: "User command received",
      context: {
        command: payload.command,
        targetUrl
      }
    });

    if (commandNeedsBrowserExecution(payload.command)) {
      try {
        const artifacts = await buildConnection(app).collectAuditArtifacts(targetUrl, {
          info: (context, message) => app.log.info(context, message),
          warn: (context, message) => app.log.warn(context, message),
          error: (context, message) => app.log.error(context, message)
        });

        audit = createQaAudit({
          url: artifacts.finalUrl,
          consoleMessages: artifacts.consoleMessages.map((message) => message.details ?? message.summary),
          networkRequests: artifacts.networkRequests.map((request) => ({
            url: request.url,
            method: request.method,
            status: request.status,
            latencyMs: request.latencyMs,
            sizeKb: request.sizeKb,
            responsePreview: request.responsePreview
          })),
          dom: {
            title: artifacts.dom.title,
            metaDescription: artifacts.dom.metaDescription,
            canonical: artifacts.dom.canonical,
            h1Count: artifacts.dom.h1Count,
            headingOrderValid: artifacts.dom.headingOrderValid,
            missingAltCount: artifacts.dom.missingAltCount,
            layoutIssues: artifacts.dom.layoutIssues,
            duplicateElements: artifacts.dom.duplicateElements,
            missingSeoElements: artifacts.dom.missingSeoElements
          },
          images: artifacts.dom.images.map((image) => ({
            src: image.src,
            alt: image.alt,
            status: image.status
          })),
          performance: {
            lcpMs: artifacts.performance.lcpMs,
            cls: artifacts.performance.cls,
            ttfbMs: artifacts.performance.ttfbMs,
            totalRequests: artifacts.performance.totalRequests,
            renderBlockingResources: artifacts.performance.renderBlockingResources,
            largeAssets: artifacts.performance.largeAssets,
            score: artifacts.performance.score
          },
          loadTestUsers: app.config.QA_LOAD_TEST_USERS
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Browser runtime unavailable";
        app.log.error({ error, targetUrl, command: payload.command }, "Chat command browser execution failed");
        await writeRuntimeLog({
          type: "error",
          message: "Chat command browser execution failed",
          context: {
            command: payload.command,
            targetUrl,
            error: message
          }
        });

        reply.code(503);
        return {
          command: payload.command,
          workflow,
          intent,
          error: "browser_runtime_unavailable",
          message
        };
      }
    }

    return {
      command: payload.command,
      workflow,
      intent,
      response: {
        title: workflow.title,
        summary:
          workflow.workflow === "next_gen_autonomous"
            ? "Autonomous mode is combining codebase, bug, health, version-control, compliance, and strategist intelligence into one report."
            : workflow.workflow === "future_ai_ecosystem"
              ? "Future ecosystem mode is combining digital twin, predictive AI, chaos testing, app store, startup builder, and cross-site intelligence."
              : workflow.workflow === "digital_twin_engine"
                ? "Digital twin mode is preparing safe experiments for UI, performance, and A/B changes."
                : workflow.workflow === "predictive_ai_engine"
                  ? "Predictive mode is surfacing likely API, performance, and scaling issues before they ship."
                  : workflow.workflow === "human_behavior_simulator"
                    ? "Behavior simulation is modeling random clicks, scroll depth, rage clicks, and drop-off risks."
                    : workflow.workflow === "chaos_engine"
                      ? "Chaos mode is planning downtime, latency, and network resilience tests."
                      : workflow.workflow === "code_style_enforcer"
                        ? "Code style mode is reviewing standards, naming, and consistency boundaries."
                        : workflow.workflow === "ai_app_store"
                          ? "App store mode is focusing on plugins, add-ons, and extension hooks."
                          : workflow.workflow === "auto_backend_generator"
                            ? "Backend generator mode is planning APIs, schema, and admin panels."
                            : workflow.workflow === "data_model_designer"
                              ? "Data model mode is designing relations, indexes, and scaling strategy."
                              : workflow.workflow === "video_to_website_engine"
                                ? "Video mode is turning scenes into UI sections and code targets."
                                : workflow.workflow === "cross_site_intelligence"
                                  ? "Cross-site intelligence is transferring learnings across multiple managed projects."
                                  : workflow.workflow === "auto_update_engine"
                                    ? "Auto update mode is checking dependency strategy and compatibility safety."
                                    : workflow.workflow === "knowledge_base_engine"
                                      ? "Knowledge base mode is generating docs, guides, and API references."
                                      : workflow.workflow === "voice_dev_mode"
                                        ? "Voice dev mode is mapping spoken commands into development actions."
                                        : workflow.workflow === "legal_policy_engine"
                                          ? "Legal policy mode is generating privacy, terms, and cookie guidance."
                                          : workflow.workflow === "cdn_optimizer"
                                            ? "CDN optimizer mode is reviewing regional delivery and caching strategy."
                                            : workflow.workflow === "ai_personality_system"
                                              ? "Personality mode is selecting how the AI should communicate and review work."
                                              : workflow.workflow === "auto_startup_builder"
                                                ? "Startup builder mode is generating the idea, UI, product plan, deploy path, and marketing strategy."
            : workflow.workflow === "codebase_understanding"
              ? "Codebase engine is mapping dependencies, data flow, and safe change boundaries."
              : workflow.workflow === "auto_bug_reproducer"
                ? `Bug reproduction is ready with ${audit.errors.length} active issue signals available for confirmation.`
                : workflow.workflow === "ai_thinking_engine"
                  ? "Thinking mode is planning work before execution and attaching validation to every step."
                  : workflow.workflow === "smart_version_control"
                    ? "Version control intelligence is reviewing branch safety, rollback boundaries, and release hygiene."
                    : workflow.workflow === "goal_based_execution"
                      ? "Goal mode is translating business intent into UI, performance, and UX actions."
                      : workflow.workflow === "auto_feature_generator"
                        ? "Feature generator is preparing backend, frontend, data, and test work for the requested capability."
                        : workflow.workflow === "global_site_health"
                          ? `Global health can be calculated from SEO ${audit.seo.score}, performance ${audit.performance.score}, UI, and security signals.`
                          : workflow.workflow === "real_device_testing"
                            ? "Device testing mode is preparing mobile, tablet, slow network, and CPU-constrained scenarios."
                            : workflow.workflow === "compliance_engine"
                              ? "Compliance mode is reviewing privacy, cookie, and consent readiness."
                              : workflow.workflow === "website_clone_engine"
                                ? "Clone engine is extracting layout structure and proposing an improved rebuild path."
                                : workflow.workflow === "memory_engine"
                                  ? "Memory mode is surfacing previous fixes and user preferences for faster decision-making."
                                  : workflow.workflow === "product_strategist_ai"
                                    ? "Product strategist mode is generating a SaaS concept, build path, and launch angle."
            : workflow.workflow === "seo_full_scan"
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
          workflow.workflow === "next_gen_autonomous"
            ? "Autonomous command center"
            : workflow.workflow === "future_ai_ecosystem"
              ? "Future ecosystem workspace"
              : workflow.workflow === "digital_twin_engine"
                ? "Experiment lab"
                : workflow.workflow === "predictive_ai_engine"
                  ? "Future ecosystem workspace"
                  : workflow.workflow === "human_behavior_simulator"
                    ? "UX simulation workspace"
                    : workflow.workflow === "chaos_engine"
                      ? "Resilience lab"
                      : workflow.workflow === "code_style_enforcer"
                        ? "Developer standards workspace"
                        : workflow.workflow === "ai_app_store"
                          ? "Plugin marketplace"
                          : workflow.workflow === "auto_backend_generator"
                            ? "Project generator workspace"
                            : workflow.workflow === "data_model_designer"
                              ? "Architecture workspace"
                              : workflow.workflow === "video_to_website_engine"
                                ? "Design conversion workspace"
                                : workflow.workflow === "cross_site_intelligence"
                                  ? "Projects workspace"
                                  : workflow.workflow === "auto_update_engine"
                                    ? "Release workspace"
                                    : workflow.workflow === "knowledge_base_engine"
                                      ? "Documentation workspace"
                                      : workflow.workflow === "voice_dev_mode"
                                        ? "AI chat panel"
                                        : workflow.workflow === "legal_policy_engine"
                                          ? "Settings and compliance workspace"
                                          : workflow.workflow === "cdn_optimizer"
                                            ? "Performance workspace"
                                            : workflow.workflow === "ai_personality_system"
                                              ? "AI settings workspace"
                                              : workflow.workflow === "auto_startup_builder"
                                                ? "Future ecosystem workspace"
            : workflow.workflow === "codebase_understanding"
              ? "Architecture workspace"
              : workflow.workflow === "auto_bug_reproducer"
                ? "Reports QA control center"
                : workflow.workflow === "ai_thinking_engine"
                  ? "Autonomous planning workspace"
                  : workflow.workflow === "smart_version_control"
                    ? "Git and release review workspace"
                    : workflow.workflow === "goal_based_execution"
                      ? "Autonomous command center"
                      : workflow.workflow === "auto_feature_generator"
                        ? "Project and feature workspace"
                        : workflow.workflow === "global_site_health"
                          ? "Autonomous command center"
                          : workflow.workflow === "real_device_testing"
                            ? "UI check workspace"
                            : workflow.workflow === "compliance_engine"
                              ? "Settings and compliance workspace"
                              : workflow.workflow === "website_clone_engine"
                                ? "Project generator workspace"
                                : workflow.workflow === "memory_engine"
                                  ? "Autonomous command center"
                                  : workflow.workflow === "product_strategist_ai"
                                    ? "Product strategy workspace"
          : workflow.workflow === "seo_full_scan"
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
