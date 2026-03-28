import { spawn, type ChildProcess } from "node:child_process";
import { access, mkdir } from "node:fs/promises";
import path from "node:path";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export interface ChromeDevtoolsMcpConfig {
  browserUrl: string;
  command: string;
  args: string[];
}

export interface ChromeRuntimeConfig extends ChromeDevtoolsMcpConfig {
  chromeExecutablePath?: string;
  chromeArgs?: string[];
  remoteDebuggingPort?: number;
  headless?: boolean;
  userDataDir?: string;
  startupTimeoutMs?: number;
  maxConcurrentSessions?: number;
  mcpWorkingDirectory?: string;
  env?: Record<string, string>;
}

export interface McpBrowserCapability {
  name: "dom" | "console" | "network" | "performance" | "screenshot";
  enabled: boolean;
}

export interface McpUserSimulationAction {
  type: "navigate" | "click" | "scroll" | "fill" | "submit";
  label: string;
  target?: string;
  value?: string;
}

export interface McpBrowserSession {
  id: string;
  browserUrl: string;
  targetUrl: string;
  connectedAt: string;
  capabilities: McpBrowserCapability[];
  userSimulationPlan: McpUserSimulationAction[];
}

export interface McpLoggerLike {
  info?: (payload: unknown, message?: string) => void;
  warn?: (payload: unknown, message?: string) => void;
  error?: (payload: unknown, message?: string) => void;
  debug?: (payload: unknown, message?: string) => void;
}

export interface BrowserConsoleMessage {
  id: number;
  level: string;
  summary: string;
  details?: string;
}

export interface BrowserNetworkRequest {
  id: number;
  url: string;
  method: string;
  status: number;
  latencyMs: number;
  sizeKb?: number;
  responsePreview?: string;
}

export interface BrowserImageAsset {
  src: string;
  alt?: string;
  status: "ok" | "broken" | "missing-cdn";
}

export interface BrowserDomSnapshot {
  title?: string;
  metaDescription?: string;
  canonical?: string;
  h1Count: number;
  headingOrderValid: boolean;
  missingAltCount: number;
  layoutIssues: string[];
  duplicateElements: string[];
  missingSeoElements: string[];
  images: BrowserImageAsset[];
  snapshotText: string;
}

export interface BrowserPerformanceMetrics {
  lcpMs: number;
  cls: number;
  ttfbMs: number;
  totalRequests: number;
  renderBlockingResources: number;
  largeAssets: number;
  score: number;
  domContentLoadedMs: number;
  loadEventEndMs: number;
}

export interface McpToolCallLog {
  name: string;
  durationMs: number;
  ok: boolean;
}

export interface BrowserAuditArtifacts {
  session: McpBrowserSession;
  finalUrl: string;
  dom: BrowserDomSnapshot;
  consoleMessages: BrowserConsoleMessage[];
  networkRequests: BrowserNetworkRequest[];
  performance: BrowserPerformanceMetrics;
  toolCalls: McpToolCallLog[];
}

interface EvaluatedPageData {
  finalUrl: string;
  title?: string;
  metaDescription?: string;
  canonical?: string;
  h1Count: number;
  headingOrderValid: boolean;
  missingAltCount: number;
  layoutIssues: string[];
  duplicateElements: string[];
  missingSeoElements: string[];
  images: Array<{ src: string; alt?: string }>;
  performance: {
    responseStartMs: number;
    domContentLoadedMs: number;
    loadEventEndMs: number;
    lcpMs: number;
    cls: number;
    resources: Array<{ name: string; duration: number; transferSize: number; renderBlocking: boolean }>;
  };
}

type QueueResolver = () => void;

let managedChromeProcess: ChildProcess | undefined;
let managedChromeStartup: Promise<void> | undefined;
let activeSessions = 0;
const queue: QueueResolver[] = [];

function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function getBaseUrl(value: string): string {
  return value.replace(/\/$/, "");
}

function log(logger: McpLoggerLike | undefined, level: keyof McpLoggerLike, payload: unknown, message: string) {
  const writer = logger?.[level];
  if (typeof writer === "function") {
    writer(payload, message);
  }
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function buildProcessEnv(overrides?: Record<string, string>) {
  const baseEntries = Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string");
  return {
    ...Object.fromEntries(baseEntries),
    ...(overrides ?? {})
  };
}

async function isBrowserReachable(browserUrl: string) {
  try {
    const response = await fetch(`${getBaseUrl(browserUrl)}/json/version`);
    return response.ok;
  } catch {
    return false;
  }
}

function getRemoteDebuggingPort(browserUrl: string) {
  const parsed = new URL(browserUrl);
  return parsed.port ? Number(parsed.port) : 9222;
}

async function ensurePathExists(targetPath: string) {
  await mkdir(targetPath, { recursive: true });
}

async function acquireSlot(limit: number) {
  if (activeSessions < limit) {
    activeSessions += 1;
    return;
  }

  await new Promise<void>((resolve) => {
    queue.push(() => {
      activeSessions += 1;
      resolve();
    });
  });
}

function releaseSlot() {
  activeSessions = Math.max(0, activeSessions - 1);
  const next = queue.shift();
  if (next) {
    next();
  }
}

async function ensureChromeRuntime(config: ChromeRuntimeConfig, logger?: McpLoggerLike) {
  if (await isBrowserReachable(config.browserUrl)) {
    return;
  }

  if (managedChromeStartup) {
    await managedChromeStartup;
    return;
  }

  if (!config.chromeExecutablePath) {
    throw new Error("Chrome is not reachable and CHROME_EXECUTABLE_PATH is not configured.");
  }

  const chromeExecutablePath = config.chromeExecutablePath;
  await access(chromeExecutablePath);

  const remoteDebuggingPort = config.remoteDebuggingPort ?? getRemoteDebuggingPort(config.browserUrl);
  const userDataDir = config.userDataDir ?? path.resolve(process.cwd(), ".runtime", "chrome-profile");
  await ensurePathExists(userDataDir);

  const chromeArgs = [
    `--remote-debugging-port=${remoteDebuggingPort}`,
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-breakpad",
    "--disable-component-update",
    "--disable-extensions",
    "--disable-renderer-backgrounding",
    "--disable-sync",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-sandbox",
    ...(config.headless === false ? [] : ["--headless=new"]),
    ...(config.chromeArgs ?? []),
    "about:blank"
  ];

  managedChromeStartup = (async () => {
    log(logger, "info", { executable: config.chromeExecutablePath, remoteDebuggingPort }, "Starting managed Chrome runtime");

    const chromeProcess = spawn(chromeExecutablePath, chromeArgs, {
      stdio: ["ignore", "ignore", "pipe"],
      detached: false,
      env: buildProcessEnv(config.env)
    });
    managedChromeProcess = chromeProcess;

    chromeProcess.stderr?.on("data", (chunk: Buffer | string) => {
      log(logger, "warn", { stderr: String(chunk).trim() }, "Chrome stderr");
    });

    chromeProcess.on("exit", (code: number | null, signal: NodeJS.Signals | null) => {
      log(logger, "warn", { code, signal }, "Managed Chrome exited");
      managedChromeProcess = undefined;
      managedChromeStartup = undefined;
    });

    const timeoutMs = config.startupTimeoutMs ?? 30_000;
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      if (await isBrowserReachable(config.browserUrl)) {
        log(logger, "info", { browserUrl: config.browserUrl }, "Managed Chrome is reachable");
        return;
      }

      await wait(500);
    }

    chromeProcess.kill("SIGTERM");
    managedChromeProcess = undefined;
    managedChromeStartup = undefined;
    throw new Error(`Timed out waiting for Chrome DevTools endpoint at ${config.browserUrl}.`);
  })();

  await managedChromeStartup;
}

function parseJsonResult(text: string) {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (!match) {
    throw new Error(`Unable to parse JSON result from MCP tool response: ${text}`);
  }

  return JSON.parse(match[1]) as EvaluatedPageData;
}

function parseSnapshotText(text: string) {
  return text
    .replace(/^## Latest page snapshot\s*/i, "")
    .trim();
}

function parseConsoleList(text: string): BrowserConsoleMessage[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("msgid="))
    .map((line) => {
      const match = line.match(/^msgid=(\d+)\s+\[([^\]]+)\]\s+(.+)$/);
      if (!match) {
        return null;
      }

      return {
        id: Number(match[1]),
        level: match[2],
        summary: match[3]
      } satisfies BrowserConsoleMessage;
    })
    .filter((entry): entry is BrowserConsoleMessage => Boolean(entry));
}

function parseConsoleDetail(text: string) {
  const lines = text.split(/\r?\n/);
  return lines.slice(0, 18).join("\n").trim();
}

function parseNetworkList(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("reqid="))
    .map((line) => {
      const match = line.match(/^reqid=(\d+)\s+(\S+)\s+(.+)\s+\[(\d+)\]$/);
      if (!match) {
        return null;
      }

      return {
        id: Number(match[1]),
        method: match[2],
        url: match[3],
        status: Number(match[4])
      };
    })
    .filter((entry): entry is { id: number; method: string; url: string; status: number } => Boolean(entry));
}

function parseNetworkDetail(text: string) {
  const responseBodyMatch = text.match(/### Response Body\r?\n([\s\S]*)$/);
  const preview = responseBodyMatch?.[1]?.trim() ?? "";

  return preview.length > 400 ? `${preview.slice(0, 400)}...` : preview;
}

function dedupeStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function deriveImages(input: EvaluatedPageData, networkRequests: BrowserNetworkRequest[]) {
  return input.images.map((image) => {
    const matchingRequest = networkRequests.find((request) => request.url === image.src);
    const status =
      matchingRequest && matchingRequest.status >= 400
        ? new URL(image.src, input.finalUrl).hostname !== new URL(input.finalUrl).hostname
          ? "missing-cdn"
          : "broken"
        : "ok";

    return {
      src: image.src,
      alt: image.alt,
      status
    } satisfies BrowserImageAsset;
  });
}

function buildPerformanceMetrics(input: EvaluatedPageData, requests: BrowserNetworkRequest[]): BrowserPerformanceMetrics {
  const renderBlockingResources = input.performance.resources.filter((resource) => resource.renderBlocking).length;
  const largeAssets = input.performance.resources.filter((resource) => resource.transferSize > 250 * 1024).length;
  const ttfbMs = Math.round(input.performance.responseStartMs);
  const lcpMs = Math.round(input.performance.lcpMs || input.performance.loadEventEndMs || input.performance.domContentLoadedMs);
  const cls = Number((input.performance.cls || 0).toFixed(3));
  const totalRequests = requests.length;

  let score = 100;
  if (ttfbMs > 800) score -= 10;
  if (lcpMs > 2500) score -= 12;
  if (cls > 0.1) score -= 10;
  if (renderBlockingResources > 2) score -= 6;
  if (largeAssets > 0) score -= Math.min(largeAssets * 4, 12);
  if (requests.some((request) => request.status >= 400)) score -= 8;

  return {
    lcpMs,
    cls,
    ttfbMs,
    totalRequests,
    renderBlockingResources,
    largeAssets,
    score: Math.max(0, score),
    domContentLoadedMs: Math.round(input.performance.domContentLoadedMs),
    loadEventEndMs: Math.round(input.performance.loadEventEndMs)
  };
}

const pageEvaluationFunction = `() => {
  const title = document.title || undefined;
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || undefined;
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || undefined;
  const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((element) => Number(element.tagName.slice(1)));
  const headingOrderValid = headings.every((level, index) => index === 0 || level - headings[index - 1] <= 1);
  const missingSeoElements = [];
  if (!title) missingSeoElements.push('Missing title tag');
  if (!metaDescription) missingSeoElements.push('Missing meta description');
  if (!canonical) missingSeoElements.push('Missing canonical URL');
  if (headings.filter((level) => level === 1).length === 0) missingSeoElements.push('Missing H1');

  const viewportWidth = window.innerWidth;
  const layoutIssues = [];
  const seenLabels = new Set();
  for (const element of Array.from(document.body?.querySelectorAll('*') ?? []).slice(0, 1500)) {
    if (!(element instanceof HTMLElement)) continue;
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && (rect.right > viewportWidth + 1 || rect.left < -1)) {
      const label = element.tagName.toLowerCase() + (element.id ? '#' + element.id : '') + (element.className ? '.' + String(element.className).split(/\\s+/).slice(0, 2).join('.') : '');
      if (!seenLabels.has(label)) {
        seenLabels.add(label);
        layoutIssues.push('Horizontal overflow detected on ' + label);
      }
    }
    if (layoutIssues.length >= 8) break;
  }

  const duplicateElements = [];
  const duplicateBuckets = new Map();
  for (const node of Array.from(document.querySelectorAll('button,a,h1,h2,h3')).slice(0, 500)) {
    const text = (node.textContent || '').trim().replace(/\\s+/g, ' ');
    if (!text || text.length < 4) continue;
    duplicateBuckets.set(text, (duplicateBuckets.get(text) || 0) + 1);
  }
  for (const [text, count] of duplicateBuckets.entries()) {
    if (count > 1 && duplicateElements.length < 5) {
      duplicateElements.push('Repeated visible element text: ' + text);
    }
  }

  const images = Array.from(document.images).slice(0, 200).map((image) => ({
    src: image.currentSrc || image.src || '',
    alt: image.getAttribute('alt') || undefined
  })).filter((image) => Boolean(image.src));

  const missingAltCount = images.filter((image) => !image.alt).length;
  const navigation = performance.getEntriesByType('navigation')[0];
  const resources = performance.getEntriesByType('resource').map((entry) => ({
    name: entry.name,
    duration: entry.duration,
    transferSize: 'transferSize' in entry ? entry.transferSize || 0 : 0,
    renderBlocking: entry.initiatorType === 'link' || entry.initiatorType === 'script'
  }));
  const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
  const layoutShifts = performance.getEntriesByType('layout-shift').filter((entry) => !entry.hadRecentInput);
  const cls = layoutShifts.reduce((total, entry) => total + (entry.value || 0), 0);

  return {
    finalUrl: location.href,
    title,
    metaDescription,
    canonical,
    h1Count: headings.filter((level) => level === 1).length,
    headingOrderValid,
    missingAltCount,
    layoutIssues,
    duplicateElements,
    missingSeoElements,
    images,
    performance: {
      responseStartMs: navigation?.responseStart || 0,
      domContentLoadedMs: navigation?.domContentLoadedEventEnd || 0,
      loadEventEndMs: navigation?.loadEventEnd || navigation?.domContentLoadedEventEnd || 0,
      lcpMs: lcpEntries.length ? lcpEntries[lcpEntries.length - 1].startTime || lcpEntries[lcpEntries.length - 1].renderTime || lcpEntries[lcpEntries.length - 1].loadTime || 0 : 0,
      cls,
      resources
    }
  };
}`;

export class ChromeDevtoolsMcpConnection {
  constructor(private readonly config: ChromeRuntimeConfig) {}

  get browserUrl(): string {
    return this.config.browserUrl;
  }

  get startCommand(): { command: string; args: string[] } {
    return {
      command: this.config.command,
      args: this.config.args
    };
  }

  toMcpJsonEntry() {
    return {
      command: this.config.command,
      args: this.config.args
    };
  }

  createSession(targetUrl: string): McpBrowserSession {
    const normalizedTarget = getBaseUrl(targetUrl);

    return {
      id: createId("mcp"),
      browserUrl: this.config.browserUrl,
      targetUrl: normalizedTarget,
      connectedAt: new Date().toISOString(),
      capabilities: [
        { name: "dom", enabled: true },
        { name: "console", enabled: true },
        { name: "network", enabled: true },
        { name: "performance", enabled: true },
        { name: "screenshot", enabled: true }
      ],
      userSimulationPlan: createUserSimulationPlan(normalizedTarget)
    };
  }

  async getHealth(logger?: McpLoggerLike) {
    const browserReachable = await isBrowserReachable(this.config.browserUrl);

    return {
      browserReachable,
      browserUrl: this.config.browserUrl,
      chromeExecutablePath: this.config.chromeExecutablePath ?? null,
      mcp: this.toMcpJsonEntry(),
      maxConcurrentSessions: this.config.maxConcurrentSessions ?? 3,
      mode: browserReachable ? "attached" : this.config.chromeExecutablePath ? "managed" : "unavailable",
      managedChromePid: managedChromeProcess?.pid ?? null,
      loggerAttached: Boolean(logger)
    };
  }

  async collectAuditArtifacts(targetUrl: string, logger?: McpLoggerLike): Promise<BrowserAuditArtifacts> {
    await ensureChromeRuntime(this.config, logger);

    const maxConcurrentSessions = this.config.maxConcurrentSessions ?? 3;
    await acquireSlot(maxConcurrentSessions);

    const session = this.createSession(targetUrl);
    const toolCalls: McpToolCallLog[] = [];
    const transport = new StdioClientTransport({
      command: this.config.command,
      args: this.config.args,
      env: buildProcessEnv(this.config.env),
      cwd: this.config.mcpWorkingDirectory ?? process.cwd(),
      stderr: "pipe"
    });

    transport.stderr?.on("data", (chunk: Buffer | string) => {
      log(logger, "warn", { stderr: String(chunk).trim(), sessionId: session.id }, "MCP stderr");
    });

    const client = new Client({ name: "naveencodes-browser-runtime", version: "1.0.0" }, { capabilities: {} });

    const callTool = async <TArguments extends Record<string, unknown>>(name: string, args: TArguments) => {
      const startedAt = Date.now();
      log(logger, "info", { sessionId: session.id, tool: name, args }, "Invoking MCP tool");

      try {
        const result = await client.callTool({
          name,
          arguments: args
        });

        toolCalls.push({
          name,
          durationMs: Date.now() - startedAt,
          ok: true
        });

        return result;
      } catch (error) {
        toolCalls.push({
          name,
          durationMs: Date.now() - startedAt,
          ok: false
        });
        log(
          logger,
          "error",
          { sessionId: session.id, tool: name, error: error instanceof Error ? error.message : String(error) },
          "MCP tool failed"
        );
        throw error;
      }
    };

    try {
      await client.connect(transport);

      await callTool("new_page", {
        url: targetUrl,
        isolatedContext: session.id,
        timeout: this.config.startupTimeoutMs ?? 30_000
      });

      const evaluationResult = await callTool("evaluate_script", {
        function: pageEvaluationFunction
      });
      const snapshotResult = await callTool("take_snapshot", {});
      const consoleListResult = await callTool("list_console_messages", {});
      const networkListResult = await callTool("list_network_requests", {});

      const evaluationText = getToolText(evaluationResult);
      const snapshotText = parseSnapshotText(getToolText(snapshotResult));
      const consoleMessages = parseConsoleList(getToolText(consoleListResult));
      const networkSummaries = parseNetworkList(getToolText(networkListResult));
      const evaluated = parseJsonResult(evaluationText);

      const detailedConsoleMessages: BrowserConsoleMessage[] = [];
      for (const message of consoleMessages.slice(0, 20)) {
        const detailResult = await callTool("get_console_message", { msgid: message.id });
        detailedConsoleMessages.push({
          ...message,
          details: parseConsoleDetail(getToolText(detailResult))
        });
      }

      const networkRequests: BrowserNetworkRequest[] = [];
      for (const request of networkSummaries.slice(0, 50)) {
        const matchingResource = evaluated.performance.resources.find((resource) => resource.name === request.url);
        const needsDetail = request.status >= 400;
        const detailResult = needsDetail ? await callTool("get_network_request", { reqid: request.id }) : null;

        networkRequests.push({
          id: request.id,
          url: request.url,
          method: request.method,
          status: request.status,
          latencyMs: Math.round(matchingResource?.duration ?? 0),
          sizeKb: matchingResource?.transferSize ? Number((matchingResource.transferSize / 1024).toFixed(2)) : undefined,
          responsePreview: detailResult ? parseNetworkDetail(getToolText(detailResult)) : undefined
        });
      }

      const images = deriveImages(evaluated, networkRequests);
      const dom: BrowserDomSnapshot = {
        title: evaluated.title,
        metaDescription: evaluated.metaDescription,
        canonical: evaluated.canonical,
        h1Count: evaluated.h1Count,
        headingOrderValid: evaluated.headingOrderValid,
        missingAltCount: evaluated.missingAltCount,
        layoutIssues: dedupeStrings(evaluated.layoutIssues),
        duplicateElements: dedupeStrings(evaluated.duplicateElements),
        missingSeoElements: dedupeStrings(evaluated.missingSeoElements),
        images,
        snapshotText
      };

      return {
        session,
        finalUrl: evaluated.finalUrl,
        dom,
        consoleMessages: detailedConsoleMessages,
        networkRequests,
        performance: buildPerformanceMetrics(evaluated, networkRequests),
        toolCalls
      };
    } finally {
      await transport.close().catch(() => undefined);
      releaseSlot();
    }
  }
}

function getToolText(result: unknown) {
  if (!result || typeof result !== "object" || !("content" in result)) {
    return "";
  }

  const content = (result as { content?: Array<{ type?: string; text?: string }> }).content;
  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("\n")
    .trim();
}

export function createChromeDevtoolsConnection(input: ChromeRuntimeConfig | { browserUrl: string; command?: string; args?: string[] }) {
  return new ChromeDevtoolsMcpConnection({
    browserUrl: input.browserUrl,
    command: input.command ?? "node",
    args: input.args ?? [],
    chromeExecutablePath: "chromeExecutablePath" in input ? input.chromeExecutablePath : undefined,
    chromeArgs: "chromeArgs" in input ? input.chromeArgs : undefined,
    remoteDebuggingPort: "remoteDebuggingPort" in input ? input.remoteDebuggingPort : undefined,
    headless: "headless" in input ? input.headless : undefined,
    userDataDir: "userDataDir" in input ? input.userDataDir : undefined,
    startupTimeoutMs: "startupTimeoutMs" in input ? input.startupTimeoutMs : undefined,
    maxConcurrentSessions: "maxConcurrentSessions" in input ? input.maxConcurrentSessions : undefined,
    mcpWorkingDirectory: "mcpWorkingDirectory" in input ? input.mcpWorkingDirectory : undefined,
    env: "env" in input ? input.env : undefined
  });
}

export function createUserSimulationPlan(targetUrl: string): McpUserSimulationAction[] {
  const baseUrl = getBaseUrl(targetUrl);

  return [
    { type: "navigate", label: "Open target URL", target: baseUrl },
    { type: "scroll", label: "Scroll viewport to trigger lazy sections" },
    { type: "click", label: "Open primary navigation", target: "nav a:first-child" },
    { type: "fill", label: "Fill contact input", target: "input[type='email']", value: "qa@naveencodes.com" },
    { type: "submit", label: "Submit the active form", target: "button[type='submit']" }
  ];
}
