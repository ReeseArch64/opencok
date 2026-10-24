import { createChatMailboxPublisher } from "@opencok/connection/chat-mailbox";
import { GameController } from "@opencok/controllers/game";
import { WorldController } from "@opencok/controllers/world";
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
import type { Rules } from "@opencok/rules/game";
import { GameService } from "@opencok/services/game";
import { WorldService } from "@opencok/services/world";
import { createRealmChatSessionIssuer } from "@opencok/connection/realm-chat-session";
import { startMailGiftRelay } from "./mail-gift-relay.ts";
import { loadNicknameServices } from "./nickname.ts";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { executeReconnectProgress } from "@opencok/repositories/reconnect-write";
import { readFriendshipBinding } from "@opencok/repositories/reconnect-mine";
import { initialFriendshipMine } from "@opencok/rules/reconnect-mine";

export class RealmDependencies extends Context.Service<RealmDependencies, ServerDependencies>()(
  "@opencok/server/Dependencies",
) {}

export class RealmRules extends Context.Service<RealmRules, Rules>()("@opencok/server/Rules") {}

export const RealmRulesLive = Layer.effect(
  RealmRules,
  Effect.gen(function* () {
    const config = yield* RealmConfig;
    return yield* fromPromise("realm.resources", () => loadRules(undefined, config.kingdomId));
  }),
);

export const RealmDependenciesLive = Layer.effect(
  RealmDependencies,
  Effect.gen(function* () {
    const config = yield* RealmConfig;
    const rules = yield* RealmRules;
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
      loadNicknameServices((key) => cache.nicknameForbiddenWords(key)),
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
    if (config.mailChat) {
      const publish = createChatMailboxPublisher({
        ...config.mailChat,
        timeoutMs: config.timeoutMs,
      });
      yield* acquireResource(
        "realm.mail-chat-relay",
        async () =>
          startMailGiftRelay(
            async () => {
              let delivered = 0;
              while (delivered < 50 && (await db.relayMailChat(publish))) delivered++;
              return delivered;
            },
            () =>
              console.warn(
                JSON.stringify({ event: "mail_chat_relay_failed", kingdom: config.kingdomId }),
              ),
          ),
        (relay) => relay.close(),
      );
    }
    yield* fromPromise("realm.cache", () => cache.command("PING")).pipe(Effect.uninterruptible);
    yield* fromPromise("realm.coordination.start", () => coordination.start()).pipe(
      Effect.uninterruptible,
    );
    const authority = yield* fromPromise("realm.authority", () =>
      acquireRealmAuthority(db.kingdom.db, config.kingdomId, () => coordination.ready),
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
      game: new GameController(
        new GameService(db, rules, config, Date.now, {
          reconnect: async (uid, now, plan) => {
            authority.assertReady();
            const binding = await readFriendshipBinding(
              db.databases.global.db,
              config.kingdomId,
              uid,
            );
            return executeReconnectProgress(db.kingdom.db, authority, uid, BigInt(now), plan, {
              binding,
              initial: () => initialFriendshipMine(rules),
            });
          },
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
          mailChatEnabled: !!config.mailChat,
          chatSession: config.chatSession
            ? createRealmChatSessionIssuer({
                ...config.chatSession,
                timeoutMs: config.timeoutMs,
              })
            : undefined,
          expeditionRanking: (limit) => cache.expeditionRanking(limit),
          scoreActivityRanking: () => cache.scoreActivityRanking(),
          battleFightPublication: () => cache.battleFightPublication(),
          playoffPublication: () => cache.playoffPublication(),
          heroHistoryPublication: (keys, alliance) => cache.heroHistoryPublication(keys, alliance),
          heroRankingPosition: (query) => cache.heroRankingPosition(query),
          throneRankingPeriod: (realm) => cache.throneRankingPeriod(realm),
          donationScores: (allianceId, kind, date) => cache.donationScores(allianceId, kind, date),
          flowerRankingPublication: (realm, uid, limit, global) =>
            cache.flowerRankingPublication(realm, uid, limit, global),
          militaryRanking: (type, group) => cache.militaryRanking(type, group),
          attributeRanking: (type) => cache.attributeRanking(type),
          publishedGlobalRanking: (kind) => cache.publishedGlobalRanking(kind),
          globalCelebrityRanking: (rankType) => cache.globalCelebrityRanking(rankType),
          dragonRanking: (ranges, allianceId) => cache.dragonRanking(ranges, allianceId),
          expeditionStage: (kingdomId) => cache.expeditionStage(kingdomId),
          worldPowerEffects: (kingdomId) => cache.worldEffects(kingdomId),
          worldTurretKills: (kingdomId, territory) => cache.worldTurretKills(kingdomId, territory),
          emperorVersion: (kingdomId) => cache.emperorVersion(kingdomId),
          changeAccountCount: (deviceId) => cache.deviceChangeCount(deviceId),
          lastSystemMail: (uid) => cache.lastSystemMail(uid),
          systemMailPage: (uid, ids, count, time, inspect) =>
            cache.systemMailPage(uid, ids, count, time, inspect),
          playerUpdateTimes: (kingdomId, uids) => cache.playerUpdateTimes(kingdomId, uids),
        }),
      ),
      world: new WorldController(new WorldService(db, config.mapSize, config.kingdomId)),
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

const realm = RealmServerLive.pipe(Layer.provide(RealmDependenciesLive));
export const RealmLive = realm.pipe(Layer.provide(RealmRulesLive));

export async function startServer(config: Config, rules?: Rules) {
  if (rules && rules.kingdomId !== config.kingdomId)
    throw new Error("Rules do not belong to the configured realm");
  const runtime = ManagedRuntime.make(
    realm.pipe(
      Layer.provide(rules ? Layer.succeed(RealmRules, rules) : RealmRulesLive),
      Layer.provide(Layer.succeed(RealmConfig, config)),
    ),
  );
  try {
    const server = await runtime.runPromise(RealmServer);
    return { ...server, close: () => runtime.dispose() };
  } catch (error) {
    await runtime.dispose();
    throw error;
  }
}
