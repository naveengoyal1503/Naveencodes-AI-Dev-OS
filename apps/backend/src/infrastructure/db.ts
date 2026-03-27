import { Pool } from "pg";
import Redis from "ioredis";

import type { BackendEnv } from "../config/env.js";

export function createDatabasePool(env: BackendEnv) {
  return new Pool({
    connectionString: env.DATABASE_URL
  });
}

export function createRedisClient(env: BackendEnv) {
  return new Redis(env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1
  });
}
