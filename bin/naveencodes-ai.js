#!/usr/bin/env node

const [command = "help"] = process.argv.slice(2);

if (command === "init") {
  console.log("NaveenCodes AI Dev OS foundation is initialized.");
  console.log("Next steps:");
  console.log("1. Copy config/env/.env.example to .env");
  console.log("2. Start PostgreSQL and Redis");
  console.log("3. Run npm install");
  console.log("4. Run npm run dev");
  process.exit(0);
}

console.log("Usage: npx naveencodes-ai init");
