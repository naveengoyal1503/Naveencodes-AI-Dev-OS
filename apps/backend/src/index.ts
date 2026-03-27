import { buildServer } from "./app.js";
import { getEnv } from "./config/env.js";

const env = getEnv();
const app = await buildServer();

await app.listen({
  host: "0.0.0.0",
  port: env.PORT
});
