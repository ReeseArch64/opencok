import { createCampaignAudience } from "@opencok/repositories/campaign-notice";
import { publishCampaignNotice } from "@opencok/services/campaign-notice";
import {
  ContinuedCostRewardService,
  continuedCostRewardDomain,
} from "@opencok/services/continued-cost-rewards";
import { createCostRankAwardStore } from "@opencok/repositories/continued-cost-rewards";
import { costRankAwardOperation } from "@opencok/rules/continued-cost-rewards";
import { ContinuedCostFinalityService } from "@opencok/services/continued-cost-finality";
import {
  createCostFinalityOwned,
  createCostFinalityShared,
} from "@opencok/repositories/continued-cost-finality";
import { ContinuedCostRankingService } from "@opencok/services/continued-cost-ranking";
import {
  createCostRankingFacts,
  createCostRankingRegistry,
} from "@opencok/repositories/continued-cost-ranking";
import {
  ExpeditionStageRewardService,
  expeditionStageRewardDomain,
  ExpeditionHistoryService,
} from "@opencok/services/expedition-stage-rewards";
import {
  createExpeditionAwardStore,
  createExpeditionAwardStandings,
  createExpeditionHistorySource,
} from "@opencok/repositories/expedition-stage-rewards";
import { expeditionAwardOperation } from "@opencok/rules/expedition-stage-rewards";
import { ExpeditionStageFinalityService } from "@opencok/services/expedition-stage-finality";
import {
  createExpeditionStageRealm,
  createExpeditionStageRegistry,
} from "@opencok/repositories/expedition-stage-finality";
import { expeditionOpen } from "@opencok/rules/new-expedition";
import {
  ExpeditionScorePublicationService,
  ExpeditionLiveViewService,
} from "@opencok/services/expedition-score-publication";
import {
  createExpeditionScoreSource,
  createExpeditionScoreProjection,
  createExpeditionLiveSource,
} from "@opencok/repositories/expedition-score-publication";
import { expeditionDiscovery } from "@opencok/rules/expedition-score-publication";
import {
  ExpeditionPhaseService,
  ExpeditionActivityService,
  expeditionPhaseDomain,
  publishExpeditionPhaseNotification,
} from "@opencok/services/expedition-phase";
import {
  createExpeditionPhaseStore,
  createExpeditionActivityReader,
  currentExpeditionClock,
} from "@opencok/repositories/expedition-phase";
import { expeditionPhaseOperation } from "@opencok/rules/expedition-phase";
import { ExpeditionMatchingService } from "@opencok/services/expedition-matching";
import {
  createExpeditionMatchingRegistry,
  createExpeditionMatchingRealmStore,
} from "@opencok/repositories/expedition-matching";
import { ExpeditionCalendarService } from "@opencok/services/expedition-calendar";
import { createExpeditionCalendarStore } from "@opencok/repositories/expedition-calendar";
import {
  HeroRankingRewardService,
  heroRankingRewardDomain,
} from "@opencok/services/hero-ranking-rewards";
import {
  createHeroRankRewardStore,
  createHeroRankRewardStandings,
} from "@opencok/repositories/hero-ranking-rewards";
import { heroRankAwardOperation } from "@opencok/rules/hero-ranking-rewards";
import { HeroRankingFinalityService } from "@opencok/services/hero-ranking-finality";
import {
  createHeroRankFinalityRealm,
  createHeroRankFinalityRegistry,
} from "@opencok/repositories/hero-ranking-finality";
import { HeroRankPublicationService } from "@opencok/services/hero-rank-publication";
import {
  createHeroRankSource,
  createHeroRankProjection,
} from "@opencok/repositories/hero-rank-publication";
import { HeroMatchingService } from "@opencok/services/hero-matching";
import {
  createHeroMatchingRealmStore,
  createHeroMatchingRegistry,
} from "@opencok/repositories/hero-matching";
import { currentHeroScore } from "@opencok/repositories/hero-score";
import { heroTargetDomain, deliverHeroTargetBatch } from "@opencok/services/hero-score";
import { HeroCalendarService } from "@opencok/services/hero-calendar";
import { createHeroCalendarStore } from "@opencok/repositories/hero-calendar";
import {
  olympicDomain,
  OlympicScheduleService,
  olympicSettlementOperation,
} from "@opencok/services/olympic";
import {
  createOlympicScheduleStore,
  pendingOlympicSettlements,
} from "@opencok/repositories/olympic";
import { olympicPeriod } from "@opencok/rules/olympic";
import {
  cupBettingDomain,
  CupScheduleService,
  cupSettlementOperation,
} from "@opencok/services/cup-betting";
import { createCupScheduleStore, pendingCupSettlements } from "@opencok/repositories/cup-betting";
import { cupCalendar } from "@opencok/rules/cup-betting";
import { createGroupBuyDomain, groupBuyOperation } from "@opencok/services/groupbuy";
import { pendingGroupBuys } from "@opencok/repositories/groupbuy";
import { createSpecialEventStock } from "@opencok/repositories/special-event";
import { createSpecialEventDomain, specialEventOperation } from "@opencok/services/special-event";
import { confirmedNicknameCost } from "@opencok/services/continued-cost-spending";
import { continuedCostDomain, continuedCostOperation } from "@opencok/services/continued-cost";
import { readContinuedCostSpending } from "@opencok/mappings/continued-cost";
import { pendingContinuedCosts } from "@opencok/repositories/continued-cost";
import {
  cosmeticInteractionParticipants,
  publishCosmeticInteractionMutation,
} from "@opencok/services/city-cosmetics";
import {
  troubleDomain,
  deliverWorldTroubles,
  publishTroubleMutation,
} from "@opencok/services/trouble";
import { createPrayerDomain } from "@opencok/services/prayer";
import { recallTaskDomain } from "@opencok/services/recall-task";
import { regionalRecallDomain } from "@opencok/services/regional-recall";
import { initializeRealmOpeningClock } from "@opencok/repositories/realm-opening-clock";
import {
  createAllianceHeartDomain,
  publishAllianceHeartMutation,
} from "@opencok/services/alliance-heart";
import { pendingAllianceHeartOwners } from "@opencok/repositories/alliance-heart";
import {
  playerItemGiftDomain,
  publishPlayerItemGiftMutation,
} from "@opencok/services/player-item-gifts";
import { pendingPlayerItemGiftOwners } from "@opencok/repositories/player-item-gifts";
import { createSeasonalExchangeDomain } from "@opencok/services/seasonal-exchange";
import { createVipBoxDomain } from "@opencok/services/vip-box";
import { createTargetTaskDomain, publishTargetTaskMutation } from "@opencok/services/target-task";
import { createRechargeFeedbackDomain } from "@opencok/services/recharge-feedback";
import { createRechargeActivityDomain } from "@opencok/services/recharge-activity";
import { createOrdinaryBoxDomain } from "@opencok/services/ordinary-box";
import { createSevenDayCycleDomain } from "@opencok/services/seven-day-cycle";
import { createShippingInvestmentDomain } from "@opencok/services/shipping-investment";
import { dailyInvestmentDomain } from "@opencok/services/daily-investment";
import { alchemistDomain } from "@opencok/services/alchemist";
import { castleLevelEventDomain } from "@opencok/services/castle-level-event";
import { createLuckyDayDomain } from "@opencok/services/lucky-day";
import { dragonTowerDomain, publishDragonTowerMutation } from "@opencok/services/dragon-tower";
import {
  ExpeditionTreasuryService,
  expeditionTreasuryCommands,
  publishExpeditionTreasuryMutation,
} from "@opencok/services/expedition-treasury";
import { createExpeditionTreasuryExecutor } from "@opencok/repositories/expedition-treasury";
import { expeditionDomain } from "@opencok/services/new-expedition";
import { createArenaDomain, publishArenaMutation } from "@opencok/services/arena";
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
import { createChatNoticeCostReader } from "@opencok/repositories/chat-notice-cost";
import { cleanupSocialRealm } from "@opencok/repositories/social-cleanup";
import type { Fields } from "@opencok/messages/sfs";
import { FriendshipMineService } from "@opencok/services/friendship-mine";
import { createFriendshipMineExecutor } from "@opencok/repositories/friendship-mine";
import { ChatNoticeService } from "@opencok/services/chat-notice";
import { PostboxService } from "@opencok/services/postbox";
import { createPostboxExecutor } from "@opencok/repositories/postbox";
import { createRealmSocialExecutor } from "@opencok/connection/realm-social";
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
import { sfs, encode, decode, str, int, fields, Type } from "@opencok/messages/sfs";
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
    cache.bindRealmOwner(authority.epoch);
    yield* fromPromise("realm.mutations", () => checkMutationStore(db.kingdom.db));
    fenceRealmDatabase(db.kingdom.db, authority);
    yield* fromPromise("realm.opening-clock", () =>
      initializeRealmOpeningClock(db.kingdom.db, authority),
    );
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
          confirmedSpending: confirmedNicknameCost(rules),
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
    const specialEventStock = createSpecialEventStock(db.databases.global.db);
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
        dragonTowerDomain,
        dragonTalentsDomain,
        createWorldMarchDomain(config.mapSize),
        createCivilizationCastleDomain(config.mapSize),
        createTotemDomain(config.mapSize),
        minstrelDomain,
        alchemistDomain,
        dailyInvestmentDomain,
        createShippingInvestmentDomain(),
        createSevenDayCycleDomain(),
        createOrdinaryBoxDomain(),
        createRechargeActivityDomain(),
        createRechargeFeedbackDomain(),
        createAllianceHeartDomain((uid) => notifications.owners().includes(uid)),
        createPrayerDomain(),
        troubleDomain,
        olympicDomain,
        cupBettingDomain,
        createGroupBuyDomain(),
        continuedCostDomain,
        heroTargetDomain,
        heroRankingRewardDomain,
        continuedCostRewardDomain,
        expeditionStageRewardDomain,
        createSpecialEventDomain(specialEventStock),
        recallTaskDomain,
        regionalRecallDomain,
        playerItemGiftDomain,
        createSeasonalExchangeDomain(),
        createVipBoxDomain(),
        createTargetTaskDomain(),
        createLuckyDayDomain(),
        castleLevelEventDomain,
        lotteryDomain,
        expeditionDomain,
        expeditionPhaseDomain,
        anniversaryDomain,
        createArenaDomain(),
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
      if (config.chatSession)
        for (let index = 0; index < 64; index++) {
          const published = await relayMutationEvent(
            db.kingdom.db,
            authority,
            async (event) => {
              const execute = createRealmSocialExecutor({
                ...config.chatSession!,
                authority,
                realm: config.kingdomId,
                timeoutMs: config.timeoutMs,
              });
              await execute(event.owner, "mine.call.publish", {
                operationId: sfs.string(event.requestId),
              });
            },
            Date.now,
            "social.mine.call",
            5000,
          );
          if (!published) break;
        }
      if (config.chatSession)
        for (let index = 0; index < 64; index++) {
          const published = await relayMutationEvent(
            db.kingdom.db,
            authority,
            async (event) => {
              const execute = createRealmSocialExecutor({
                authority,
                ...config.chatSession!,
                realm: config.kingdomId,
                timeoutMs: config.timeoutMs,
              });
              const result = await execute(event.owner, "chat.notice.commit", {
                operationId: sfs.string(event.requestId),
              });
              if (result.expired?.value === true && result.delivered?.value !== true)
                await notices.refund(event.owner, event.requestId);
            },
            Date.now,
            "social.notice",
            5000,
          );
          if (!published) break;
        }
      for (let index = 0; index < 64; index++) {
        const published = await relayMutationEvent(
          db.kingdom.db,
          authority,
          async (event) => {
            const data = decode(event.payload);
            if (BigInt((data.expiresAt?.value as bigint) ?? 0) > BigInt(Date.now()))
              await notifications.publish(str(data, "recipient"), "push.lua.postMail", {
                message: data.message!,
                chat: data.chat!,
              });
          },
          Date.now,
          "social.post",
        );
        if (!published) break;
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
      cosmeticInteractionParticipants,
    );
    const expeditionTreasury = new ExpeditionTreasuryService(
      createExpeditionTreasuryExecutor(db.kingdom.db, authority),
      rules,
    );
    const worldInterest = createWorldInterest(db.kingdom.db, authority, config.mapSize);
    let worldCursor: { dueAt: bigint; id: string } | undefined;
    let worldImportCursor: string | undefined;
    const heroCalendar = new HeroCalendarService(
      createHeroCalendarStore(db.kingdom.db, authority),
      rules,
    );
    const heroRankPublication = new HeroRankPublicationService(
      createHeroRankSource(db.kingdom.db, authority),
      createHeroRankProjection(db.databases.global.db, authority),
      (rows) => cache.publishHeroRanking(rows),
      rules,
    );
    const heroRankingFinality = new HeroRankingFinalityService(
      createHeroRankFinalityRealm(db.kingdom.db, authority),
      createHeroRankFinalityRegistry(db.databases.global.db, authority),
      createHeroRankProjection(db.databases.global.db, authority),
      rules,
      [...db.databases.kingdoms.keys()],
    );
    const campaignAudience = createCampaignAudience(db.kingdom.db, authority);
    const costRankingFacts = createCostRankingFacts(db.kingdom.db, authority);
    const continuedCostFinality = new ContinuedCostFinalityService(
      costRankingFacts,
      createCostFinalityOwned(db.kingdom.db, authority),
      createCostFinalityShared(db.databases.global.db, authority),
    );
    const continuedCostRanking = new ContinuedCostRankingService(
      costRankingFacts,
      createCostRankingRegistry(db.databases.global.db, authority),
      rules,
      [...db.databases.kingdoms.keys()],
    );
    const expeditionCalendar = new ExpeditionCalendarService(
      createExpeditionCalendarStore(db.databases.global.db),
      rules,
      [...db.databases.kingdoms.keys()],
    );
    const expeditionMatching = new ExpeditionMatchingService(
      expeditionCalendar,
      createExpeditionMatchingRealmStore(
        db.kingdom.db,
        authority,
        Date.now,
        rules.configuration.serverConfig?.get("power_limit")?.rankingHideGm === "1",
      ),
      createExpeditionMatchingRegistry(db.databases.global.db),
      rules,
    );
    const expeditionPhases = new ExpeditionPhaseService(
      expeditionCalendar,
      createExpeditionPhaseStore(db.kingdom.db, authority),
    );
    const expeditionActivity = new ExpeditionActivityService(
      createExpeditionActivityReader(db.kingdom.db, authority),
      rules,
    );
    let expeditionNoticeCursor = 0;
    const expeditionNotified = new Map<string, bigint>();
    const recoverExpeditionNotifications = async () => {
      const clock = await currentExpeditionClock(db.kingdom.db, authority);
      if (!clock) return;
      const online = notifications.owners(),
        active = new Set(online);
      for (const owner of expeditionNotified.keys())
        if (!active.has(owner)) expeditionNotified.delete(owner);
      const selected = Array.from(
        { length: Math.min(32, online.length) },
        (_, index) => online[(expeditionNoticeCursor + index) % online.length]!,
      );
      if (online.length)
        expeditionNoticeCursor = (expeditionNoticeCursor + selected.length) % online.length;
      await Promise.allSettled(
        selected.map(async (owner) => {
          if (expeditionNotified.get(owner) === clock.revision) return;
          await activities.domainCommand(owner, "expedition.notify", {
            revision: sfs.string(String(clock.revision)),
            operationId: sfs.string(expeditionPhaseOperation(clock.revision)),
          });
          expeditionNotified.set(owner, clock.revision);
        }),
      );
      for (let index = 0; index < 64; index++) {
        const latest = await currentExpeditionClock(db.kingdom.db, authority);
        const delivered = await relayMutationEvent(
          db.kingdom.db,
          authority,
          async (event) => {
            await publishExpeditionPhaseNotification(
              event.payload,
              event.owner,
              latest?.revision,
              (owner, command, body) => notifications.publish(owner, command, body),
            );
          },
          Date.now,
          "expedition.phase",
          60000,
        );
        if (!delivered) break;
      }
    };
    const costRankRewards = new ContinuedCostRewardService(
      createCostRankAwardStore(db.kingdom.db, authority),
      createCostRankingRegistry(db.databases.global.db, authority),
      createCostFinalityShared(db.databases.global.db, authority),
      rules,
      (owner, id) =>
        activities.domainCommand(owner, "continuedcost.rank.deliver", {
          awardId: sfs.string(id),
          operationId: sfs.string(costRankAwardOperation(id)),
        }),
    );
    const expeditionStageRewards = new ExpeditionStageRewardService(
      createExpeditionAwardStore(db.kingdom.db, authority),
      createExpeditionAwardStandings(db.databases.global.db, config.kingdomId),
      rules,
      (owner, id) =>
        activities.domainCommand(owner, "expedition.award.deliver", {
          awardId: sfs.string(id),
          operationId: sfs.string(expeditionAwardOperation(id)),
        }),
    );
    const expeditionHistory = new ExpeditionHistoryService(
      createExpeditionHistorySource(db.kingdom.db, db.databases.global.db, authority),
      rules,
    );
    const expeditionStageFinality = new ExpeditionStageFinalityService(
      createExpeditionStageRealm(db.kingdom.db, authority),
      createExpeditionStageRegistry(db.databases.global.db, authority),
    );
    const expeditionScorePublication = new ExpeditionScorePublicationService(
      createExpeditionScoreSource(db.kingdom.db, authority),
      createExpeditionScoreProjection(db.databases.global.db, authority),
      (clock, version, now) =>
        cache.publishExpeditionDiscovery(
          expeditionDiscovery(clock, version, now, expeditionOpen(rules, now)),
        ),
    );
    const expeditionLiveView = new ExpeditionLiveViewService(
      createExpeditionLiveSource(db.kingdom.db, db.databases.global.db, authority),
    );
    const heroRankingRewards = new HeroRankingRewardService(
      createHeroRankRewardStore(db.kingdom.db, authority),
      createHeroRankRewardStandings(db.databases.global.db, config.kingdomId),
      rules,
      (owner, id) =>
        activities.domainCommand(owner, "hero.rank.deliver", {
          awardId: sfs.string(id),
          operationId: sfs.string(heroRankAwardOperation(id)),
        }),
    );
    const heroMatching = new HeroMatchingService(
      createHeroMatchingRealmStore(db.kingdom.db, authority),
      createHeroMatchingRegistry(db.databases.global.db),
      rules,
    );
    const recoverHeroCalendar = async () => {
      await heroCalendar.refresh();
      await heroMatching.refresh();
    };
    yield* Effect.tryPromise({
      try: recoverHeroCalendar,
      catch: () => new Error("Hero calendar recovery unavailable"),
    }).pipe(Effect.catch(() => Effect.void));
    const olympicSchedule = new OlympicScheduleService(
      createOlympicScheduleStore(db.kingdom.db, authority),
      rules,
    );
    let olympicScanAt = 0n,
      olympicCursor: string | undefined;
    const recoverOlympicBets = async () => {
      const at = BigInt(Date.now()),
        period = olympicPeriod(rules);
      if (!period) return;
      if (at >= olympicScanAt) {
        await olympicSchedule.refresh();
        olympicScanAt = at + 300000n;
      }
      if (at <= period.end) return;
      const pending = await pendingOlympicSettlements(db.kingdom.db, olympicCursor);
      if (!pending.length) olympicCursor = undefined;
      for (const record of pending) {
        olympicCursor = record.owner;
        try {
          await activities.domainCommand(record.owner, "Olympic.settle", {
            operationId: sfs.string(olympicSettlementOperation(record.owner, record.ids)),
          });
        } catch {
          console.warn(
            JSON.stringify({ event: "olympic_settlement_failed", kingdom: config.kingdomId }),
          );
        }
      }
    };
    const cupSchedule = new CupScheduleService(
      createCupScheduleStore(db.kingdom.db, authority),
      rules,
    );
    let cupScanAt = 0n,
      cupCursor: string | undefined;
    const recoverCupBets = async () => {
      const at = BigInt(Date.now()),
        calendar = cupCalendar(rules);
      if (!calendar) return;
      if (at >= cupScanAt) {
        await cupSchedule.refresh();
        cupScanAt = at + 300000n;
      }
      if (at <= calendar.end) return;
      const pending = await pendingCupSettlements(db.kingdom.db, cupCursor);
      if (!pending.length) cupCursor = undefined;
      for (const record of pending) {
        if (!record.owner) continue;
        cupCursor = record.owner;
        try {
          await activities.domainCommand(record.owner, "euro.cup.settle", {
            operationId: sfs.string(cupSettlementOperation(record.owner, record.ids)),
          });
        } catch {
          console.warn(
            JSON.stringify({ event: "cup_settlement_failed", kingdom: config.kingdomId }),
          );
        }
      }
    };
    let groupBuyCursor: { id: string; round: number; owner: string } | undefined;
    const recoverGroupBuys = async () => {
      const pending = await pendingGroupBuys(db.kingdom.db, groupBuyCursor);
      if (!pending.length) groupBuyCursor = undefined;
      for (const record of pending) {
        groupBuyCursor = record;
        try {
          await activities.domainCommand(record.owner, "groupbuys.settle", {
            activityId: sfs.string(record.id),
            round: sfs.int(record.round),
            operationId: sfs.string(
              groupBuyOperation("settle", `${record.owner}:${record.id}:${record.round}`),
            ),
          });
        } catch {
          console.warn(
            JSON.stringify({ event: "group_buy_settlement_failed", kingdom: config.kingdomId }),
          );
        }
      }
    };
    const recoverSpecialPurchases = async () => {
      const at = BigInt(Date.now());
      for (const record of await specialEventStock.pending(config.kingdomId, at)) {
        const eventId = text(record, "eventId"),
          owner = text(record, "ownerUid");
        try {
          await activities.domainCommand(owner, "special.paid", {
            eventId: sfs.string(eventId),
            operationId: sfs.string(specialEventOperation(eventId)),
          });
          await specialEventStock.delivered(eventId, owner, config.kingdomId, BigInt(Date.now()));
        } catch {
          await specialEventStock.defer(eventId, BigInt(Date.now() + 60000));
        }
      }
    };
    const recoverHeroScoreNotifications = async () => {
      for (let index = 0; index < 64; index++) {
        const delivered = await relayMutationEvent(
          db.kingdom.db,
          authority,
          async (event) => {
            const params = decode(event.payload),
              recipients = params.recipients,
              body = params.body;
            if (
              recipients?.type !== Type.StringArray ||
              !Array.isArray(recipients.value) ||
              recipients.value.length > 64 ||
              body?.type !== Type.Object
            )
              throw new Error("Invalid hero score notification");
            const score = fields(body);
            if (
              !(await currentHeroScore(
                db.kingdom.db,
                str(score, "actId"),
                str(score, "aid"),
                int(score, "score"),
              ))
            )
              return;
            for (const owner of recipients.value as string[])
              await notifications.publish(owner, "push.act.score.obtain", score);
          },
          Date.now,
          "hero.score.notify",
          60000,
        );
        if (!delivered) break;
      }
    };
    const recoverHeroTargets = async () => {
      for (let index = 0; index < 64; index++) {
        const delivered = await relayMutationEvent(
          db.kingdom.db,
          authority,
          (event) =>
            deliverHeroTargetBatch(event.payload, (owner, params) =>
              activities.domainCommand(owner, "hero.target.deliver", params),
            ),
          Date.now,
          "hero.target.earned",
          60000,
        );
        if (!delivered) break;
      }
    };
    const recoverContinuedCosts = async (owner?: string) => {
      for (let index = 0; index < 64; index++) {
        try {
          const delivered = await relayMutationEvent(
            db.kingdom.db,
            authority,
            async (event) => {
              const fact = readContinuedCostSpending(event.payload);
              if (fact.owner !== event.owner)
                throw new Error("Foreign continued-cost evidence owner");
              await activities.domainCommand(event.owner, "continuedcost.apply", {
                ...decode(event.payload),
                operationId: sfs.string(
                  continuedCostOperation(event.owner, event.requestId, event.id),
                ),
              });
            },
            Date.now,
            "continuedcost.spend",
            60000,
            owner,
          );
          if (!delivered) break;
        } catch (error) {
          if (owner) throw error;
        }
      }
      if (owner && (await pendingContinuedCosts(db.kingdom.db, config.kingdomId, owner)))
        throw new Error("Continued-cost delivery pending");
    };
    const recoverCosmeticInteractions = async () => {
      for (const command of ["trouble.deliver", "trouble.speed"])
        for (let index = 0; index < 64; index++) {
          const delivered = await relayMutationEvent(
            db.kingdom.db,
            authority,
            (event) =>
              publishTroubleMutation(
                event.payload,
                command,
                worldInterest.interested,
                (owner, name, body) => notifications.publish(owner, name, body),
              ),
            Date.now,
            command,
          );
          if (!delivered) break;
        }
      for (let index = 0; index < 64; index++) {
        const delivered = await relayMutationEvent(
          db.kingdom.db,
          authority,
          (event) =>
            publishCosmeticInteractionMutation(
              event.payload,
              worldInterest.interested,
              (owner, command, body) => notifications.publish(owner, command, body),
            ),
          Date.now,
          "trigger.activity",
        );
        if (!delivered) break;
      }
    };
    let heartCursor = 0;
    const recoverAllianceHearts = async () => {
      const online = notifications.owners();
      if (online.length) {
        const selected = Array.from(
          { length: Math.min(32, online.length) },
          (_, index) => online[(heartCursor + index) % online.length]!,
        );
        heartCursor = (heartCursor + selected.length) % online.length;
        for (const owner of await pendingAllianceHeartOwners(db.kingdom.db, selected)) {
          try {
            await activities.domainCommand(owner, "heart.init", { notify: sfs.bool(true) });
          } catch {
            console.warn(
              JSON.stringify({ event: "heart_delivery_deferred", kingdom: config.kingdomId }),
            );
          }
        }
      }
      for (const command of ["heart.send", "heart.init"])
        for (let index = 0; index < 64; index++) {
          const delivered = await relayMutationEvent(
            db.kingdom.db,
            authority,
            (event) =>
              publishAllianceHeartMutation(
                event.payload,
                worldInterest.interested,
                (owner, name, body) => notifications.publish(owner, name, body),
              ),
            Date.now,
            command,
          );
          if (!delivered) break;
        }
    };
    let giftCursor = 0;
    const deliverPlayerItemGifts = async (owners: readonly string[]) => {
      for (const owner of await pendingPlayerItemGiftOwners(db.kingdom.db, owners)) {
        try {
          await activities.domainCommand(owner, "gift.init", { notify: sfs.bool(true) });
        } catch {
          console.warn(
            JSON.stringify({ event: "item_gift_delivery_deferred", kingdom: config.kingdomId }),
          );
        }
      }
    };
    const recoverPlayerItemGifts = async () => {
      const online = notifications.owners();
      if (online.length) {
        const selected = Array.from(
          { length: Math.min(32, online.length) },
          (_, index) => online[(giftCursor + index) % online.length]!,
        );
        giftCursor = (giftCursor + selected.length) % online.length;
        await deliverPlayerItemGifts(selected);
      }
      for (let index = 0; index < 64; index++) {
        const delivered = await relayMutationEvent(
          db.kingdom.db,
          authority,
          (event) =>
            publishPlayerItemGiftMutation(event.payload, async (owner, command, body) => {
              await notifications.publish(owner, command, body);
            }),
          Date.now,
          "gift.init",
        );
        if (!delivered) break;
      }
    };
    const recoverWorld = async () => {
      for (let index = 0; index < 64; index++) {
        const delivered = await relayMutationEvent(
          db.kingdom.db,
          authority,
          (event) =>
            publishTargetTaskMutation(event.payload, async (owner, command, body) => {
              await notifications.publish(owner, command, body);
            }),
          Date.now,
          "target.paid",
        );
        if (!delivered) break;
      }
      for (const command of ["dragontower", "dragontower.init", "dragontower.tick"])
        for (let index = 0; index < 64; index++) {
          const delivered = await relayMutationEvent(
            db.kingdom.db,
            authority,
            (event) =>
              publishDragonTowerMutation(event.payload, (owner, name, body) =>
                notifications.publish(owner, name, body),
              ),
            Date.now,
            command,
          );
          if (!delivered) break;
        }
      for (let index = 0; index < 64; index++) {
        const delivered = await relayMutationEvent(
          db.kingdom.db,
          authority,
          (event) =>
            publishExpeditionTreasuryMutation(event.payload, (owner, name, body) =>
              notifications.publish(owner, name, body),
            ),
          Date.now,
          "expedition.king.present",
        );
        if (!delivered) break;
      }
      for (const command of ["arena.matched", "arena.enter", "arena.leave", "arena.finished"])
        for (let index = 0; index < 64; index++) {
          const delivered = await relayMutationEvent(
            db.kingdom.db,
            authority,
            (event) =>
              publishArenaMutation(event.payload, command, undefined, (owner, name, body) =>
                notifications.publish(owner, name, body),
              ),
            Date.now,
            command,
          );
          if (!delivered) break;
        }
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
        "world.march.check",
        "world.user.march",
        "world.get.march",
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
            async (event) => {
              await deliverWorldTroubles(event.payload, (owner, params) =>
                activities.domainCommand(owner, "trouble.deliver", params),
              );
              await publishWorldMutation(
                event.payload,
                command,
                config.kingdomId,
                worldInterest.interested,
                (owner, eventCommand, body) => notifications.publish(owner, eventCommand, body),
              );
            },
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
      try: recoverHeroCalendar,
      catch: () => new Error("Hero calendar recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: async () => {
        await recoverHeroTargets();
        await recoverHeroScoreNotifications();
      },
      catch: () => new Error("Hero reward recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: async () => {
        try {
          await expeditionMatching.refresh();
        } finally {
          await expeditionPhases.refresh();
        }
      },
      catch: () => new Error("Expedition matching recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: recoverExpeditionNotifications,
      catch: () => new Error("Expedition activity publication unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: async () => {
        for (let index = 0; index < 64; index++) {
          try {
            const delivered = await relayMutationEvent(
              db.kingdom.db,
              authority,
              (event) =>
                publishCampaignNotice(
                  event.payload,
                  event.owner,
                  notifications.owners(),
                  campaignAudience,
                  (owner, command, body) => notifications.publish(owner, command, body),
                ),
              Date.now,
              "campaign.notice",
              1000,
            );
            if (!delivered) break;
          } catch {
            continue;
          }
        }
      },
      catch: () => new Error("Campaign notice publication unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: () => continuedCostFinality.refresh(),
      catch: () => new Error("Consumption ranking finality unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: () => continuedCostRanking.refresh(),
      catch: () => new Error("Consumption ranking publication unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: () => expeditionStageFinality.refresh(),
      catch: () => new Error("Expedition stage finality unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: () => expeditionScorePublication.refresh(),
      catch: () => new Error("Expedition score publication unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: () => heroRankPublication.refresh(),
      catch: () => new Error("Hero ranking publication unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: () => heroRankingFinality.refresh(),
      catch: () => new Error("Hero ranking finality unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: async () => {
        await heroRankingRewards.refresh().catch(() => undefined);
        await expeditionStageRewards.refresh().catch(() => undefined);
        await costRankRewards.refresh().catch(() => undefined);
        for (const type of [
          "hero.rank.mail",
          "hero.target.mail",
          "expedition.award.mail",
          "continuedcost.rank.mail",
        ]) {
          for (let index = 0; index < 64; index++) {
            const delivered = await relayMutationEvent(
              db.kingdom.db,
              authority,
              async (event) => {
                const data = decode(event.payload);
                if (str(data, "owner") !== event.owner)
                  throw new Error("Foreign progression mail publication");
                await notifications.publish(event.owner, "push.mail", fields(data.mail));
                if (data.achievement)
                  await notifications.publish(
                    event.owner,
                    "push.hero.target.achieved",
                    fields(data.achievement),
                  );
              },
              Date.now,
              type,
              60000,
            );
            if (!delivered) break;
          }
        }
      },
      catch: () => new Error("Hero ranking reward recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: recoverOlympicBets,
      catch: () => new Error("Olympic settlement unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: recoverCupBets,
      catch: () => new Error("Cup settlement unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: recoverGroupBuys,
      catch: () => new Error("Group-buy settlement unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: recoverSpecialPurchases,
      catch: () => new Error("Special event recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: () => recoverContinuedCosts(),
      catch: () => new Error("Continued-cost recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: recoverCosmeticInteractions,
      catch: () => new Error("Cosmetic interaction recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: recoverAllianceHearts,
      catch: () => new Error("Heart recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
    yield* Effect.tryPromise({
      try: recoverPlayerItemGifts,
      catch: () => new Error("Item gift recovery unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(1000)),
      Effect.forever,
      Effect.forkScoped,
    );
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
    yield* Effect.tryPromise({
      try: async () => {
        const removed = await cleanupSocialRealm(db.kingdom.db, authority);
        if (removed >= 500)
          console.warn(
            JSON.stringify({ event: "social_retention_backlog", kingdom: config.kingdomId }),
          );
        return removed;
      },
      catch: () => new Error("Social retention cleanup unavailable"),
    }).pipe(
      Effect.catch(() => Effect.void),
      Effect.andThen(Effect.sleep(60_000)),
      Effect.forever,
      Effect.forkScoped,
    );
    const socialRemote = config.chatSession
      ? createRealmSocialExecutor({
          authority,
          ...config.chatSession,
          realm: config.kingdomId,
          timeoutMs: config.timeoutMs,
        })
      : undefined;
    const friendshipMine = new FriendshipMineService(
      createFriendshipMineExecutor(db, authority, () => initialFriendshipMine(rules), Date.now, {
        before: async (tx, owner, now) => {
          await productionPreparation.prepare(tx, owner, now);
        },
      }),
      rules,
      economyEffects,
      socialRemote,
    );
    const notices = new ChatNoticeService(
      createInventoryExecutor(db.kingdom.db, authority, Date.now, {
        before: async (tx, owner, now) => {
          await productionPreparation.prepare(tx, owner, now);
        },
      }),
      rules,
      economyEffects,
      Date.now,
      async (owner) => {
        if (!socialRemote) throw new Error("Chat unavailable");
        await socialRemote(owner, "chat.notice.authorize", {});
      },
      createChatNoticeCostReader(db.kingdom.db, config.kingdomId),
    );
    const postbox = new PostboxService(
      createPostboxExecutor(db.kingdom.db, authority, Date.now, {
        before: async (tx, owner, now) => {
          await productionPreparation.prepare(tx, owner, now);
        },
      }),
      rules,
      economyEffects,
    );
    if (socialRemote)
      yield* Effect.tryPromise({
        try: async () => {
          authority.assertReady();
          const batch = await socialRemote(`realm-${config.kingdomId}`, "mine.inbox.poll", {});
          const commands = batch.commands?.value as { type: number; value: Fields }[] | undefined;
          for (const entry of commands ?? []) {
            const data = entry.value,
              owner = str(data, "owner"),
              id = str(data, "id");
            await friendshipMine.command(
              owner,
              "mine.receive.help",
              {
                operationId: sfs.string(id),
                actor: data.actor!,
                generation: data.generation!,
                name: data.name!,
              },
              true,
            );
            await socialRemote(owner, "mine.inbox.ack", { id: sfs.string(id) });
          }
        },
        catch: () => new Error("Friendship help recovery unavailable"),
      }).pipe(
        Effect.catch(() => Effect.void),
        Effect.andThen(Effect.sleep(1000)),
        Effect.forever,
        Effect.forkScoped,
      );
    if (socialRemote)
      yield* Effect.tryPromise({
        try: async () => {
          authority.assertReady();
          const owners = notifications.owners();
          let cursor = "";
          for (let index = 0; index < Math.max(1, owners.length); index += 4) {
            const batch = await socialRemote(`realm-${config.kingdomId}`, "realm.events.poll", {
              token: sfs.string(authority.instance),
              epoch: sfs.string(String(authority.epoch)),
              owners: sfs.array(owners.slice(index, index + 4).map((owner) => sfs.string(owner))),
              ...(cursor ? { end: sfs.string(cursor) } : {}),
            });
            if (index === 0) cursor = str(batch, "cursor", "");
            const deliveries = batch.deliveries?.value as
              | { type: number; value: Fields }[]
              | undefined;
            for (const entry of deliveries ?? []) {
              const data = entry.value;
              await notifications.publish(str(data, "owner"), str(data, "cmd"), {
                ...(data.data?.value as Fields),
                eventId: data.id!,
              });
            }
            if (batch.resync?.value === true)
              for (const owner of owners.slice(index, index + 4))
                await notifications.publish(owner, "push.chat.resync", {});
          }
          if (cursor)
            await socialRemote(`realm-${config.kingdomId}`, "realm.events.ack", {
              token: sfs.string(authority.instance),
              epoch: sfs.string(String(authority.epoch)),
              cursor: sfs.string(cursor),
            });
        },
        catch: () => new Error("Social event delivery unavailable"),
      }).pipe(
        Effect.catch(() => Effect.void),
        Effect.andThen(Effect.sleep(250)),
        Effect.forever,
        Effect.forkScoped,
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
                  itemId === "200031"
                    ? "prayer.item"
                    : rules.goods.get(itemId)?.type === "36"
                      ? "ordinary.box.open"
                      : ["37", "40"].includes(rules.goods.get(itemId)?.type ?? "")
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
            if (command === "newexpidition.rankinfo")
              return { body: await expeditionHistory.read(owner), pushes: [] };
            if ((expeditionTreasuryCommands as readonly string[]).includes(command))
              return expeditionTreasury.command(owner, command, params);
            await recoverActivities(owner);
            if (
              [
                "target.init",
                "target.task.ui",
                "target.task.item",
                "target.task.receive",
                "target.paid",
              ].includes(command)
            )
              await activities.domainCommand(owner, "world.tick", {});
            if (command === "continuedcost.info" || command === "continuedcost.reward")
              await recoverContinuedCosts(owner);
            const result = await activities.domainCommand(owner, command, params);
            if (command === "item.send") {
              const recipient = str(params, "uid");
              if (notifications.owners().includes(recipient))
                await deliverPlayerItemGifts([recipient]);
            }
            if (command === "newexpidition.activityinfo")
              return { ...result, body: await expeditionLiveView.enrich(owner, result.body) };
            return result;
          },
          reconcileTimed: async (owner) => {
            await recoverActivities(owner);
            await production.command(owner, "production.settle", {});
          },
          trade: (owner, command, params) => trade.command(owner, command, params),
          shop: (owner, command, params) => shops.command(owner, command, params),
          mailReward: (owner, command, params) => mailRewards.command(owner, command, params),
          friendshipMine: (owner, command, params) =>
            friendshipMine.command(owner, command, params),
          notice: (owner, command, params) => notices.command(owner, command, params),
          postbox: (owner, command, params) => postbox.command(owner, command, params),
          inventory: (owner, command, params) => inventory.command(owner, command, params),
          expeditionActivity: (owner) => expeditionActivity.activity(owner),
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
          social: config.chatSession
            ? (() => {
                const execute = createRealmSocialExecutor({
                  authority,
                  ...config.chatSession,
                  realm: config.kingdomId,
                  timeoutMs: config.timeoutMs,
                });
                return async (owner, command, params) => {
                  authority.assertReady();
                  return execute(owner, command, params);
                };
              })()
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
          publishedGlobalRanking: (kind) =>
            kind === "consumption"
              ? continuedCostRanking.board(() => cache.publishedGlobalRanking(kind))
              : cache.publishedGlobalRanking(kind),
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
