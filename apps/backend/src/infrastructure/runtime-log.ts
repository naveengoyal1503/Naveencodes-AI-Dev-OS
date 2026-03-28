import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export interface RuntimeLogEntry {
  type: "user_command" | "qa_run" | "mcp_call" | "error" | "health";
  message: string;
  context?: Record<string, unknown>;
}

function resolveLogPath() {
  return process.env.APP_LOG_FILE
    ? path.resolve(process.cwd(), process.env.APP_LOG_FILE)
    : path.resolve(process.cwd(), "logs", "runtime.jsonl");
}

export async function writeRuntimeLog(entry: RuntimeLogEntry) {
  const filePath = resolveLogPath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await appendFile(
    filePath,
    `${JSON.stringify({
      timestamp: new Date().toISOString(),
      ...entry
    })}\n`,
    "utf8"
  );
}
