export interface ChromeDevtoolsMcpConfig {
  browserUrl: string;
  command: string;
  args: string[];
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

function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function getBaseUrl(value: string): string {
  return value.replace(/\/$/, "");
}

export class ChromeDevtoolsMcpConnection {
  constructor(private readonly config: ChromeDevtoolsMcpConfig) {}

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
}

export function createChromeDevtoolsConnection(input: {
  browserUrl: string;
  command?: string;
  args?: string[];
}): ChromeDevtoolsMcpConnection {
  return new ChromeDevtoolsMcpConnection({
    browserUrl: input.browserUrl,
    command: input.command ?? "node",
    args: input.args ?? []
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
