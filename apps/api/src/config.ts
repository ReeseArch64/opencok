import { resolve } from "node:path";
import { Context, Effect, Layer } from "effect";
import { apiSchema } from "@opencok/env/api/schema";
import { databaseUrl, readEnvironment, workspaceRoot } from "@opencok/env/effect";

export const readConfig = Effect.gen(function* () {
  const settings = yield* readEnvironment(apiSchema);
  const url = new URL(yield* databaseUrl);
  url.pathname = `/${settings.GLOBAL_DATABASE_NAME}`;
  url.searchParams.delete("database");

  return {
    provisioning: settings.FIREBASE_PROJECT_ID
      ? {
          projectId: settings.FIREBASE_PROJECT_ID,
          secret: settings.PROVISIONING_SIGNING_SECRET!,
          realms: settings.API_PROVISIONING_REALMS!,
        }
      : undefined,
    filesEnabled: !!settings.S3_BUCKET,
    chatUrl: settings.API_CHAT_URL,
    kingdomId: settings.KINGDOM_ID,
    host: settings.API_HOST,
    port: settings.API_PORT,
    databaseUrl: url.href,
    redisUrl: settings.API_REDIS_URL,
    timeoutMs: settings.API_DEPENDENCY_TIMEOUT_MS,
    serversFile: settings.API_SERVERS_FILE
      ? resolve(workspaceRoot, settings.API_SERVERS_FILE)
      : undefined,
    gameHost: settings.API_GAME_HOST,
    gamePort: settings.API_GAME_PORT,
  };
});

export type Config = Effect.Success<typeof readConfig>;

export class ApiConfig extends Context.Service<ApiConfig, Config>()("@opencok/api/Config") {}

export const ApiConfigLive = Layer.effect(ApiConfig, readConfig);
