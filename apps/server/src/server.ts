import { anniversaryDomain } from "@opencok/services/anniversary";
import { lotteryDomain } from "@opencok/services/lottery";
import { createTotemEffectStore, pendingTotemOwners } from "@opencok/repositories/totem";
import { createTotemDomain, expireTotems, settleTotemEffects } from "@opencok/services/totem";
import { publishWorldMutation } from "@opencok/services/world-publication";
import { createCivilizationCastleDomain } from "@opencok/services/civilization-castle";
import { createWorldMarchDomain } from "@opencok/services/world-march-runtime";
import {
  dueWorldMarches,
  createWorldInterest,
  unregisteredWorldMarches,
} from "@opencok/repositories/world-march-runtime";
import { dragonTalentsDomain } from "@opencok/services/dragon-talents";
import { dragonProgressionDomain } from "@opencok/services/dragon-progression";
import { minstrelDomain } from "@opencok/services/minstrel";
import { civilizationScienceDomain } from "@opencok/services/civilization-science";
import { createAvatarTickets } from "@opencok/storage/avatar-tickets";
import { createGeneralDrawDomain } from "@opencok/services/general-draws";
import { AllianceService, allianceStableId } from "@opencok/services/alliances";
import { createAllianceRepository } from "@opencok/repositories/alliance-gameplay";
import { dueAllianceResearch } from "@opencok/repositories/alliance-recovery";
import { createAlliancePublicationReader } from "@opencok/repositories/alliance-publication";
import { publishAllianceMutation } from "@opencok/services/alliance-publication";
import { relayMutationEvent } from "@opencok/repositories/mutation";
import { generalsDomain } from "@opencok/services/generals";
import { equipmentDomain, workshopDomain } from "@opencok/services/equipment";
import { playerEffectsDomain } from "@opencok/services/player-effects";
import { questsDomain } from "@opencok/services/quests";
import { cityQueueCommands } from "@opencok/rules/city-command";
import { trainingDomain } from "@opencok/services/training";
import { hospitalDomain } from "@opencok/services/hospital";
import { fortificationDomain } from "@opencok/services/fortifications";
import { researchDomain } from "@opencok/services/research";
import { createHash } from "node:crypto";
import { createCityProgressionStore } from "@opencok/repositories/city-progression";
import { createCityProductionBoundary } from "@opencok/repositories/city-production";
import { createCityProgressionHandlers } from "@opencok/services/city-progression";
import { constructionDomain } from "@opencok/services/construction";
import { num, text } from "@opencok/contracts/rows";
import {
  createActivityExecutor,
  dueActivities,
  unregisteredActivities,
  activityTransitionInstant,
  type ActivityDomain,
} from "@opencok/repositories/timed-activity";
import { createProductionExecutor } from "@opencok/repositories/production";
import { readReconnectProgress } from "@opencok/repositories/reconnect-progress";
import { persistReconnectProgress } from "@opencok/repositories/reconnect-write";
import { TimedActivityService } from "@opencok/services/timed-activity";
import { ProductionService } from "@opencok/services/production";
import { productionContext } from "@opencok/services/production-context";
import { sfs, encode, decode, str } from "@opencok/messages/sfs";
import { createCharacterCreator } from "@opencok/repositories/character-provisioning";
import { CharacterProvisioningService } from "@opencok/services/provisioning";
import { CharacterProvisioningController } from "@opencok/controllers/provisioning";
import { characterProvisioningHandler } from "@opencok/connection/provisioning";
import {
  createMailRewardExecutor,
  mailRewardRealmAllowed,
} from "@opencok/repositories/mail-rewards";
import { createShopRepository } from "@opencok/repositories/shops";
import { createTradeExecutor } from "@opencok/repositories/trade";
import { TradeService } from "@opencok/services/trade";
import { ShopService } from "@opencok/services/shops";
import { MailRewardService } from "@opencok/services/mail-rewards";
import { createInventoryExecutor } from "@opencok/repositories/inventory";
import { InventoryService } from "@opencok/services/inventory";
import { decodeWorldPowerEffects } from "@opencok/services/power";
import { worldPowerEffects } from "@opencok/rules/power-world";
import { checkMutationStore, createMutationExecutor } from "@opencok/repositories/mutation";
import { createEconomyMutationExecutor } from "@opencok/repositories/economy-mutation";
import { checkNicknameChangeStore } from "@opencok/repositories/nickname-change";
import { nicknameAllianceReward } from "@opencok/rules/nickname-alliance";
import { createCn1Sessions } from "@opencok/repositories/cn1-session";
import { createNicknameChangeRuntime } from "./nickname-change.ts";
import { createChatNicknamePublisher } from "@opencok/connection/chat-nickname";
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
import { createAvatarFiles } from "@opencok/connection/avatar-files";
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
import {
  acquireRealmAuthority,
  fenceRealmDatabase,
  fenceRealmTransaction,
} from "@opencok/repositories/realm-authority";
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
    const cache = new Cache(config);
    const avatarFiles = config.avatarFiles
      ? yield* fromPromise("realm.avatar-files", async () => {
          await checkAvatarGrantStore(db.kingdom.db);
          return createAvatarFiles({
            ...config.avatarFiles!,
            timeoutMs: config.timeoutMs,
            tickets: createAvatarTickets((name, ...args) => cache.command(name, ...args)),
          });
        })
      : undefined;
    const nicknameServices = yield* fromPromise("realm.nickname-words", () =>
      loadNicknameServices((key) => cache.nicknameForbiddenWords(key)),
    );
    const coordination = yield* acquireResource(
      "realm.coordination",
      async () => new Coordination(config),
      async (coordination) => coordination.close(),
    );
    yield* fromPromise("realm.database.start", () => db.start()).pipe(Effect.uninterruptible);
    yield* fromPromise("realm.cache", () => cache.command("PING")).pipe(Effect.uninterruptible);
    yield* fromPromise("realm.coordination.start", () => coordination.start()).pipe(
      Effect.uninterruptible,
    );
    const authority = yield* fromPromise("realm.authority", () =>
      acquireRealmAuthority(db.kingdom.db, config.kingdomId, () => coordination.ready),
    );
    yield* fromPromise("realm.mutations", () => checkMutationStore(db.kingdom.db));
    fenceRealmDatabase(db.kingdom.db, authority);
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
    const notifications = createRealmNotifications();
    const cn1 = createCn1Sessions(db.databases.global.db, rules, config.kingdomId);
    const nickname = config.nicknameChat
      ? createNicknameChangeRuntime({
          databases: db.databases,
          kingdomId: config.kingdomId,
          rules,
          notifications,
          timeoutMs: config.timeoutMs,
          report: () =>
            console.warn(
              JSON.stringify({ event: "nickname_delivery_failed", kingdom: config.kingdomId }),
            ),
          prepareRefund: (owner, now) => cn1.refresh(owner, now),
          refundRatio: async (profile) => cn1.ratio(profile),
          chat: createChatNicknamePublisher({
            ...config.nicknameChat,
            timeoutMs: config.timeoutMs,
          }),
          alliance: { rules, resolveMailReward: (id) => nicknameAllianceReward(id, rules) },
          sharedUser: { rules, cache },
        })
      : undefined;
    if (nickname) {
      yield* fromPromise("realm.nickname-store", () =>
        checkNicknameChangeStore(db.databases, config.kingdomId),
      );
      yield* fromPromise("realm.nickname-sessions", () => cn1.check());
      yield* acquireResource(
        "realm.nickname-relay",
        async () =>
          startAvatarVersionRelay(
            nickname.next,
            (owner, operationId) => {
              authority.assertReady();
              return nickname.deliver(owner, operationId, Date.now());
            },
            () =>
              console.warn(
                JSON.stringify({ event: "nickname_recovery_failed", kingdom: config.kingdomId }),
              ),
          ),
        (relay) => relay.close(),
      );
    }
    const avatar = avatarFiles
      ? createAvatarRuntime({
          db,
          files: avatarFiles,
          rules,
          config,
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
          startAvatarVersionRelay(
            avatar.nextVersion,
            (owner, operationId) => {
              authority.assertReady();
              return avatar.versionService.deliver(owner, operationId);
            },
            () =>
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
          startAvatarRelay(
            avatar.next,
            (owner, sequence) => {
              authority.assertReady();
              return avatar.service.deliver(owner, sequence);
            },
            () =>
              console.warn(
                JSON.stringify({ event: "avatar_relay_failed", kingdom: config.kingdomId }),
              ),
          ),
        (relay) => relay.close(),
      );
    }
    const economyEffects = {
      world: async () =>
        worldPowerEffects(
          decodeWorldPowerEffects(await cache.worldEffects(config.kingdomId)),
          rules,
          { kingdomId: config.kingdomId, version: "12.06.0", now: Date.now() },
        ),
      emperor: () => cache.emperorVersion(config.kingdomId),
    };
    const baseProductionPreparation = {
      async prepare(tx: Parameters<typeof readReconnectProgress>[0], owner: string, now: bigint) {
        const state = await readReconnectProgress(tx, owner, config.kingdomId, now);
        const planned = await productionContext(state, rules, now, {
          worldPowerEffects: (id) => cache.worldEffects(id),
          emperorVersion: (id) => cache.emperorVersion(id),
        });
        await persistReconnectProgress(tx, state, planned.write, authority, now);
        return planned.rates;
      },
    };
    const baseCityBoundary = createCityProductionBoundary(baseProductionPreparation, (row) => {
      const rule = rules.building(
        text(row, "itemId"),
        num(row, "level"),
        num(row, "star"),
        num(row, "progress"),
      );
      return rule.effects?.productionPerHour === undefined
        ? undefined
        : ["wood", "stone", "iron", "food"][rule.effects.productionResourceId ?? -1];
    });
    const cityBoundary: typeof baseCityBoundary = async (
      tx,
      owner,
      now,
      change,
      deleted,
      economy,
    ) => {
      await settleTotemEffects(
        createTotemEffectStore(tx, owner, now, config.mapSize, config.kingdomId, baseCityBoundary),
        rules,
        config.mapSize,
      );
      return baseCityBoundary(tx, owner, now, change, deleted, economy);
    };
    const productionPreparation = {
      async prepare(tx: Parameters<typeof readReconnectProgress>[0], owner: string, now: bigint) {
        await settleTotemEffects(
          createTotemEffectStore(
            tx,
            owner,
            now,
            config.mapSize,
            config.kingdomId,
            baseCityBoundary,
          ),
          rules,
          config.mapSize,
        );
        return baseProductionPreparation.prepare(tx, owner, now);
      },
    };
    const city = createCityProgressionHandlers(
      (tx: Parameters<typeof readReconnectProgress>[0], owner, now) =>
        createCityProgressionStore(tx, owner, now, cityBoundary, config.mapSize),
      [
        generalsDomain,
        createGeneralDrawDomain(() => cache.generalDrawRanking()),
        equipmentDomain,
        workshopDomain,
        playerEffectsDomain,
        questsDomain,
        constructionDomain,
        researchDomain,
        civilizationScienceDomain,
        dragonProgressionDomain,
        dragonTalentsDomain,
        createWorldMarchDomain(config.mapSize),
        createCivilizationCastleDomain(config.mapSize),
        createTotemDomain(config.mapSize),
        minstrelDomain,
        lotteryDomain,
        anniversaryDomain,
        trainingDomain,
        hospitalDomain,
        fortificationDomain,
      ],
      rules,
      economyEffects,
    );
    const alliances = new AllianceService(
      createAllianceRepository(
        db.kingdom.db,
        authority,
        cityBoundary,
        Date.now,
        city.domains,
        async (tx, owner, kind, count, now) => {
          await city.command(
            tx,
            owner,
            "quest.action",
            encode({ kind: sfs.string(kind), count: sfs.int(count) }),
            now,
            {
              resource() {
                throw new Error("Unexpected alliance quest resource grant");
              },
              gold() {
                throw new Error("Unexpected alliance quest gold grant");
              },
              item() {
                throw new Error("Unexpected alliance quest item grant");
              },
            },
          );
        },
      ),
      rules,
      economyEffects,
      async (value) =>
        Boolean(await nicknameServices.nicknameBadWords?.(value)) ||
        Boolean(await nicknameServices.nicknameForbidden?.(value)),
    );
    let allianceCursor: string | undefined;
    const recoverAlliances = async () => {
      authority.assertReady();
      const due = await dueAllianceResearch(
        db.kingdom.db,
        config.kingdomId,
        BigInt(Date.now()),
        allianceCursor,
      );
      allianceCursor = due.length === 64 ? due.at(-1)!.allianceId : undefined;
      for (const saved of due) {
        try {
          await alliances.command(saved.owner, "alliance.tick", {
            operationId: sfs.string(
              "alliance-research:" +
                allianceStableId(
                  `${saved.allianceId}:${saved.scienceId}:${saved.startTime}:${saved.needTime}:${saved.accelerate?.toString("hex") ?? ""}`,
                ),
            ),
          });
        } catch {
          console.warn(
            JSON.stringify({
              event: "alliance_research_recovery_failed",
              kingdom: config.kingdomId,
              alliance: saved.allianceId,
            }),
          );
        }
      }
      for (let index = 0; index < 64; index++) {
        const published = await relayMutationEvent(
          db.kingdom.db,
          authority,
          (event) =>
            publishAllianceMutation(
              createAlliancePublicationReader(db.kingdom.db, authority),
              event.payload,
              (owner, command, body) => notifications.publish(owner, command, body),
              rules,
            ),
          Date.now,
          "alliance.changed",
        );
        if (!published) break;
      }
    };
    yield* Effect.tryPromise({
      try: recoverAlliances,
      catch: () => new Error("Alliance recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    const activityDomains: ReadonlyMap<number, ActivityDomain> = city.domains;
    const activities = new TimedActivityService(
      createActivityExecutor(db.kingdom.db, authority, activityDomains, Date.now, {
        before: async (tx, owner, now, command) => {
          if (command.command === "activity.restore") return now;
          const transition =
            ["queue.finish", "queue.ccd"].includes(command.command) ||
            cityQueueCommands[command.command]?.action === "queue.finish";
          const params = decode(Buffer.from(command.request));
          const queueId = transition
            ? str(
                params,
                cityQueueCommands[command.command]?.queueKey ??
                  (command.command === "queue.ccd" ? "qUUID" : "uuid"),
              )
            : undefined;
          const at = await activityTransitionInstant(tx, owner, queueId, now);
          await productionPreparation.prepare(tx, owner, at);
          return at;
        },
        command: city.command,
        next: city.next,
        accelerate: city.accelerate,
      }),
      rules,
      economyEffects,
    );
    const worldInterest = createWorldInterest(db.kingdom.db, authority, config.mapSize);
    let worldCursor: { dueAt: bigint; id: string } | undefined;
    let worldImportCursor: string | undefined;
    const recoverWorld = async () => {
      const totemNow = BigInt(Date.now());
      await db.kingdom.db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        await expireTotems(
          createTotemEffectStore(
            tx,
            "",
            totemNow,
            config.mapSize,
            config.kingdomId,
            baseCityBoundary,
          ),
          config.mapSize,
        );
      });
      for (const owner of await pendingTotemOwners(db.kingdom.db, totemNow)) {
        try {
          await recoverActivities(owner);
          await activities.domainCommand(owner, "totem.tick", {
            operationId: sfs.string(`totem-tick:${Date.now()}:${owner}`),
          });
        } catch {
          console.warn(
            JSON.stringify({ event: "totem_recovery_failed", kingdom: config.kingdomId }),
          );
        }
      }
      const imported = await unregisteredWorldMarches(db.kingdom.db, worldImportCursor);
      worldImportCursor = imported.length === 64 ? imported.at(-1)!.id : undefined;
      for (const entry of imported)
        if (entry.owner) {
          try {
            await recoverActivities(entry.owner);
            await activities.domainCommand(entry.owner, "world.tick", {
              operationId: sfs.string(`world-import:${entry.id}`),
            });
          } catch {
            console.warn(
              JSON.stringify({
                event: "world_import_failed",
                kingdom: config.kingdomId,
                march: entry.id,
              }),
            );
          }
        }
      const due = await dueWorldMarches(db.kingdom.db, BigInt(Date.now()), worldCursor);
      worldCursor = due.length === 64 ? due.at(-1) : undefined;
      for (const entry of due) {
        try {
          await recoverActivities(entry.owner);
          await activities.domainCommand(entry.owner, "world.tick", {
            operationId: sfs.string(`world:${entry.id}:${entry.version}`),
          });
        } catch {
          console.warn(
            JSON.stringify({
              event: "world_recovery_failed",
              kingdom: config.kingdomId,
              march: entry.id,
            }),
          );
        }
      }
      for (const command of [
        "world.march",
        "world.march.retreat",
        "civilizationCastle",
        "totem",
        "totem.world",
        "world.march.spd",
        "world.tick",
        "world.mv",
        "world.mv.gold",
      ])
        for (let index = 0; index < 64; index++) {
          const delivered = await relayMutationEvent(
            db.kingdom.db,
            authority,
            (event) =>
              publishWorldMutation(
                event.payload,
                command,
                config.kingdomId,
                worldInterest.interested,
                (owner, eventCommand, body) => notifications.publish(owner, eventCommand, body),
              ),
            Date.now,
            command,
          );
          if (!delivered) break;
        }
    };
    yield* Effect.tryPromise({
      try: async () => {
        for (let i = 0; i < 64; i++) {
          const delivered = await relayMutationEvent(
            db.kingdom.db,
            authority,
            async (event) => {
              await notifications.publish(event.owner, "status.push", decode(event.payload));
            },
            Date.now,
            "totem.status",
          );
          if (!delivered) break;
        }
      },
      catch: () => new Error("Totem status relay unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    const production = new ProductionService(
      createProductionExecutor(db.kingdom.db, authority, {
        ...productionPreparation,
        recordAction: async (tx, owner, kind, itemId, count, now, economy) => {
          await city.command(
            tx,
            owner,
            "quest.action",
            encode({ kind: sfs.string(kind), itemId: sfs.string(itemId), count: sfs.int(count) }),
            now,
            economy,
          );
        },
      }),
      rules,
      economyEffects,
    );
    let importCursor: string | undefined;
    let recoveryCursor: { dueAt: bigint; id: string } | undefined;
    const recoverActivities = async (owner?: string, stopQueue?: string) => {
      authority.assertReady();
      const pending = await unregisteredActivities(
        db.kingdom.db,
        [...activityDomains.keys()],
        owner ? 256 : 64,
        owner,
        owner ? undefined : importCursor,
      );
      if (!owner) importCursor = pending.length === 64 ? pending.at(-1)!.uuid : undefined;
      for (const saved of pending) {
        const operationId =
          "restore:" +
          createHash("sha256")
            .update(
              [
                saved.uuid,
                saved.ownerId,
                saved.itemId,
                String(saved.startTime),
                String(saved.updateTime),
              ].join(":"),
            )
            .digest("hex");
        try {
          await activities.restore(saved.ownerId, operationId, saved.uuid);
        } catch {
          console.warn(
            JSON.stringify({
              event: "activity_import_failed",
              kingdom: config.kingdomId,
              queue: saved.uuid,
            }),
          );
        }
      }
      const due = await dueActivities(
        db.kingdom.db,
        [...activityDomains.keys()],
        BigInt(Date.now()),
        owner ? 256 : 64,
        owner,
        owner ? undefined : recoveryCursor,
      );
      if (!owner) recoveryCursor = due.length === 64 ? due.at(-1) : undefined;
      for (const activity of due) {
        if (activity.queueId === stopQueue) break;
        try {
          await activities.command(activity.ownerId, "queue.finish", {
            uuid: sfs.string(activity.queueId),
            activityId: sfs.string(activity.id),
            version: sfs.int(activity.version),
            operationId: sfs.string(`finish:${activity.id}:${activity.version}`),
          });
        } catch {
          console.warn(
            JSON.stringify({
              event: "activity_recovery_failed",
              kingdom: config.kingdomId,
              activity: activity.id,
            }),
          );
        }
      }
    };
    yield* Effect.tryPromise({
      try: recoverWorld,
      catch: () => new Error("World recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: () => recoverActivities(),
      catch: () => new Error("Activity recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    const trade = new TradeService(createTradeExecutor(db.kingdom.db, authority), rules);
    const shops = new ShopService(createShopRepository(db.kingdom.db, authority), rules);
    const mailRewards = new MailRewardService(
      createMailRewardExecutor(db.kingdom.db, authority, Date.now, () =>
        mailRewardRealmAllowed(db.databases.global.db, config.kingdomId),
      ),
      rules,
    );
    const inventory = new InventoryService(
      createInventoryExecutor(db.kingdom.db, authority, Date.now, {
        before: async (tx, owner, now) => {
          await productionPreparation.prepare(tx, owner, now);
        },
        recordAction: async (tx, owner, kind, itemId, count, now, economy) => {
          await city.command(
            tx,
            owner,
            "quest.action",
            encode({ kind: sfs.string(kind), itemId: sfs.string(itemId), count: sfs.int(count) }),
            now,
            economy,
          );
        },
        useEffect: async (tx, owner, itemId, count, now, economy) =>
          decode(
            Buffer.from(
              (
                await city.command(
                  tx,
                  owner,
                  ["37", "40"].includes(rules.goods.get(itemId)?.type ?? "")
                    ? "dragon.item"
                    : "effect.item",
                  encode({ itemId: sfs.string(itemId), count: sfs.int(count) }),
                  now,
                  economy,
                )
              ).response,
            ),
          ),
      }),
      rules,
      {
        world: async () =>
          worldPowerEffects(
            decodeWorldPowerEffects(await cache.worldEffects(config.kingdomId)),
            rules,
            { kingdomId: config.kingdomId, version: "12.06.0", now: Date.now() },
          ),
        emperor: () => cache.emperorVersion(config.kingdomId),
      },
    );
    return {
      provisioning: config.provisioningSecret
        ? characterProvisioningHandler(
            new CharacterProvisioningController(
              new CharacterProvisioningService(
                createCharacterCreator(db.kingdom.db, authority, config.mapSize),
                rules,
              ),
            ),
            config.provisioningSecret,
          )
        : undefined,
      inventory,
      mutations: createMutationExecutor(db.kingdom.db, authority),
      economy: createEconomyMutationExecutor(db.kingdom.db, authority),
      profileSessions: nickname ? { open: cn1.open, close: cn1.close } : undefined,
      notifications,
      db,
      cache,
      coordination,
      game: new GameController(
        new GameService(db, rules, config, Date.now, {
          timed: async (owner, command, params) => {
            const target = ["queue.open", "queue.rent"].includes(command)
              ? undefined
              : str(params, command === "queue.ccd" ? "qUUID" : "uuid");
            await recoverActivities(owner, target);
            return activities.command(owner, command, params);
          },
          production: async (owner, command, params) => {
            await recoverActivities(owner);
            return production.command(owner, command, params);
          },
          reconcileAlliance: async (owner) => {
            await alliances.command(owner, "alliance.tick", {});
          },
          alliance: async (owner, command, params) => {
            await recoverActivities(owner);
            return alliances.command(owner, command, params);
          },
          cityProgression: async (owner, command, params) => {
            await recoverActivities(owner);
            return activities.domainCommand(owner, command, params);
          },
          reconcileTimed: async (owner) => {
            await recoverActivities(owner);
            await production.command(owner, "production.settle", {});
          },
          trade: (owner, command, params) => trade.command(owner, command, params),
          shop: (owner, command, params) => shops.command(owner, command, params),
          mailReward: (owner, command, params) => mailRewards.command(owner, command, params),
          inventory: (owner, command, params) => inventory.command(owner, command, params),
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
          nicknameChange: nickname
            ? async (...args) => {
                authority.assertReady();
                return nickname.command(...args);
              }
            : undefined,
          worldPointDetail,
          playerSearch,
          worldSearch,
          worldFavorites,
          avatarFinish: avatar
            ? {
                ...avatar.service,
                finish: (...args) => {
                  authority.assertReady();
                  return avatar.service.finish(...args);
                },
              }
            : undefined,
          avatarVersion: avatar
            ? {
                ...avatar.versionService,
                update: (...args) => {
                  authority.assertReady();
                  return avatar.versionService.update(...args);
                },
              }
            : undefined,
          avatar: avatarFiles
            ? {
                ...avatarFiles,
                read: (uid, now, inspect) => {
                  authority.assertReady();
                  return readAvatarGrant(db.kingdom.db, config.kingdomId, uid, now, inspect);
                },
              }
            : undefined,
          mailChatEnabled: !!config.mailChat,
          chatSession: config.chatSession
            ? (() => {
                const issue = createRealmChatSessionIssuer({
                  ...config.chatSession,
                  timeoutMs: config.timeoutMs,
                });
                return async (request) => {
                  authority.assertReady();
                  return issue(request);
                };
              })()
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
      world: new WorldController(
        new WorldService(db, config.mapSize, config.kingdomId, { ...worldInterest, rules }),
      ),
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
