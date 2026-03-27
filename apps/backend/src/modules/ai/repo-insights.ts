import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RepoSignals } from "@naveencodes/ai";

function findRepoRoot(startDir: string): string {
  let current = startDir;

  while (true) {
    const packageJsonPath = join(current, "package.json");

    if (existsSync(packageJsonPath)) {
      try {
        const parsed = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { workspaces?: string[] };

        if (Array.isArray(parsed.workspaces)) {
          return current;
        }
      } catch {
        // Ignore malformed package.json while walking upward.
      }
    }

    const parent = dirname(current);

    if (parent === current) {
      return startDir;
    }

    current = parent;
  }
}

function listWorkspaceEntries(root: string, folder: string): string[] {
  const target = join(root, folder);

  if (!existsSync(target)) {
    return [];
  }

  return readdirSync(target, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${folder}/${entry.name}`);
}

function readGitLines(root: string, args: string[]): string[] {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function getLocalRepoSignals(): RepoSignals {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = findRepoRoot(currentDir);
  const workspacePackages = [...listWorkspaceEntries(repoRoot, "apps"), ...listWorkspaceEntries(repoRoot, "packages")];
  const changedFiles = readGitLines(repoRoot, ["status", "--short"]).map((line) => line.replace(/^[A-Z? ]+/, "").trim());
  const recentCommits = readGitLines(repoRoot, ["log", "--oneline", "-6"]);

  return {
    rootPath: repoRoot,
    workspacePackages,
    projectAreas: ["dashboard", "projects", "reports", "monitoring", "settings", "autonomous"],
    recentCommits,
    changedFiles,
    dirty: changedFiles.length > 0
  };
}
