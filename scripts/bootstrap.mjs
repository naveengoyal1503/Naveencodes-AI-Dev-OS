import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const source = join(root, "config", "env", ".env.example");
const target = join(root, ".env");

if (!existsSync(target)) {
  copyFileSync(source, target);
  console.log("Created .env from config/env/.env.example");
} else {
  console.log(".env already exists");
}
