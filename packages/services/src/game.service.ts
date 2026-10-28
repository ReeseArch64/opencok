import type { PostboxCommands } from "@opencok/contracts/postbox-orchestration";
import type { AvatarCommands } from "@opencok/contracts/avatar-orchestration";
import { AvatarOrchestrationService } from "./avatar-orchestration";
import type { ReconnectResearchProjection } from "@opencok/contracts/reconnect";
import { planReconnectProgress, validateReconnectResult } from "./reconnect-progress.ts";
import type { CityBootstrapFactory, CityBootstrapRuntime } from "@opencok/contracts/city-bootstrap";
import { HeroEventService } from "@opencok/hero/services/hero-event";
import { checkGameProfile } from "./game-profile";
import { activityDirectory } from "@opencok/mappings/activity-directory";
import { generalRequest } from "@opencok/hero/mappings/generals";
import { activityDirectoryEntries } from "@opencok/rules/activity-directory";
import { worldFightBulletins } from "./world-bulletins";
import { worldScoutQuotation } from "./world-scout";
import { inspectWorldMarch } from "./world-march-inspection";
import { worldRecreationCommands } from "./world-recreation";
import { worldUseCommands } from "./world-use";
import { treasureMapCommands } from "./treasure-map";
import { cityDefenseCommands } from "./city-defense";
import { legacyIntegerOrder } from "@opencok/messages/legacy-object-order";
import { activityOperators } from "@opencok/rules/activity-operators";
import { activityOperatorsView } from "@opencok/mappings/activity-operators";

import { randomInt } from "node:crypto";
import { closedActivityPanels, catalogReward } from "@opencok/rules/local-activity-info";
import { closedActivities, catalogRewardView } from "@opencok/mappings/local-activity-info";
import { previewRewards } from "@opencok/rules/rewards";
import { worldMutationCommands } from "./world-march-runtime";
import { dragonProgressionCommands } from "./dragon-progression";
import { friendshipMineCommands } from "./friendship-mine";
import { noticeCommands } from "./chat-notice";
import { nativeChatCommands } from "./chat-native";
import { postboxCommands } from "./postbox";
import { chatSocialCommands } from "./chat-social";
import type { MilitaryProjection } from "@opencok/contracts/military-projection";
import { decodeFightRanking, decodePlayoffTeams } from "./battle-ranking.ts";
import { fightRanking, playoffRanking } from "@opencok/mappings/battle-ranking";
import { battleRankingOpen } from "@opencok/rules/battle-ranking";
import { militaryRanking } from "@opencok/mappings/military-ranking";
import { militaryRankingGroup } from "@opencok/rules/military-ranking";
import { flowerRanking, flowerRankingEntries } from "@opencok/mappings/flower-ranking";
import { flowerRankingRefresh } from "@opencok/rules/flower-ranking";
import type { DonationRankingKind } from "@opencok/contracts/community-ranking";
import {
    donationRanking,
    resourceDonationRanking,
    cemeteryRanking,
} from "@opencok/mappings/community-ranking";
import { rankingCalendar } from "@opencok/rules/community-ranking";
import {
    throneRanking,
    throneRankingBoard,
    throneRankingOpen,
} from "@opencok/mappings/throne-ranking";
import { versionAtLeast } from "@opencok/rules/availability";
import { reportAvatar } from "./avatar-report.ts";
import { systemMailProjection } from "./mail-system.ts";
import { javaDecimal } from "@opencok/rules/java-integer";
import { dragonRankingRanges } from "@opencok/rules/dragon-ranking";
import { dragonRanking } from "@opencok/mappings/dragon-ranking";
import { decodeDragonRanking } from "./dragon-ranking.ts";
import { favoriteInteger } from "@opencok/world/rules/world-favorites";
import { worldSearchName } from "@opencok/world/rules/world-search";
import { playerSearch } from "@opencok/mappings/player-search";
import {
    playerSearchQuery,
    playerSearchRemoteBudget,
    selectPlayerSearch,
    sharedSearchProfile,
} from "@opencok/rules/player-search";
import { MAX_FRAME } from "@opencok/messages/frame";
import { encode, extension } from "@opencok/messages/sfs";
import { realmChatSessionRequest, realmChatSessionResponse } from "./realm-chat-session.ts";
import { mailCategoryProjection } from "./mail-category.ts";
import { resolveMailPresentation } from "./mail-presentation.ts";
import { mailListProjection } from "./mail-list.ts";
import { mailContentsProjection } from "./mail-contents.ts";
import { mailConversationReadRequest } from "./mail-conversation-read.ts";
import { mailCategoryDeleteQuery, mailTypeDeleteQuery } from "@opencok/rules/mail-batch-delete";
import { planMailBatchInvitations } from "./mail-delete.ts";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import {
    mailContentsQuery,
    mailCategoryQuery,
    selectMailCategory,
    mailConversationSaveQuery,
} from "@opencok/rules/mail";
import { expeditionRanking } from "@opencok/mappings/expedition-ranking";
import { expeditionRankingLimit, selectExpeditionRanking } from "@opencok/rules/expedition-ranking";
import { decodeExpeditionRanking } from "./expedition-ranking.ts";
import { allianceCommands } from "@opencok/alliance/constants/commands";
import type { ServerConfig } from "@opencok/contracts/server";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import {
    sfs,
    Type,
    int as wireInt,
    str as wireString,
    type Fields,
    type Value,
} from "@opencok/messages/sfs";
import { guidePlayerSummary, playerSummary } from "@opencok/mappings/players";
import { resource } from "@opencok/economy/mappings/resources";
import { powerInfo } from "@opencok/mappings/power";
import { calculatePlayerPower } from "@opencok/rules/power";
import { powerContext, decodeWorldPowerEffects } from "./power.ts";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { serverFeature } from "@opencok/rules/power-context";
import { dragonAttackEffect } from "@opencok/rules/power-resolver";
import { worldPowerEffects } from "@opencok/rules/power-world";
import type { Rules } from "@opencok/rules/game";
import { GameError } from "@opencok/errors/game";
import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import {
    accountVerificationEnabled,
    accountVerificationRequired,
    type FeatureContext,
} from "@opencok/rules/features";
import {
    dataConfig,
    featureConfig,
    serverClock,
    settingConfig,
    loginConfigurationPreferences,
    loginSwitches,
} from "@opencok/mappings/bootstrap";
import { inventoryItem } from "@opencok/economy/mappings/inventory-item";

const playerRankingKinds = {
    "server.rank": "power",
    "kill.rank": "kills",
    "level.rank": "level",
    "building.rank": "building",
    "silver.contribute.rank": "contribution",
} as const;

type GameConfig =
    & Pick<
        ServerConfig,
        | "kingdomId"
        | "mailTranslationEnabled"
        | "crossSearchEnabled"
        | "chatInterval"
        | "feedMaxCount"
    >
    & { mapSize?: number; };

export interface Result
{
    body: Fields;
    pushes: { command: string; body: Fields; }[];
}

function missingMilitaryProjection(): never
{
    throw new GameError(errors.unsupported, "city_progression");
}

export class GameService
{
    private readonly bootstrap?: CityBootstrapRuntime;

    constructor(
        readonly db: GameStore,
        readonly rules: Rules,
        readonly config: GameConfig,
        readonly postbox: PostboxCommands,
        readonly now = Date.now,
        readonly services: GameServices = {},
        readonly heroes = new HeroEventService(db, rules, config, now, services),
        createBootstrap?: CityBootstrapFactory,
        readonly projectResearch: ReconnectResearchProjection = () => {
            throw new GameError(errors.unsupported, "reconnect");
        },
        readonly military: MilitaryProjection = {
            wounded: missingMilitaryProjection,
            fortification: missingMilitaryProjection,
            snapshot: missingMilitaryProjection,
        },
        readonly ranking = services.ranking,
        readonly worldQueries = services.worldQueries,
        readonly worldDetail = services.worldDetail,
        readonly avatars: AvatarCommands = new AvatarOrchestrationService(
            db,
            rules,
            config,
            now,
            services,
        ),
    )
    {
        this.bootstrap = createBootstrap?.({
            power: (uid) => this.power(uid, true),
            features: (profile) => featureConfig(this.rules, this.featureContext(profile)),
        });
    }

    private world()
    {
        if (!this.worldQueries)
        {
            throw new GameError(errors.unsupported);
        }

        return this.worldQueries;
    }

    private rankings()
    {
        if (!this.ranking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        return this.ranking;
    }

    private city(): CityBootstrapRuntime
    {
        if (!this.bootstrap)
        {
            throw new GameError(errors.unsupported, "city_progression");
        }

        return this.bootstrap;
    }

    async initial(uid: string): Promise<Fields>
    {
        return (await this.initialize(uid)).body;
    }

    async initialize(uid: string, correlation: Fields = {}, signal?: AbortSignal): Promise<Result>
    {
        return this.city().initialize(uid, correlation, signal);
    }

    async execute(uid: string, command: string, params: Fields): Promise<Result>
    {
        ({ command, params } = generalRequest(command, params));

        if ((allianceCommands as readonly string[]).includes(command))
        {
            if (!this.services.alliance)
            {
                throw new GameError(errors.unsupported);
            }

            return this.services.alliance(uid, command, params);
        }

        if (friendshipMineCommands.includes(command))
        {
            if (!this.services.friendshipMine)
            {
                throw new GameError(errors.unsupported);
            }

            return this.services.friendshipMine(uid, command, params);
        }

        if (noticeCommands.includes(command))
        {
            if (!this.services.notice)
            {
                throw new GameError(errors.unsupported);
            }

            return this.services.notice(uid, command, params);
        }

        if (postboxCommands.includes(command))
        {
            if (!this.services.postbox)
            {
                throw new GameError(errors.unsupported);
            }

            return this.services.postbox(uid, command, params);
        }

        if (command === "chat.get.new")
        {
            return { body: await this.chatNews(uid, params), pushes: [] };
        }

        if ([...chatSocialCommands, ...nativeChatCommands].includes(command))
        {
            if (!this.services.social)
            {
                throw new GameError(errors.unsupported);
            }

            return { body: await this.services.social(uid, command, params), pushes: [] };
        }

        if (command === "al.fight.bulletin")
        {
            if (!this.services.worldFightBulletins)
            {
                throw new GameError(errors.unsupported);
            }

            return this.worldQueryResult(
                command,
                params,
                await worldFightBulletins(
                    this.services.worldFightBulletins,
                    uid,
                    params,
                    this.config.kingdomId,
                    this.now(),
                ),
            );
        }

        if (command === "world.scout.detail")
        {
            if (!this.services.worldScout)
            {
                throw new GameError(errors.unsupported);
            }

            return this.worldQueryResult(
                command,
                params,
                await worldScoutQuotation(
                    this.services.worldScout,
                    uid,
                    params,
                    this.rules,
                    this.config.kingdomId,
                    this.config.mapSize ?? 1200,
                    this.now(),
                    this.services,
                ),
            );
        }

        if (command === "world.get.march")
        {
            if (!this.services.worldMarchInspection)
            {
                throw new GameError(errors.unsupported);
            }

            return this.worldQueryResult(
                command,
                params,
                await inspectWorldMarch(
                    this.services.worldMarchInspection,
                    uid,
                    params,
                    this.rules,
                    this.config.kingdomId,
                    this.now(),
                    this.services,
                ),
            );
        }

        if (command !== "activity.operators")
        {
            await this.services.reconcileAlliance?.(uid);
        }

        let body: Fields;
        let pushes: Result["pushes"] = [];

        if (
            worldMutationCommands.includes(command)
            || cityDefenseCommands.includes(command)
            || treasureMapCommands.includes(command)
            || worldUseCommands.includes(command)
            || worldRecreationCommands.includes(command)
        )
        {
            if (
                command === "world.tick"
                || command === "treasuremap.init"
                || !this.services.cityProgression
            )
            {
                throw new GameError(errors.unsupported);
            }

            const result = await this.services.cityProgression(uid, command, params);

            if (Object.keys(result.body).length === 0)
            {
                result.body.success = sfs.bool(true);
            }

            if (params._cok_)
            {
                result.body._cok_ = params._cok_;
            }

            if (params.cmdBaseTime)
            {
                result.body.cmdBaseTime = params.cmdBaseTime;
            }

            return result;
        }

        if (dragonProgressionCommands.includes(command))
        {
            if (
                command === "dragon.item"
                || command === "dragon.init"
                || command === "dragon.tick"
                || !this.services.cityProgression
            )
            {
                throw new GameError(errors.unsupported);
            }

            const result = await this.services.cityProgression(uid, command, params);

            if (Object.keys(result.body).length === 0)
            {
                result.body.success = sfs.bool(true);
            }

            if (params._cok_)
            {
                result.body._cok_ = params._cok_;
            }

            if (params.cmdBaseTime)
            {
                result.body.cmdBaseTime = params.cmdBaseTime;
            }

            return result;
        }

        switch (command)
        {
            case "activity.close.info":
                body = closedActivities(
                    closedActivityPanels(await this.profile(uid), this.rules, BigInt(this.now())),
                );
                break;
            case "resource.client.reward.get":
            {
                const profile = await this.profile(uid),
                    id = wireString(params, "rewardId"),
                    definition = catalogReward(this.rules, id);
                body = catalogRewardView(
                    id,
                    definition,
                    previewRewards(id, this.rules, this.featureContext(profile), randomInt),
                );
                break;
            }
            case "trade.info":
            case "trade.exchange":
            case "trade.cancel":
                if (!this.services.trade)
                {
                    throw new GameError(errors.unsupported);
                }

                ({ body, pushes } = await this.services.trade(uid, command, params));
                break;
            case "mall.info":
            case "mall.info.type":
            case "mall.data":
            case "shoppingMall.buy":
                if (!this.services.shop)
                {
                    throw new GameError(errors.unsupported);
                }

                ({ body, pushes } = await this.services.shop(uid, command, params));
                break;
            case "mail.reward":
            case "mail.reward.batch":
                if (!this.services.mailReward)
                {
                    throw new GameError(errors.unsupported);
                }

                ({ body, pushes } = await this.services.mailReward(uid, command, params));
                break;
            case "activity.operators":
            {
                if (!this.db.activityOperators)
                {
                    throw new GameError(errors.unsupported, "activity_operators");
                }

                const now = this.now(),
                    snapshot = await this.db.activityOperators(uid, now);

                if (snapshot.profile?.uid !== uid)
                {
                    throw new GameError(errors.unsupported, "activity_operators");
                }

                body = activityOperatorsView(
                    activityOperators(this.rules, snapshot, {
                        kingdomId: this.config.kingdomId,
                        version: "12.06.0",
                        now,
                    }),
                );
                break;
            }
            case "activity.accept.reward":
            case "egg.act.info":
            case "egg.act.open":
            case "egg.act.reward":
            case "egg.act.cd":
            case "egg.exp.reward":
            case "egg.goods.full":
            case "goldeggs.info":
            case "goldeggs.smashing":
            case "goldeggs.smashingall":
            case "goldeggs.flush":
            case "goldeggs.scorereward":
            case "goldeggs.rank":
            case "goldeggs.rankAll":
            case "comeback.info":
            case "comeback.reward":
            case "hot.item.v2.get":
            case "hot.item.refresh":
            case "hot.item.refreshV3":
            case "hot.item.v2.buy":
            case "hot.item.v3.buy":
            case "herodraw":
            case "robgeneral":
            case "general.fire":
            case "general.def.ch":
            case "general.pick":
            case "generaltrun":
            case "heroOffice":
            case "newgeneral":
            case "newgeneral.buy":
            case "fresh.signIn":
            case "daily.quest.ls":
            case "daily.quest.reward":
            case "equipment.create":
            case "equipment.buy":
            case "equipment.break":
            case "equip.putOn":
            case "equip.takeOff":
            case "equipment.strength":
            case "equip.reforge":
            case "suit.create":
            case "suit.equipment.create":
            case "suit.decompose":
            case "set.suit.decompose.effect":
            case "material.create":
            case "material.break":
            case "create.tool":
            case "queue.tool":
            case "rm.tool":
            case "tool.queue.buy":
            case "skill.save":
            case "skill.clear":
            case "skill.switch":
            case "skill":
            case "skill.use":
            case "skill.del":
            case "status.remove":
            case "show.status.item":
            case "collect.svip.switch":
            case "task.reward.get":
            case "quest.stage.rd":
            case "story.task.info":
            case "story.task.reward":
            case "daily.task.info":
            case "daily.task.reward":
            case "daily.task.box.reward":
            case "signIn.info":
            case "signIn.reward":
            case "army.add":
            case "army.cd":
            case "army.fire":
            case "hospital.cure":
            case "hospital.cd":
            case "hospital.fire":
            case "fort.build":
            case "fort.cd":
            case "fort.destory":
            case "fort.destroy":
            case "dragonskill":
            case "dragontower":
            case "minstrel":
            case "alchemist":
            case "Olympic.question.info":
            case "Olympic.bet.info":
            case "Olympic.bet":
            case "Olympic.reward":
            case "euro.cup.info":
            case "euro.cup.bet.info":
            case "euro.cup.record":
            case "euro.cup.bet":
            case "euro.cup.reward":
            case "groupbuys.info":
            case "special.ui.state":
            case "continuedcost.hideking":
            case "continuedcost.global.reward":
            case "continuedcost.info":
            case "continuedcost.reward":
            case "get.trouble.list":
            case "trouble.speed":
            case "trigger.activity":
            case "item.askFor":
            case "avatar.activate":
            case "user.pray":
            case "user.pray.info":
            case "recall.task.ui":
            case "recall.task.receive":
            case "region.recall.open.ui":
            case "region.recall.receive":
            case "heart.send":
            case "item.send":
            case "act.exchange":
            case "act.ex.reward":
            case "act.ex.flush":
            case "activity.exchange.info":
            case "activity.exchange.reward":
            case "vip.box.turntable.ui":
            case "vip.box.turntable.reward":
            case "target.task.ui":
            case "target.task.receive":
            case "target.task.item":
            case "redPackets.sd":
            case "redPackets.rv":
            case "redPackets.status":
            case "redPackets.rvd.id":
            case "pay.recharge.ui.state":
            case "new.sercum.ui":
            case "new.sercum.reward":
            case "get.table.value":
            case "sevenday.info":
            case "sevenday.look.reward":
            case "sevenday.reward":
            case "sevenday.lucky.draw":
            case "shipping.trade.invest.ui":
            case "shipping.trade.invest.reward":
            case "branchcity.open":
            case "invest.add":
            case "invest.open.ui":
            case "invest.receive":
            case "castle.ui.state":
            case "castle.level.reward":
            case "castle.share.reward":
            case "luckyday.effect":
            case "civilizationCastle":
            case "totem":
            case "exchequer.show":
            case "expedition.king.present":
            case "expedition.recieve.count":
            case "newexpidition.rankinfo":
            case "newexpidition.activityinfo":
            case "newexpidition.takepersonreward":
            case "newexpidition.takealliancereward":
            case "expedition.show":
            case "distribution.record.show":
            case "tax.record.show":
            case "arena.info":
            case "arena.apply":
            case "arena.army":
            case "show.arena.army":
            case "arena.enter":
            case "arena.leave":
            case "1year.info":
            case "third.anniversary":
            case "third.anniversary.reward":
            case "get.activity.value":
            case "lottery.start":
            case "lottery.buy":
            case "lottery.batch":
            case "lottery.b.use":
            case "lottery.cancel":
            case "civilization.science.data.init":
            case "race.science.research":
            case "race.science.directly":
            case "science.data.init":
            case "science.research":
            case "science.directly":
            case "build.create":
            case "build.upgrade":
            case "build.destroy":
            case "build.move":
            case "buildingUnlock":
            case "miracle.unlock":
            case "buildingUnlock.info":
            case "buildingUnlock.glory":
            case "building.reward":
                if (!this.services.cityProgression)
                {
                    throw new GameError(errors.unsupported);
                }

                ({ body, pushes } = await this.services.cityProgression(uid, command, params));
                break;
            case "equip.q.finish":
            case "havest.tool":
            case "army.complete":
            case "hospital.cure.done":
            case "hospital.cancel":
            case "fort.build.done":
            case "fort.cancel":
            case "race.science.upgrade":
            case "science.upgrade":
            case "queue.finish":
            case "queue.cancel":
            case "queue.ccd":
            case "queue.open":
            case "queue.rent":
                if (!this.services.timed)
                {
                    throw new GameError(errors.unsupported);
                }

                ({ body, pushes } = await this.services.timed(uid, command, params));
                break;
            case "build.collect":
            case "building.addOutPut":
                if (!this.services.production)
                {
                    throw new GameError(errors.unsupported);
                }

                ({ body, pushes } = await this.services.production(uid, command, params));
                break;
            case "item.buy":
            case "item.use":
            case "item.buyUse":
            case "item.compose":
            case "item.compose2":
            case "item.compose.suitequipment.store":
                if (!this.services.inventory)
                {
                    throw new GameError(errors.unsupported);
                }

                ({ body, pushes } = await this.services.inventory(uid, command, params));
                break;
            case "user.lv":
            {
                if (!this.services.reconnect)
                {
                    throw new GameError(errors.unsupported, "reconnect");
                }

                const now = this.now();
                const context = {
                    kingdomId: this.config.kingdomId,
                    version: MOBILE_CLIENT_VERSION,
                    now,
                };
                ({ body, pushes } = await this.services.reconnect(uid, now, async (state) => {
                    const planned = await planReconnectProgress(
                        state,
                        this.rules,
                        context,
                        this.services,
                        {
                            specialServer: serverFeature(this.rules, "araf_mode", context),
                            cn1: null,
                            research: this.projectResearch,
                            military: this.military,
                        },
                    );

                    if (params._cok_)
                    {
                        planned.result.body._cok_ = params._cok_;
                    }

                    if (params.cmdBaseTime)
                    {
                        planned.result.body.cmdBaseTime = params.cmdBaseTime;
                    }

                    validateReconnectResult(planned.result, command);

                    return planned;
                }));
                break;
            }
            case "celebrity.desc.get":
            case "celebrity.desc.save":
                if (!this.services.celebrityDescription)
                {
                    throw new GameError(errors.unsupported);
                }

                body = command === "celebrity.desc.get"
                    ? await this.services.celebrityDescription.read(uid, params, this.now())
                    : await this.services.celebrityDescription.save(uid, params, this.now());
                break;
            case "user.modify.nickName":
            case "user.check.nickName":
                if (!this.services.nickname)
                {
                    throw new GameError(errors.unsupported);
                }

                body = command === "user.modify.nickName"
                    ? await this.services.nickname.change(uid, params)
                    : await this.services.nickname.check(uid, params);
                break;
            case "equip.show":
            case "medal.show":
            case "march.soldier.show":
            case "colorblind.set":
            case "equip.scroll":
            case "banner.set":
            case "speed.cd.open":
                if (!this.services.profilePreference)
                {
                    throw new GameError(errors.unsupported);
                }

                body = await this.services.profilePreference(uid, command, params, this.now());
                break;
            case "pushSetting.get":
            case "parse.push.set":
                if (!this.services.playerPreferences)
                {
                    throw new GameError(errors.unsupported);
                }

                body = await this.services.playerPreferences.command(uid, command, params);
                break;
            case "world.get.detail":
                if (!this.services.worldPointDetail || !this.worldDetail)
                {
                    throw new GameError(errors.unsupported);
                }

                body = await this.worldDetail.read(uid, params, this.now(), this.now);
                break;
            case "search.player":
                body = await this.playerSearch(uid, params);
                break;
            case "point.nearest.find":
            case "world.al.leader.pt":
            case "world.leave":
                body = await this.world().utility(uid, command, params);
                break;
            case "world.search.user":
                body = await this.world().search(uid, params);
                break;
            case "world.favo.get":
            case "world.favo.add":
            case "world.favo.delme":
                body = await this.world().favorites(uid, command, params);
                break;
            case "report.picVer":
                body = await reportAvatar(this.db, uid, this.config.kingdomId, params, this.now());
                break;
            case "user.update.picVer":
                body = await this.avatars.avatarVersion(uid);
                break;
            case "user.avatar.finish":
                ({ body, pushes } = await this.avatars.avatarFinish(uid, params));
                break;
            case "user.avatar.url":
                body = await this.avatars.avatarUrl(uid, params);
                break;
            case "user.avatar.grant":
                body = await this.avatars.avatarGrant(uid, params);
                break;
            case "chat.session.create":
                body = await this.chatSession(uid);
                break;
            case "cmd.ping":
                body = { serverNowTime: sfs.long(this.now()) };
                break;
            case "login.dataconfig":
                body = dataConfig(this.rules, {
                    profileLevel: num(await this.profile(uid), "level"),
                    now: this.now(),
                    chatInterval: this.config.chatInterval,
                    feedMaxCount: this.config.feedMaxCount,
                });
                break;
            case "setting.xml":
                body = settingConfig(this.rules);
                break;
            case "login.other":
                body = await this.otherLogin(uid, params);
                break;
            case "build.info":
                body = this.city().info(await this.city().state(uid));
                break;
            case "get.user.info.multi":
                await this.profile(uid);
                body = await this.playerSummaries(params);
                break;
            case "get.user.info":
                body = await this.publicProfile(uid, params);
                break;
            case "get.power.info":
                body = await this.power(uid);
                break;
            case "mail.category.status":
                body = await this.postbox.mailStatus(uid, params);
                break;
            case "mail.read.status":
            case "mail.read.status.betch":
                body = await this.postbox.mailRead(
                    uid,
                    command === "mail.read.status.betch",
                    params,
                );
                break;
            case "mread.batch":
            case "mread.chat":
                body = await this.postbox.mailBatch(uid, params, command);
                break;
            case "mread.batch.category":
                body = await this.mailCategory(uid, params);
                break;
            case "mail.read":
                body = await this.mailContents(uid, params);
                break;
            case "mail.delete":
                body = await this.postbox.mailDelete(uid, params);
                break;
            case "chat.get.system.mails":
                body = await this.postbox.mailSystem(uid, params, true);
                break;
            case "chat.get.system.mails.v2":
                body = await this.postbox.mailSystem(uid, params);
                break;
            case "chat.get.update.mails":
                body = await this.postbox.mailUpdates(uid, params);
                break;
            case "chatMail.save":
                body = await this.mailConversationSave(uid, params);
                break;
            case "chatMail.read":
                body = await this.mailConversationRead(uid, params);
                break;
            case "mail.delete.batch":
                body = await this.mailCategoryDelete(uid, params);
                break;
            case "chatMail.delete.batch":
                body = await this.mailConversationDelete(uid, params, true);
                break;
            case "chatMail.delete":
                body = await this.mailTypeDelete(uid, params);
                break;
            case "mail.save":
            case "mail.cancel.save":
            case "mail.save.batch":
                body = await this.postbox.mailSave(
                    uid,
                    command === "mail.save"
                        ? "save"
                        : command === "mail.cancel.save"
                        ? "cancel"
                        : "batch",
                    params,
                );
                break;
            case "expedition.rank":
                body = await this.expeditionRanking(uid);
                break;
            case "alliance.rank":
            case "kill.al.rank":
                body = await this.rankings().allianceRanking(
                    uid,
                    command === "alliance.rank" ? "power" : "kills",
                );
                break;
            case "act.score.rank":
                body = await this.scoreActivityRanking(uid);
                break;
            case "dragon.battle.rank":
                body = await this.dragonRanking(uid, params);
                break;
            case "al.donate.rank.all":
            case "al.donate.rank.today":
            case "al.donate.rank.week":
            case "al.donate.res.rank.day":
            case "al.donate.res.rank.week":
            case "al.donate.res.rank.history":
                body = await this.donationRanking(uid, command);
                break;
            case "cemetery.get.ranking":
                body = await this.cemeteryRanking(uid, params);
                break;
            case "flower.ranking":
                body = await this.flowerRanking(uid);
                break;
            case "military.ranking":
                body = await this.militaryRanking(uid, params);
                break;
            case "ctf.get.rank":
                body = await this.throneRanking(uid, params);
                break;
            case "dragon.battle.fight.rank":
            case "dragon.playoff.rank.info":
                body = await this.battleRanking(uid, command);
                break;
            case "act.ls":
                body = await this.activityDirectory(uid);
                break;
            case "hero.event.info.get":
            case "hero.event.ranking.get":
            case "hero.cross.info":
                body = await this.heroes.heroEventDetails(uid, command, params);
                break;
            case "hero.event.ranking.his.get":
                body = await this.heroes.heroHistory(uid, params);
                break;
            case "hero.al.inside.ranking":
                body = await this.heroes.heroInsideRanking(uid, params);
                break;
            case "hero.self.rank":
                body = await this.heroes.heroSelfRanking(uid, params);
                break;
            case "attributeRank.info":
                body = await this.rankings().attributeRanking(uid, params);
                break;
            case "paytotal.ranking":
            case "continuedcost.ranking":
                body = await this.rankings().publishedRanking(
                    uid,
                    command === "paytotal.ranking" ? "payment" : "consumption",
                );
                break;
            case "global.celebrities.rank":
                body = await this.globalCelebrityRanking(uid, params);
                break;
            case "server.rank":
            case "kill.rank":
            case "level.rank":
            case "building.rank":
            case "silver.contribute.rank":
                body = await this.rankings().ranking(uid, playerRankingKinds[command]);
                break;
            default:
                throw new GameError(errors.unsupported);
        }

        if (Object.keys(body).length === 0 && command !== "world.get.detail")
        {
            body.success = sfs.bool(true);
        }

        if (params._cok_)
        {
            body._cok_ = params._cok_;
        }

        if (params.cmdBaseTime)
        {
            body.cmdBaseTime = params.cmdBaseTime;
        }

        if (
            command.startsWith("world.favo.") && encode(extension(command, body)).length > MAX_FRAME
        )
        {
            throw new GameError(errors.unsupported, "world_favorite_size");
        }

        if (command === "world.search.user" && encode(extension(command, body)).length > MAX_FRAME)
        {
            throw new GameError(errors.unsupported, "world_search_size");
        }

        if (command === "search.player" && encode(extension(command, body)).length > MAX_FRAME)
        {
            throw new GameError(errors.unsupported, "player_search");
        }

        if (command === "world.get.detail" && encode(extension(command, body)).length > MAX_FRAME)
        {
            throw new GameError(errors.unsupported, "world_point_detail");
        }

        if (
            [
                "al.donate.rank.all",
                "al.donate.rank.today",
                "al.donate.rank.week",
                "al.donate.res.rank.day",
                "al.donate.res.rank.week",
                "al.donate.res.rank.history",
                "cemetery.get.ranking",
                "flower.ranking",
                "military.ranking",
                "ctf.get.rank",
                "hero.event.info.get",
                "hero.event.ranking.get",
                "hero.cross.info",
                "hero.self.rank",
                "hero.al.inside.ranking",
                "hero.event.ranking.his.get",
                "dragon.battle.fight.rank",
                "dragon.playoff.rank.info",
                "act.score.rank",
                "global.celebrities.rank",
                "dragon.battle.rank",
                "attributeRank.info",
                "paytotal.ranking",
                "continuedcost.ranking",
            ].includes(command)
            && encode(extension(command, body)).length > MAX_FRAME
        )
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        return { body, pushes };
    }

    private async playerSearch(uid: string, params: Fields): Promise<Fields>
    {
        const store = this.services.playerSearch;

        if (!store)
        {
            throw new GameError(errors.unsupported);
        }

        if (
            params.key?.type !== Type.String
            || !worldSearchName(params.key.value)
            || params.page?.type !== Type.Int
            || !favoriteInteger(params.page.value)
        )
        {
            throw new GameError(errors.invalid);
        }

        const query = playerSearchQuery(
            params.key.value,
            params.page.value,
            this.config.crossSearchEnabled ?? true,
            this.config.kingdomId,
            this.rules,
        );
        const now = this.now();

        if (!Number.isSafeInteger(now) || now < 0)
        {
            throw new GameError(errors.invalid);
        }

        const state = await store.search(
            uid,
            query,
            now,
            (rows) => playerSearchRemoteBudget(query, rows),
        );
        const profile = this.checkProfile(state.profile, now);

        if (profile.uid !== uid || profile.serverId !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const remote = state.remote.map((entry) => ({
            ...entry,
            data: entry.data.uid == null
                ? entry.data
                : sharedSearchProfile(entry.data, this.rules, now),
        }));

        return playerSearch(selectPlayerSearch(query, state.local, remote));
    }

    private async chatSession(uid: string): Promise<Fields>
    {
        if (!this.services.chatSession)
        {
            throw new GameError(errors.unsupported);
        }

        const now = this.now();
        const profile = this.checkProfile(await this.db.getProfileById(uid), now);
        const request = realmChatSessionRequest(profile, uid, this.config.kingdomId);

        try
        {
            return realmChatSessionResponse(await this.services.chatSession(request), this.now());
        }
        catch
        {
            throw new GameError(errors.invalid);
        }
    }

    private async profile(uid: string): Promise<Row>
    {
        return this.checkProfile(await this.db.getProfileById(uid));
    }

    private async chatNews(uid: string, params: Fields): Promise<Fields>
    {
        if (!this.services.social)
        {
            throw new GameError(errors.unsupported);
        }

        let rooms: unknown;

        try
        {
            rooms = JSON.parse(wireString(params, "params"));
        }
        catch
        {
            throw new GameError(errors.invalid);
        }

        if (!Array.isArray(rooms) || rooms.length > 16)
        {
            throw new GameError(errors.invalid);
        }

        const results: Value[] = [];

        for (const room of rooms)
        {
            if (
                !room
                || typeof room !== "object"
                || Array.isArray(room)
                || !Number.isInteger(room.type)
                || typeof room.id !== "string"
                || typeof room.seqid !== "string"
            )
            {
                throw new GameError(errors.invalid);
            }

            if (room.type !== 4 && room.type !== 2)
            {
                const response = await this.services.social(uid, "chat.get.new", {
                    params: sfs.string(JSON.stringify([room])),
                });
                const values = response.rooms?.value;

                if (!Array.isArray(values) || values.length !== 1)
                {
                    throw new GameError(errors.invalid);
                }

                results.push((values as Value[])[0]!);
                continue;
            }

            if (!this.db.getSystemMailByPlayerId)
            {
                throw new GameError(errors.unsupported);
            }

            const now = this.now();
            const anchor = ["-1", "0", ""].includes(room.seqid) ? null : room.seqid;
            let body: Fields | undefined;
            const state = await this.db.getSystemMailByPlayerId(
                uid,
                { anchor, time: 0n, now },
                async (entries, readers) => {
                    if (room.type === 4)
                    {
                        body = await systemMailProjection(uid, entries, readers, 100, 0n, {});
                    }
                    else
                    {
                        const privateTypes = new Set([
                            20,
                            21,
                            22,
                            23,
                            24,
                            37,
                            38,
                            39,
                            40,
                            43,
                            44,
                            45,
                            46,
                        ]);
                        const shield = await this.services.social!(uid, "chat.shield.list", {});
                        const blocks = new Set(
                            ((shield.list?.value ?? []) as Value[]).map((value) =>
                                wireString((value.value ?? {}) as Fields, "other")
                            ),
                        );
                        const selected = entries
                            .filter(
                                (entry) =>
                                    privateTypes.has(entry.type)
                                    && (!entry.fromUser || !blocks.has(entry.fromUser)),
                            )
                            .slice(0, 100);
                        const presentation = await resolveMailPresentation(
                            selected,
                            readers,
                            true,
                            this.config.mailTranslationEnabled ?? true,
                            async () => "",
                        );
                        const projection = mailListProjection(
                            uid,
                            selected,
                            presentation,
                            "conversation",
                            "chat.get.new",
                        );
                        const response = await this.services.social!(uid, "chat.get.new", {
                            params: sfs.string(JSON.stringify([{ ...room, id: "" }])),
                        });
                        const remoteRooms = response.rooms?.value as Value[];
                        const remote = remoteRooms?.[0]?.value as Fields | undefined;
                        const copies = (remote?.msg?.value ?? []) as Value[];
                        body = {
                            msg: sfs.array([
                                ...((projection.body.result?.value ?? []) as Value[]),
                                ...copies,
                            ]),
                        };
                    }
                },
            );
            const profile = this.checkProfile(state.profile, now);

            if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
            {
                throw new GameError(errors.invalid);
            }

            results.push(
                sfs.object({
                    ...body,
                    id: sfs.string(room.id),
                    type: sfs.int(room.type),
                    firstSeqId: sfs.string("-1"),
                    lastSeqId: sfs.string("-1"),
                }),
            );
        }

        return { rooms: sfs.array(results) };
    }

    private async mailCategory(uid: string, params: Fields): Promise<Fields>
    {
        const query = mailCategoryQuery(
            wireInt(params, "category"),
            wireInt(params, "num"),
            wireInt(params, "offset"),
            this.now(),
        );

        if (params.fromUser !== undefined && typeof wireString(params, "fromUser") !== "string")
        {
            throw new GameError(errors.invalid);
        }

        const envelope: Fields = {};

        for (const key of ["_cok_", "cmdBaseTime"])
        {
            if (params[key] !== undefined)
            {
                envelope[key] = params[key]!;
            }
        }

        let body: Fields | undefined;
        const state = await this.db.mailCategory(uid, query, async (window, readers) => {
            const entries = selectMailCategory(query, window);
            const presentation = await resolveMailPresentation(
                entries,
                readers,
                query.category === 4 || query.category === 7,
                this.config.mailTranslationEnabled ?? true,
                async () =>
                    (await this.services.playerUpdateTimes?.(this.config.kingdomId, [uid]))?.get(
                        uid,
                    ) ?? "",
            );
            const projection = mailCategoryProjection(uid, query, window, presentation, envelope);
            body = projection.body;

            return projection.invalidIds;
        });
        const profile = this.checkProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
        {
            throw new GameError(errors.invalid);
        }

        return body;
    }

    private async mailContents(uid: string, params: Fields): Promise<Fields>
    {
        const ids = wireString(params, "uid");

        if (typeof wireString(params, "type") !== "string")
        {
            throw new GameError(errors.invalid);
        }

        const query = mailContentsQuery(ids, this.now());
        let body: Fields | undefined;
        const envelope: Fields = {};

        for (const key of ["_cok_", "cmdBaseTime"])
        {
            if (params[key] !== undefined)
            {
                envelope[key] = params[key]!;
            }
        }

        const state = await this.db.mailContents(uid, query, (entries) => {
            const projection = mailContentsProjection(entries, envelope);
            body = projection.body;

            return projection.invalidIds;
        });
        const profile = this.checkProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
        {
            throw new GameError(errors.invalid);
        }

        return body;
    }

    private async mailConversationSave(uid: string, params: Fields): Promise<Fields>
    {
        const sender = params.fromUser !== undefined;
        const type = params.type !== undefined;

        if (
            sender
                ? typeof params.fromUser!.value !== "string"
                : type && typeof params.type!.value !== "number"
        )
        {
            throw new GameError(errors.invalid);
        }

        const query = mailConversationSaveQuery(
            {
                mod: wireInt(params, "mod", 0),
                ...(sender
                    ? { fromUser: wireString(params, "fromUser") }
                    : type
                    ? { type: wireInt(params, "type") }
                    : {}),
                ...(sender || type ? { flag: wireInt(params, "flag") } : {}),
            },
            this.now(),
        );
        const state = await this.db.mailConversationSave(uid, query);
        const profile = this.checkProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        return {};
    }

    private async mailConversationRead(uid: string, params: Fields): Promise<Fields>
    {
        const query = mailConversationReadRequest(params, this.now());

        if (
            !this.db.mailConversationRead
            || (query.effects.some((effect) => effect.kind === "chat")
                && !this.services.mailChatEnabled)
        )
        {
            throw new GameError(errors.unsupported, "mail");
        }

        const body: Fields = { success: sfs.bool(true) };

        for (const key of ["_cok_", "cmdBaseTime"])
        {
            if (params[key] !== undefined)
            {
                body[key] = params[key]!;
            }
        }

        if (encode(extension("chatMail.read", body)).length > MAX_FRAME)
        {
            throw new GameError(errors.unsupported, "mail");
        }

        const state = await this.db.mailConversationRead(uid, query);
        const profile = this.checkProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        return body;
    }

    private async mailCategoryDelete(uid: string, params: Fields): Promise<Fields>
    {
        const read = (key: string) =>
            params[key] === undefined || params[key]!.type === Type.Null
                ? null
                : wireString(params, key);
        const query = mailCategoryDeleteQuery(read("uids"), read("types"), this.now());

        if (!this.db.mailCategoryDelete)
        {
            throw new GameError(errors.unsupported, "mail");
        }

        let body: Fields | undefined;
        const state = await this.db.mailCategoryDelete(
            uid,
            query,
            (counts) => {
                const result: Fields = Object.create(null);

                for (const entry of counts)
                {
                    result[entry.raw] = sfs.int(entry.unread);
                    result[`total${entry.raw}`] = sfs.int(entry.total);
                }

                body = { RetObj: sfs.object(result) };

                for (const key of ["_cok_", "cmdBaseTime"])
                {
                    if (params[key] !== undefined)
                    {
                        body[key] = params[key]!;
                    }
                }

                if (encode(extension("mail.delete.batch", body)).length > MAX_FRAME)
                {
                    throw new GameError(errors.unsupported, "mail");
                }
            },
            (entries) => planMailBatchInvitations(uid, entries),
            !!this.services.mailChatEnabled,
        );
        const profile = this.checkProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
        {
            throw new GameError(errors.invalid);
        }

        return body;
    }

    private async mailConversationDelete(
        uid: string,
        params: Fields,
        batch: boolean,
    ): Promise<Fields>
    {
        if (!this.services.mailChatEnabled || !this.db.mailConversationDelete)
        {
            throw new GameError(errors.unsupported, "mail");
        }

        const mod = wireInt(params, "mod", 0);
        const bottle = batch && wireInt(params, "driftingBottle", 0) === 1;
        let senders: (string | null)[];

        if (batch)
        {
            const raw = wireString(params, "users");
            senders = raw.split(",");

            if (raw !== "")
            {
                while (senders.at(-1) === "")
                {
                    senders.pop();
                }
            }
        }
        else
        {
            senders = [params.fromUser?.type === Type.Null ? null : wireString(params, "fromUser")];
        }

        if (
            senders.length > 1000
            || senders.some(
                (sender) =>
                    sender !== null
                    && (sender.length > 40 || sender.includes("\0") || !sender.isWellFormed()),
            )
        )
        {
            throw new GameError(errors.invalid, "mail");
        }

        const body: Fields = { success: sfs.bool(true) };

        for (const key of ["_cok_", "cmdBaseTime"])
        {
            if (params[key] !== undefined)
            {
                body[key] = params[key]!;
            }
        }

        if (
            encode(extension(batch ? "chatMail.delete.batch" : "chatMail.delete", body)).length
                > MAX_FRAME
        )
        {
            throw new GameError(errors.unsupported, "mail");
        }

        const now = this.now();
        const state = await this.db.mailConversationDelete(uid, {
            now,
            senders,
            moderation: mod === 1,
            bottle,
        });
        const profile = this.checkProfile(state.profile, now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        return body;
    }

    private async mailTypeDelete(uid: string, params: Fields): Promise<Fields>
    {
        wireInt(params, "mod", 0);

        if (params.fromUser !== undefined)
        {
            return this.mailConversationDelete(uid, params, false);
        }

        const query = mailTypeDeleteQuery(
            params.type === undefined ? undefined : wireInt(params, "type"),
            this.now(),
        );

        if (!this.db.mailTypeDelete)
        {
            throw new GameError(errors.unsupported, "mail");
        }

        const body: Fields = { success: sfs.bool(true) };

        for (const key of ["_cok_", "cmdBaseTime"])
        {
            if (params[key] !== undefined)
            {
                body[key] = params[key]!;
            }
        }

        if (encode(extension("chatMail.delete", body)).length > MAX_FRAME)
        {
            throw new GameError(errors.unsupported, "mail");
        }

        const state = await this.db.mailTypeDelete(uid, query);
        const profile = this.checkProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        return body;
    }

    private async militaryRanking(uid: string, params: Fields): Promise<Fields>
    {
        const now = this.now();
        const profile = this.checkProfile(await this.db.getProfileById(uid), now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        if (
            !serverFeature(this.rules, "wr_switch", {
                kingdomId: this.config.kingdomId,
                now,
                version: MOBILE_CLIENT_VERSION,
            })
        )
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const type = wireInt(params, "type");

        if (![0, 1].includes(type))
        {
            throw new GameError(errors.invalid);
        }

        if (!this.services.militaryRanking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const group = militaryRankingGroup(this.rules, this.config.kingdomId);

        return militaryRanking(
            await this.services.militaryRanking(type, group),
            uid,
            this.config.kingdomId,
            type,
        );
    }

    private async flowerRanking(uid: string): Promise<Fields>
    {
        const now = this.now();
        const current = this.checkProfile(await this.db.getProfileById(uid), now);

        if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        if (
            !this.db.crossRankingRealm
            || !this.db.flowerRanking
            || !this.services.flowerRankingPublication
        )
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const cross = await this.db.crossRankingRealm();
        const realm = cross ? Number(current.crossFightSrcServerId) : this.config.kingdomId;

        if (!Number.isInteger(realm) || realm < 1)
        {
            throw new GameError(errors.invalid);
        }

        const limit = Number(this.rules.items.get("ranking")?.k2);

        if (!Number.isInteger(limit) || limit < 1 || limit > 32767)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const feature = this.rules.features.get("flowers_all_sev");
        const global = serverFeature(this.rules, "flowers_all_sev", {
            kingdomId: this.config.kingdomId,
            now,
            version: MOBILE_CLIENT_VERSION,
        }) && versionAtLeast(MOBILE_CLIENT_VERSION, feature!.version!);
        const publication = await this.services.flowerRankingPublication(realm, uid, limit, global);
        const state = await this.db.flowerRanking(
            uid,
            realm,
            flowerRankingEntries(publication.local).map((row) => row.uid),
        );
        const profile = this.checkProfile(state.profile, now);

        if (profile.uid !== uid || num(profile, "serverId") !== realm)
        {
            throw new GameError(errors.invalid);
        }

        if (global && cross)
        {
            const own = await this.db.flowerRanking(uid, this.config.kingdomId, []);
            const ownProfile = this.checkProfile(own.profile, now);

            if (ownProfile.uid !== uid || num(ownProfile, "serverId") !== this.config.kingdomId)
            {
                throw new GameError(errors.invalid);
            }

            state.hide = own.hide;
        }

        return flowerRanking(
            publication,
            state,
            uid,
            flowerRankingRefresh(now, state.time, Number(this.rules.items.get("flowers")?.k5)),
            global,
        );
    }

    private async donationRanking(uid: string, command: string): Promise<Fields>
    {
        const now = this.now();
        const resource = command.startsWith("al.donate.res.");
        const current = this.checkProfile(await this.db.getProfileById(uid), now);

        if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        if (resource)
        {
            if (!this.db.crossRankingRealm)
            {
                throw new GameError(errors.unsupported, "ranking");
            }

            if (await this.db.crossRankingRealm())
            {
                return {};
            }
        }

        if (!this.db.donationRanking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const snapshot = await this.db.donationRanking(uid, now);
        const profile = this.checkProfile(snapshot.profile, now);

        if (
            profile.uid !== uid
            || num(profile, "serverId") !== this.config.kingdomId
            || !text(profile, "allianceId").trim()
        )
        {
            throw new GameError(errors.invalid);
        }

        const suffix = command.split(".").at(-1)!;
        const kind = (resource ? `resource-${suffix}` : suffix) as DonationRankingKind;

        if (!resource)
        {
            return donationRanking(snapshot, kind, now);
        }

        if (!this.services.donationScores)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const date = rankingCalendar(now);
        const scores = await this.services.donationScores(
            text(profile, "allianceId"),
            kind as "resource-day" | "resource-week" | "resource-history",
            kind === "resource-day" ? date.dayKey : date.weekKey,
        );

        return resourceDonationRanking(snapshot, scores, kind === "resource-week", now);
    }

    private async cemeteryRanking(uid: string, params: Fields): Promise<Fields>
    {
        const now = this.now();
        const profile = this.checkProfile(await this.db.getProfileById(uid), now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const type = wireString(params, "type");

        if (type !== "0" && type !== "1")
        {
            throw new GameError(errors.invalid);
        }

        if (!this.db.cemeteryRanking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const snapshot = await this.db.cemeteryRanking(uid, type, now);
        const owner = this.checkProfile(snapshot.profile, now);

        if (owner.uid !== uid || num(owner, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        return cemeteryRanking(snapshot, uid);
    }

    private async throneRanking(uid: string, params: Fields): Promise<Fields>
    {
        const now = this.now();
        const profile = this.checkProfile(await this.db.getProfileById(uid), now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const own = this.config.kingdomId;
        const peer = own % 2 === 0 ? own - 1 : own + 1;
        const enabled = (realm: number) =>
            serverFeature(this.rules, "wk_switch", {
                kingdomId: realm,
                version: MOBILE_CLIENT_VERSION,
                now,
            });
        const target = enabled(own) && enabled(peer) ? peer : -1;
        const selected = params.serverId === undefined ? undefined : wireInt(params, "serverId");

        if (selected !== undefined && selected <= 0)
        {
            throw new GameError(errors.invalid);
        }

        if (selected !== undefined && selected !== own && selected !== target)
        {
            return throneRanking([]);
        }

        if (!this.services.throneRankingPeriod || !this.db.throneRanking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const boards: Fields[] = [];

        for (const realm of [own, ...(target > 0 ? [target] : [])])
        {
            if (selected !== undefined && selected !== realm)
            {
                continue;
            }

            const period = await this.services.throneRankingPeriod(realm);

            if (realm !== own && !period)
            {
                continue;
            }

            if (period && !throneRankingOpen(period))
            {
                continue;
            }

            const snapshot = await this.db.throneRanking(realm, period);
            const board = throneRankingBoard(snapshot, realm, realm === own ? uid : "");

            if (board)
            {
                boards.push(board);
            }
        }

        return throneRanking(boards);
    }

    private async battleRanking(uid: string, command: string): Promise<Fields>
    {
        const now = this.now();

        if (!this.db.battleRankingState)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const state = await this.db.battleRankingState(uid, now);
        const profile = this.checkProfile(state.profile, now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const playoff = command === "dragon.playoff.rank.info" || [7, 8].includes(state.realmType);

        if (
            (playoff || [3, 5].includes(state.realmType))
            && !battleRankingOpen(
                this.rules,
                state,
                this.config.kingdomId,
                now,
                playoff,
                MOBILE_CLIENT_VERSION,
            )
        )
        {
            throw new GameError(errors.battleClosed, "ranking");
        }

        if (command === "dragon.playoff.rank.info")
        {
            if (!this.services.playoffPublication)
            {
                throw new GameError(errors.unsupported, "ranking");
            }

            const publication = await this.services.playoffPublication();
            const teams = decodePlayoffTeams(publication.teams);
            const weekday = Number(javaDecimal(this.rules.items.get("wap_info")?.k9 ?? "", 32));

            return playoffRanking(
                publication,
                teams,
                text(profile, "allianceId"),
                state.tickets,
                now,
                weekday,
            );
        }

        if (![3, 5, 7, 8, 13, 14].includes(state.realmType))
        {
            return fightRanking();
        }

        const teamId = state.observerTeam ?? text(profile, "allianceId");

        if (!teamId)
        {
            throw new GameError(errors.invalid);
        }

        if (!this.services.battleFightPublication)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        return fightRanking(
            decodeFightRanking(await this.services.battleFightPublication(), teamId),
        );
    }

    private async activityDirectory(uid: string): Promise<Fields>
    {
        const now = this.now();

        if (!this.db.activityDirectory)
        {
            throw new GameError(errors.unsupported, "activity_directory");
        }

        const state = await this.db.activityDirectory(uid),
            profile = this.checkProfile(state.profile, now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const body = activityDirectory(
            activityDirectoryEntries(state.activities, now, legacyIntegerOrder),
        );

        if (encode(extension("act.ls", body)).length > MAX_FRAME)
        {
            throw new GameError(errors.unsupported, "activity_directory");
        }

        return body;
    }

    private async dragonRanking(uid: string, params: Fields): Promise<Fields>
    {
        const profile = this.checkProfile(await this.db.getProfileById(uid), this.now());

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const ranges = dragonRankingRanges(wireString(params, "index_limit"));

        if (ranges === undefined)
        {
            return {};
        }

        if (!this.services.dragonRanking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const entries = await this.services.dragonRanking(ranges, text(profile, "allianceId"));

        return dragonRanking(decodeDragonRanking(entries));
    }

    private async globalCelebrityRanking(uid: string, params: Fields): Promise<Fields>
    {
        if (this.config.kingdomId > 999999)
        {
            return {};
        }

        if (!this.db.normalRankingRealm)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        if (!(await this.db.normalRankingRealm()))
        {
            return {};
        }

        const rankType = wireInt(params, "rankType");

        if (!Number.isInteger(rankType) || rankType < -2147483648 || rankType > 2147483647)
        {
            throw new GameError(errors.invalid);
        }

        const profile = this.checkProfile(await this.db.getProfileById(uid), this.now());

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        if (![0, 1, 2, 3, 4, 5, 6, 11].includes(rankType))
        {
            return {};
        }

        if (!this.services.globalCelebrityRanking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const rows = await this.services.globalCelebrityRanking(rankType);

        if (!Array.isArray(rows) || rows.length > (rankType === 4 ? 30 : 151))
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        return { rankMap: sfs.array(rows.map((row) => sfs.object(decodeLegacyJsonObject(row)))) };
    }

    private async scoreActivityRanking(uid: string): Promise<Fields>
    {
        const profile = this.checkProfile(await this.db.getProfileById(uid), this.now());

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        if (!this.services.scoreActivityRanking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const board = await this.services.scoreActivityRanking();

        if (
            !Array.isArray(board)
            || board.length > 32767
            || board.some((value) => typeof value !== "string" || !value.isWellFormed())
        )
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        return { rank: { type: Type.StringArray, value: [...board] } };
    }

    private async expeditionRanking(uid: string): Promise<Fields>
    {
        if (this.rules.kingdomId !== this.config.kingdomId || !this.services.expeditionRanking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const now = this.now();
        const profile = this.checkProfile(await this.db.getProfileById(uid), now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const limit = expeditionRankingLimit(this.rules);
        const entries = await this.services.expeditionRanking(limit);

        return expeditionRanking(
            selectExpeditionRanking(uid, limit, decodeExpeditionRanking(entries)),
        );
    }

    private async publicProfile(uid: string, params: Fields): Promise<Fields>
    {
        if (!this.services.publicProfile)
        {
            throw new GameError(errors.unsupported, "public_profile");
        }

        return this.services.publicProfile(uid, params);
    }

    private async power(uid: string, login = false): Promise<Fields>
    {
        const now = this.now();
        const state = await this.db.getPowerByPlayerId(uid, now);
        const profile = this.checkProfile(state.profile, now);

        if (text(profile, "uid") !== uid)
        {
            throw new GameError(errors.invalid);
        }

        const ruleContext = {
            now,
            kingdomId: this.config.kingdomId,
            version: MOBILE_CLIENT_VERSION,
        };
        const context = powerContext(this.rules, state.knight, ruleContext);

        if (
            context.dragonLevelUp
            && context.dragonScience
            && state.dragons.some((dragon) => num(dragon, "dragonState") === 3)
        )
        {
            if (!this.services.worldPowerEffects)
            {
                throw new GameError(errors.unsupported, "power_state");
            }

            const world = worldPowerEffects(
                decodeWorldPowerEffects(await this.services.worldPowerEffects()),
                this.rules,
                ruleContext,
            );
            const emperor = state.throneRewards.length
                ? await this.services.emperorVersion?.()
                : undefined;
            context.dragonAttackPercent = dragonAttackEffect(
                { ...state, profile },
                this.rules,
                ruleContext,
                generalSkillPoints(state.generals),
                world,
                emperor,
            );
        }

        const power = calculatePlayerPower({ ...state, profile }, this.rules, context);
        const result = powerInfo(
            state.statistics,
            power,
            login ? undefined : state.upload,
            this.rules,
        );

        if (login)
        {
            delete result.nextUpdateTime;
            delete result.banTime;
            delete result.banCount;
            result.skillPoint = sfs.int(num(state.generals[0] ?? {}, "plusSkillPoint"));
            result.isPayFlag = sfs.bool(long(profile, "payTotal") > 0n);
        }

        return result;
    }

    private async playerSummaries(params: Fields): Promise<Fields>
    {
        const value = params.uids;

        if (!value || value.type === Type.Null)
        {
            return { uids: sfs.array() };
        }

        if (value.type !== Type.Array || !Array.isArray(value.value))
        {
            throw new GameError(errors.invalid);
        }

        const uids: string[] = [];

        for (const entry of value.value as Value[])
        {
            if (entry?.type !== Type.String || typeof entry.value !== "string")
            {
                throw new GameError(errors.invalid);
            }

            if (!entry.value.trim())
            {
                continue;
            }

            if (entry.value.length > 255)
            {
                throw new GameError(errors.invalid);
            }

            uids.push(entry.value);
        }

        if (!uids.length || uids.length > 50)
        {
            return { uids: sfs.array() };
        }

        const summaries = await this.db.getPlayerSummariesByIds(
            uids.filter((id) => id !== "3000002"),
            "allservers" in params,
        );
        const groups = new Map<number, string[]>();

        for (const summary of summaries)
        {
            const ids = groups.get(summary.kingdomId) ?? [];
            ids.push(text(summary.data, "uid"));
            groups.set(summary.kingdomId, ids);
        }

        const updates = new Map<number, ReadonlyMap<string, string>>();

        for (const [id, ids] of groups)
        {
            updates.set(
                id,
                (await this.services.playerUpdateTimes?.(id, [...new Set(ids)])) ?? new Map(),
            );
        }

        const fallback = String(Math.trunc(this.now() / 1000));
        const out = summaries.map((summary) =>
            sfs.object(
                playerSummary(
                    summary,
                    updates.get(summary.kingdomId)?.get(text(summary.data, "uid")) ?? fallback,
                ),
            )
        );

        if (uids.includes("3000002"))
        {
            out.push(sfs.object(guidePlayerSummary()));
        }

        return { uids: sfs.array(out) };
    }

    private worldQueryResult(command: string, params: Fields, body: Fields): Result
    {
        for (const key of ["_cok_", "cmdBaseTime"])
        {
            if (params[key])
            {
                body[key] = params[key]!;
            }
        }

        if (encode(extension(command, body)).length > MAX_FRAME)
        {
            throw new GameError(errors.unsupported, "world_state");
        }

        return { body, pushes: [] };
    }

    private checkProfile(profile: Row | undefined, now = this.now()): Row
    {
        return checkGameProfile(profile, now);
    }

    private featureContext(profile: Row): FeatureContext
    {
        const now = this.now();

        return {
            uid: text(profile, "uid"),
            platform: text(profile, "pf"),
            version: MOBILE_CLIENT_VERSION,
            kingdomId: this.config.kingdomId,
            now,
            bossRunning: (key) => this.services.featureAvailability?.(profile, now)[key] === true,
        };
    }

    private async configuration(uid: string): Promise<Fields>
    {
        const preferences = this.services.playerPreferences;

        if (!preferences)
        {
            throw new GameError(errors.unsupported, "config_record");
        }

        const state = await preferences.configuration(uid);
        const profile = this.checkProfile(state.profile);
        const context = this.featureContext(profile);
        const result = loginConfigurationPreferences(this.rules, state);
        await preferences.initialize(uid, state.pushSettings, context.now);

        try
        {
            const switchRows = this.db.configurationSwitches
                ? await this.db.configurationSwitches()
                : state.switches;

            if (switchRows !== undefined)
            {
                Object.assign(result, loginSwitches(switchRows));
                let count: string | null = null;

                if (accountVerificationEnabled(this.rules, context))
                {
                    if (!this.services.changeAccountCount)
                    {
                        throw new GameError(errors.unsupported, "account_rule");
                    }

                    count = await this.services.changeAccountCount(
                        String(profile.deviceId ?? "null"),
                    );
                }

                result.isVerifyChangeAccount = sfs.bool(
                    accountVerificationRequired(this.rules, context, count),
                );
            }
        }
        catch
        {
        }

        Object.assign(result, featureConfig(this.rules, context));

        return result;
    }

    private async otherLogin(uid: string, params: Fields): Promise<Fields>
    {
        if (!params.army)
        {
            if (params.config)
            {
                return this.configuration(uid);
            }

            if (params.store)
            {
                return { store: sfs.array() };
            }

            if (params.exchange)
            {
                return { exchange: sfs.array(), exchange_gift: sfs.array() };
            }
        }

        const state = await this.city().state(uid);

        if (params.army)
        {
            return {
                resource: sfs.object(resource(state.resource)),
                ...this.military.snapshot(
                    state.armies,
                    state.hospital ?? [],
                    state.forts ?? [],
                ),
                items: sfs.array(state.items.map((r) => sfs.object(inventoryItem(r, this.rules)))),
            };
        }

        const lord = state.lord;

        if (!lord)
        {
            throw new GameError(errors.missing);
        }

        const out: Fields = { medal: sfs.string(text(lord, "medal")) };
        const time = serverClock(this.now(), 0);
        out.nextDay = sfs.long(Number(time.tomorrow!.value) * 1000);

        for (const key of ["levelUp", "pveLevel", "freshRechargeTotal", "castleLevelUp"])
        {
            out[key] = sfs.int(num(lord, key));
        }

        out.remainAttackTime = sfs.int(num(lord, "remainAttackLeaderBossTime"));

        return { lord: sfs.object(out), tomorrow: time.tomorrow! };
    }
}
