import { Context, Effect, Layer } from "effect";
import { databaseUrl, readEnvironment } from "@opencok/env/effect";
import { serverSchema } from "@opencok/env/server/schema";
import type { ServerConfig } from "@opencok/contracts/server";

export type Config = ServerConfig;

export const config = Effect.gen(function* () {
  const settings = yield* readEnvironment(serverSchema);

  return {
    provisioningSecret: settings.PROVISIONING_SIGNING_SECRET,
    avatarChat: settings.GAME_AVATAR_CHAT_URL
      ? { url: settings.GAME_AVATAR_CHAT_URL, signingSecret: settings.CHAT_SECRET! }
      : undefined,
    avatarFiles: settings.API_URL ? { origin: settings.API_URL } : undefined,
    nicknameChat: settings.CHAT_URL
      ? {
          url: new URL("/_internal/nickname", settings.CHAT_URL).href,
          signingSecret: settings.CHAT_SECRET!,
        }
      : undefined,
    mailChat: settings.CHAT_URL
      ? {
          url: new URL("/_internal/mailbox", settings.CHAT_URL).href,
          signingSecret: settings.CHAT_SECRET!,
        }
      : undefined,
    chatSession: settings.CHAT_URL
      ? {
          url: new URL("/external/session", settings.CHAT_URL).href,
          signingSecret: settings.CHAT_SECRET!,
        }
      : undefined,
    host: "0.0.0.0",
    chatInterval: 1,
    feedMaxCount: 3,
    mailTranslationEnabled: settings.GAME_MAIL_TRANSLATION,
    crossSearchEnabled: true,
    port: 9933,
    healthPort: 18090,
    kingdomId: settings.KINGDOM_ID,
    kingdomDatabase: settings.KINGDOM_DATABASE_NAME ?? `opencok_kingdom_${settings.KINGDOM_ID}`,
    playerKingdoms: undefined,
    globalDatabase: settings.GLOBAL_DATABASE_NAME,
    databaseUrl: yield* databaseUrl,
    redisUrl: settings.REDIS_URL,
    zookeeper: settings.GAME_ZOOKEEPER,
    zkPath: `/opencok-experiment/COK${settings.KINGDOM_ID}`,
    loginSecret: settings.GAME_SECRET,
    mapSize: 1201,
    timeoutMs: 5000,
  } satisfies Config;
});

export class RealmConfig extends Context.Service<RealmConfig, Config>()("@opencok/server/Config") {}

export const RealmConfigLive = Layer.effect(RealmConfig, config);
