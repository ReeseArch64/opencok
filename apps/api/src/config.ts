import { dirname, resolve } from "node:path";
import { loadApiEnvironment } from "@opencok/env/api";
import { requireEnv, rootEnvPath } from "@opencok/env/database";

export function readConfig() {
  const settings = loadApiEnvironment();
  const url = new URL(requireEnv("DATABASE_URL"));
  url.pathname = `/${settings.GLOBAL_DATABASE_NAME}`;
  url.searchParams.delete("database");
  return {
    kingdomId: settings.KINGDOM_ID,
    host: settings.API_HOST,
    port: settings.API_PORT,
    databaseUrl: url.href,
    redisUrl: settings.API_REDIS_URL,
    timeoutMs: settings.API_DEPENDENCY_TIMEOUT_MS,
    serversFile: settings.API_SERVERS_FILE
      ? resolve(dirname(rootEnvPath), settings.API_SERVERS_FILE)
      : undefined,
    gameHost: settings.API_GAME_HOST,
    gamePort: settings.API_GAME_PORT,
  };
}
export type Config = ReturnType<typeof readConfig>;
