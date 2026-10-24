import {
  createWorldPointDetailStore,
  checkWorldPointDetailStore,
} from "@opencok/repositories/world-point-detail";
import { createWorldSearchStore, checkWorldSearchStore } from "@opencok/repositories/world-search";
import {
  createPlayerSearchStore,
  checkPlayerSearchStore,
} from "@opencok/repositories/player-search";
import {
  createWorldFavoriteStore,
  checkWorldFavoriteStore,
} from "@opencok/repositories/world-favorites";
import { createAvatarRuntime } from "./avatar.ts";
import { checkAvatarVersionStore } from "@opencok/repositories/avatar-version";
import { startAvatarRelay, startAvatarVersionRelay } from "./avatar-relay.ts";
import { checkAvatarCompletionStore } from "@opencok/repositories/avatar-delivery";
import { createRealmNotifications } from "@opencok/connection/notifications";
import { loadAvatarFiles } from "@opencok/connection/avatar-files";
import { readAvatarGrant, checkAvatarGrantStore } from "@opencok/repositories/avatar-grant";
import { Context, Effect, Layer, ManagedRuntime } from "effect";
import { RealmConfig, type Config } from "./config.ts";
import { acquireResource, fromPromise } from "@opencok/core/resource";
import { listenServer } from "@opencok/connection/server";
import type { ServerDependencies } from "@opencok/connection/dependencies";
import { Database } from "@opencok/repositories/game";
import { Cache } from "@opencok/storage/session";
import { Coordination } from "@opencok/storage/coordination";
import { loadRules } from "@opencok/resources/rules";
import { Game } from "@opencok/controllers/game";
import { World } from "@opencok/controllers/world";
import { createRealmChatSessionIssuer } from "@opencok/connection/realm-chat-session";
import { startMailGiftRelay } from "./mail-gift-relay.ts";
import { loadNicknameServices } from "./nickname.ts";

export class RealmDependencies extends Context.Service<RealmDependencies, ServerDependencies>()(
  "@opencok/server/Dependencies",
) {}

export const RealmDependenciesLive = Layer.effect(
  RealmDependencies,
  Effect.gen(function* () {
    const config = yield* RealmConfig;
    const rules = yield* fromPromise("realm.resources", () =>
      loadRules(config.resources, config.kingdomId),
    );
    const db = yield* acquireResource(
      "realm.database",
      async () => new Database(config),
      (db) => db.close(),
    );
    yield* fromPromise("realm.world-favorites", () =>
      checkWorldFavoriteStore(db.kingdom.db, db.databases.global.db),
    );
    const worldFavorites = createWorldFavoriteStore(
      db.kingdom.db,
      db.databases.global.db,
      config.kingdomId,
    );
    yield* fromPromise("realm.world-search", () => checkWorldSearchStore(db.kingdom.db));
    const worldSearch = createWorldSearchStore(db.databases, config.kingdomId);
    yield* fromPromise("realm.world-point-detail", () => checkWorldPointDetailStore(db.kingdom.db));
    const worldPointDetail = createWorldPointDetailStore(db.databases, config.kingdomId);
    yield* fromPromise("realm.player-search", () =>
      checkPlayerSearchStore(db.databases, config.kingdomId, config.crossSearchEnabled ?? true),
    );
    const playerSearch = createPlayerSearchStore(db.databases, config.kingdomId);
    const avatarFiles = config.avatarFiles
      ? yield* fromPromise("realm.avatar-files", async () => {
          await checkAvatarGrantStore(db.kingdom.db);
          return loadAvatarFiles({ ...config.avatarFiles!, timeoutMs: config.timeoutMs });
        })
      : undefined;
    const cache = new Cache(config);
    const nicknameServices = yield* fromPromise("realm.nickname-words", () =>
      loadNicknameServices(config.resources, (key) => cache.nicknameForbiddenWords(key)),
    );
    const coordination = yield* acquireResource(
      "realm.coordination",
      async () => new Coordination(config),
      async (coordination) => coordination.close(),
    );
    yield* fromPromise("realm.database.start", () => db.start()).pipe(Effect.uninterruptible);
    yield* acquireResource(
      "realm.mail-gift-relay",
      async () =>
        startMailGiftRelay(
          () => db.relayMailGifts(),
          () => {
            console.warn(
              JSON.stringify({ event: "mail_gift_relay_failed", kingdom: config.kingdomId }),
            );
          },
        ),
      (relay) => relay.close(),
    );
    yield* fromPromise("realm.cache", () => cache.command("PING")).pipe(Effect.uninterruptible);
    yield* fromPromise("realm.coordination.start", () => coordination.start()).pipe(
      Effect.uninterruptible,
    );
    const notifications = createRealmNotifications();
    const avatar =
      config.avatarChat && avatarFiles
        ? createAvatarRuntime({
            db,
            files: avatarFiles,
            rules,
            config: { ...config, avatarChat: config.avatarChat },
            cache,
            notifications,
            report: (effect) =>
              console.warn(
                JSON.stringify({
                  event: "avatar_delivery_failed",
                  kingdom: config.kingdomId,
                  effect,
                }),
              ),
          })
        : undefined;
    if (config.avatarChat && !avatarFiles) throw new Error("Avatar files unavailable");
    if (avatar) {
      yield* fromPromise("realm.avatar-version", () => checkAvatarVersionStore(db.kingdom.db));
      yield* acquireResource(
        "realm.avatar-version-relay",
        async () =>
          startAvatarVersionRelay(avatar.nextVersion, avatar.versionService.deliver, () =>
            console.warn(
              JSON.stringify({ event: "avatar_version_relay_failed", kingdom: config.kingdomId }),
            ),
          ),
        (relay) => relay.close(),
      );
      yield* fromPromise("realm.avatar-completion", () =>
        checkAvatarCompletionStore(db.kingdom.db),
      );
      yield* acquireResource(
        "realm.avatar-relay",
        async () =>
          startAvatarRelay(avatar.next, avatar.service.deliver, () =>
            console.warn(
              JSON.stringify({ event: "avatar_relay_failed", kingdom: config.kingdomId }),
            ),
          ),
        (relay) => relay.close(),
      );
    }
    return {
      notifications,
      db,
      cache,
      coordination,
      game: new Game(db, rules, config, Date.now, {
        ...nicknameServices,
        worldPointDetail,
        playerSearch,
        worldSearch,
        worldFavorites,
        avatarFinish: avatar?.service,
        avatarVersion: avatar?.versionService,
        avatar: avatarFiles
          ? {
              ...avatarFiles,
              read: (uid, now, inspect) =>
                readAvatarGrant(db.kingdom.db, config.kingdomId, uid, now, inspect),
            }
          : undefined,
        chatSession: config.chatSession
          ? createRealmChatSessionIssuer({
              ...config.chatSession,
              timeoutMs: config.timeoutMs,
            })
          : undefined,
        expeditionRanking: (limit) => cache.expeditionRanking(limit),
        scoreActivityRanking: () => cache.scoreActivityRanking(),
        heroRankingPosition: (query) => cache.heroRankingPosition(query),
        throneRankingPeriod: (realm) => cache.throneRankingPeriod(realm),
        donationScores: (allianceId, kind, date) => cache.donationScores(allianceId, kind, date),
        flowerRankingPublication: (realm, uid, limit, global) =>
          cache.flowerRankingPublication(realm, uid, limit, global),
        attributeRanking: (type) => cache.attributeRanking(type),
        publishedGlobalRanking: (kind) => cache.publishedGlobalRanking(kind),
        globalCelebrityRanking: (rankType) => cache.globalCelebrityRanking(rankType),
        dragonRanking: (ranges, allianceId) => cache.dragonRanking(ranges, allianceId),
        expeditionStage: (kingdomId) => cache.expeditionStage(kingdomId),
        worldPowerEffects: (kingdomId) => cache.worldEffects(kingdomId),
        emperorVersion: (kingdomId) => cache.emperorVersion(kingdomId),
        changeAccountCount: (deviceId) => cache.deviceChangeCount(deviceId),
        playerUpdateTimes: (kingdomId, uids) => cache.playerUpdateTimes(kingdomId, uids),
      }),
      world: new World(db, config.mapSize, config.kingdomId),
    };
  }),
);

export class RealmServer extends Context.Service<
  RealmServer,
  Effect.Success<ReturnType<typeof listenServer>>
>()("@opencok/server/Server") {}

export const RealmServerLive = Layer.effect(
  RealmServer,
  Effect.gen(function* () {
    const config = yield* RealmConfig;
    const dependencies = yield* RealmDependencies;
    return yield* listenServer(config, dependencies);
  }),
);

export const RealmLive = RealmServerLive.pipe(Layer.provide(RealmDependenciesLive));

export async function startServer(config: Config) {
  const runtime = ManagedRuntime.make(
    RealmLive.pipe(Layer.provide(Layer.succeed(RealmConfig, config))),
  );
  try {
    const server = await runtime.runPromise(RealmServer);
    return { ...server, close: () => runtime.dispose() };
  } catch (error) {
    await runtime.dispose();
    throw error;
  }
}
