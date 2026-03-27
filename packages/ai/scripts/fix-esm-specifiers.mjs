import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const specifierPattern =
  /((?:import|export)\s+(?:type\s+)?(?:[^"']*?\s+from\s+)?)["'](\.\.?\/[^"']+)["']/g;

function withJsExtension(specifier) {
  return /\.[a-z0-9]+$/i.test(specifier) ? specifier : `${specifier}.js`;
}

async function rewriteFile(filePath) {
  const source = await readFile(filePath, "utf8");
  const next = source.replace(specifierPattern, (full, prefix, specifier) => `${prefix}"${withJsExtension(specifier)}"`);

  if (next !== source) {
    await writeFile(filePath, next, "utf8");
  }
}

async function walk(directory) {
  const entries = await readdir(directory);

  for (const entry of entries) {
    const entryPath = path.join(directory, entry);
    const entryStat = await stat(entryPath);

    if (entryStat.isDirectory()) {
      await walk(entryPath);
      continue;
    }

    if (entryPath.endsWith(".js")) {
      await rewriteFile(entryPath);
    }
  }
}

await walk(distDir);
