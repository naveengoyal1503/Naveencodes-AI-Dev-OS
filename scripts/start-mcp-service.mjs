import { spawn } from "node:child_process";

const command = process.env.MCP_SERVER_COMMAND || "npx";
const args = (process.env.MCP_SERVER_ARGS || "-y,chrome-devtools-mcp@0.20.3,--headless,--browser-url=http://127.0.0.1:9222")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const child = spawn(command, args, {
  stdio: "inherit",
  env: process.env
});

const shutdown = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
