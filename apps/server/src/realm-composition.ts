import { createRealmCityProgressionHandlers } from "./composition/city";
import {
    createRealmProductionService,
    planRealmProductionContext,
    createRealmProductionExecutor,
} from "./composition/production.ts";
import { nicknameChangePayment } from "@opencok/player/repositories/nickname-change";
import { createRealmNicknameService } from "./composition/nickname.ts";
import { createRealmCelebrityDescriptionService } from "./composition/celebrity-description.ts";
import { createRealmPublicProfileService } from "./composition/public-profile.ts";
import { checkPublicProfileStore } from "@opencok/player/repositories/public-profile";
import { PushPreferenceService } from "@opencok/player/services/push-preferences";
import { setPushPreference } from "@opencok/player/repositories/push-preferences";
import { getConfigurationByPlayerId } from "@opencok/player/repositories/push-preferences-snapshot";
import { initializeWorldNewsPreference } from "@opencok/player/repositories/world-news-preference";
import { ProfilePreferenceService } from "@opencok/player/services/profile-preferences";
import { updateProfilePreference } from "@opencok/player/repositories/profile-preferences";
import { planRealmInventoryGrants } from "@opencok/services/inventory-runtime";
import { ActivityRecoveryJob } from "./activity-recovery-job.ts";
import { WorldMarchRecoveryJob } from "./world-march-recovery-job.ts";
import { WorldPopulationJob } from "./world-population-job.ts";
import { logEvent } from "@opencok/core/logging";
import { observeAdapter, observeJob } from "@opencok/core/operation";
import { HeroEventService } from "@opencok/hero/services/hero-event";
import { ActivityRewardDomain } from "@opencok/services/activity-reward";
import { createWorldMarchInspectionStore } from "@opencok/repositories/world-march-inspection";
import { createWorldScoutStore } from "@opencok/repositories/world-scout";
import { createWorldScoutMailReader } from "@opencok/repositories/world-scout-publication";
import { publishWorldScoutMail } from "@opencok/services/world-scout-publication";
import { createWorldBulletinStore } from "@opencok/repositories/world-bulletins";
import { EggActivityDomain } from "@opencok/services/egg-activity";
import { createGoldEggsRanks, createGoldEggsRuntimeStore } from "@opencok/repositories/gold-eggs";
import { GoldEggsDomain, goldEggsAwardParameters } from "@opencok/services/gold-eggs";
import { GoldEggsRuntime } from "@opencok/services/gold-eggs-runtime";
import { goldEggsEnabled } from "@opencok/rules/gold-eggs";
import { createPaymentObservers } from "@opencok/services/payment-observers";
import { NormalRechargeDomain } from "@opencok/services/normal-recharge";
import { createComebackSessions } from "@opencok/repositories/comeback-session";
import { ComebackDomain, planComebackLogin } from "@opencok/services/comeback";
import { BranchCityDomain } from "@opencok/services/branch-city";
import {
    HotItemDomain,
    createHotBusinessMan,
    publishHotBusinessMan,
} from "@opencok/services/hot-item";
import { AsyncLocalStorage } from "node:async_hooks";
import { createMergeCampaignStore, mergeCampaignActor } from "@opencok/repositories/merge-campaign";
import { mergeEffectBoard } from "@opencok/mappings/merge-campaign";
import { publishMergeEffectBoard } from "@opencok/services/merge-campaign";
import { serverFeature } from "@opencok/rules/power-context";
import { createWorldMonsterRefreshExecutor } from "@opencok/repositories/world-monster-refresh";
import { WorldRecreationDomain } from "@opencok/services/world-recreation";
import { assertWorldTerrain } from "@opencok/repositories/world-terrain";
import { WorldUseDomain } from "@opencok/services/world-use";
import { TreasureMapDomain } from "@opencok/services/treasure-map";
import { CityDefenseDomain } from "@opencok/services/city-defense";
import { createWorldUtilityStore } from "@opencok/repositories/world-utility";
import { createWorldResourceRefreshExecutor } from "@opencok/repositories/world-resource-refresh";
import { createWorldResourceNewExecutor } from "@opencok/repositories/world-resource-new";
import { worldResourceAreaCount } from "@opencok/rules/world-resource-refresh";
import { createRedPacketExpiryStore, redPacketReader } from "@opencok/repositories/red-packets";
import {
    RedPacketDomain,
    publishRedPacketAnnouncement,
    settleRedPacketExpiry,
} from "@opencok/services/red-packets";
import { ExchangeActivityDomain } from "@opencok/services/exchange-activity";
import { createRealmAvatarActivationDomain } from "./composition/skins";
import {
    campaignInventoryObservations,
    campaignObservationNeeded,
    planCampaignObservation,
} from "@opencok/services/campaign-observation";
import type { CampaignObservation } from "@opencok/contracts/campaign-observation";
import type { MutationTransaction } from "@opencok/repositories/mutation";
import { createCampaignAudience } from "@opencok/repositories/campaign-notice";
import { publishCampaignNotice } from "@opencok/services/campaign-notice";
import {
    ContinuedCostRewardService,
    ContinuedCostRewardDomain,
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
    ExpeditionStageRewardDomain,
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
    ExpeditionPhaseDomain,
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
    HeroRankingRewardDomain,
} from "@opencok/hero/services/hero-ranking-rewards";
import {
    createHeroRankRewardStore,
    createHeroRankRewardStandings,
} from "@opencok/hero/repositories/hero-ranking-rewards";
import { heroRankAwardOperation } from "@opencok/hero/rules/hero-ranking-rewards";
import { HeroRankingFinalityService } from "@opencok/hero/services/hero-ranking-finality";
import {
    createHeroRankFinalityRealm,
    createHeroRankFinalityRegistry,
} from "@opencok/hero/repositories/hero-ranking-finality";
import { HeroRankPublicationService } from "@opencok/hero/services/hero-rank-publication";
import {
    createHeroRankSource,
    createHeroRankProjection,
} from "@opencok/hero/repositories/hero-rank-publication";
import { HeroMatchingService } from "@opencok/hero/services/hero-matching";
import {
    createHeroMatchingRealmStore,
    createHeroMatchingRegistry,
} from "@opencok/hero/repositories/hero-matching";
import { currentHeroScore } from "@opencok/hero/repositories/hero-score";
import { HeroTargetDomain, deliverHeroTargetBatch } from "@opencok/hero/services/hero-score";
import { HeroCalendarService } from "@opencok/hero/services/hero-calendar";
import { createHeroCalendarStore } from "@opencok/hero/repositories/hero-calendar";
import {
    OlympicDomain,
    OlympicScheduleService,
    olympicSettlementOperation,
} from "@opencok/services/olympic";
import {
    createOlympicScheduleStore,
    pendingOlympicSettlements,
} from "@opencok/repositories/olympic";
import { olympicPeriod } from "@opencok/rules/olympic";
import {
    CupBettingDomain,
    CupScheduleService,
    cupSettlementOperation,
} from "@opencok/services/cup-betting";
import { createCupScheduleStore, pendingCupSettlements } from "@opencok/repositories/cup-betting";
import { cupCalendar } from "@opencok/rules/cup-betting";
import { GroupBuyDomain, groupBuyOperation } from "@opencok/services/groupbuy";
import { pendingGroupBuys } from "@opencok/repositories/groupbuy";
import { createSpecialEventStock } from "@opencok/repositories/special-event";
import { SpecialEventDomain, specialEventOperation } from "@opencok/services/special-event";
import { confirmedNicknameCost } from "@opencok/services/continued-cost-spending";
import { ContinuedCostDomain, continuedCostOperation } from "@opencok/services/continued-cost";
import { readContinuedCostSpending } from "@opencok/mappings/continued-cost";
import { pendingContinuedCosts } from "@opencok/repositories/continued-cost";
import {
    cosmeticInteractionParticipants,
    publishCosmeticInteractionMutation,
} from "./composition/skins";
import {
    TroubleDomain,
    deliverWorldTroubles,
    publishTroubleMutation,
} from "@opencok/services/trouble";
import { PrayerDomain } from "@opencok/services/prayer";
import { createRealmRecallTaskDomain } from "./composition/recall-task";
import { RegionalRecallDomain } from "@opencok/services/regional-recall";
import { initializeRealmOpeningClock } from "@opencok/repositories/realm-opening-clock";
import {
    AllianceHeartDomain,
    publishAllianceHeartMutation,
} from "@opencok/services/alliance-heart";
import { pendingAllianceHeartOwners } from "@opencok/repositories/alliance-heart";
import {
    PlayerItemGiftDomain,
    publishPlayerItemGiftMutation,
} from "@opencok/services/player-item-gifts";
import { pendingPlayerItemGiftOwners } from "@opencok/repositories/player-item-gifts";
import { SeasonalExchangeDomain } from "@opencok/services/seasonal-exchange";
import { VipBoxDomain } from "@opencok/services/vip-box";
import { createRealmTargetTaskDomain } from "./composition/target-task";
import { TargetTaskPublicationService } from "@opencok/tasks/services/target-publication";
import { RechargeFeedbackDomain } from "@opencok/services/recharge-feedback";
import { RechargeActivityDomain } from "@opencok/services/recharge-activity";
import { OrdinaryBoxDomain } from "@opencok/services/ordinary-box";
import { SevenDayCycleDomain } from "@opencok/services/seven-day-cycle";
import { ShippingInvestmentDomain } from "@opencok/services/shipping-investment";
import { DailyInvestmentDomain } from "@opencok/services/daily-investment";
import { AlchemistDomain } from "@opencok/services/alchemist";
import { CastleLevelEventDomain } from "@opencok/services/castle-level-event";
import { LuckyDayDomain } from "@opencok/services/lucky-day";
import { DragonTowerDomain, publishDragonTowerMutation } from "@opencok/services/dragon-tower";
import {
    ExpeditionTreasuryService,
    expeditionTreasuryCommands,
    publishExpeditionTreasuryMutation,
} from "@opencok/services/expedition-treasury";
import { createExpeditionTreasuryExecutor } from "@opencok/repositories/expedition-treasury";
import { ExpeditionDomain } from "@opencok/services/new-expedition";
import { ArenaDomain, publishArenaMutation } from "@opencok/services/arena";
import { AnniversaryDomain } from "@opencok/services/anniversary";
import { LotteryDomain } from "@opencok/services/lottery";
import { createTotemEffectStore, pendingTotemOwners } from "@opencok/repositories/totem";
import { TotemDomain, expireTotems, settleTotemEffects } from "@opencok/services/totem";
import { publishWorldMutation } from "@opencok/services/world-publication";
import { CivilizationCastleDomain } from "@opencok/services/civilization-castle";
import { WorldMarchDomain } from "@opencok/services/world-march-runtime";
import {
    dueWorldMarches,
    createWorldInterest,
    unregisteredWorldMarches,
} from "@opencok/repositories/world-march-runtime";
import { DragonTalentsDomain } from "@opencok/services/dragon-talents";
import { DragonProgressionDomain } from "@opencok/services/dragon-progression";
import { MinstrelDomain } from "@opencok/services/minstrel";
import { CivilizationScienceDomain } from "@opencok/research/services/civilization";
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
import { GeneralDrawDomain } from "@opencok/hero/services/general-draws";
import { AllianceIdentity } from "@opencok/alliance/services/identity";
import { AllianceScienceRecoveryReader } from "@opencok/alliance/repositories/science-recovery";
import {
    createAllianceRepository,
    createRealmAllianceService,
    createAlliancePublicationReader,
    publishAllianceMutation,
} from "./composition/alliance";
import { relayMutationEvent } from "@opencok/repositories/mutation";
import { GeneralsDomain } from "@opencok/hero/services/generals";
import { createRealmEquipmentDomains } from "./composition/equipment";
import { PlayerEffectsDomain } from "@opencok/services/player-effects";
import { createRealmQuestsDomain } from "./composition/quests";
import { cityQueueCommands } from "@opencok/rules/city-command";
import { createRealmTrainingDomain } from "./composition/troops";
import { createRealmHospitalDomain } from "./composition/troops";
import { createRealmFortificationDomain } from "./composition/troops";
import { createRealmResearchDomain } from "./composition/research";
import { createRealmCityProgressionStore } from "./composition/city-persistence.ts";
import { createCityProductionBoundary } from "@opencok/production/repositories/city-boundary";
import type { CityProgressionService } from "@opencok/city/services/progression";
import { createRealmConstructionDomain } from "./composition/construction";
import { num, text } from "@opencok/contracts/rows";
import {
    createActivityExecutor,
    dueActivities,
    unregisteredActivities,
    activityTransitionInstant,
    type ActivityDomain,
} from "@opencok/repositories/timed-activity";
import { readReconnectProgress } from "@opencok/repositories/reconnect-progress";
import { persistReconnectProgress } from "@opencok/repositories/reconnect-write";
import { TimedActivityService } from "@opencok/services/timed-activity";
import { sfs, encode, decode, str, int, fields, Type } from "@opencok/messages/sfs";
import { createCharacterCreator } from "./character-provisioning";
import { CharacterProvisioningService } from "@opencok/player/services/character-provisioning";
import { CharacterProvisioningController } from "@opencok/player/controllers/character-provisioning";
import { characterProvisioningHandler } from "@opencok/connection/provisioning";
import {
    createMailRewardExecutor,
    mailRewardRealmAllowed,
} from "@opencok/repositories/mail-rewards";
import { createShopRepository } from "@opencok/shop/repositories/shops";
import { createTradeExecutor } from "@opencok/shop/repositories/trade";
import { TradeService } from "@opencok/shop/services/trade";
import { ShopService } from "@opencok/shop/services/shops";
import { MailRewardService } from "@opencok/services/mail-rewards";
import {
    createRealmInventoryExecutor,
    executeRealmInventoryTransaction,
} from "@opencok/repositories/inventory-runtime";
import { createInventoryService } from "@opencok/services/inventory-runtime";
import { decodeWorldPowerEffects } from "@opencok/services/power";
import { worldPowerEffects } from "@opencok/rules/power-world";
import { checkMutationStore, createMutationExecutor } from "@opencok/repositories/mutation";
import { createEconomyMutationExecutor } from "@opencok/economy/repositories/balances";
import { checkNicknameChangeStore } from "@opencok/player/repositories/nickname-change";
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
import { AvatarRelay } from "./avatar-relay.ts";
import { AvatarVersionRelay } from "./avatar-version-relay.ts";
import { checkAvatarCompletionStore } from "@opencok/repositories/avatar-delivery";
import { createRealmNotifications } from "@opencok/connection/notifications";
import { createAvatarFiles } from "@opencok/connection/avatar-files";
import { readAvatarGrant, checkAvatarGrantStore } from "@opencok/repositories/avatar-grant";
import { Effect, Layer } from "effect";
import { RealmConfig } from "./config.ts";
import { acquireResource, fromPromise } from "@opencok/core/resource";
import { listenServer } from "@opencok/connection/server";
import { Database } from "@opencok/repositories/game";
import { Cache } from "@opencok/storage/session";
import { Coordination } from "@opencok/storage/coordination";
import { loadRules } from "@opencok/resources/rules";
import { createRealmGameService } from "./composition/game";
import { WorldService } from "@opencok/services/world";
import { createRealmChatSessionIssuer } from "@opencok/connection/realm-chat-session";
import { MailGiftRelay } from "./mail-gift-relay.ts";
import { loadNicknameServices } from "./nickname.ts";
import {
    acquireRealmAuthority,
    fenceRealmDatabase,
    fenceRealmTransaction,
} from "@opencok/repositories/realm-authority";
import { executeReconnectProgress } from "@opencok/repositories/reconnect-write";
import { readFriendshipBinding } from "@opencok/repositories/reconnect-mine";
import { initialFriendshipMine } from "@opencok/rules/reconnect-mine";

import { RealmDependencies } from "./realm-dependencies.ts";
import { RealmRules } from "./realm-rules.ts";
import { RealmServer } from "./realm-server.ts";

const { publishTargetTaskMutation } = new TargetTaskPublicationService();

export const RealmRulesLive = Layer.effect(
    RealmRules,
    Effect.gen(function*()
    {
        const config = yield* RealmConfig;

        return yield* fromPromise("realm.resources", () => loadRules(undefined, config.kingdomId));
    }),
);

export const RealmDependenciesLive = Layer.effect(
    RealmDependencies,
    Effect.gen(function*()
    {
        const config = yield* RealmConfig;
        const rules = yield* RealmRules;
        const db = yield* acquireResource(
            "realm.database",
            async () => observeAdapter(new Database(config), "realm.Database"),
            (db) => db.close(),
        );
        const pushPreferences = observeAdapter(
            new PushPreferenceService({
                getProfileById: (uid) => db.getProfileById(uid),
                getConfigurationByPlayerId: (uid) => getConfigurationByPlayerId(db.kingdom.db, uid),
                initializeWorldNewsPreference: (uid, now) =>
                    initializeWorldNewsPreference(db.kingdom.db, uid, config.kingdomId, now),
                setPushPreference: (uid, preference, now) =>
                    setPushPreference(db.kingdom.db, uid, config.kingdomId, preference, now),
            }),
            "realm.PushPreferenceService",
        );
        const profilePreferences = observeAdapter(
            new ProfilePreferenceService({
                getProfileById: (uid) => db.getProfileById(uid),
                updateProfilePreference: (uid, field, now, readValue) =>
                    updateProfilePreference(
                        db.kingdom.db,
                        uid,
                        config.kingdomId,
                        field,
                        now,
                        readValue,
                    ),
            }),
            "realm.ProfilePreferenceService",
        );
        yield* fromPromise(
            "realm.world-favorites",
            () => checkWorldFavoriteStore(db.kingdom.db, db.databases.global.db),
        );
        const worldFavorites = observeAdapter(
            createWorldFavoriteStore(db.kingdom.db, db.databases.global.db, config.kingdomId),
            "realm.createWorldFavoriteStore",
        );
        yield* fromPromise("realm.world-search", () => checkWorldSearchStore(db.kingdom.db));
        const worldSearch = observeAdapter(
            createWorldSearchStore(db.databases, config.kingdomId),
            "realm.createWorldSearchStore",
        );
        yield* fromPromise(
            "realm.world-point-detail",
            () => checkWorldPointDetailStore(db.kingdom.db),
        );
        const worldPointDetail = observeAdapter(
            createWorldPointDetailStore(db.databases, config.kingdomId),
            "realm.createWorldPointDetailStore",
        );
        yield* fromPromise(
            "realm.player-search",
            () =>
                checkPlayerSearchStore(
                    db.databases,
                    config.kingdomId,
                    config.crossSearchEnabled ?? true,
                ),
        );
        const playerSearch = observeAdapter(
            createPlayerSearchStore(db.databases, config.kingdomId),
            "realm.createPlayerSearchStore",
        );
        const cache = observeAdapter(new Cache(config), "realm.Cache");
        const avatarFiles = config.avatarFiles
            ? yield* fromPromise("realm.avatar-files", async () => {
                await checkAvatarGrantStore(db.kingdom.db);

                return observeAdapter(
                    createAvatarFiles({
                        ...config.avatarFiles!,
                        timeoutMs: config.timeoutMs,
                        tickets: observeAdapter(
                            createAvatarTickets((name, ...args) => cache.command(name, ...args)),
                            "realm.createAvatarTickets",
                        ),
                    }),
                    "realm.createAvatarFiles",
                );
            })
            : undefined;
        const nicknameServices = yield* fromPromise(
            "realm.nickname-words",
            () => loadNicknameServices((key) => cache.nicknameForbiddenWords(key)),
        );
        const celebrityDescriptions = observeAdapter(
            createRealmCelebrityDescriptionService(
                db,
                db.databases,
                config.kingdomId,
                nicknameServices,
            ),
            "realm.CelebrityDescriptionService",
        );
        const publicProfiles = observeAdapter(
            createRealmPublicProfileService(
                db,
                db.databases,
                rules,
                config.kingdomId,
                (kingdomId, uids) => cache.playerUpdateTimes(kingdomId, uids),
            ),
            "realm.PublicProfileService",
        );
        const coordination = yield* acquireResource(
            "realm.coordination",
            async () => observeAdapter(new Coordination(config), "realm.Coordination"),
            async (coordination) => coordination.close(),
        );
        yield* fromPromise("realm.database.start", async () => {
            await db.start();
            await checkPublicProfileStore(db.kingdom.db);
        }).pipe(Effect.uninterruptible);
        yield* fromPromise("realm.cache", () => cache.command("PING")).pipe(Effect.uninterruptible);
        yield* fromPromise("realm.coordination.start", () => coordination.start()).pipe(
            Effect.uninterruptible,
        );
        const authority = yield* fromPromise(
            "realm.authority",
            () => acquireRealmAuthority(db.kingdom.db, config.kingdomId, () => coordination.ready),
        );
        cache.bindRealmOwner(authority.epoch);
        yield* fromPromise("realm.mutations", () => checkMutationStore(db.kingdom.db));
        fenceRealmDatabase(db.kingdom.db, authority);
        yield* fromPromise(
            "realm.terrain",
            () => assertWorldTerrain(db.kingdom.db, authority, config.mapSize),
        );
        const realmTransactions = new AsyncLocalStorage<MutationTransaction>();
        const transactRealm = db.kingdom.db.transaction.bind(db.kingdom.db);
        db.kingdom.db.transaction = (apply, settings) =>
            transactRealm((tx) => realmTransactions.run(tx, () => apply(tx)), settings);

        yield* fromPromise(
            "realm.opening-clock",
            () => initializeRealmOpeningClock(db.kingdom.db, authority),
        );
        yield* acquireResource(
            "realm.mail-gift-relay",
            async () =>
                observeAdapter(
                    new MailGiftRelay(
                        () => db.relayMailGifts(),
                        () => {
                            logEvent(
                                "mail_gift_relay_failed",
                                { kingdom: config.kingdomId, outcome: "failure" },
                                "error",
                            );
                        },
                    ),
                    "realm.MailGiftRelay",
                ),
            (relay) => relay.close(),
        );

        if (config.mailChat)
        {
            const publish = observeAdapter(
                createChatMailboxPublisher({
                    ...config.mailChat,
                    timeoutMs: config.timeoutMs,
                }),
                "realm.createChatMailboxPublisher",
            );
            yield* acquireResource(
                "realm.mail-chat-relay",
                async () =>
                    observeAdapter(
                        new MailGiftRelay(
                            async () => {
                                let delivered = 0;

                                while (delivered < 50 && (await db.relayMailChat(publish)))
                                {
                                    delivered++;
                                }

                                return delivered;
                            },
                            () =>
                                logEvent(
                                    "mail_chat_relay_failed",
                                    { kingdom: config.kingdomId, outcome: "failure" },
                                    "error",
                                ),
                        ),
                        "realm.MailGiftRelay",
                    ),
                (relay) => relay.close(),
            );
        }

        const notifications = observeAdapter(
            createRealmNotifications(),
            "realm.createRealmNotifications",
        );
        const scoutMailReader = observeAdapter(
            createWorldScoutMailReader(db.kingdom.db, config.kingdomId),
            "realm.createWorldScoutMailReader",
        );
        const cn1 = observeAdapter(
            createCn1Sessions(db.databases.global.db, rules, config.kingdomId),
            "realm.createCn1Sessions",
        );
        const nickname = config.nicknameChat
            ? observeAdapter(
                createNicknameChangeRuntime({
                    databases: db.databases,
                    kingdomId: config.kingdomId,
                    rules,
                    notifications,
                    timeoutMs: config.timeoutMs,
                    report: () =>
                        logEvent(
                            "nickname_delivery_failed",
                            { kingdom: config.kingdomId, outcome: "failure" },
                            "error",
                        ),
                    prepareRefund: (owner, now) => cn1.refresh(owner, now),
                    confirmedSpending: confirmedNicknameCost(rules),
                    refundRatio: async (profile) => cn1.ratio(profile),
                    chat: observeAdapter(
                        createChatNicknamePublisher({
                            ...config.nicknameChat,
                            timeoutMs: config.timeoutMs,
                        }),
                        "realm.createChatNicknamePublisher",
                    ),
                    alliance: {
                        rules,
                        resolveMailReward: (id) => nicknameAllianceReward(id, rules),
                    },
                    sharedUser: { rules, cache },
                }),
                "realm.createNicknameChangeRuntime",
            )
            : undefined;

        const nicknames = observeAdapter(
            createRealmNicknameService(db, db.databases, config.kingdomId, {
                ...nicknameServices,
                nicknameChange: nickname
                    ? async (...args) => {
                        authority.assertReady();

                        return nickname.command(...args);
                    }
                    : undefined,
            }),
            "realm.NicknameService",
        );

        if (nickname)
        {
            yield* fromPromise(
                "realm.nickname-store",
                () => checkNicknameChangeStore(db.databases, config.kingdomId),
            );
            yield* fromPromise("realm.nickname-sessions", () => cn1.check());
            yield* acquireResource(
                "realm.nickname-relay",
                async () =>
                    observeAdapter(
                        new AvatarVersionRelay(
                            nickname.next,
                            (owner, operationId) => {
                                authority.assertReady();

                                return nickname.deliver(owner, operationId, Date.now());
                            },
                            () =>
                                logEvent(
                                    "nickname_recovery_failed",
                                    { kingdom: config.kingdomId, outcome: "failure" },
                                    "error",
                                ),
                        ),
                        "realm.AvatarVersionRelay",
                    ),
                (relay) => relay.close(),
            );
        }

        const avatar = avatarFiles
            ? observeAdapter(
                createAvatarRuntime({
                    db,
                    files: avatarFiles,
                    rules,
                    config,
                    cache,
                    notifications,
                    report: () =>
                        logEvent(
                            "avatar_delivery_failed",
                            { kingdom: config.kingdomId, outcome: "failure" },
                            "error",
                        ),
                }),
                "realm.createAvatarRuntime",
            )
            : undefined;

        if (config.avatarChat && !avatarFiles)
        {
            throw new Error("Avatar files unavailable");
        }

        if (avatar)
        {
            yield* fromPromise(
                "realm.avatar-version",
                () => checkAvatarVersionStore(db.kingdom.db),
            );
            yield* acquireResource(
                "realm.avatar-version-relay",
                async () =>
                    observeAdapter(
                        new AvatarVersionRelay(
                            avatar.nextVersion,
                            (owner, operationId) => {
                                authority.assertReady();

                                return avatar.versionService.deliver(owner, operationId);
                            },
                            () =>
                                logEvent(
                                    "avatar_version_relay_failed",
                                    { kingdom: config.kingdomId, outcome: "failure" },
                                    "error",
                                ),
                        ),
                        "realm.AvatarVersionRelay",
                    ),
                (relay) => relay.close(),
            );
            yield* fromPromise(
                "realm.avatar-completion",
                () => checkAvatarCompletionStore(db.kingdom.db),
            );
            yield* acquireResource(
                "realm.avatar-relay",
                async () =>
                    observeAdapter(
                        new AvatarRelay(
                            avatar.next,
                            (owner, sequence) => {
                                authority.assertReady();

                                return avatar.service.deliver(owner, sequence);
                            },
                            () =>
                                logEvent(
                                    "avatar_relay_failed",
                                    { kingdom: config.kingdomId, outcome: "failure" },
                                    "error",
                                ),
                        ),
                        "realm.AvatarRelay",
                    ),
                (relay) => relay.close(),
            );
        }

        const mergeCampaigns = observeAdapter(
            createMergeCampaignStore(db.kingdom.db, authority, rules.advanced.campaignRules ?? []),
            "realm.createMergeCampaignStore",
        );
        yield* fromPromise("realm.merge-campaigns", () => mergeCampaigns.refresh());
        const worldEffects = async (kingdomId = config.kingdomId) => {
            const cached = await cache.worldEffects(kingdomId);

            return kingdomId === config.kingdomId
                ? mergeCampaigns.overlay(cached, undefined, realmTransactions.getStore())
                : cached;
        };
        const currentMergeBoard = async () => {
            const effects = await mergeCampaigns.current(undefined, realmTransactions.getStore());
            const enabled = serverFeature(rules, "server_buff", {
                kingdomId: config.kingdomId,
                version: "12.06.0",
                now: Date.now(),
            });

            return mergeEffectBoard(enabled ? effects : []);
        };
        const economyEffects = {
            world: async () =>
                worldPowerEffects(
                    decodeWorldPowerEffects(await worldEffects(config.kingdomId)),
                    rules,
                    {
                        kingdomId: config.kingdomId,
                        version: "12.06.0",
                        now: Date.now(),
                    },
                ),
            emperor: () => cache.emperorVersion(config.kingdomId),
        };
        const baseProductionPreparation = {
            async prepare(
                tx: Parameters<typeof readReconnectProgress>[0],
                owner: string,
                now: bigint,
            )
            {
                const state = await readReconnectProgress(tx, owner, config.kingdomId, now);
                const planned = await planRealmProductionContext(state, rules, now, {
                    worldPowerEffects: (id) => worldEffects(id),
                    emperorVersion: (id) => cache.emperorVersion(id),
                });
                await persistReconnectProgress(tx, state, planned.write, authority, now);

                return planned.rates;
            },
        };
        const baseCityBoundary = observeAdapter(
            createCityProductionBoundary(baseProductionPreparation, (row) => {
                const rule = rules.building(
                    text(row, "itemId"),
                    num(row, "level"),
                    num(row, "star"),
                    num(row, "progress"),
                );

                return rule.effects?.productionPerHour === undefined
                    ? undefined
                    : ["wood", "stone", "iron", "food"][rule.effects.productionResourceId ?? -1];
            }),
            "realm.createCityProductionBoundary",
        );
        const cityBoundary: typeof baseCityBoundary = async (
            tx,
            owner,
            now,
            change,
            deleted,
            economy,
        ) => {
            await settleTotemEffects(
                observeAdapter(
                    createTotemEffectStore(
                        tx,
                        owner,
                        now,
                        config.mapSize,
                        config.kingdomId,
                        baseCityBoundary,
                    ),
                    "realm.createTotemEffectStore",
                ),
                rules,
                config.mapSize,
            );

            return baseCityBoundary(tx, owner, now, change, deleted, economy);
        };
        const productionPreparation = {
            async prepare(
                tx: Parameters<typeof readReconnectProgress>[0],
                owner: string,
                now: bigint,
            )
            {
                await settleTotemEffects(
                    observeAdapter(
                        createTotemEffectStore(
                            tx,
                            owner,
                            now,
                            config.mapSize,
                            config.kingdomId,
                            baseCityBoundary,
                        ),
                        "realm.createTotemEffectStore",
                    ),
                    rules,
                    config.mapSize,
                );

                return baseProductionPreparation.prepare(tx, owner, now);
            },
        };
        const specialEventStock = observeAdapter(
            createSpecialEventStock(db.databases.global.db),
            "realm.createSpecialEventStock",
        );
        const paymentObservers: ReturnType<typeof createPaymentObservers> = observeAdapter(
            createPaymentObservers(
                config.paidGiftGateway,
                rules,
                async (owner, orderId, platform) => {
                    const tx = realmTransactions.getStore();

                    if (!tx)
                    {
                        throw new Error("Missing trusted payment transaction");
                    }

                    return redPacketReader(tx, owner).payment(orderId, platform);
                },
                (owner, command, params) => activities.domainCommand(owner, command, params),
            ),
            "realm.createPaymentObservers",
        );
        const goldEggsRanks = observeAdapter(
            createGoldEggsRanks(
                [...db.databases.kingdoms].map(([kingdomId, realm]) => ({
                    kingdomId,
                    db: realm.db,
                    eligible: () =>
                        goldEggsEnabled(rules, BigInt(Date.now()), false, kingdomId)
                        && goldEggsEnabled(rules, BigInt(Date.now()), true, kingdomId),
                })),
            ),
            "realm.createGoldEggsRanks",
        );
        const equipmentDomains = createRealmEquipmentDomains();
        const city: CityProgressionService<MutationTransaction> = observeAdapter(
            createRealmCityProgressionHandlers(
                (tx: Parameters<typeof readReconnectProgress>[0], owner, now) =>
                    observeAdapter(
                        createRealmCityProgressionStore(
                            tx,
                            owner,
                            now,
                            cityBoundary,
                            config.mapSize,
                            authority,
                        ),
                        "realm.createRealmCityProgressionStore",
                    ),
                [
                    observeAdapter(new GeneralsDomain(), "realm.GeneralsDomain"),
                    observeAdapter(
                        new GeneralDrawDomain(() => cache.generalDrawRanking()),
                        "realm.GeneralDrawDomain",
                    ),
                    observeAdapter(
                        equipmentDomains.equipment,
                        "realm.EquipmentDomain",
                    ),
                    observeAdapter(equipmentDomains.workshop, "realm.WorkshopDomain"),
                    observeAdapter(new PlayerEffectsDomain(), "realm.PlayerEffectsDomain"),
                    observeAdapter(createRealmQuestsDomain(), "realm.QuestsDomain"),
                    observeAdapter(createRealmConstructionDomain(), "realm.ConstructionDomain"),
                    observeAdapter(createRealmResearchDomain(), "realm.ResearchDomain"),
                    observeAdapter(
                        new CivilizationScienceDomain(),
                        "realm.CivilizationScienceDomain",
                    ),
                    observeAdapter(new DragonProgressionDomain(), "realm.DragonProgressionDomain"),
                    observeAdapter(new DragonTowerDomain(), "realm.DragonTowerDomain"),
                    observeAdapter(new DragonTalentsDomain(), "realm.DragonTalentsDomain"),
                    observeAdapter(new WorldMarchDomain(config.mapSize), "realm.WorldMarchDomain"),
                    observeAdapter(new CityDefenseDomain(), "realm.CityDefenseDomain"),
                    observeAdapter(
                        new TreasureMapDomain(config.mapSize),
                        "realm.TreasureMapDomain",
                    ),
                    observeAdapter(new WorldUseDomain(config.mapSize), "realm.WorldUseDomain"),
                    observeAdapter(
                        new WorldRecreationDomain(config.mapSize),
                        "realm.WorldRecreationDomain",
                    ),
                    observeAdapter(
                        new CivilizationCastleDomain(config.mapSize),
                        "realm.CivilizationCastleDomain",
                    ),
                    observeAdapter(new TotemDomain(config.mapSize), "realm.TotemDomain"),
                    observeAdapter(new MinstrelDomain(), "realm.MinstrelDomain"),
                    observeAdapter(new AlchemistDomain(), "realm.AlchemistDomain"),
                    observeAdapter(new BranchCityDomain(), "realm.BranchCityDomain"),
                    observeAdapter(new DailyInvestmentDomain(), "realm.DailyInvestmentDomain"),
                    observeAdapter(
                        new ShippingInvestmentDomain(),
                        "realm.ShippingInvestmentDomain",
                    ),
                    observeAdapter(new SevenDayCycleDomain(), "realm.SevenDayCycleDomain"),
                    observeAdapter(new OrdinaryBoxDomain(), "realm.OrdinaryBoxDomain"),
                    observeAdapter(
                        new NormalRechargeDomain(config.paidGiftGateway),
                        "realm.NormalRechargeDomain",
                    ),
                    observeAdapter(
                        new GoldEggsDomain(undefined, goldEggsRanks),
                        "realm.GoldEggsDomain",
                    ),
                    observeAdapter(new EggActivityDomain(), "realm.EggActivityDomain"),
                    observeAdapter(
                        new RechargeActivityDomain(paymentObservers.newcomer),
                        "realm.RechargeActivityDomain",
                    ),
                    observeAdapter(
                        new RechargeFeedbackDomain(paymentObservers.feedback),
                        "realm.RechargeFeedbackDomain",
                    ),
                    observeAdapter(new ActivityRewardDomain(), "realm.ActivityRewardDomain"),
                    observeAdapter(
                        new RedPacketDomain(config.paidGiftGateway),
                        "realm.RedPacketDomain",
                    ),
                    observeAdapter(
                        new AllianceHeartDomain((uid) => notifications.owners().includes(uid)),
                        "realm.AllianceHeartDomain",
                    ),
                    observeAdapter(new PrayerDomain(), "realm.PrayerDomain"),
                    observeAdapter(new TroubleDomain(), "realm.TroubleDomain"),
                    observeAdapter(new OlympicDomain(), "realm.OlympicDomain"),
                    observeAdapter(new CupBettingDomain(), "realm.CupBettingDomain"),
                    observeAdapter(new GroupBuyDomain(), "realm.GroupBuyDomain"),
                    observeAdapter(new ContinuedCostDomain(), "realm.ContinuedCostDomain"),
                    observeAdapter(new HeroTargetDomain(), "realm.HeroTargetDomain"),
                    observeAdapter(new HeroRankingRewardDomain(), "realm.HeroRankingRewardDomain"),
                    observeAdapter(
                        new ContinuedCostRewardDomain(),
                        "realm.ContinuedCostRewardDomain",
                    ),
                    observeAdapter(
                        new ExpeditionStageRewardDomain(),
                        "realm.ExpeditionStageRewardDomain",
                    ),
                    observeAdapter(
                        new SpecialEventDomain(specialEventStock),
                        "realm.SpecialEventDomain",
                    ),
                    observeAdapter(createRealmRecallTaskDomain(), "realm.RecallTaskDomain"),
                    observeAdapter(new RegionalRecallDomain(), "realm.RegionalRecallDomain"),
                    observeAdapter(new PlayerItemGiftDomain(), "realm.PlayerItemGiftDomain"),
                    observeAdapter(new SeasonalExchangeDomain(), "realm.SeasonalExchangeDomain"),
                    observeAdapter(new ExchangeActivityDomain(), "realm.ExchangeActivityDomain"),
                    observeAdapter(new ComebackDomain(), "realm.ComebackDomain"),
                    observeAdapter(new HotItemDomain(), "realm.HotItemDomain"),
                    observeAdapter(new VipBoxDomain(), "realm.VipBoxDomain"),
                    observeAdapter(createRealmTargetTaskDomain(), "realm.TargetTaskDomain"),
                    observeAdapter(new LuckyDayDomain(), "realm.LuckyDayDomain"),
                    observeAdapter(new CastleLevelEventDomain(), "realm.CastleLevelEventDomain"),
                    observeAdapter(new LotteryDomain(), "realm.LotteryDomain"),
                    observeAdapter(new ExpeditionDomain(), "realm.ExpeditionDomain"),
                    observeAdapter(new ExpeditionPhaseDomain(), "realm.ExpeditionPhaseDomain"),
                    observeAdapter(new AnniversaryDomain(), "realm.AnniversaryDomain"),
                    observeAdapter(
                        createRealmAvatarActivationDomain(),
                        "realm.AvatarActivationDomain",
                    ),
                    observeAdapter(new ArenaDomain(), "realm.ArenaDomain"),
                    observeAdapter(createRealmTrainingDomain(), "realm.TrainingDomain"),
                    observeAdapter(createRealmHospitalDomain(), "realm.HospitalDomain"),
                    observeAdapter(createRealmFortificationDomain(), "realm.FortificationDomain"),
                ],
                rules,
                economyEffects,
            ),
            "realm.CityProgressionService",
        );
        const alliances = observeAdapter(
            createRealmAllianceService(
                observeAdapter(
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
                                    resource()
                                    {
                                        throw new Error("Unexpected alliance quest resource grant");
                                    },
                                    gold()
                                    {
                                        throw new Error("Unexpected alliance quest gold grant");
                                    },
                                    item()
                                    {
                                        throw new Error("Unexpected alliance quest item grant");
                                    },
                                },
                            );
                        },
                    ),
                    "realm.createAllianceRepository",
                ),
                rules,
                economyEffects,
                async (value) =>
                    Boolean(await nicknameServices.nicknameBadWords?.(value))
                    || Boolean(await nicknameServices.nicknameForbidden?.(value)),
            ),
            "realm.AllianceService",
        );
        let allianceCursor: string | undefined;
        const recoverAlliances = async () => {
            authority.assertReady();
            const due = await new AllianceScienceRecoveryReader(db.kingdom.db).due(
                config.kingdomId,
                BigInt(Date.now()),
                allianceCursor,
            );
            allianceCursor = due.length === 64 ? due.at(-1)!.allianceId : undefined;

            for (const saved of due)
            {
                try
                {
                    await alliances.command(saved.owner, "alliance.tick", {
                        operationId: sfs.string(
                            "alliance-research:"
                                + AllianceIdentity.stableId(
                                    `${saved.allianceId}:${saved.scienceId}:${saved.startTime}:${saved.needTime}:${
                                        saved.accelerate?.toString("hex") ?? ""
                                    }`,
                                ),
                        ),
                    });
                }
                catch
                {
                    logEvent(
                        "alliance_research_recovery_failed",
                        { kingdom: config.kingdomId, outcome: "failure" },
                        "error",
                    );
                }
            }

            if (config.chatSession)
            {
                for (let index = 0; index < 64; index++)
                {
                    const published = await relayMutationEvent(
                        db.kingdom.db,
                        authority,
                        async (event) => {
                            const execute = observeAdapter(
                                createRealmSocialExecutor({
                                    ...config.chatSession!,
                                    authority,
                                    realm: config.kingdomId,
                                    timeoutMs: config.timeoutMs,
                                }),
                                "realm.createRealmSocialExecutor",
                            );
                            await execute(event.owner, "mine.call.publish", {
                                operationId: sfs.string(event.requestId),
                            });
                        },
                        Date.now,
                        "social.mine.call",
                        5000,
                    );

                    if (!published)
                    {
                        break;
                    }
                }
            }

            if (config.chatSession)
            {
                for (let index = 0; index < 64; index++)
                {
                    const published = await relayMutationEvent(
                        db.kingdom.db,
                        authority,
                        async (event) => {
                            const execute = observeAdapter(
                                createRealmSocialExecutor({
                                    authority,
                                    ...config.chatSession!,
                                    realm: config.kingdomId,
                                    timeoutMs: config.timeoutMs,
                                }),
                                "realm.createRealmSocialExecutor",
                            );
                            const result = await execute(event.owner, "chat.notice.commit", {
                                operationId: sfs.string(event.requestId),
                            });

                            if (result.expired?.value === true && result.delivered?.value !== true)
                            {
                                await notices.refund(event.owner, event.requestId);
                            }
                        },
                        Date.now,
                        "social.notice",
                        5000,
                    );

                    if (!published)
                    {
                        break;
                    }
                }
            }

            for (let index = 0; index < 64; index++)
            {
                const published = await relayMutationEvent(
                    db.kingdom.db,
                    authority,
                    async (event) => {
                        const data = decode(event.payload);

                        if (BigInt((data.expiresAt?.value as bigint) ?? 0) > BigInt(Date.now()))
                        {
                            await notifications.publish(
                                str(data, "recipient"),
                                "push.lua.postMail",
                                {
                                    message: data.message!,
                                    chat: data.chat!,
                                },
                            );
                        }
                    },
                    Date.now,
                    "social.post",
                );

                if (!published)
                {
                    break;
                }
            }

            for (let index = 0; index < 64; index++)
            {
                const published = await relayMutationEvent(
                    db.kingdom.db,
                    authority,
                    (event) =>
                        publishAllianceMutation(
                            observeAdapter(
                                createAlliancePublicationReader(db.kingdom.db, authority),
                                "realm.createAlliancePublicationReader",
                            ),
                            event.payload,
                            (owner, command, body) => notifications.publish(owner, command, body),
                            rules,
                        ),
                    Date.now,
                    "alliance.changed",
                );

                if (!published)
                {
                    break;
                }
            }
        };
        yield* Effect.tryPromise({
            try: () => observeJob("realm.alliance_recovery", recoverAlliances),
            catch: () => new Error("Alliance recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        const activityDomains: ReadonlyMap<number, ActivityDomain> = city.domains;
        const activities: TimedActivityService = observeAdapter(
            new TimedActivityService(
                observeAdapter(
                    createActivityExecutor(db.kingdom.db, authority, activityDomains, Date.now, {
                        before: async (tx, owner, now, command) => {
                            if (command.command === "activity.restore")
                            {
                                return now;
                            }

                            const transition =
                                ["queue.finish", "queue.ccd"].includes(command.command)
                                || cityQueueCommands[command.command]?.action === "queue.finish";
                            const params = decode(Buffer.from(command.request));
                            const queueId = transition
                                ? str(
                                    params,
                                    cityQueueCommands[command.command]?.queueKey
                                        ?? (command.command === "queue.ccd" ? "qUUID" : "uuid"),
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
                    "realm.createActivityExecutor",
                ),
                rules,
                economyEffects,
                cosmeticInteractionParticipants,
            ),
            "realm.TimedActivityService",
        );
        const expeditionTreasury = observeAdapter(
            new ExpeditionTreasuryService(
                observeAdapter(
                    createExpeditionTreasuryExecutor(db.kingdom.db, authority),
                    "realm.createExpeditionTreasuryExecutor",
                ),
                rules,
            ),
            "realm.ExpeditionTreasuryService",
        );
        const worldInterest = observeAdapter(
            createWorldInterest(db.kingdom.db, authority, config.mapSize),
            "realm.createWorldInterest",
        );
        const heroCalendar = observeAdapter(
            new HeroCalendarService(
                observeAdapter(
                    createHeroCalendarStore(db.kingdom.db, authority),
                    "realm.createHeroCalendarStore",
                ),
                rules,
            ),
            "realm.HeroCalendarService",
        );
        const heroRankPublication = observeAdapter(
            new HeroRankPublicationService(
                observeAdapter(
                    createHeroRankSource(db.kingdom.db, authority),
                    "realm.createHeroRankSource",
                ),
                observeAdapter(
                    createHeroRankProjection(db.databases.global.db, authority),
                    "realm.createHeroRankProjection",
                ),
                (rows) => cache.publishHeroRanking(rows),
                rules,
            ),
            "realm.HeroRankPublicationService",
        );
        const heroRankingFinality = observeAdapter(
            new HeroRankingFinalityService(
                observeAdapter(
                    createHeroRankFinalityRealm(db.kingdom.db, authority),
                    "realm.createHeroRankFinalityRealm",
                ),
                observeAdapter(
                    createHeroRankFinalityRegistry(db.databases.global.db, authority),
                    "realm.createHeroRankFinalityRegistry",
                ),
                observeAdapter(
                    createHeroRankProjection(db.databases.global.db, authority),
                    "realm.createHeroRankProjection",
                ),
                rules,
                [...db.databases.kingdoms.keys()],
            ),
            "realm.HeroRankingFinalityService",
        );
        const campaignAudience = observeAdapter(
            createCampaignAudience(db.kingdom.db, authority),
            "realm.createCampaignAudience",
        );
        const hotBusinessMan = observeAdapter(
            createHotBusinessMan(rules),
            "realm.createHotBusinessMan",
        );
        let publishedHotBusinessMan: string | undefined;
        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.businessman_publication_unavailable", async () => {
                    const current = hotBusinessMan.current();

                    if (!current || current.key === publishedHotBusinessMan)
                    {
                        return;
                    }

                    await publishHotBusinessMan(
                        notifications.owners(),
                        campaignAudience,
                        () => hotBusinessMan.current()?.body ?? current.body,
                        (owner, command, body) => {
                            authority.assertReady();

                            return notifications.publish(owner, command, body);
                        },
                    );
                    publishedHotBusinessMan = current.key;
                }),
            catch: () => new Error("Businessman publication unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );

        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.merge_campaign_recovery_unavailable", async () => {
                    await mergeCampaigns.refresh();

                    for (let index = 0; index < 16; index++)
                    {
                        const delivered = await relayMutationEvent(
                            db.kingdom.db,
                            authority,
                            async () => {
                                await publishMergeEffectBoard(
                                    notifications.owners(),
                                    campaignAudience,
                                    currentMergeBoard,
                                    (owner, command, body) => {
                                        authority.assertReady();

                                        return notifications.publish(owner, command, body);
                                    },
                                );
                            },
                            Date.now,
                            "merge.campaign.board",
                            1000,
                            mergeCampaignActor,
                        );

                        if (!delivered)
                        {
                            break;
                        }
                    }
                }),
            catch: () => new Error("Merge campaign recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );

        const costRankingFacts = observeAdapter(
            createCostRankingFacts(db.kingdom.db, authority, nicknameChangePayment),
            "realm.createCostRankingFacts",
        );
        const continuedCostFinality = observeAdapter(
            new ContinuedCostFinalityService(
                costRankingFacts,
                observeAdapter(
                    createCostFinalityOwned(db.kingdom.db, authority),
                    "realm.createCostFinalityOwned",
                ),
                observeAdapter(
                    createCostFinalityShared(db.databases.global.db, authority),
                    "realm.createCostFinalityShared",
                ),
            ),
            "realm.ContinuedCostFinalityService",
        );
        const continuedCostRanking = observeAdapter(
            new ContinuedCostRankingService(
                costRankingFacts,
                observeAdapter(
                    createCostRankingRegistry(db.databases.global.db, authority),
                    "realm.createCostRankingRegistry",
                ),
                rules,
                [...db.databases.kingdoms.keys()],
            ),
            "realm.ContinuedCostRankingService",
        );
        const expeditionCalendar = observeAdapter(
            new ExpeditionCalendarService(
                observeAdapter(
                    createExpeditionCalendarStore(db.databases.global.db),
                    "realm.createExpeditionCalendarStore",
                ),
                rules,
                [...db.databases.kingdoms.keys()],
            ),
            "realm.ExpeditionCalendarService",
        );
        const expeditionMatching = observeAdapter(
            new ExpeditionMatchingService(
                expeditionCalendar,
                observeAdapter(
                    createExpeditionMatchingRealmStore(
                        db.kingdom.db,
                        authority,
                        Date.now,
                        rules.configuration.serverConfig?.get("power_limit")?.rankingHideGm === "1",
                    ),
                    "realm.createExpeditionMatchingRealmStore",
                ),
                observeAdapter(
                    createExpeditionMatchingRegistry(db.databases.global.db),
                    "realm.createExpeditionMatchingRegistry",
                ),
                rules,
            ),
            "realm.ExpeditionMatchingService",
        );
        const expeditionPhases = observeAdapter(
            new ExpeditionPhaseService(
                expeditionCalendar,
                observeAdapter(
                    createExpeditionPhaseStore(db.kingdom.db, authority),
                    "realm.createExpeditionPhaseStore",
                ),
            ),
            "realm.ExpeditionPhaseService",
        );
        const expeditionActivity = observeAdapter(
            new ExpeditionActivityService(
                observeAdapter(
                    createExpeditionActivityReader(db.kingdom.db, authority),
                    "realm.createExpeditionActivityReader",
                ),
                rules,
            ),
            "realm.ExpeditionActivityService",
        );
        let expeditionNoticeCursor = 0;
        const expeditionNotified = new Map<string, bigint>();
        const recoverExpeditionNotifications = async () => {
            const clock = await currentExpeditionClock(db.kingdom.db, authority);

            if (!clock)
            {
                return;
            }

            const online = notifications.owners(),
                active = new Set(online);

            for (const owner of expeditionNotified.keys())
            {
                if (!active.has(owner))
                {
                    expeditionNotified.delete(owner);
                }
            }

            const selected = Array.from(
                { length: Math.min(32, online.length) },
                (_, index) => online[(expeditionNoticeCursor + index) % online.length]!,
            );

            if (online.length)
            {
                expeditionNoticeCursor = (expeditionNoticeCursor + selected.length) % online.length;
            }

            await Promise.allSettled(
                selected.map(async (owner) => {
                    if (expeditionNotified.get(owner) === clock.revision)
                    {
                        return;
                    }

                    await activities.domainCommand(owner, "expedition.notify", {
                        revision: sfs.string(String(clock.revision)),
                        operationId: sfs.string(expeditionPhaseOperation(clock.revision)),
                    });
                    expeditionNotified.set(owner, clock.revision);
                }),
            );

            for (let index = 0; index < 64; index++)
            {
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

                if (!delivered)
                {
                    break;
                }
            }
        };
        const costRankRewards = observeAdapter(
            new ContinuedCostRewardService(
                observeAdapter(
                    createCostRankAwardStore(db.kingdom.db, authority),
                    "realm.createCostRankAwardStore",
                ),
                observeAdapter(
                    createCostRankingRegistry(db.databases.global.db, authority),
                    "realm.createCostRankingRegistry",
                ),
                observeAdapter(
                    createCostFinalityShared(db.databases.global.db, authority),
                    "realm.createCostFinalityShared",
                ),
                rules,
                (owner, id) =>
                    activities.domainCommand(owner, "continuedcost.rank.deliver", {
                        awardId: sfs.string(id),
                        operationId: sfs.string(costRankAwardOperation(id)),
                    }),
            ),
            "realm.ContinuedCostRewardService",
        );
        const expeditionStageRewards = observeAdapter(
            new ExpeditionStageRewardService(
                observeAdapter(
                    createExpeditionAwardStore(db.kingdom.db, authority),
                    "realm.createExpeditionAwardStore",
                ),
                observeAdapter(
                    createExpeditionAwardStandings(db.databases.global.db, config.kingdomId),
                    "realm.createExpeditionAwardStandings",
                ),
                rules,
                (owner, id) =>
                    activities.domainCommand(owner, "expedition.award.deliver", {
                        awardId: sfs.string(id),
                        operationId: sfs.string(expeditionAwardOperation(id)),
                    }),
            ),
            "realm.ExpeditionStageRewardService",
        );
        const expeditionHistory = observeAdapter(
            new ExpeditionHistoryService(
                observeAdapter(
                    createExpeditionHistorySource(db.kingdom.db, db.databases.global.db, authority),
                    "realm.createExpeditionHistorySource",
                ),
                rules,
            ),
            "realm.ExpeditionHistoryService",
        );
        const expeditionStageFinality = observeAdapter(
            new ExpeditionStageFinalityService(
                observeAdapter(
                    createExpeditionStageRealm(db.kingdom.db, authority),
                    "realm.createExpeditionStageRealm",
                ),
                observeAdapter(
                    createExpeditionStageRegistry(db.databases.global.db, authority),
                    "realm.createExpeditionStageRegistry",
                ),
            ),
            "realm.ExpeditionStageFinalityService",
        );
        const expeditionScorePublication = observeAdapter(
            new ExpeditionScorePublicationService(
                observeAdapter(
                    createExpeditionScoreSource(db.kingdom.db, authority),
                    "realm.createExpeditionScoreSource",
                ),
                observeAdapter(
                    createExpeditionScoreProjection(db.databases.global.db, authority),
                    "realm.createExpeditionScoreProjection",
                ),
                (clock, version, now) =>
                    cache.publishExpeditionDiscovery(
                        expeditionDiscovery(clock, version, now, expeditionOpen(rules, now)),
                    ),
            ),
            "realm.ExpeditionScorePublicationService",
        );
        const expeditionLiveView = observeAdapter(
            new ExpeditionLiveViewService(
                observeAdapter(
                    createExpeditionLiveSource(db.kingdom.db, db.databases.global.db, authority),
                    "realm.createExpeditionLiveSource",
                ),
            ),
            "realm.ExpeditionLiveViewService",
        );
        const heroRankingRewards = observeAdapter(
            new HeroRankingRewardService(
                observeAdapter(
                    createHeroRankRewardStore(db.kingdom.db, authority),
                    "realm.createHeroRankRewardStore",
                ),
                observeAdapter(
                    createHeroRankRewardStandings(db.databases.global.db, config.kingdomId),
                    "realm.createHeroRankRewardStandings",
                ),
                rules,
                (owner, id) =>
                    activities.domainCommand(owner, "hero.rank.deliver", {
                        awardId: sfs.string(id),
                        operationId: sfs.string(heroRankAwardOperation(id)),
                    }),
            ),
            "realm.HeroRankingRewardService",
        );
        const heroMatching = observeAdapter(
            new HeroMatchingService(
                observeAdapter(
                    createHeroMatchingRealmStore(db.kingdom.db, authority),
                    "realm.createHeroMatchingRealmStore",
                ),
                observeAdapter(
                    createHeroMatchingRegistry(db.databases.global.db),
                    "realm.createHeroMatchingRegistry",
                ),
                rules,
            ),
            "realm.HeroMatchingService",
        );
        const recoverHeroCalendar = async () => {
            await heroCalendar.refresh();
            await heroMatching.refresh();
        };
        yield* Effect.tryPromise({
            try: () => observeJob("realm.hero_calendar_recovery", recoverHeroCalendar),
            catch: () => new Error("Hero calendar recovery unavailable"),
        }).pipe(Effect.catch(() => Effect.void));
        const olympicSchedule = observeAdapter(
            new OlympicScheduleService(
                observeAdapter(
                    createOlympicScheduleStore(db.kingdom.db, authority),
                    "realm.createOlympicScheduleStore",
                ),
                rules,
            ),
            "realm.OlympicScheduleService",
        );
        let olympicScanAt = 0n,
            olympicCursor: string | undefined;
        const recoverOlympicBets = async () => {
            const at = BigInt(Date.now()),
                period = olympicPeriod(rules);

            if (!period)
            {
                return;
            }

            if (at >= olympicScanAt)
            {
                await olympicSchedule.refresh();
                olympicScanAt = at + 300000n;
            }

            if (at <= period.end)
            {
                return;
            }

            const pending = await pendingOlympicSettlements(db.kingdom.db, olympicCursor);

            if (!pending.length)
            {
                olympicCursor = undefined;
            }

            for (const record of pending)
            {
                olympicCursor = record.owner;

                try
                {
                    await activities.domainCommand(record.owner, "Olympic.settle", {
                        operationId: sfs.string(
                            olympicSettlementOperation(record.owner, record.ids),
                        ),
                    });
                }
                catch
                {
                    logEvent(
                        "olympic_settlement_failed",
                        { kingdom: config.kingdomId, outcome: "failure" },
                        "error",
                    );
                }
            }
        };
        const cupSchedule = observeAdapter(
            new CupScheduleService(
                observeAdapter(
                    createCupScheduleStore(db.kingdom.db, authority),
                    "realm.createCupScheduleStore",
                ),
                rules,
            ),
            "realm.CupScheduleService",
        );
        let cupScanAt = 0n,
            cupCursor: string | undefined;
        const recoverCupBets = async () => {
            const at = BigInt(Date.now()),
                calendar = cupCalendar(rules);

            if (!calendar)
            {
                return;
            }

            if (at >= cupScanAt)
            {
                await cupSchedule.refresh();
                cupScanAt = at + 300000n;
            }

            if (at <= calendar.end)
            {
                return;
            }

            const pending = await pendingCupSettlements(db.kingdom.db, cupCursor);

            if (!pending.length)
            {
                cupCursor = undefined;
            }

            for (const record of pending)
            {
                if (!record.owner)
                {
                    continue;
                }

                cupCursor = record.owner;

                try
                {
                    await activities.domainCommand(record.owner, "euro.cup.settle", {
                        operationId: sfs.string(cupSettlementOperation(record.owner, record.ids)),
                    });
                }
                catch
                {
                    logEvent(
                        "cup_settlement_failed",
                        { kingdom: config.kingdomId, outcome: "failure" },
                        "error",
                    );
                }
            }
        };
        let groupBuyCursor: { id: string; round: number; owner: string; } | undefined;
        const recoverGroupBuys = async () => {
            const pending = await pendingGroupBuys(db.kingdom.db, groupBuyCursor);

            if (!pending.length)
            {
                groupBuyCursor = undefined;
            }

            for (const record of pending)
            {
                groupBuyCursor = record;

                try
                {
                    await activities.domainCommand(record.owner, "groupbuys.settle", {
                        activityId: sfs.string(record.id),
                        round: sfs.int(record.round),
                        operationId: sfs.string(
                            groupBuyOperation(
                                "settle",
                                `${record.owner}:${record.id}:${record.round}`,
                            ),
                        ),
                    });
                }
                catch
                {
                    logEvent(
                        "group_buy_settlement_failed",
                        { kingdom: config.kingdomId, outcome: "failure" },
                        "error",
                    );
                }
            }
        };
        const goldEggsRuntime = new GoldEggsRuntime(
            observeAdapter(
                createGoldEggsRuntimeStore(db.kingdom.db, authority),
                "realm.createGoldEggsRuntimeStore",
            ),
            goldEggsRanks,
            rules,
            (owner, period, global) =>
                activities.domainCommand(
                    owner,
                    "goldeggs.award.deliver",
                    goldEggsAwardParameters(owner, period, global),
                ),
        );
        const recoverSpecialPurchases = async () => {
            const at = BigInt(Date.now());

            for (const record of await specialEventStock.pending(config.kingdomId, at))
            {
                const eventId = text(record, "eventId"),
                    owner = text(record, "ownerUid");

                try
                {
                    await activities.domainCommand(owner, "special.paid", {
                        eventId: sfs.string(eventId),
                        operationId: sfs.string(specialEventOperation(eventId)),
                    });
                    await specialEventStock.delivered(
                        eventId,
                        owner,
                        config.kingdomId,
                        BigInt(Date.now()),
                    );
                }
                catch
                {
                    await specialEventStock.defer(eventId, BigInt(Date.now() + 60000));
                }
            }
        };
        const recoverHeroScoreNotifications = async () => {
            for (let index = 0; index < 64; index++)
            {
                const delivered = await relayMutationEvent(
                    db.kingdom.db,
                    authority,
                    async (event) => {
                        const params = decode(event.payload),
                            recipients = params.recipients,
                            body = params.body;

                        if (
                            recipients?.type !== Type.StringArray
                            || !Array.isArray(recipients.value)
                            || recipients.value.length > 64
                            || body?.type !== Type.Object
                        )
                        {
                            throw new Error("Invalid hero score notification");
                        }

                        const score = fields(body);

                        if (
                            !(await currentHeroScore(
                                db.kingdom.db,
                                str(score, "actId"),
                                str(score, "aid"),
                                int(score, "score"),
                            ))
                        )
                        {
                            return;
                        }

                        for (const owner of recipients.value as string[])
                        {
                            await notifications.publish(owner, "push.act.score.obtain", score);
                        }
                    },
                    Date.now,
                    "hero.score.notify",
                    60000,
                );

                if (!delivered)
                {
                    break;
                }
            }
        };
        const recoverHeroTargets = async () => {
            for (let index = 0; index < 64; index++)
            {
                const delivered = await relayMutationEvent(
                    db.kingdom.db,
                    authority,
                    (event) =>
                        deliverHeroTargetBatch(
                            event.payload,
                            (owner, params) =>
                                activities.domainCommand(owner, "hero.target.deliver", params),
                        ),
                    Date.now,
                    "hero.target.earned",
                    60000,
                );

                if (!delivered)
                {
                    break;
                }
            }
        };
        const recoverContinuedCosts = async (owner?: string) => {
            for (let index = 0; index < 64; index++)
            {
                try
                {
                    const delivered = await relayMutationEvent(
                        db.kingdom.db,
                        authority,
                        async (event) => {
                            const fact = readContinuedCostSpending(event.payload);

                            if (fact.owner !== event.owner)
                            {
                                throw new Error("Foreign continued-cost evidence owner");
                            }

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

                    if (!delivered)
                    {
                        break;
                    }
                }
                catch (error)
                {
                    if (owner)
                    {
                        throw error;
                    }
                }
            }

            if (owner && (await pendingContinuedCosts(db.kingdom.db, config.kingdomId, owner)))
            {
                throw new Error("Continued-cost delivery pending");
            }
        };
        const recoverCosmeticInteractions = async () => {
            for (const command of ["trouble.deliver", "trouble.speed"])
            {
                for (let index = 0; index < 64; index++)
                {
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

                    if (!delivered)
                    {
                        break;
                    }
                }
            }

            for (const type of ["trigger.activity", "avatar.activate"])
            {
                for (let index = 0; index < 64; index++)
                {
                    const delivered = await relayMutationEvent(
                        db.kingdom.db,
                        authority,
                        (event) =>
                            publishCosmeticInteractionMutation(
                                event.payload,
                                worldInterest.interested,
                                (owner, command, body) =>
                                    notifications.publish(owner, command, body),
                            ),
                        Date.now,
                        type,
                    );

                    if (!delivered)
                    {
                        break;
                    }
                }
            }
        };
        let heartCursor = 0;
        const recoverAllianceHearts = async () => {
            const online = notifications.owners();

            if (online.length)
            {
                const selected = Array.from(
                    { length: Math.min(32, online.length) },
                    (_, index) => online[(heartCursor + index) % online.length]!,
                );
                heartCursor = (heartCursor + selected.length) % online.length;

                for (const owner of await pendingAllianceHeartOwners(db.kingdom.db, selected))
                {
                    try
                    {
                        await activities.domainCommand(owner, "heart.init", {
                            notify: sfs.bool(true),
                        });
                    }
                    catch
                    {
                        logEvent(
                            "heart_delivery_deferred",
                            { kingdom: config.kingdomId, outcome: "failure" },
                            "warn",
                        );
                    }
                }
            }

            for (const command of ["heart.send", "heart.init"])
            {
                for (let index = 0; index < 64; index++)
                {
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

                    if (!delivered)
                    {
                        break;
                    }
                }
            }
        };
        let giftCursor = 0;
        const deliverPlayerItemGifts = async (owners: readonly string[]) => {
            for (const owner of await pendingPlayerItemGiftOwners(db.kingdom.db, owners))
            {
                try
                {
                    await activities.domainCommand(owner, "gift.init", { notify: sfs.bool(true) });
                }
                catch
                {
                    logEvent(
                        "item_gift_delivery_deferred",
                        { kingdom: config.kingdomId, outcome: "failure" },
                        "warn",
                    );
                }
            }
        };
        const recoverPlayerItemGifts = async () => {
            const online = notifications.owners();

            if (online.length)
            {
                const selected = Array.from(
                    { length: Math.min(32, online.length) },
                    (_, index) => online[(giftCursor + index) % online.length]!,
                );
                giftCursor = (giftCursor + selected.length) % online.length;
                await deliverPlayerItemGifts(selected);
            }

            for (let index = 0; index < 64; index++)
            {
                const delivered = await relayMutationEvent(
                    db.kingdom.db,
                    authority,
                    (event) =>
                        publishPlayerItemGiftMutation(
                            event.payload,
                            async (owner, command, body) => {
                                await notifications.publish(owner, command, body);
                            },
                        ),
                    Date.now,
                    "gift.init",
                );

                if (!delivered)
                {
                    break;
                }
            }
        };
        const monsterRefresh = observeAdapter(
            createWorldMonsterRefreshExecutor(db.kingdom.db, authority, config.mapSize),
            "realm.createWorldMonsterRefreshExecutor",
        );
        const resourceRefresh = observeAdapter(
            createWorldResourceRefreshExecutor(db.kingdom.db, authority, config.mapSize),
            "realm.createWorldResourceRefreshExecutor",
        );
        const resourceNewRefresh = observeAdapter(
            createWorldResourceNewExecutor(
                db.kingdom.db,
                authority,
                config.mapSize,
                worldResourceAreaCount(rules, config.mapSize),
            ),
            "realm.createWorldResourceNewExecutor",
        );
        const population = new WorldPopulationJob(
            resourceNewRefresh,
            resourceRefresh,
            monsterRefresh,
            rules,
            config.mapSize,
            () => economyEffects.world(),
            (event) => logEvent(event, { kingdom: config.kingdomId, outcome: "failure" }, "error"),
        );
        const marchRecovery = new WorldMarchRecoveryJob(
            (after) => unregisteredWorldMarches(db.kingdom.db, after),
            (now, after) => dueWorldMarches(db.kingdom.db, now, after),
            (owner) => recoverActivities(owner),
            (owner, command, params) => activities.domainCommand(owner, command, params),
            (event) => logEvent(event, { kingdom: config.kingdomId, outcome: "failure" }, "error"),
        );
        const recoverWorld = async () => {
            await population.run();

            for (let index = 0; index < 64; index++)
            {
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

                if (!delivered)
                {
                    break;
                }
            }

            for (const command of ["dragontower", "dragontower.init", "dragontower.tick"])
            {
                for (let index = 0; index < 64; index++)
                {
                    const delivered = await relayMutationEvent(
                        db.kingdom.db,
                        authority,
                        (event) =>
                            publishDragonTowerMutation(
                                event.payload,
                                (owner, name, body) => notifications.publish(owner, name, body),
                            ),
                        Date.now,
                        command,
                    );

                    if (!delivered)
                    {
                        break;
                    }
                }
            }

            for (let index = 0; index < 64; index++)
            {
                const delivered = await relayMutationEvent(
                    db.kingdom.db,
                    authority,
                    (event) =>
                        publishExpeditionTreasuryMutation(
                            event.payload,
                            (owner, name, body) => notifications.publish(owner, name, body),
                        ),
                    Date.now,
                    "expedition.king.present",
                );

                if (!delivered)
                {
                    break;
                }
            }

            for (const command of ["arena.matched", "arena.enter", "arena.leave", "arena.finished"])
            {
                for (let index = 0; index < 64; index++)
                {
                    const delivered = await relayMutationEvent(
                        db.kingdom.db,
                        authority,
                        (event) =>
                            publishArenaMutation(
                                event.payload,
                                command,
                                undefined,
                                (owner, name, body) => notifications.publish(owner, name, body),
                            ),
                        Date.now,
                        command,
                    );

                    if (!delivered)
                    {
                        break;
                    }
                }
            }

            const totemNow = BigInt(Date.now());
            await db.kingdom.db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                await expireTotems(
                    observeAdapter(
                        createTotemEffectStore(
                            tx,
                            "",
                            totemNow,
                            config.mapSize,
                            config.kingdomId,
                            baseCityBoundary,
                        ),
                        "realm.createTotemEffectStore",
                    ),
                    config.mapSize,
                );
            });

            for (const owner of await pendingTotemOwners(db.kingdom.db, totemNow))
            {
                try
                {
                    await recoverActivities(owner);
                    await activities.domainCommand(owner, "totem.tick", {
                        operationId: sfs.string(`totem-tick:${Date.now()}:${owner}`),
                    });
                }
                catch
                {
                    logEvent(
                        "totem_recovery_failed",
                        { kingdom: config.kingdomId, outcome: "failure" },
                        "error",
                    );
                }
            }

            await marchRecovery.run();

            for (
                const command of [
                    "treasuremap.spd",
                    "world.use",
                    "create.boss",
                    "world.get.monster",
                    "world.get.barbarion",
                    "world.user.rcr",
                    "resource.new.detail",
                    "world.resources",
                    "world.monsters",
                    "buy.citydef",
                    "world.user.rcd",
                    "world.march",
                    "world.march.retreat",
                    "world.march.check",
                    "world.user.march",
                    "common.res.syn",
                    "world.get.march",
                    "civilizationCastle",
                    "totem",
                    "totem.world",
                    "world.march.spd",
                    "world.tick",
                    "world.mv",
                    "world.mv.gold",
                ]
            )
            {
                for (let index = 0; index < 64; index++)
                {
                    const delivered = await relayMutationEvent(
                        db.kingdom.db,
                        authority,
                        async (event) => {
                            await deliverWorldTroubles(
                                event.payload,
                                (owner, params) =>
                                    activities.domainCommand(owner, "trouble.deliver", params),
                            );
                            await publishWorldMutation(
                                event.payload,
                                command,
                                config.kingdomId,
                                worldInterest.interested,
                                (owner, eventCommand, body) =>
                                    notifications.publish(owner, eventCommand, body),
                            );
                        },
                        Date.now,
                        command,
                    );

                    if (!delivered)
                    {
                        break;
                    }
                }
            }
        };
        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.totem_status_relay_unavailable", async () => {
                    for (let i = 0; i < 64; i++)
                    {
                        const delivered = await relayMutationEvent(
                            db.kingdom.db,
                            authority,
                            async (event) => {
                                await notifications.publish(
                                    event.owner,
                                    "status.push",
                                    decode(event.payload),
                                );
                            },
                            Date.now,
                            "totem.status",
                        );

                        if (!delivered)
                        {
                            break;
                        }
                    }
                }),
            catch: () => new Error("Totem status relay unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        const production = observeAdapter(
            createRealmProductionService(
                observeAdapter(
                    createRealmProductionExecutor(db.kingdom.db, authority, {
                        ...productionPreparation,
                        recordAction: async (tx, owner, kind, itemId, count, now, economy) => {
                            await city.command(
                                tx,
                                owner,
                                "quest.action",
                                encode({
                                    kind: sfs.string(kind),
                                    itemId: sfs.string(itemId),
                                    count: sfs.int(count),
                                }),
                                now,
                                economy,
                            );
                        },
                    }),
                    "realm.createProductionExecutor",
                ),
                rules,
                economyEffects,
            ),
            "realm.ProductionService",
        );
        const activityRecovery = new ActivityRecoveryJob(
            () => authority.assertReady(),
            () => [...activityDomains.keys()],
            (types, limit, owner, after) =>
                unregisteredActivities(db.kingdom.db, types, limit, owner, after),
            (types, now, limit, owner, after) =>
                dueActivities(db.kingdom.db, types, now, limit, owner, after),
            (owner, operationId, queueId) => activities.restore(owner, operationId, queueId),
            (owner, command, params) => activities.command(owner, command, params),
            (event) => logEvent(event, { kingdom: config.kingdomId, outcome: "failure" }, "error"),
        );
        const recoverActivities = (owner?: string, stopQueue?: string) =>
            activityRecovery.run(owner, stopQueue);
        yield* Effect.tryPromise({
            try: () => observeJob("realm.hero_calendar_recovery", recoverHeroCalendar),
            catch: () => new Error("Hero calendar recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.hero_reward_recovery_unavailable", async () => {
                    await recoverHeroTargets();
                    await recoverHeroScoreNotifications();
                }),
            catch: () => new Error("Hero reward recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.expedition_matching_recovery_unavailable", async () => {
                    try
                    {
                        await expeditionMatching.refresh();
                    }
                    finally
                    {
                        await expeditionPhases.refresh();
                    }
                }),
            catch: () => new Error("Expedition matching recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.expedition_activity_publication", recoverExpeditionNotifications),
            catch: () => new Error("Expedition activity publication unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.campaign_notice_publication_unavailable", async () => {
                    await settleRedPacketExpiry(
                        observeAdapter(
                            createRedPacketExpiryStore(db.kingdom.db, authority),
                            "realm.createRedPacketExpiryStore",
                        ),
                        rules,
                        BigInt(Date.now()),
                    ).catch(() => undefined);

                    for (const type of ["campaign.notice", "redPackets.announce"])
                    {
                        for (let index = 0; index < 64; index++)
                        {
                            try
                            {
                                const delivered = await relayMutationEvent(
                                    db.kingdom.db,
                                    authority,
                                    (event) =>
                                        (type === "campaign.notice"
                                            ? publishCampaignNotice
                                            : publishRedPacketAnnouncement)(
                                                event.payload,
                                                event.owner,
                                                notifications.owners(),
                                                campaignAudience,
                                                (owner, command, body) =>
                                                    notifications.publish(owner, command, body),
                                            ),
                                    Date.now,
                                    type,
                                    1000,
                                );

                                if (!delivered)
                                {
                                    break;
                                }
                            }
                            catch
                            {
                                continue;
                            }
                        }
                    }
                }),
            catch: () => new Error("Campaign notice publication unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob(
                    "realm.consumption_ranking_finality",
                    () => continuedCostFinality.refresh(),
                ),
            catch: () => new Error("Consumption ranking finality unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob(
                    "realm.consumption_ranking_publication",
                    () => continuedCostRanking.refresh(),
                ),
            catch: () => new Error("Consumption ranking publication unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob(
                    "realm.expedition_stage_finality",
                    () => expeditionStageFinality.refresh(),
                ),
            catch: () => new Error("Expedition stage finality unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob(
                    "realm.expedition_score_publication",
                    () => expeditionScorePublication.refresh(),
                ),
            catch: () => new Error("Expedition score publication unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.hero_ranking_publication", () => heroRankPublication.refresh()),
            catch: () => new Error("Hero ranking publication unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.hero_ranking_finality", () => heroRankingFinality.refresh()),
            catch: () => new Error("Hero ranking finality unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.hero_ranking_reward_recovery_unavailable", async () => {
                    await heroRankingRewards.refresh().catch(() => undefined);
                    await expeditionStageRewards.refresh().catch(() => undefined);
                    await costRankRewards.refresh().catch(() => undefined);

                    for (
                        const type of [
                            "hero.rank.mail",
                            "gold.eggs.mail",
                            "egg.activity.mail",
                            "world.scout.mail",
                            "hero.target.mail",
                            "campaign.mail",
                            "redPackets.mail",
                            "expedition.award.mail",
                            "continuedcost.rank.mail",
                        ]
                    )
                    {
                        for (let index = 0; index < 64; index++)
                        {
                            const delivered = await relayMutationEvent(
                                db.kingdom.db,
                                authority,
                                async (event) => {
                                    if (type === "world.scout.mail")
                                    {
                                        await publishWorldScoutMail(
                                            event.payload,
                                            event.owner,
                                            scoutMailReader,
                                            (recipient, command, body) =>
                                                notifications.publish(recipient, command, body),
                                        );

                                        return;
                                    }

                                    const data = decode(event.payload);

                                    if (str(data, "owner") !== event.owner)
                                    {
                                        throw new Error("Foreign progression mail publication");
                                    }

                                    await notifications.publish(
                                        event.owner,
                                        "push.mail",
                                        fields(data.mail),
                                    );

                                    if (data.achievement)
                                    {
                                        await notifications.publish(
                                            event.owner,
                                            "push.hero.target.achieved",
                                            fields(data.achievement),
                                        );
                                    }
                                },
                                Date.now,
                                type,
                                60000,
                            );

                            if (!delivered)
                            {
                                break;
                            }
                        }
                    }
                }),
            catch: () => new Error("Hero ranking reward recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () => observeJob("realm.olympic_settlement", recoverOlympicBets),
            catch: () => new Error("Olympic settlement unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () => observeJob("realm.cup_settlement", recoverCupBets),
            catch: () => new Error("Cup settlement unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () => observeJob("realm.group_buy_settlement", recoverGroupBuys),
            catch: () => new Error("Group-buy settlement unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () => observeJob("realm.gold_eggs_recovery", () => goldEggsRuntime.refresh()),
            catch: () => new Error("Gold eggs recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () => observeJob("realm.special_event_recovery", recoverSpecialPurchases),
            catch: () => new Error("Special event recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () => observeJob("realm.continued_cost_recovery", () => recoverContinuedCosts()),
            catch: () => new Error("Continued-cost recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.cosmetic_interaction_recovery", recoverCosmeticInteractions),
            catch: () => new Error("Cosmetic interaction recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () => observeJob("realm.heart_recovery", recoverAllianceHearts),
            catch: () => new Error("Heart recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () => observeJob("realm.item_gift_recovery", recoverPlayerItemGifts),
            catch: () => new Error("Item gift recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () => observeJob("realm.world_recovery", recoverWorld),
            catch: () => new Error("World recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.tryPromise({
            try: () => observeJob("realm.activity_recovery", () => recoverActivities()),
            catch: () => new Error("Activity recovery unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(1000)),
            Effect.forever,
            Effect.forkScoped,
        );
        const trade = observeAdapter(
            new TradeService(
                observeAdapter(
                    createTradeExecutor(db.kingdom.db, authority),
                    "realm.createTradeExecutor",
                ),
                rules,
                planRealmInventoryGrants,
            ),
            "realm.TradeService",
        );
        const confirmCampaignInventory = async (
            tx: MutationTransaction,
            owner: string,
            events: readonly CampaignObservation[],
            now: number,
        ) => {
            if (!campaignObservationNeeded(rules, events, now))
            {
                return undefined;
            }

            return executeRealmInventoryTransaction(
                tx,
                owner,
                (state) =>
                    planCampaignObservation(
                        state,
                        rules,
                        economyEffects,
                        now,
                        events,
                        (request, economy) =>
                            city.command(
                                tx,
                                owner,
                                "campaign.record",
                                request,
                                BigInt(now),
                                economy,
                            ),
                    ),
                "campaign.record",
            );
        };
        const shops = observeAdapter(
            new ShopService(
                observeAdapter(
                    createShopRepository(
                        db.kingdom.db,
                        authority,
                        Date.now,
                        (tx, owner, purchase, inventory, now) =>
                            confirmCampaignInventory(
                                tx,
                                owner,
                                campaignInventoryObservations(
                                    inventory,
                                    /^\d+$/.test(purchase.id) && purchase.saleType
                                        ? {
                                            code: 68,
                                            selector: purchase.saleType,
                                            attributes: {
                                                key_shopId: purchase.id,
                                                key_shopBuyNum: purchase.count,
                                                key_shopSaleType: purchase.saleType,
                                            },
                                        }
                                        : undefined,
                                ),
                                now,
                            ),
                    ),
                    "realm.createShopRepository",
                ),
                rules,
                planRealmInventoryGrants,
            ),
            "realm.ShopService",
        );
        const mailRewards = observeAdapter(
            new MailRewardService(
                observeAdapter(
                    createMailRewardExecutor(
                        db.kingdom.db,
                        authority,
                        Date.now,
                        () => mailRewardRealmAllowed(db.databases.global.db, config.kingdomId),
                        (tx, owner, entry, inventory, now) =>
                            confirmCampaignInventory(
                                tx,
                                owner,
                                campaignInventoryObservations(inventory, {
                                    code: 61,
                                    selector: text(entry, "title"),
                                    attributes: { key_mailTitle: text(entry, "title") },
                                }),
                                now,
                            ),
                    ),
                    "realm.createMailRewardExecutor",
                ),
                rules,
            ),
            "realm.MailRewardService",
        );
        yield* Effect.tryPromise({
            try: () =>
                observeJob("realm.social_retention_cleanup_unavailable", async () => {
                    const removed = await cleanupSocialRealm(db.kingdom.db, authority);

                    if (removed >= 500)
                    {
                        logEvent(
                            "social_retention_backlog",
                            { kingdom: config.kingdomId, outcome: "failure" },
                            "warn",
                        );
                    }

                    return removed;
                }),
            catch: () => new Error("Social retention cleanup unavailable"),
        }).pipe(
            Effect.catch(() => Effect.void),
            Effect.andThen(Effect.sleep(60_000)),
            Effect.forever,
            Effect.forkScoped,
        );
        const socialRemote = config.chatSession
            ? observeAdapter(
                createRealmSocialExecutor({
                    authority,
                    ...config.chatSession,
                    realm: config.kingdomId,
                    timeoutMs: config.timeoutMs,
                }),
                "realm.createRealmSocialExecutor",
            )
            : undefined;
        const friendshipMine = observeAdapter(
            new FriendshipMineService(
                observeAdapter(
                    createFriendshipMineExecutor(
                        db,
                        authority,
                        () => initialFriendshipMine(rules),
                        Date.now,
                        {
                            before: async (tx, owner, now) => {
                                await productionPreparation.prepare(tx, owner, now);
                            },
                        },
                    ),
                    "realm.createFriendshipMineExecutor",
                ),
                rules,
                economyEffects,
                socialRemote,
            ),
            "realm.FriendshipMineService",
        );
        const notices = observeAdapter(
            new ChatNoticeService(
                observeAdapter(
                    createRealmInventoryExecutor(db.kingdom.db, authority, Date.now, {
                        before: async (tx, owner, now) => {
                            await productionPreparation.prepare(tx, owner, now);
                        },
                    }),
                    "realm.createInventoryExecutor",
                ),
                rules,
                economyEffects,
                Date.now,
                async (owner) => {
                    if (!socialRemote)
                    {
                        throw new Error("Chat unavailable");
                    }

                    await socialRemote(owner, "chat.notice.authorize", {});
                },
                observeAdapter(
                    createChatNoticeCostReader(db.kingdom.db, config.kingdomId),
                    "realm.createChatNoticeCostReader",
                ),
            ),
            "realm.ChatNoticeService",
        );
        const postbox = observeAdapter(
            new PostboxService(
                observeAdapter(
                    createPostboxExecutor(db.kingdom.db, authority, Date.now, {
                        before: async (tx, owner, now) => {
                            await productionPreparation.prepare(tx, owner, now);
                        },
                    }),
                    "realm.createPostboxExecutor",
                ),
                rules,
                economyEffects,
            ),
            "realm.PostboxService",
        );

        if (socialRemote)
        {
            yield* Effect.tryPromise({
                try: () =>
                    observeJob("realm.friendship_help_recovery_unavailable", async () => {
                        authority.assertReady();
                        const batch = await socialRemote(
                            `realm-${config.kingdomId}`,
                            "mine.inbox.poll",
                            {},
                        );
                        const commands = batch.commands?.value as
                            | { type: number; value: Fields; }[]
                            | undefined;

                        for (const entry of commands ?? [])
                        {
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
                    }),
                catch: () => new Error("Friendship help recovery unavailable"),
            }).pipe(
                Effect.catch(() => Effect.void),
                Effect.andThen(Effect.sleep(1000)),
                Effect.forever,
                Effect.forkScoped,
            );
        }

        if (socialRemote)
        {
            yield* Effect.tryPromise({
                try: () =>
                    observeJob("realm.social_event_delivery_unavailable", async () => {
                        authority.assertReady();
                        const owners = notifications.owners();
                        let cursor = "";

                        for (let index = 0; index < Math.max(1, owners.length); index += 4)
                        {
                            const batch = await socialRemote(
                                `realm-${config.kingdomId}`,
                                "realm.events.poll",
                                {
                                    token: sfs.string(authority.instance),
                                    epoch: sfs.string(String(authority.epoch)),
                                    owners: sfs.array(
                                        owners.slice(index, index + 4).map((owner) =>
                                            sfs.string(owner)
                                        ),
                                    ),
                                    ...(cursor ? { end: sfs.string(cursor) } : {}),
                                },
                            );

                            if (index === 0)
                            {
                                cursor = str(batch, "cursor", "");
                            }

                            const deliveries = batch.deliveries?.value as
                                | { type: number; value: Fields; }[]
                                | undefined;

                            for (const entry of deliveries ?? [])
                            {
                                const data = entry.value;
                                await notifications.publish(str(data, "owner"), str(data, "cmd"), {
                                    ...(data.data?.value as Fields),
                                    eventId: data.id!,
                                });
                            }

                            if (batch.resync?.value === true)
                            {
                                for (const owner of owners.slice(index, index + 4))
                                {
                                    await notifications.publish(owner, "push.chat.resync", {});
                                }
                            }
                        }

                        if (cursor)
                        {
                            await socialRemote(`realm-${config.kingdomId}`, "realm.events.ack", {
                                token: sfs.string(authority.instance),
                                epoch: sfs.string(String(authority.epoch)),
                                cursor: sfs.string(cursor),
                            });
                        }
                    }),
                catch: () => new Error("Social event delivery unavailable"),
            }).pipe(
                Effect.catch(() => Effect.void),
                Effect.andThen(Effect.sleep(250)),
                Effect.forever,
                Effect.forkScoped,
            );
        }

        const inventory = observeAdapter(
            createInventoryService(
                observeAdapter(
                    createRealmInventoryExecutor(db.kingdom.db, authority, Date.now, {
                        before: async (tx, owner, now) => {
                            await productionPreparation.prepare(tx, owner, now);
                        },
                        recordAction: async (tx, owner, kind, itemId, count, now, economy) => {
                            await city.command(
                                tx,
                                owner,
                                "quest.action",
                                encode({
                                    kind: sfs.string(kind),
                                    itemId: sfs.string(itemId),
                                    count: sfs.int(count),
                                }),
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
                                                : ["37", "40"].includes(
                                                        rules.goods.get(itemId)?.type ?? "",
                                                    )
                                                ? "dragon.item"
                                                : "effect.item",
                                            encode({
                                                itemId: sfs.string(itemId),
                                                count: sfs.int(count),
                                            }),
                                            now,
                                            economy,
                                        )
                                    ).response,
                                ),
                            ),
                    }),
                    "realm.createInventoryExecutor",
                ),
                rules,
                {
                    world: async () =>
                        worldPowerEffects(
                            decodeWorldPowerEffects(await worldEffects(config.kingdomId)),
                            rules,
                            {
                                kingdomId: config.kingdomId,
                                version: "12.06.0",
                                now: Date.now(),
                            },
                        ),
                    emperor: () => cache.emperorVersion(config.kingdomId),
                },
            ),
            "realm.InventoryService",
        );
        const comebackSessions = observeAdapter(
            createComebackSessions(
                db.kingdom.db,
                authority,
                (tx, owner, now) =>
                    executeRealmInventoryTransaction(
                        tx,
                        owner,
                        (state) =>
                            planComebackLogin(
                                state,
                                rules,
                                economyEffects,
                                now,
                                (economy) =>
                                    city.command(
                                        tx,
                                        owner,
                                        "comeback.init",
                                        encode({}),
                                        now,
                                        economy,
                                    ),
                            ),
                        "comeback.init",
                    ),
            ),
            "realm.createComebackSessions",
        );

        return {
            paidGifts: { consume: paymentObservers.consume },
            provisioning: config.provisioningSecret
                ? characterProvisioningHandler(
                    observeAdapter(
                        new CharacterProvisioningController(
                            observeAdapter(
                                new CharacterProvisioningService(
                                    observeAdapter(
                                        createCharacterCreator(
                                            db.kingdom.db,
                                            authority,
                                            config.mapSize,
                                        ),
                                        "realm.createCharacterCreator",
                                    ),
                                    rules,
                                ),
                                "realm.CharacterProvisioningService",
                            ),
                        ),
                        "realm.CharacterProvisioningController",
                    ),
                    config.provisioningSecret,
                )
                : undefined,
            inventory,
            mutations: observeAdapter(
                createMutationExecutor(db.kingdom.db, authority),
                "realm.createMutationExecutor",
            ),
            economy: observeAdapter(
                createEconomyMutationExecutor(createMutationExecutor(db.kingdom.db, authority)),
                "realm.createEconomyMutationExecutor",
            ),
            profileSessions: {
                async open(owner, id, now)
                {
                    if (nickname)
                    {
                        await cn1.open(owner, id, now);
                    }

                    await comebackSessions.open(owner, id, now);
                },
                async close(owner, id, now)
                {
                    try
                    {
                        await comebackSessions.close(owner, id, now);
                    }
                    finally
                    {
                        if (nickname)
                        {
                            await cn1.close(owner, id, now);
                        }
                    }
                },
                observe: comebackSessions.observe,
            },
            notifications,
            db,
            cache,
            coordination,
            game: observeAdapter(
                new GameController(
                    observeAdapter(
                        createRealmGameService(
                            db,
                            rules,
                            config,
                            Date.now,
                            {
                                celebrityDescription: celebrityDescriptions,
                                publicProfile: (uid, params) => publicProfiles.get(uid, params),
                                playerPreferences: pushPreferences,
                                profilePreference: (uid, command, params, now) =>
                                    profilePreferences.command(uid, command, params, now),
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
                                    {
                                        return {
                                            body: await expeditionHistory.read(owner),
                                            pushes: [],
                                        };
                                    }

                                    if (
                                        (expeditionTreasuryCommands as readonly string[]).includes(
                                            command,
                                        )
                                    )
                                    {
                                        return expeditionTreasury.command(owner, command, params);
                                    }

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
                                    {
                                        await activities.domainCommand(owner, "world.tick", {});
                                    }

                                    if (
                                        command === "continuedcost.info"
                                        || command === "continuedcost.reward"
                                    )
                                    {
                                        await recoverContinuedCosts(owner);
                                    }

                                    const result = await activities.domainCommand(
                                        owner,
                                        command,
                                        params,
                                    );

                                    if (command === "item.send")
                                    {
                                        const recipient = str(params, "uid");

                                        if (notifications.owners().includes(recipient))
                                        {
                                            await deliverPlayerItemGifts([recipient]);
                                        }
                                    }

                                    if (command === "newexpidition.activityinfo")
                                    {
                                        return {
                                            ...result,
                                            body: await expeditionLiveView.enrich(
                                                owner,
                                                result.body,
                                            ),
                                        };
                                    }

                                    return result;
                                },
                                reconcileTimed: async (owner) => {
                                    await recoverActivities(owner);
                                    await production.command(owner, "production.settle", {});
                                },
                                trade: (owner, command, params) =>
                                    trade.command(owner, command, params),
                                shop: (owner, command, params) =>
                                    shops.command(owner, command, params),
                                mailReward: (owner, command, params) =>
                                    mailRewards.command(owner, command, params),
                                friendshipMine: (owner, command, params) =>
                                    friendshipMine.command(owner, command, params),
                                notice: (owner, command, params) =>
                                    notices.command(owner, command, params),
                                postbox: (owner, command, params) =>
                                    postbox.command(owner, command, params),
                                inventory: (owner, command, params) =>
                                    inventory.command(owner, command, params),
                                expeditionActivity: (owner) => expeditionActivity.activity(owner),
                                reconnect: async (uid, now, plan) => {
                                    authority.assertReady();
                                    const binding = await readFriendshipBinding(
                                        db.databases.global.db,
                                        config.kingdomId,
                                        uid,
                                    );

                                    return executeReconnectProgress(
                                        db.kingdom.db,
                                        authority,
                                        uid,
                                        BigInt(now),
                                        plan,
                                        {
                                            binding,
                                            initial: () => initialFriendshipMine(rules),
                                        },
                                    );
                                },
                                ...nicknameServices,
                                nickname: nicknames,
                                worldPointDetail,
                                worldMarchInspection: observeAdapter(
                                    createWorldMarchInspectionStore(db.kingdom.db),
                                    "realm.createWorldMarchInspectionStore",
                                ),
                                worldScout: observeAdapter(
                                    createWorldScoutStore(db.kingdom.db, config.mapSize),
                                    "realm.createWorldScoutStore",
                                ),
                                worldFightBulletins: {
                                    store: observeAdapter(
                                        createWorldBulletinStore(db.kingdom.db),
                                        "realm.createWorldBulletinStore",
                                    ),
                                    page: (...args) => cache.worldFightBulletins(...args),
                                },
                                playerSearch,
                                worldSearch,
                                worldUtility: observeAdapter(
                                    createWorldUtilityStore(
                                        db.kingdom.db,
                                        authority,
                                        config.mapSize,
                                    ),
                                    "realm.createWorldUtilityStore",
                                ),
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

                                            return readAvatarGrant(
                                                db.kingdom.db,
                                                config.kingdomId,
                                                uid,
                                                now,
                                                inspect,
                                            );
                                        },
                                    }
                                    : undefined,
                                social: config.chatSession
                                    ? (() => {
                                        const execute = observeAdapter(
                                            createRealmSocialExecutor({
                                                authority,
                                                ...config.chatSession,
                                                realm: config.kingdomId,
                                                timeoutMs: config.timeoutMs,
                                            }),
                                            "realm.createRealmSocialExecutor",
                                        );

                                        return async (owner, command, params) => {
                                            authority.assertReady();

                                            return execute(owner, command, params);
                                        };
                                    })()
                                    : undefined,
                                mailChatEnabled: !!config.mailChat,
                                chatSession: config.chatSession
                                    ? (() => {
                                        const issue = observeAdapter(
                                            createRealmChatSessionIssuer({
                                                ...config.chatSession,
                                                timeoutMs: config.timeoutMs,
                                            }),
                                            "realm.createRealmChatSessionIssuer",
                                        );

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
                                heroHistoryPublication: (keys, alliance) =>
                                    cache.heroHistoryPublication(keys, alliance),
                                heroRankingPosition: (query) => cache.heroRankingPosition(query),
                                throneRankingPeriod: (realm) => cache.throneRankingPeriod(realm),
                                donationScores: (allianceId, kind, date) =>
                                    cache.donationScores(allianceId, kind, date),
                                flowerRankingPublication: (realm, uid, limit, global) =>
                                    cache.flowerRankingPublication(realm, uid, limit, global),
                                militaryRanking: (type, group) =>
                                    cache.militaryRanking(type, group),
                                attributeRanking: (type) => cache.attributeRanking(type),
                                publishedGlobalRanking: (kind) =>
                                    kind === "consumption"
                                        ? continuedCostRanking.board(() =>
                                            cache.publishedGlobalRanking(kind)
                                        )
                                        : cache.publishedGlobalRanking(kind),
                                globalCelebrityRanking: (rankType) =>
                                    cache.globalCelebrityRanking(rankType),
                                dragonRanking: (ranges, allianceId) =>
                                    cache.dragonRanking(ranges, allianceId),
                                expeditionStage: (kingdomId) => cache.expeditionStage(kingdomId),
                                worldPowerEffects: (kingdomId) => worldEffects(kingdomId),
                                worldEffectBoard: currentMergeBoard,
                                hotItemBusinessMan: async () => {
                                    authority.assertReady();

                                    return hotBusinessMan.current()?.body;
                                },
                                worldTurretKills: (kingdomId, territory) =>
                                    cache.worldTurretKills(kingdomId, territory),
                                emperorVersion: (kingdomId) => cache.emperorVersion(kingdomId),
                                changeAccountCount: (deviceId) => cache.deviceChangeCount(deviceId),
                                lastSystemMail: (uid) => cache.lastSystemMail(uid),
                                systemMailPage: (uid, ids, count, time, inspect) =>
                                    cache.systemMailPage(uid, ids, count, time, inspect),
                                playerUpdateTimes: (kingdomId, uids) =>
                                    cache.playerUpdateTimes(kingdomId, uids),
                            },
                            observeAdapter(
                                new HeroEventService(db, rules, config, Date.now, {
                                    heroHistoryPublication: (keys, alliance) =>
                                        cache.heroHistoryPublication(keys, alliance),
                                    heroRankingPosition: (query) =>
                                        cache.heroRankingPosition(query),
                                }),
                                "realm.HeroEventService",
                            ),
                        ),
                        "realm.GameService",
                    ),
                ),
                "realm.GameController",
            ),
            world: observeAdapter(
                new WorldController(
                    observeAdapter(
                        new WorldService(db, config.mapSize, config.kingdomId, {
                            ...worldInterest,
                            rules,
                        }),
                        "realm.WorldService",
                    ),
                ),
                "realm.WorldController",
            ),
        };
    }),
);

export const RealmServerLive = Layer.effect(
    RealmServer,
    Effect.gen(function*()
    {
        const config = yield* RealmConfig;
        const dependencies = yield* RealmDependencies;
        const server = yield* listenServer(config, dependencies);

        return { ...server, paidGifts: dependencies.paidGifts };
    }),
);

export const RealmApplicationLive = RealmServerLive.pipe(Layer.provide(RealmDependenciesLive));

export const RealmLive = RealmApplicationLive.pipe(Layer.provide(RealmRulesLive));
