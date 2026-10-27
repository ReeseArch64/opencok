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
      ? { url: settings.GAME_AVATAR_CHAT_URL, signingSecret: settings.CHAT_SIGNING_SECRET! }
      : undefined,
    avatarFiles: settings.GAME_FILES_URL ? { origin: settings.GAME_FILES_URL } : undefined,
    nicknameChat: settings.GAME_NICKNAME_CHAT_URL
      ? { url: settings.GAME_NICKNAME_CHAT_URL, signingSecret: settings.CHAT_SIGNING_SECRET! }
      : undefined,
    mailChat: settings.GAME_MAIL_CHAT_URL
      ? { url: settings.GAME_MAIL_CHAT_URL, signingSecret: settings.CHAT_SIGNING_SECRET! }
      : undefined,
    chatSession: settings.GAME_CHAT_SESSION_URL
      ? {
          url: settings.GAME_CHAT_SESSION_URL,
          signingSecret: settings.CHAT_SIGNING_SECRET!,
        }
      : undefined,
    host: "0.0.0.0",
    chatInterval: settings.GAME_CHAT_INTERVAL,
    feedMaxCount: settings.GAME_FEED_MAX_COUNT,
    mailTranslationEnabled: settings.GAME_MAIL_TRANSLATION,
    crossSearchEnabled: settings.GAME_CROSS_SEARCH,
    port: 9933,
    healthPort: 18090,
    kingdomId: settings.KINGDOM_ID,
    kingdomDatabase: settings.KINGDOM_DATABASE_NAME ?? `opencok_kingdom_${settings.KINGDOM_ID}`,
    playerKingdoms: settings.GAME_PLAYER_KINGDOMS,
    globalDatabase: settings.GLOBAL_DATABASE_NAME,
    databaseUrl: yield* databaseUrl,
    redisUrl: settings.REDIS_URL,
    zookeeper: settings.GAME_ZOOKEEPER,
    zkPath: `/opencok-experiment/COK${settings.KINGDOM_ID}`,
    loginSecret: settings.GAME_LOGIN_SECRET,
    mapSize: settings.GAME_MAP_SIZE,
    timeoutMs: settings.DEPENDENCY_TIMEOUT_MS,
  } satisfies Config;
});

export class RealmConfig extends Context.Service<RealmConfig, Config>()("@opencok/server/Config") {}

export const RealmConfigLive = Layer.effect(RealmConfig, config);
