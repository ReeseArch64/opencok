import { dirname, resolve } from "node:path";
import { requireEnv, rootEnvPath } from "@opencok/env/database";
import { loadServerEnvironment, type ServerEnvironment } from "@opencok/env/server";
import type { ServerConfig } from "@opencok/contracts/server";

export type Config = ServerConfig;

export function config(settings: ServerEnvironment = loadServerEnvironment()): Config {
  return {
    host: settings.GAME_HOST,
    port: settings.GAME_PORT,
    healthPort: settings.GAME_HEALTH_PORT,
    kingdomId: settings.KINGDOM_ID,
    kingdomDatabase: settings.KINGDOM_DATABASE_NAME ?? `opencok_kingdom_${settings.KINGDOM_ID}`,
    globalDatabase: settings.GLOBAL_DATABASE_NAME,
    databaseUrl: requireEnv("DATABASE_URL"),
    redisUrl: settings.GAME_REDIS_URL,
    zookeeper: settings.GAME_ZOOKEEPER,
    zkPath: `/opencok-experiment/COK${settings.KINGDOM_ID}`,
    loginSecret: settings.GAME_LOGIN_SECRET,
    resources: resolve(dirname(rootEnvPath), settings.GAME_RESOURCES),
    mapSize: settings.GAME_MAP_SIZE,
    timeoutMs: settings.DEPENDENCY_TIMEOUT_MS,
  };
}
