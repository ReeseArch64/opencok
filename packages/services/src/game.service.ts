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
import { UPLOAD_PATH } from "@opencok/contracts/files";
import { equipment as equipmentFields } from "@opencok/mappings/equipment";
import { militarySnapshot } from "@opencok/mappings/military";
import { researchData } from "@opencok/mappings/research";
import { changeNickname } from "./nickname-command.ts";
import type { CreateWorldFavoriteDto } from "@opencok/dtos/world-favorites/create-world-favorite.dto";
import type { UpdatePushPreferenceDto } from "@opencok/dtos/profile/update-push-preference.dto";
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
import {
  heroRankingLookup,
  heroSelfRanking,
  heroHistoryBand,
  heroHistoryRewards,
} from "@opencok/rules/hero-ranking";
import {
  heroSelfRanking as mapHeroSelfRanking,
  heroInsideRanking,
  heroHistory,
} from "@opencok/mappings/hero-ranking";
import { versionAtLeast } from "@opencok/rules/availability";
import { attributeRanking, publishedRanking } from "@opencok/mappings/published-ranking";
import { reportAvatar } from "./avatar-report.ts";
import { systemMailProjection } from "./mail-system.ts";
import { javaDecimal } from "@opencok/rules/java-integer";
import { dragonRankingRanges } from "@opencok/rules/dragon-ranking";
import { dragonRanking } from "@opencok/mappings/dragon-ranking";
import { decodeDragonRanking } from "./dragon-ranking.ts";
import { worldPointDetail } from "./world-point-detail.ts";
import { profilePreference } from "./profile-preferences.ts";
import { celebrityDescription, saveCelebrityDescription } from "./celebrity.ts";
import { checkNickname } from "@opencok/rules/nickname";
import { favoriteInteger, favoriteName, favoriteServer } from "@opencok/rules/world-favorites";
import { worldFavorites } from "@opencok/mappings/world-favorites";
import { worldSearch } from "@opencok/mappings/world-search";
import { worldSearchName, worldSearchOffset } from "@opencok/rules/world-search";
import { playerSearch } from "@opencok/mappings/player-search";
import {
  playerSearchQuery,
  playerSearchRemoteBudget,
  selectPlayerSearch,
  sharedSearchProfile,
} from "@opencok/rules/player-search";
import { MAX_FRAME } from "@opencok/messages/frame";
import { encode, extension } from "@opencok/messages/sfs";
import {
  avatarSequence,
  avatarMinimumLevel,
  checkAvatarLevel,
  checkAvatarRecord,
} from "@opencok/rules/avatar";
import { realmChatSessionRequest, realmChatSessionResponse } from "./realm-chat-session.ts";
import { mailDeleted, mailSave, mailStatus } from "@opencok/mappings/mail";
import { mailCategoryProjection } from "./mail-category.ts";
import { mailGroupProjection } from "./mail-groups.ts";
import {
  mailGroupQuery,
  mailGroupRule,
  mailGroupSenders,
  mailGroupWindow,
} from "@opencok/rules/mail-groups";
import { resolveMailPresentation } from "./mail-presentation.ts";
import { mailListProjection } from "./mail-list.ts";
import { mailContentsProjection } from "./mail-contents.ts";
import { mailConversationReadRequest } from "./mail-conversation-read.ts";
import { mailCategoryDeleteQuery, mailTypeDeleteQuery } from "@opencok/rules/mail-batch-delete";
import { planMailBatchInvitations, planMailDeletion } from "./mail-delete.ts";
import { mailUpdateCursor, mailUpdatesProjection } from "./mail-updates.ts";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import {
  mailBlank,
  mailContentsQuery,
  mailCategoryQuery,
  mailBatchQuery,
  mailBatchIsChat,
  selectMailCategory,
  mailConversationSaveQuery,
  mailDeleteQuery,
  mailReadQuery,
  mailSaveQuery,
  mailStatusQuery,
  calculateMailStatus,
} from "@opencok/rules/mail";
import type {
  MailSaveMode,
  MailGroupQuery,
  MailGroupPreview,
  MailListCommand,
} from "@opencok/contracts/mail";
import { expeditionRanking } from "@opencok/mappings/expedition-ranking";
import { expeditionRankingLimit, selectExpeditionRanking } from "@opencok/rules/expedition-ranking";
import { decodeExpeditionRanking } from "./expedition-ranking.ts";
import { allianceCommands } from "./alliances";
import { allianceRanking } from "@opencok/mappings/alliance-ranking";
import { allianceRankingQuery, selectAllianceRanking } from "@opencok/rules/alliance-ranking";
import type { AllianceRankingKind } from "@opencok/contracts/alliance-ranking";
import type { ServerConfig } from "@opencok/contracts/server";
import type { CityState, GameServices, GameStore } from "@opencok/contracts/game";
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
import { building, gold, queue, resource, user } from "@opencok/mappings/city";
import { powerInfo } from "@opencok/mappings/power";
import { publicProfileBase } from "@opencok/mappings/profile";
import { publicProfileAlliance, publicProfileGenerals } from "./profile.ts";
import { playerRanking } from "@opencok/mappings/ranking";
import { playerRankingQuery, selectPlayerRanking } from "@opencok/rules/ranking";
import type { PlayerRankingKind } from "@opencok/contracts/ranking";
import { calculatePlayerPower } from "@opencok/rules/power";
import { powerContext, decodeWorldPowerEffects, generalSkillPoints } from "./power.ts";
import { planReconnectProgress, validateReconnectResult } from "./reconnect-progress.ts";
import { serverFeature } from "@opencok/rules/power-context";
import { dragonAttackEffect } from "@opencok/rules/power-resolver";
import { worldPowerEffects } from "@opencok/rules/power-world";
import type { Rules } from "@opencok/rules/game";
import { GameError } from "@opencok/errors/game";
import {
  errors,
  MOBILE_CLIENT_VERSION,
  PUSH_SETTING_COUNT,
  WORLD_NEWS_PUSH_TYPE,
} from "@opencok/constants/game";
import {
  accountVerificationEnabled,
  accountVerificationRequired,
  type FeatureContext,
} from "@opencok/rules/features";
import {
  dataConfig,
  featureConfig,
  inventoryItem,
  serverClock,
  settingConfig,
  loginConfigurationPreferences,
  loginSwitches,
  pushPreferences,
} from "@opencok/mappings/bootstrap";

const playerRankingKinds = {
  "server.rank": "power",
  "kill.rank": "kills",
  "level.rank": "level",
  "building.rank": "building",
  "silver.contribute.rank": "contribution",
} as const;

type GameConfig = Pick<
  ServerConfig,
  "kingdomId" | "mailTranslationEnabled" | "crossSearchEnabled" | "chatInterval" | "feedMaxCount"
>;

type ReadyCity = CityState & { profile: Row; resource: Row };
export interface Result {
  body: Fields;
  pushes: { command: string; body: Fields }[];
}

export class GameService {
  constructor(
    readonly db: GameStore,
    readonly rules: Rules,
    readonly config: GameConfig,
    readonly now = Date.now,
    readonly services: GameServices = {},
  ) {}
  private async state(uid: string): Promise<ReadyCity> {
    const state = await this.db.getCityByPlayerId(uid, this.now());
    if (!state.profile || !state.resource) throw new GameError(errors.missing);
    if (long(state.profile, "banTime") > BigInt(this.now()) || num(state.profile, "banFlag") !== 0)
      throw new GameError(errors.invalid);
    return { ...state, profile: state.profile, resource: state.resource };
  }
  private queueFields(q: Row, state: ReadyCity, helped = true, now = this.now()): Fields {
    const target = state.buildings.find((b) => text(b, "uuid") === text(q, "itemId"));
    if ([1, 8, 9, 10, 17].includes(num(q, "type")) && text(q, "itemId"))
      return queue(
        q,
        { itemId: sfs.string(text(q, "itemId")), allId: sfs.string(text(q, "itemId")) },
        helped,
      );
    if ([2, 3].includes(num(q, "type")) && text(q, "itemId"))
      return queue(q, { itemId: sfs.string(text(q, "itemId")) }, helped);
    if (num(q, "type") === 6 && text(q, "itemId"))
      return queue(q, { itemId: sfs.string(text(q, "itemId")) }, helped);
    if (num(q, "type") === 11 && text(q, "itemId")) {
      const row = state.equipment?.find((row) => row.uuid === q.itemId);
      return queue(
        q,
        row ? { itemId: sfs.string(text(row, "itemId")), cost: sfs.string(text(row, "cost")) } : {},
        helped,
      );
    }
    if (num(q, "type") === 12 && text(q, "itemId"))
      return queue(
        q,
        {
          itemId: sfs.string(text(q, "itemId").split(";")[0] ?? ""),
          allId: sfs.string(text(q, "itemId")),
          para: sfs.int(num(q, "para")),
        },
        helped,
      );
    if (num(q, "type") !== 0 && text(q, "itemId"))
      throw new GameError(errors.unsupported, "queue_kind");
    return queue(q, target ? building(target, this.rules, true, now) : {}, helped);
  }
  private info(state: ReadyCity): Fields {
    const now = this.now();
    return {
      building: sfs.array(
        state.buildings.map((b) => sfs.object(building(b, this.rules, false, now))),
      ),
      buildingQueue: sfs.array(
        state.queues
          .filter((q) => num(q, "type") === 0)
          .map((q) => sfs.object(this.queueFields(q, state, true, now))),
      ),
      resource: sfs.object(resource(state.resource)),
      gold: sfs.long(gold(state.profile)),
      ...(state.sciences && this.rules.power.sciences?.size
        ? { science: researchData(state.sciences, state.queues, this.rules) }
        : {}),
    };
  }
  private initialWorld(world: Row): Fields {
    return {
      m: sfs.array(),
      enemy: sfs.array(),
      point: sfs.int(num(world, "pointId")),
      cityDefValue: sfs.int(num(world, "cityDefValue")),
      gridType: sfs.int(num(world, "gridType")),
      ft: sfs.long(long(world, "fireTime")),
      lastCityDefTime: sfs.long(long(world, "lastCityDefTime")),
      stamina: sfs.int(num(world, "attMonsterStamina")),
      lastStaminaTime: sfs.long(long(world, "lastStaminaTime")),
      resSearchCount: sfs.int(num(world, "resSearchCount")),
      maxSearchCount: sfs.int(Number(this.rules.items.get("shake")?.k10 ?? 0)),
    };
  }
  async initial(uid: string): Promise<Fields> {
    return (await this.initialize(uid)).body;
  }
  async initialize(uid: string, correlation: Fields = {}): Promise<Result> {
    const worldRecovery = await this.services.cityProgression?.(uid, "world.tick", {});
    await this.services.reconcileAlliance?.(uid);
    await this.services.reconcileTimed?.(uid);
    const effects = await this.services.cityProgression?.(uid, "effects.init", {});
    const quest = await this.services.cityProgression?.(uid, "quest.init", {});
    const equipment = await this.services.cityProgression?.(uid, "equipment.init", {});
    const generals = await this.services.cityProgression?.(uid, "general.init", {});
    const dragons = await this.services.cityProgression?.(uid, "dragon.init", {});
    const civilization = await this.services.cityProgression?.(
      uid,
      "civilization.science.data.init",
      {},
    );
    const dragonTower = await this.services.cityProgression?.(uid, "dragontower.init", {});
    const recharge = await this.services.cityProgression?.(uid, "new.sercum.init", {});
    const boxes = await this.services.cityProgression?.(uid, "ordinary.box.init", {});
    const cycle = await this.services.cityProgression?.(uid, "sevenday.init", {});
    const investment = await this.services.cityProgression?.(uid, "invest.init", {});
    const castleLevel = await this.services.cityProgression?.(uid, "castle.event.init", {});
    const luckyDay = await this.services.cityProgression?.(uid, "luckyday.init", {});
    const campaign = await this.services.cityProgression?.(uid, "campaign.init", {});
    const lottery = await this.services.cityProgression?.(uid, "lottery.init", {});
    const totems = await this.services.cityProgression?.(uid, "totem.init", {});
    const alliance = await this.services.alliance?.(uid, "alliance.init", {});
    const state = await this.state(uid);
    const world = state.world;
    if (!world || num(world, "worldId") !== 0 || (state.hasMarches && !this.services.reconnect))
      throw new GameError(errors.unsupported, "world_state");
    const body: Fields = {
      equip: sfs.array(
        (state.equipment ?? [])
          .filter((row) => num(row, "on") !== 2)
          .map((row) => sfs.object(equipmentFields(row))),
      ),
      ...equipment?.body,
      ...generals?.body,
      ...dragons?.body,
      ...dragonTower?.body,
      ...luckyDay?.body,
      ...recharge?.body,
      ...totems?.body,
      ...lottery?.body,
      ...civilization?.body,
      ...alliance?.body,
      ...effects?.body,
      ...quest?.body,
      ...serverClock(this.now(), 0),
      ...featureConfig(this.rules, this.featureContext(state.profile)),
      ...this.info(state),
      user: sfs.object(
        user(state.profile, this.rules, this.config.kingdomId, state.civilizationPrestige),
      ),
      newAccount: sfs.bool(false),
      queue: sfs.array(
        this.services.reconnect
          ? []
          : state.queues.map((q) => sfs.object(this.queueFields(q, state))),
      ),
      world: sfs.object(this.initialWorld(world)),
      serverTime: sfs.long(this.now()),
    };
    const initialPushes = [
      worldRecovery,
      effects,
      quest,
      equipment,
      generals,
      dragons,
      dragonTower,
      luckyDay,
      castleLevel,
      investment,
      cycle,
      boxes,
      recharge,
      civilization,
      campaign,
      lottery,
      totems,
      alliance,
    ].flatMap((result) => result?.pushes ?? []);
    if (!this.services.reconnect) return { body, pushes: initialPushes };
    const now = this.now();
    const context = { kingdomId: this.config.kingdomId, version: MOBILE_CLIENT_VERSION, now };
    return this.services.reconnect(uid, now, async (progress) => {
      const planned = await planReconnectProgress(progress, this.rules, context, this.services, {
        specialServer: serverFeature(this.rules, "araf_mode", context),
        cn1: null,
      });
      if (!progress.world || num(progress.world, "worldId") !== 0)
        throw new GameError(errors.unsupported, "world_state");
      const buildings = progress.buildings.map((row) => {
        const refresh = planned.write.buildingRefreshes.find((entry) => entry.uuid === row.uuid);
        return refresh ? { ...row, refreshTime: refresh.refreshTime } : { ...row };
      });
      const prestige = progress.effects.prestige.find(
        (row) => num(row, "civilizationType") === num(progress.profile, "civilizationType"),
      );
      planned.result.body = {
        ...body,
        ...this.info({
          ...state,
          profile: progress.profile,
          resource: { ...progress.resource, ...planned.write.resource },
          buildings,
          queues: [...progress.queues],
          sciences: [...progress.effects.sciences],
        }),
        ...planned.result.body,
        user: sfs.object(
          user(
            progress.profile,
            this.rules,
            this.config.kingdomId,
            prestige ? long(prestige, "prestigeValue") : 0n,
          ),
        ),
        world: sfs.object({
          ...this.initialWorld(progress.world),
          m: planned.result.body.worldMarch!,
        }),
      };
      planned.result.pushes = [...initialPushes, ...planned.result.pushes];
      if (correlation._cok_) planned.result.body._cok_ = correlation._cok_;
      validateReconnectResult(planned.result, "init");
      return planned;
    });
  }
  async execute(uid: string, command: string, params: Fields): Promise<Result> {
    if ((allianceCommands as readonly string[]).includes(command)) {
      if (!this.services.alliance) throw new GameError(errors.unsupported);
      return this.services.alliance(uid, command, params);
    }
    if (friendshipMineCommands.includes(command)) {
      if (!this.services.friendshipMine) throw new GameError(errors.unsupported);
      return this.services.friendshipMine(uid, command, params);
    }
    if (noticeCommands.includes(command)) {
      if (!this.services.notice) throw new GameError(errors.unsupported);
      return this.services.notice(uid, command, params);
    }
    if (postboxCommands.includes(command)) {
      if (!this.services.postbox) throw new GameError(errors.unsupported);
      return this.services.postbox(uid, command, params);
    }
    if (command === "chat.get.new") return { body: await this.chatNews(uid, params), pushes: [] };
    if ([...chatSocialCommands, ...nativeChatCommands].includes(command)) {
      if (!this.services.social) throw new GameError(errors.unsupported);
      return { body: await this.services.social(uid, command, params), pushes: [] };
    }
    await this.services.reconcileAlliance?.(uid);
    let body: Fields;
    let pushes: Result["pushes"] = [];
    if (worldMutationCommands.includes(command)) {
      if (command === "world.tick" || !this.services.cityProgression)
        throw new GameError(errors.unsupported);
      const result = await this.services.cityProgression(uid, command, params);
      if (Object.keys(result.body).length === 0) result.body.success = sfs.bool(true);
      if (params._cok_) result.body._cok_ = params._cok_;
      if (params.cmdBaseTime) result.body.cmdBaseTime = params.cmdBaseTime;
      return result;
    }
    if (dragonProgressionCommands.includes(command)) {
      if (
        command === "dragon.item" ||
        command === "dragon.init" ||
        command === "dragon.tick" ||
        !this.services.cityProgression
      )
        throw new GameError(errors.unsupported);
      const result = await this.services.cityProgression(uid, command, params);
      if (Object.keys(result.body).length === 0) result.body.success = sfs.bool(true);
      if (params._cok_) result.body._cok_ = params._cok_;
      if (params.cmdBaseTime) result.body.cmdBaseTime = params.cmdBaseTime;
      return result;
    }
    switch (command) {
      case "activity.close.info":
        body = closedActivities(
          closedActivityPanels(await this.profile(uid), this.rules, BigInt(this.now())),
        );
        break;
      case "resource.client.reward.get": {
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
        if (!this.services.trade) throw new GameError(errors.unsupported);
        ({ body, pushes } = await this.services.trade(uid, command, params));
        break;
      case "mall.info":
      case "mall.info.type":
      case "mall.data":
      case "shoppingMall.buy":
        if (!this.services.shop) throw new GameError(errors.unsupported);
        ({ body, pushes } = await this.services.shop(uid, command, params));
        break;
      case "mail.reward":
      case "mail.reward.batch":
        if (!this.services.mailReward) throw new GameError(errors.unsupported);
        ({ body, pushes } = await this.services.mailReward(uid, command, params));
        break;
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
        if (!this.services.cityProgression) throw new GameError(errors.unsupported);
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
        if (!this.services.timed) throw new GameError(errors.unsupported);
        ({ body, pushes } = await this.services.timed(uid, command, params));
        break;
      case "build.collect":
      case "building.addOutPut":
        if (!this.services.production) throw new GameError(errors.unsupported);
        ({ body, pushes } = await this.services.production(uid, command, params));
        break;
      case "item.buy":
      case "item.use":
      case "item.buyUse":
      case "item.compose":
      case "item.compose2":
      case "item.compose.suitequipment.store":
        if (!this.services.inventory) throw new GameError(errors.unsupported);
        ({ body, pushes } = await this.services.inventory(uid, command, params));
        break;
      case "user.lv": {
        if (!this.services.reconnect) throw new GameError(errors.unsupported, "reconnect");
        const now = this.now();
        const context = { kingdomId: this.config.kingdomId, version: MOBILE_CLIENT_VERSION, now };
        ({ body, pushes } = await this.services.reconnect(uid, now, async (state) => {
          const planned = await planReconnectProgress(state, this.rules, context, this.services, {
            specialServer: serverFeature(this.rules, "araf_mode", context),
            cn1: null,
          });
          if (params._cok_) planned.result.body._cok_ = params._cok_;
          if (params.cmdBaseTime) planned.result.body.cmdBaseTime = params.cmdBaseTime;
          validateReconnectResult(planned.result, command);
          return planned;
        }));
        break;
      }
      case "celebrity.desc.get":
        body = await celebrityDescription(this.db, uid, this.config.kingdomId, params, this.now());
        break;
      case "celebrity.desc.save":
        body = await saveCelebrityDescription(
          this.db,
          this.services,
          uid,
          this.config.kingdomId,
          params,
          this.now(),
        );
        break;
      case "user.modify.nickName":
        body = await changeNickname(
          this.db,
          this.services,
          uid,
          this.config.kingdomId,
          params,
          this.now(),
        );
        break;
      case "user.check.nickName":
        body = await this.nicknameCheck(uid, params);
        break;
      case "equip.show":
      case "medal.show":
      case "march.soldier.show":
      case "colorblind.set":
      case "equip.scroll":
      case "banner.set":
      case "speed.cd.open":
        body = await profilePreference(this.db, uid, command, params, this.now());
        break;
      case "pushSetting.get":
        body = await this.getPushPreferences(uid);
        break;
      case "parse.push.set":
        body = await this.setPushPreference(uid, params);
        break;
      case "world.get.detail":
        if (!this.services.worldPointDetail) throw new GameError(errors.unsupported);
        body = await worldPointDetail(
          this.services.worldPointDetail,
          uid,
          params,
          this.rules,
          this.config.kingdomId,
          this.now(),
          this.services,
          this.now,
        );
        break;
      case "search.player":
        body = await this.playerSearch(uid, params);
        break;
      case "world.search.user":
        body = await this.worldSearch(uid, params);
        break;
      case "world.favo.get":
      case "world.favo.add":
      case "world.favo.delme":
        body = await this.worldFavorites(uid, command, params);
        break;
      case "report.picVer":
        body = await reportAvatar(this.db, uid, this.config.kingdomId, params, this.now());
        break;
      case "user.update.picVer":
        body = await this.avatarVersion(uid);
        break;
      case "user.avatar.finish":
        ({ body, pushes } = await this.avatarFinish(uid, params));
        break;
      case "user.avatar.url":
        body = await this.avatarUrl(uid, params);
        break;
      case "user.avatar.grant":
        body = await this.avatarGrant(uid, params);
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
        body = this.info(await this.state(uid));
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
        body = await this.mailStatus(uid, params);
        break;
      case "mail.read.status":
      case "mail.read.status.betch":
        body = await this.mailRead(uid, command === "mail.read.status.betch", params);
        break;
      case "mread.batch":
      case "mread.chat":
        body = await this.mailBatch(uid, params, command);
        break;
      case "mread.batch.category":
        body = await this.mailCategory(uid, params);
        break;
      case "mail.read":
        body = await this.mailContents(uid, params);
        break;
      case "mail.delete":
        body = await this.mailDelete(uid, params);
        break;
      case "chat.get.system.mails":
        body = await this.mailSystem(uid, params, true);
        break;
      case "chat.get.system.mails.v2":
        body = await this.mailSystem(uid, params);
        break;
      case "chat.get.update.mails":
        body = await this.mailUpdates(uid, params);
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
        body = await this.mailSave(
          uid,
          command === "mail.save" ? "save" : command === "mail.cancel.save" ? "cancel" : "batch",
          params,
        );
        break;
      case "expedition.rank":
        body = await this.expeditionRanking(uid);
        break;
      case "alliance.rank":
      case "kill.al.rank":
        body = await this.allianceRanking(uid, command === "alliance.rank" ? "power" : "kills");
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
      case "hero.event.ranking.his.get":
        body = await this.heroHistory(uid, params);
        break;
      case "hero.al.inside.ranking":
        body = await this.heroInsideRanking(uid, params);
        break;
      case "hero.self.rank":
        body = await this.heroSelfRanking(uid, params);
        break;
      case "attributeRank.info":
        body = await this.attributeRanking(uid, params);
        break;
      case "paytotal.ranking":
      case "continuedcost.ranking":
        body = await this.publishedRanking(
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
        body = await this.ranking(uid, playerRankingKinds[command]);
        break;
      default:
        throw new GameError(errors.unsupported);
    }
    if (Object.keys(body).length === 0 && command !== "world.get.detail")
      body.success = sfs.bool(true);
    if (params._cok_) body._cok_ = params._cok_;
    if (params.cmdBaseTime) body.cmdBaseTime = params.cmdBaseTime;
    if (command.startsWith("world.favo.") && encode(extension(command, body)).length > MAX_FRAME)
      throw new GameError(errors.unsupported, "world_favorite_size");
    if (command === "world.search.user" && encode(extension(command, body)).length > MAX_FRAME)
      throw new GameError(errors.unsupported, "world_search_size");
    if (command === "search.player" && encode(extension(command, body)).length > MAX_FRAME)
      throw new GameError(errors.unsupported, "player_search");
    if (command === "world.get.detail" && encode(extension(command, body)).length > MAX_FRAME)
      throw new GameError(errors.unsupported, "world_point_detail");
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
      ].includes(command) &&
      encode(extension(command, body)).length > MAX_FRAME
    )
      throw new GameError(errors.unsupported, "ranking");
    return { body, pushes };
  }
  private async playerSearch(uid: string, params: Fields): Promise<Fields> {
    const store = this.services.playerSearch;
    if (!store) throw new GameError(errors.unsupported);
    if (
      params.key?.type !== Type.String ||
      !worldSearchName(params.key.value) ||
      params.page?.type !== Type.Int ||
      !favoriteInteger(params.page.value)
    )
      throw new GameError(errors.invalid);
    const query = playerSearchQuery(
      params.key.value,
      params.page.value,
      this.config.crossSearchEnabled ?? true,
      this.config.kingdomId,
      this.rules,
    );
    const now = this.now();
    if (!Number.isSafeInteger(now) || now < 0) throw new GameError(errors.invalid);
    const state = await store.search(uid, query, now, (rows) =>
      playerSearchRemoteBudget(query, rows),
    );
    const profile = this.checkProfile(state.profile, now);
    if (profile.uid !== uid || profile.serverId !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const remote = state.remote.map((entry) => ({
      ...entry,
      data: entry.data.uid == null ? entry.data : sharedSearchProfile(entry.data, this.rules, now),
    }));
    return playerSearch(selectPlayerSearch(query, state.local, remote));
  }
  private async worldSearch(uid: string, params: Fields): Promise<Fields> {
    const store = this.services.worldSearch;
    if (!store) throw new GameError(errors.unsupported);
    const integer = (key: string, fallback: number) => {
      const field = params[key];
      if (field === undefined) return fallback;
      if (field.type !== Type.Int || !favoriteInteger(field.value))
        throw new GameError(errors.invalid);
      return field.value;
    };
    const name = params.name === undefined ? "" : params.name.value;
    if ((params.name !== undefined && params.name.type !== Type.String) || !worldSearchName(name))
      throw new GameError(errors.invalid);
    const kingdomId = integer("serverId", this.config.kingdomId);
    const offset = worldSearchOffset(integer("page", 1));
    const now = this.now();
    if (kingdomId < 1 || !Number.isSafeInteger(now) || now < 0) throw new GameError(errors.invalid);
    const state = await store.search(uid, { name, offset, kingdomId, now });
    const profile = this.checkProfile(state.profile, now);
    if (
      profile.uid !== uid ||
      profile.serverId !== this.config.kingdomId ||
      state.kingdomId !== kingdomId
    )
      throw new GameError(errors.invalid);
    return worldSearch(state.rows);
  }
  private async worldFavorites(uid: string, command: string, params: Fields): Promise<Fields> {
    const store = this.services.worldFavorites;
    if (!store) throw new GameError(errors.unsupported);
    const now = this.now();
    if (!Number.isSafeInteger(now) || now < 0) throw new GameError(errors.invalid);
    const check = (profile: Row | undefined) => {
      const owned = this.checkProfile(profile, now);
      if (owned.uid !== uid || owned.serverId !== this.config.kingdomId)
        throw new GameError(errors.invalid);
    };
    if (command === "world.favo.get") {
      const state = await store.list(uid, now);
      check(state.profile);
      return worldFavorites(state, uid);
    }
    const integer = (key: string, fallback?: number) => {
      const field = params[key];
      if (field === undefined && fallback !== undefined) return fallback;
      if (field?.type !== Type.Int || !favoriteInteger(field.value))
        throw new GameError(errors.invalid);
      return field.value;
    };
    if (command === "world.favo.add") {
      if (params.name?.type !== Type.String || !favoriteName(params.name.value))
        throw new GameError(errors.invalid);
      const dto: CreateWorldFavoriteDto = {
        point: integer("point"),
        type: integer("type"),
        cityType: integer("cityType", -1),
        resType: integer("resType", -1),
        name: params.name.value,
        server: favoriteServer(
          params.server === undefined ? undefined : integer("server"),
          this.config.kingdomId,
          this.rules,
        ),
      };
      const state = await store.add(uid, { ...dto, now });
      check(state.profile);
      const repliedAt = this.now();
      if (!Number.isSafeInteger(repliedAt) || repliedAt < 0) throw new GameError(errors.invalid);
      return { state: sfs.int(1), createTime: sfs.long(repliedAt), point: sfs.int(dto.point) };
    }
    const selection = (key: string): number[] => {
      const field = params[key];
      if (field?.type !== Type.Array || !Array.isArray(field.value) || field.value.length > 32767)
        throw new GameError(errors.invalid);
      return field.value.map((entry: Value) => {
        if (entry?.type !== Type.Int || !favoriteInteger(entry.value))
          throw new GameError(errors.invalid);
        return entry.value;
      });
    };
    const points = selection("point"),
      servers = selection("server");
    if (points.length !== servers.length) throw new GameError(errors.invalid);
    const result = await store.remove(
      uid,
      points.map((point, index) => ({ point, server: servers[index]! })),
      now,
    );
    check(result.profile);
    return {
      state: sfs.int(result.success ? 1 : 0),
      pointArray: sfs.array(points.map(sfs.int)),
      serverArray: sfs.array(servers.map(sfs.int)),
    };
  }
  private async avatarVersion(uid: string): Promise<Fields> {
    const service = this.services.avatarVersion;
    if (!service) throw new GameError(errors.unsupported);
    if (!/^[0-9]{1,20}$/.test(uid)) throw new GameError(errors.invalid);
    const now = this.now();
    const state = await service.update(uid, now);
    const profile = this.checkProfile(state.profile, now);
    const intent = state.intent;
    if (
      profile.uid !== uid ||
      profile.serverId !== this.config.kingdomId ||
      !intent ||
      intent.ownerUid !== uid ||
      !/^[a-f0-9]{32}$/.test(intent.operationId) ||
      !Number.isInteger(intent.picVer) ||
      intent.picVer < 1 ||
      intent.picVer > 2147483647 ||
      (intent.nextUpdateTime !== null &&
        (typeof intent.nextUpdateTime !== "bigint" ||
          BigInt.asIntN(64, intent.nextUpdateTime) !== intent.nextUpdateTime))
    )
      throw new GameError(errors.invalid);
    try {
      await service.deliver(uid, intent.operationId);
    } catch {}
    const body: Fields = { uid: sfs.string(uid), picVer: sfs.int(intent.picVer) };
    if (intent.nextUpdateTime !== null) body.nextUpdateTime = sfs.long(intent.nextUpdateTime);
    return body;
  }
  private async avatarFinish(uid: string, params: Fields): Promise<Result> {
    const service = this.services.avatarFinish;
    if (!service) throw new GameError(errors.unsupported);
    if (
      !/^[0-9]{1,20}$/.test(uid) ||
      params.receipt?.type !== Type.String ||
      typeof params.receipt.value !== "string" ||
      !/^[1-9][0-9]{0,5}:[a-f0-9]{64}$/.test(params.receipt.value) ||
      (params.gameuid !== undefined &&
        (params.gameuid.type !== Type.String || params.gameuid.value !== uid))
    )
      throw new GameError(errors.invalid);
    const now = this.now();
    const receipt = params.receipt.value;
    const state = await service.finish(uid, receipt, now);
    const profile = this.checkProfile(state.profile, now);
    const sequence = Number(receipt.split(":")[0]);
    if (
      profile.uid !== uid ||
      profile.serverId !== this.config.kingdomId ||
      !Number.isInteger(state.picVer) ||
      state.picVer! < 0 ||
      state.picVer! > 2147483647 ||
      state.picVer! % 1000000 < sequence ||
      state.superseded !== sequence < state.picVer! % 1000000
    )
      throw new GameError(errors.invalid);
    try {
      await service.deliver(uid, sequence);
    } catch {}
    const body: Fields = {
      uid: sfs.string(uid),
      picVer: sfs.int(state.picVer!),
      superseded: sfs.bool(state.superseded),
    };
    return { body, pushes: [{ command: "push.picVer.update", body: { ...body } }] };
  }
  private async avatarUrl(uid: string, params: Fields): Promise<Fields> {
    const service = this.services.avatar;
    if (!service) throw new GameError(errors.unsupported);
    const now = this.now();
    const requester = this.checkProfile(await this.db.getProfileById(uid), now);
    if (requester.uid !== uid || requester.serverId !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const target = params.gameuid === undefined ? uid : params.gameuid.value;
    if (
      (params.gameuid !== undefined && params.gameuid.type !== Type.String) ||
      typeof target !== "string" ||
      !/^[0-9]{1,20}$/.test(target)
    )
      throw new GameError(errors.invalid);
    const profile = this.checkProfile(await this.db.getProfileById(target), now);
    if (profile.uid !== target || profile.serverId !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const version = profile.picVer;
    if (
      typeof version !== "number" ||
      !Number.isInteger(version) ||
      version < -2147483648 ||
      version > 2147483647
    )
      throw new GameError(errors.invalid);
    const sequence = Math.max(0, version % 1000000);
    return {
      owner: sfs.string(target),
      path: sfs.string(sequence ? await service.image(target, sequence) : ""),
    };
  }
  private async avatarGrant(uid: string, params: Fields): Promise<Fields> {
    const service = this.services.avatar;
    if (!service) throw new GameError(errors.unsupported);
    if (
      !/^[0-9]{1,20}$/.test(uid) ||
      (params.gameuid !== undefined &&
        (params.gameuid.type !== Type.String || params.gameuid.value !== uid))
    )
      throw new GameError(errors.invalid);
    const now = this.now();
    const state = await service.read(uid, now, async (profile, readers) => {
      this.checkProfile(profile, now);
      if (profile.uid !== uid || profile.serverId !== this.config.kingdomId)
        throw new GameError(errors.invalid);
      const sequence = avatarSequence(profile.picVer);
      const minimum = avatarMinimumLevel(this.rules);
      if (minimum !== undefined) {
        checkAvatarLevel(await readers.castleLevel(), minimum);
        const record = await readers.uploadRecord();
        if (record && record.uid !== uid) throw new GameError(errors.invalid);
        checkAvatarRecord(this.rules, record, now);
      }
      const receipt = await service.find(uid, sequence);
      if (
        receipt &&
        (receipt.owner !== uid ||
          receipt.sequence !== String(sequence) ||
          !/^[a-f0-9]{64}$/.test(receipt.hash))
      )
        throw new GameError(errors.invalid);
      return {
        owner: uid,
        sequence,
        grant: await service.issue(uid, sequence),
        pendingHash: receipt?.hash ?? "",
      };
    });
    const profile = this.checkProfile(state.profile, now);
    if (
      profile.uid !== uid ||
      profile.serverId !== this.config.kingdomId ||
      !state.grant ||
      state.grant.owner !== uid
    )
      throw new GameError(errors.invalid);
    return {
      owner: sfs.string(state.grant.owner),
      sequence: sfs.int(state.grant.sequence),
      grant: sfs.string(state.grant.grant),
      uploadPath: sfs.string(`${UPLOAD_PATH}?grant=${state.grant.grant}`),
      pendingHash: sfs.string(state.grant.pendingHash),
    };
  }
  private async chatSession(uid: string): Promise<Fields> {
    if (!this.services.chatSession) throw new GameError(errors.unsupported);
    const now = this.now();
    const profile = this.checkProfile(await this.db.getProfileById(uid), now);
    const request = realmChatSessionRequest(profile, uid, this.config.kingdomId);
    try {
      return realmChatSessionResponse(await this.services.chatSession(request), this.now());
    } catch {
      throw new GameError(errors.invalid);
    }
  }
  private async profile(uid: string): Promise<Row> {
    return this.checkProfile(await this.db.getProfileById(uid));
  }
  private async mailStatus(uid: string, params: Fields): Promise<Fields> {
    const field = params.category;
    let category: number | undefined;
    if (field !== undefined) {
      if (field.type !== Type.Int || typeof field.value !== "number")
        throw new GameError(errors.invalid);
      category = field.value;
    }
    const query = mailStatusQuery(category, this.now());
    const state = await this.db.mailStatus(uid, query);
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    return mailStatus(calculateMailStatus(query, state.counts));
  }
  private async mailSave(uid: string, mode: MailSaveMode, params: Fields): Promise<Fields> {
    const ids = mode === "batch" ? params.uids : params.uid;
    const flag = mode === "batch" ? params.flag : params.type;
    if (
      !ids ||
      ids.type !== Type.String ||
      typeof ids.value !== "string" ||
      !flag ||
      flag.type !== Type.Int ||
      typeof flag.value !== "number"
    )
      throw new GameError(errors.invalid);
    const query = mailSaveQuery(mode, ids.value, flag.value, this.now());
    const state = await this.db.mailSave(uid, query);
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    return mailSave(state.result);
  }
  private async mailRead(uid: string, batch: boolean, params: Fields): Promise<Fields> {
    const ids = batch ? params.uids : params.uid;
    const type = params.type;
    if (
      !ids ||
      ids.type !== Type.String ||
      typeof ids.value !== "string" ||
      (!batch &&
        (!type ||
          type.type !== Type.Int ||
          typeof type.value !== "number" ||
          !Number.isInteger(type.value) ||
          type.value < -2147483648 ||
          type.value > 2147483647))
    )
      throw new GameError(errors.invalid);
    const query = mailReadQuery(batch, ids.value, this.now());
    const state = await this.db.mailRead(uid, query);
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    return {};
  }
  private async mailDelete(uid: string, params: Fields): Promise<Fields> {
    const ids = params.uids;
    const legacyNum = params.num;
    if (
      !ids ||
      ids.type !== Type.String ||
      typeof ids.value !== "string" ||
      (legacyNum !== undefined &&
        (legacyNum.type !== Type.Int ||
          typeof legacyNum.value !== "number" ||
          !Number.isInteger(legacyNum.value) ||
          legacyNum.value < -2147483648 ||
          legacyNum.value > 2147483647))
    )
      throw new GameError(errors.invalid);
    const query = mailDeleteQuery(ids.value, this.now());
    const state = await this.db.mailDelete(uid, query, (entries) => planMailDeletion(uid, entries));
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    return mailDeleted(state.deleted);
  }
  private async chatNews(uid: string, params: Fields): Promise<Fields> {
    if (!this.services.social) throw new GameError(errors.unsupported);
    let rooms: unknown;
    try {
      rooms = JSON.parse(wireString(params, "params"));
    } catch {
      throw new GameError(errors.invalid);
    }
    if (!Array.isArray(rooms) || rooms.length > 16) throw new GameError(errors.invalid);
    const results: Value[] = [];
    for (const room of rooms) {
      if (
        !room ||
        typeof room !== "object" ||
        Array.isArray(room) ||
        !Number.isInteger(room.type) ||
        typeof room.id !== "string" ||
        typeof room.seqid !== "string"
      )
        throw new GameError(errors.invalid);
      if (room.type !== 4 && room.type !== 2) {
        const response = await this.services.social(uid, "chat.get.new", {
          params: sfs.string(JSON.stringify([room])),
        });
        const values = response.rooms?.value;
        if (!Array.isArray(values) || values.length !== 1) throw new GameError(errors.invalid);
        results.push((values as Value[])[0]!);
        continue;
      }
      if (!this.db.getSystemMailByPlayerId) throw new GameError(errors.unsupported);
      const now = this.now();
      const anchor = ["-1", "0", ""].includes(room.seqid) ? null : room.seqid;
      let body: Fields | undefined;
      const state = await this.db.getSystemMailByPlayerId(
        uid,
        { anchor, time: 0n, now },
        async (entries, readers) => {
          if (room.type === 4)
            body = await systemMailProjection(uid, entries, readers, 100, 0n, {});
          else {
            const privateTypes = new Set([20, 21, 22, 23, 24, 37, 38, 39, 40, 43, 44, 45, 46]);
            const shield = await this.services.social!(uid, "chat.shield.list", {});
            const blocks = new Set(
              ((shield.list?.value ?? []) as Value[]).map((value) =>
                wireString((value.value ?? {}) as Fields, "other"),
              ),
            );
            const selected = entries
              .filter(
                (entry) =>
                  privateTypes.has(entry.type) && (!entry.fromUser || !blocks.has(entry.fromUser)),
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
              msg: sfs.array([...((projection.body.result?.value ?? []) as Value[]), ...copies]),
            };
          }
        },
      );
      const profile = this.checkProfile(state.profile, now);
      if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
        throw new GameError(errors.invalid);
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
  private async mailSystem(uid: string, params: Fields, legacy = false): Promise<Fields> {
    if (legacy && !this.services.systemMailPage) throw new GameError(errors.unsupported);
    const clientseq = params.clientseq;
    if (
      !clientseq ||
      (clientseq.type !== Type.Null &&
        (clientseq.type !== Type.String || typeof clientseq.value !== "string"))
    )
      throw new GameError(errors.invalid);
    const count = wireInt(params, "count");
    let time = 0n;
    if (params.time !== undefined) {
      try {
        time = javaDecimal(wireString(params, "time"), 64);
      } catch {
        throw new GameError(errors.invalid);
      }
    }
    const now = this.now();
    const profile = this.checkProfile(await this.db.getProfileById(uid), now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    if (!this.db.getSystemMailByPlayerId) throw new GameError(errors.unsupported);
    let anchor = clientseq.type === Type.Null ? null : (clientseq.value as string);
    if (mailBlank(anchor) || anchor === "0") {
      if (!this.services.lastSystemMail) throw new GameError(errors.unsupported);
      anchor = await this.services.lastSystemMail(uid);
    }
    if (mailBlank(anchor) || anchor === "0") anchor = null;
    if (anchor !== null && (anchor.length > 40 || anchor.includes("\0") || !anchor.isWellFormed()))
      throw new GameError(errors.invalid);
    const envelope: Fields = {};
    for (const key of ["_cok_", "cmdBaseTime"])
      if (params[key] !== undefined) envelope[key] = params[key]!;
    let body: Fields | undefined;
    const state = await this.db.getSystemMailByPlayerId(
      uid,
      { anchor, time, now },
      async (entries, readers) => {
        body = await systemMailProjection(
          uid,
          entries,
          readers,
          count,
          time,
          envelope,
          legacy
            ? (ids, inspect) => this.services.systemMailPage!(uid, ids, count, time, inspect)
            : undefined,
        );
      },
    );
    const current = this.checkProfile(state.profile, now);
    if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    if (!body) throw new GameError(errors.unsupported);
    return body;
  }
  private async mailUpdates(uid: string, params: Fields): Promise<Fields> {
    const now = this.now();
    const profile = this.checkProfile(await this.db.getProfileById(uid), now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    if (!Object.hasOwn(params, "time")) return {};
    const time = params.time;
    if (
      !time ||
      (time.type !== Type.Null && (time.type !== Type.String || typeof time.value !== "string"))
    )
      throw new GameError(errors.invalid);
    if (!this.db.mailUpdates) throw new GameError(errors.unsupported);
    const after = mailUpdateCursor(time.type === Type.Null ? null : (time.value as string));
    const envelope: Fields = {};
    for (const key of ["_cok_", "cmdBaseTime"])
      if (params[key] !== undefined) envelope[key] = params[key]!;
    let body: Fields | undefined;
    const state = await this.db.mailUpdates(uid, { after, now }, (entries) => {
      body = mailUpdatesProjection(entries, envelope);
    });
    const current = this.checkProfile(state.profile, now);
    if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    if (!body) throw new GameError(errors.unsupported);
    return body;
  }
  private async mailBatch(uid: string, params: Fields, command: MailListCommand): Promise<Fields> {
    const fromUser =
      params.fromUser === undefined || params.fromUser.type === Type.Null
        ? null
        : wireString(params, "fromUser");
    if (fromUser !== null && typeof fromUser !== "string") throw new GameError(errors.invalid);
    const type =
      command === "mread.chat" && params.type === undefined ? 4 : wireInt(params, "type");
    const begin = wireInt(params, "num");
    const limit = wireInt(params, "offset");
    const now = this.now();
    if (type === 10 || type === 1000)
      return this.mailGroups(uid, params, mailGroupQuery(type, begin, limit, now), command);
    const query = mailBatchQuery(type, begin, limit, fromUser, now);
    const chat = mailBatchIsChat(query);
    let body: Fields | undefined;
    const envelope: Fields = {};
    for (const key of ["_cok_", "cmdBaseTime"])
      if (params[key] !== undefined) envelope[key] = params[key]!;
    const state = await this.db.mailBatch(uid, query, async (entries, readers) => {
      if (entries.length > query.limit) throw new GameError(errors.invalid);
      const presentation = await resolveMailPresentation(
        entries,
        readers,
        chat,
        this.config.mailTranslationEnabled ?? true,
        async () =>
          (await this.services.playerUpdateTimes?.(this.config.kingdomId, [uid]))?.get(uid) ?? "",
      );
      const projection = mailListProjection(
        uid,
        entries,
        presentation,
        chat ? "conversation" : "ordinary",
        command,
        envelope,
      );
      body = projection.body;
      return projection.invalidIds;
    });
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
      throw new GameError(errors.invalid);
    return body;
  }
  private async mailGroups(
    uid: string,
    params: Fields,
    query: MailGroupQuery,
    command: MailListCommand,
  ): Promise<Fields> {
    const envelope: Fields = {};
    for (const key of ["_cok_", "cmdBaseTime"])
      if (params[key] !== undefined) envelope[key] = params[key]!;
    let body: Fields | undefined;
    const state = await this.db.mailGroups(uid, query, async (groups, readers) => {
      const selected = mailGroupWindow(uid, query, groups);
      const senders = await readers.senders(mailGroupSenders(groups));
      const previews: MailGroupPreview[] = [];
      for (const group of selected) {
        const rule = mailGroupRule(group.groupType);
        previews.push(
          rule && (rule.kind !== "sender" || senders.has(group.groupIndex))
            ? await readers.preview(group, rule)
            : { entries: [], total: 0n, unread: 0n },
        );
      }
      const chatEntries = previews.flatMap((preview, index) =>
        mailGroupRule(selected[index]!.groupType)?.kind === "uid" ? [] : [...preview.entries],
      );
      const presentation = await resolveMailPresentation(
        chatEntries,
        readers,
        true,
        this.config.mailTranslationEnabled ?? true,
        async () =>
          (await this.services.playerUpdateTimes?.(this.config.kingdomId, [uid]))?.get(uid) ?? "",
        senders,
      );
      const projection = mailGroupProjection(
        uid,
        query,
        { groups, previews },
        presentation,
        envelope,
        command,
      );
      body = projection.body;
      return projection.cleanup;
    });
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
      throw new GameError(errors.invalid);
    return body;
  }
  private async mailCategory(uid: string, params: Fields): Promise<Fields> {
    const query = mailCategoryQuery(
      wireInt(params, "category"),
      wireInt(params, "num"),
      wireInt(params, "offset"),
      this.now(),
    );
    if (params.fromUser !== undefined && typeof wireString(params, "fromUser") !== "string")
      throw new GameError(errors.invalid);
    const envelope: Fields = {};
    for (const key of ["_cok_", "cmdBaseTime"])
      if (params[key] !== undefined) envelope[key] = params[key]!;
    let body: Fields | undefined;
    const state = await this.db.mailCategory(uid, query, async (window, readers) => {
      const entries = selectMailCategory(query, window);
      const presentation = await resolveMailPresentation(
        entries,
        readers,
        query.category === 4 || query.category === 7,
        this.config.mailTranslationEnabled ?? true,
        async () =>
          (await this.services.playerUpdateTimes?.(this.config.kingdomId, [uid]))?.get(uid) ?? "",
      );
      const projection = mailCategoryProjection(uid, query, window, presentation, envelope);
      body = projection.body;
      return projection.invalidIds;
    });
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
      throw new GameError(errors.invalid);
    return body;
  }
  private async mailContents(uid: string, params: Fields): Promise<Fields> {
    const ids = wireString(params, "uid");
    if (typeof wireString(params, "type") !== "string") throw new GameError(errors.invalid);
    const query = mailContentsQuery(ids, this.now());
    let body: Fields | undefined;
    const envelope: Fields = {};
    for (const key of ["_cok_", "cmdBaseTime"])
      if (params[key] !== undefined) envelope[key] = params[key]!;
    const state = await this.db.mailContents(uid, query, (entries) => {
      const projection = mailContentsProjection(entries, envelope);
      body = projection.body;
      return projection.invalidIds;
    });
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
      throw new GameError(errors.invalid);
    return body;
  }
  private async mailConversationSave(uid: string, params: Fields): Promise<Fields> {
    const sender = params.fromUser !== undefined;
    const type = params.type !== undefined;
    if (
      sender
        ? typeof params.fromUser!.value !== "string"
        : type && typeof params.type!.value !== "number"
    )
      throw new GameError(errors.invalid);
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
      throw new GameError(errors.invalid);
    return {};
  }
  private async mailConversationRead(uid: string, params: Fields): Promise<Fields> {
    const query = mailConversationReadRequest(params, this.now());
    if (
      !this.db.mailConversationRead ||
      (query.effects.some((effect) => effect.kind === "chat") && !this.services.mailChatEnabled)
    )
      throw new GameError(errors.unsupported, "mail");
    const body: Fields = { success: sfs.bool(true) };
    for (const key of ["_cok_", "cmdBaseTime"])
      if (params[key] !== undefined) body[key] = params[key]!;
    if (encode(extension("chatMail.read", body)).length > MAX_FRAME)
      throw new GameError(errors.unsupported, "mail");
    const state = await this.db.mailConversationRead(uid, query);
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    return body;
  }
  private async mailCategoryDelete(uid: string, params: Fields): Promise<Fields> {
    const read = (key: string) =>
      params[key] === undefined || params[key]!.type === Type.Null ? null : wireString(params, key);
    const query = mailCategoryDeleteQuery(read("uids"), read("types"), this.now());
    if (!this.db.mailCategoryDelete) throw new GameError(errors.unsupported, "mail");
    let body: Fields | undefined;
    const state = await this.db.mailCategoryDelete(
      uid,
      query,
      (counts) => {
        const result: Fields = Object.create(null);
        for (const entry of counts) {
          result[entry.raw] = sfs.int(entry.unread);
          result[`total${entry.raw}`] = sfs.int(entry.total);
        }
        body = { RetObj: sfs.object(result) };
        for (const key of ["_cok_", "cmdBaseTime"])
          if (params[key] !== undefined) body[key] = params[key]!;
        if (encode(extension("mail.delete.batch", body)).length > MAX_FRAME)
          throw new GameError(errors.unsupported, "mail");
      },
      (entries) => planMailBatchInvitations(uid, entries),
      !!this.services.mailChatEnabled,
    );
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
      throw new GameError(errors.invalid);
    return body;
  }
  private async mailConversationDelete(
    uid: string,
    params: Fields,
    batch: boolean,
  ): Promise<Fields> {
    if (!this.services.mailChatEnabled || !this.db.mailConversationDelete)
      throw new GameError(errors.unsupported, "mail");
    const mod = wireInt(params, "mod", 0);
    const bottle = batch && wireInt(params, "driftingBottle", 0) === 1;
    let senders: (string | null)[];
    if (batch) {
      const raw = wireString(params, "users");
      senders = raw.split(",");
      if (raw !== "") while (senders.at(-1) === "") senders.pop();
    } else senders = [params.fromUser?.type === Type.Null ? null : wireString(params, "fromUser")];
    if (
      senders.length > 1000 ||
      senders.some(
        (sender) =>
          sender !== null &&
          (sender.length > 40 || sender.includes("\0") || !sender.isWellFormed()),
      )
    )
      throw new GameError(errors.invalid, "mail");
    const body: Fields = { success: sfs.bool(true) };
    for (const key of ["_cok_", "cmdBaseTime"])
      if (params[key] !== undefined) body[key] = params[key]!;
    if (
      encode(extension(batch ? "chatMail.delete.batch" : "chatMail.delete", body)).length >
      MAX_FRAME
    )
      throw new GameError(errors.unsupported, "mail");
    const now = this.now();
    const state = await this.db.mailConversationDelete(uid, {
      now,
      senders,
      moderation: mod === 1,
      bottle,
    });
    const profile = this.checkProfile(state.profile, now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    return body;
  }
  private async mailTypeDelete(uid: string, params: Fields): Promise<Fields> {
    wireInt(params, "mod", 0);
    if (params.fromUser !== undefined) return this.mailConversationDelete(uid, params, false);
    const query = mailTypeDeleteQuery(
      params.type === undefined ? undefined : wireInt(params, "type"),
      this.now(),
    );
    if (!this.db.mailTypeDelete) throw new GameError(errors.unsupported, "mail");
    const body: Fields = { success: sfs.bool(true) };
    for (const key of ["_cok_", "cmdBaseTime"])
      if (params[key] !== undefined) body[key] = params[key]!;
    if (encode(extension("chatMail.delete", body)).length > MAX_FRAME)
      throw new GameError(errors.unsupported, "mail");
    const state = await this.db.mailTypeDelete(uid, query);
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    return body;
  }
  private async militaryRanking(uid: string, params: Fields): Promise<Fields> {
    const now = this.now();
    const profile = this.checkProfile(await this.db.getProfileById(uid), now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    if (
      !serverFeature(this.rules, "wr_switch", {
        kingdomId: this.config.kingdomId,
        now,
        version: MOBILE_CLIENT_VERSION,
      })
    )
      throw new GameError(errors.unsupported, "ranking");
    const type = wireInt(params, "type");
    if (![0, 1].includes(type)) throw new GameError(errors.invalid);
    if (!this.services.militaryRanking) throw new GameError(errors.unsupported, "ranking");
    const group = militaryRankingGroup(this.rules, this.config.kingdomId);
    return militaryRanking(
      await this.services.militaryRanking(type, group),
      uid,
      this.config.kingdomId,
      type,
    );
  }
  private async flowerRanking(uid: string): Promise<Fields> {
    const now = this.now();
    const current = this.checkProfile(await this.db.getProfileById(uid), now);
    if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    if (
      !this.db.crossRankingRealm ||
      !this.db.flowerRanking ||
      !this.services.flowerRankingPublication
    )
      throw new GameError(errors.unsupported, "ranking");
    const cross = await this.db.crossRankingRealm();
    const realm = cross ? Number(current.crossFightSrcServerId) : this.config.kingdomId;
    if (!Number.isInteger(realm) || realm < 1) throw new GameError(errors.invalid);
    const limit = Number(this.rules.items.get("ranking")?.k2);
    if (!Number.isInteger(limit) || limit < 1 || limit > 32767)
      throw new GameError(errors.unsupported, "ranking");
    const feature = this.rules.features.get("flowers_all_sev");
    const global =
      serverFeature(this.rules, "flowers_all_sev", {
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
      throw new GameError(errors.invalid);
    if (global && cross) {
      const own = await this.db.flowerRanking(uid, this.config.kingdomId, []);
      const ownProfile = this.checkProfile(own.profile, now);
      if (ownProfile.uid !== uid || num(ownProfile, "serverId") !== this.config.kingdomId)
        throw new GameError(errors.invalid);
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
  private async donationRanking(uid: string, command: string): Promise<Fields> {
    const now = this.now();
    const resource = command.startsWith("al.donate.res.");
    const current = this.checkProfile(await this.db.getProfileById(uid), now);
    if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    if (resource) {
      if (!this.db.crossRankingRealm) throw new GameError(errors.unsupported, "ranking");
      if (await this.db.crossRankingRealm()) return {};
    }
    if (!this.db.donationRanking) throw new GameError(errors.unsupported, "ranking");
    const snapshot = await this.db.donationRanking(uid, now);
    const profile = this.checkProfile(snapshot.profile, now);
    if (
      profile.uid !== uid ||
      num(profile, "serverId") !== this.config.kingdomId ||
      !text(profile, "allianceId").trim()
    )
      throw new GameError(errors.invalid);
    const suffix = command.split(".").at(-1)!;
    const kind = (resource ? `resource-${suffix}` : suffix) as DonationRankingKind;
    if (!resource) return donationRanking(snapshot, kind, now);
    if (!this.services.donationScores) throw new GameError(errors.unsupported, "ranking");
    const date = rankingCalendar(now);
    const scores = await this.services.donationScores(
      text(profile, "allianceId"),
      kind as "resource-day" | "resource-week" | "resource-history",
      kind === "resource-day" ? date.dayKey : date.weekKey,
    );
    return resourceDonationRanking(snapshot, scores, kind === "resource-week", now);
  }
  private async cemeteryRanking(uid: string, params: Fields): Promise<Fields> {
    const now = this.now();
    const profile = this.checkProfile(await this.db.getProfileById(uid), now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const type = wireString(params, "type");
    if (type !== "0" && type !== "1") throw new GameError(errors.invalid);
    if (!this.db.cemeteryRanking) throw new GameError(errors.unsupported, "ranking");
    const snapshot = await this.db.cemeteryRanking(uid, type, now);
    const owner = this.checkProfile(snapshot.profile, now);
    if (owner.uid !== uid || num(owner, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    return cemeteryRanking(snapshot, uid);
  }
  private async throneRanking(uid: string, params: Fields): Promise<Fields> {
    const now = this.now();
    const profile = this.checkProfile(await this.db.getProfileById(uid), now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
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
    if (selected !== undefined && selected <= 0) throw new GameError(errors.invalid);
    if (selected !== undefined && selected !== own && selected !== target) return throneRanking([]);
    if (!this.services.throneRankingPeriod || !this.db.throneRanking)
      throw new GameError(errors.unsupported, "ranking");
    const boards: Fields[] = [];
    for (const realm of [own, ...(target > 0 ? [target] : [])]) {
      if (selected !== undefined && selected !== realm) continue;
      const period = await this.services.throneRankingPeriod(realm);
      if (realm !== own && !period) continue;
      if (period && !throneRankingOpen(period)) continue;
      const snapshot = await this.db.throneRanking(realm, period);
      const board = throneRankingBoard(snapshot, realm, realm === own ? uid : "");
      if (board) boards.push(board);
    }
    return throneRanking(boards);
  }
  private async battleRanking(uid: string, command: string): Promise<Fields> {
    const now = this.now();
    if (!this.db.battleRankingState) throw new GameError(errors.unsupported, "ranking");
    const state = await this.db.battleRankingState(uid, now);
    const profile = this.checkProfile(state.profile, now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const playoff = command === "dragon.playoff.rank.info" || [7, 8].includes(state.realmType);
    if (
      (playoff || [3, 5].includes(state.realmType)) &&
      !battleRankingOpen(
        this.rules,
        state,
        this.config.kingdomId,
        now,
        playoff,
        MOBILE_CLIENT_VERSION,
      )
    )
      throw new GameError(errors.battleClosed, "ranking");
    if (command === "dragon.playoff.rank.info") {
      if (!this.services.playoffPublication) throw new GameError(errors.unsupported, "ranking");
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
    if (![3, 5, 7, 8, 13, 14].includes(state.realmType)) return fightRanking();
    const teamId = state.observerTeam ?? text(profile, "allianceId");
    if (!teamId) throw new GameError(errors.invalid);
    if (!this.services.battleFightPublication) throw new GameError(errors.unsupported, "ranking");
    return fightRanking(decodeFightRanking(await this.services.battleFightPublication(), teamId));
  }
  private async heroHistory(uid: string, params: Fields): Promise<Fields> {
    const now = this.now();
    const current = this.checkProfile(await this.db.getProfileById(uid), now);
    if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const source = current.crossFightSrcServerId;
    const realm = source == null || Number(source) === -1 ? this.config.kingdomId : Number(source);
    const type = wireInt(params, "type");
    if (!Number.isInteger(type) || type < 0 || type > 4) throw new GameError(errors.invalid);
    if (!this.db.heroHistory) throw new GameError(errors.unsupported, "ranking");
    const state = await this.db.heroHistory(uid, realm, type, now);
    const profile = this.checkProfile(state.profile, now);
    if (profile.uid !== uid || num(profile, "serverId") !== realm)
      throw new GameError(errors.invalid);
    if (!state.active || !state.events.length) return heroHistory([]);
    const alliance = type === 2 || type === 4;
    const band = heroHistoryBand(type, state.castleLevel, state.alliancePower, this.rules);
    if (band < 0 || (!alliance && band >= 40)) return heroHistory([]);
    const rewards = heroHistoryRewards(this.rules, text(state.active, "eventId"), band);
    const keys = state.events.map((event) => {
      const lookup = heroRankingLookup(
        event,
        uid,
        text(profile, "allianceId"),
        this.rules,
        realm,
        MOBILE_CLIENT_VERSION,
        false,
      );
      if (typeof lookup === "number" || !lookup.keys[band]) throw new GameError(errors.invalid);
      return lookup.keys[band]!;
    });
    if (!this.services.heroHistoryPublication || !this.db.heroHistoryPresentation)
      throw new GameError(errors.unsupported, "ranking");
    const publications = await this.services.heroHistoryPublication(keys, alliance);
    if (publications.length !== state.events.length) throw new GameError(errors.invalid);
    const ids = [...new Set(publications.flatMap((row) => [...row.members]))];
    const realmIds = [
      ...new Set(
        state.events.flatMap((event) =>
          type >= 3 && event.kingdomRank
            ? String(event.kingdomRank)
                .split("|")
                .map((id) => Number(javaDecimal(id, 32)))
            : [],
        ),
      ),
    ];
    const presentation = await this.db.heroHistoryPresentation(alliance ? ids : [], realmIds);
    const players = new Map<string, Row>();
    if (!alliance) {
      for (let offset = 0; offset < ids.length; offset += 50) {
        const summaries = await this.db.getPlayerSummariesByIds(
          ids.slice(offset, offset + 50),
          true,
        );
        for (const summary of summaries)
          players.set(text(summary.data, "uid"), { ...summary.data, server: summary.kingdomId });
      }
    }
    return heroHistory(
      state.events.map((event, index) => {
        const publication = publications[index]!;
        const members = publication.members.flatMap((id, position) => {
          const rewardId = rewards[position];
          if (rewardId === undefined) return [];
          const member: Row = {
            [alliance ? "allianceId" : "uid"]: id,
            rewardId,
            rank: position + 1,
          };
          if (alliance) {
            const raw = publication.alliances[position];
            const data: unknown = raw
              ? JSON.parse(raw)
              : presentation.alliances.find((row) => row.allianceId === id);
            if (data != null && (typeof data !== "object" || Array.isArray(data)))
              throw new GameError(errors.invalid);
            if (data)
              for (const key of ["name", "server", "abbr", "icon"])
                if ((data as Row)[key] != null) member[key] = (data as Row)[key]!;
          } else {
            const data = players.get(id);
            if (data && text(data, "name").trim()) {
              member.name = text(data, "name");
              member.server = data.server!;
              member.pic = text(data, "pic");
              member.picVer = num(data, "picVer");
              member.picfraId = num(data, "picfraId");
              member.abbr = text(data, "abbr");
            }
          }
          return [member];
        });
        const realms =
          type >= 3 && members.length && event.kingdomRank
            ? String(event.kingdomRank)
                .split("|")
                .map((raw, rank) => {
                  const id = Number(javaDecimal(raw, 32));
                  return {
                    ...presentation.realms.find((row) => Number(row.id) === id),
                    id,
                    rank: rank + 1,
                  };
                })
            : [];
        return { event, members, realms };
      }),
    );
  }
  private async heroInsideRanking(uid: string, params: Fields): Promise<Fields> {
    const now = this.now();
    const current = this.checkProfile(await this.db.getProfileById(uid), now);
    if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const source = current.crossFightSrcServerId;
    const realm = source == null || Number(source) === -1 ? this.config.kingdomId : Number(source);
    if (!this.db.heroInsideRanking) throw new GameError(errors.unsupported, "ranking");
    const state = await this.db.heroInsideRanking(uid, realm, wireString(params, "actId"), now);
    const profile = this.checkProfile(state.profile, now);
    if (profile.uid !== uid || num(profile, "serverId") !== realm)
      throw new GameError(errors.invalid);
    return heroInsideRanking(state.rows);
  }
  private async heroSelfRanking(uid: string, params: Fields): Promise<Fields> {
    const now = this.now();
    const current = this.checkProfile(await this.db.getProfileById(uid), now);
    if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const source = current.crossFightSrcServerId;
    const realm = source == null || Number(source) === -1 ? this.config.kingdomId : Number(source);
    const activityId = wireString(params, "activityId");
    if (!this.db.heroRanking) throw new GameError(errors.unsupported, "ranking");
    const state = await this.db.heroRanking(uid, realm, activityId, now);
    const profile = this.checkProfile(state.profile, now);
    if (profile.uid !== uid || num(profile, "serverId") !== realm)
      throw new GameError(errors.invalid);
    const positions: number[] = [];
    for (const event of state.events) {
      const query = heroRankingLookup(
        event,
        uid,
        text(profile, "allianceId"),
        this.rules,
        realm,
        MOBILE_CLIENT_VERSION,
      );
      if (typeof query === "number") positions.push(query);
      else {
        if (!this.services.heroRankingPosition) throw new GameError(errors.unsupported, "ranking");
        positions.push(await this.services.heroRankingPosition(query));
      }
    }
    return mapHeroSelfRanking(heroSelfRanking(state.events, positions));
  }
  private async publishedRanking(uid: string, kind: "payment" | "consumption"): Promise<Fields> {
    const now = this.now();
    const profile = this.checkProfile(await this.db.getProfileById(uid), now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const key = kind === "payment" ? "new_rank_recharge" : "new_rank_cost";
    if (
      !serverFeature(this.rules, key, {
        kingdomId: this.config.kingdomId,
        version: MOBILE_CLIENT_VERSION,
        now,
      })
    )
      return {};
    if (!versionAtLeast(MOBILE_CLIENT_VERSION, this.rules.features.get(key)!.version!)) return {};
    if (!this.services.publishedGlobalRanking || !this.db.rankingPrivacy)
      throw new GameError(errors.unsupported, "ranking");
    const hide = await this.db.rankingPrivacy(uid, kind);
    return publishedRanking(await this.services.publishedGlobalRanking(kind), uid, hide);
  }
  private async attributeRanking(uid: string, params: Fields): Promise<Fields> {
    if (this.config.kingdomId > 999999) return {};
    if (!this.db.normalRankingRealm) throw new GameError(errors.unsupported, "ranking");
    if (!(await this.db.normalRankingRealm())) return {};
    const type = wireInt(params, "rankType");
    const profile = this.checkProfile(await this.db.getProfileById(uid), this.now());
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    if (![0, 1, 2].includes(type)) return {};
    if (!this.services.attributeRanking) throw new GameError(errors.unsupported, "ranking");
    return attributeRanking(await this.services.attributeRanking(type), type);
  }
  private async dragonRanking(uid: string, params: Fields): Promise<Fields> {
    const profile = this.checkProfile(await this.db.getProfileById(uid), this.now());
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const ranges = dragonRankingRanges(wireString(params, "index_limit"));
    if (ranges === undefined) return {};
    if (!this.services.dragonRanking) throw new GameError(errors.unsupported, "ranking");
    const entries = await this.services.dragonRanking(ranges, text(profile, "allianceId"));
    return dragonRanking(decodeDragonRanking(entries));
  }
  private async globalCelebrityRanking(uid: string, params: Fields): Promise<Fields> {
    if (this.config.kingdomId > 999999) return {};
    if (!this.db.normalRankingRealm) throw new GameError(errors.unsupported, "ranking");
    if (!(await this.db.normalRankingRealm())) return {};
    const rankType = wireInt(params, "rankType");
    if (!Number.isInteger(rankType) || rankType < -2147483648 || rankType > 2147483647)
      throw new GameError(errors.invalid);
    const profile = this.checkProfile(await this.db.getProfileById(uid), this.now());
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    if (![0, 1, 2, 3, 4, 5, 6, 11].includes(rankType)) return {};
    if (!this.services.globalCelebrityRanking) throw new GameError(errors.unsupported, "ranking");
    const rows = await this.services.globalCelebrityRanking(rankType);
    if (!Array.isArray(rows) || rows.length > (rankType === 4 ? 30 : 151))
      throw new GameError(errors.unsupported, "ranking");
    return { rankMap: sfs.array(rows.map((row) => sfs.object(decodeLegacyJsonObject(row)))) };
  }
  private async scoreActivityRanking(uid: string): Promise<Fields> {
    const profile = this.checkProfile(await this.db.getProfileById(uid), this.now());
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    if (!this.services.scoreActivityRanking) throw new GameError(errors.unsupported, "ranking");
    const board = await this.services.scoreActivityRanking();
    if (
      !Array.isArray(board) ||
      board.length > 32767 ||
      board.some((value) => typeof value !== "string" || !value.isWellFormed())
    )
      throw new GameError(errors.unsupported, "ranking");
    return { rank: { type: Type.StringArray, value: [...board] } };
  }
  private async expeditionRanking(uid: string): Promise<Fields> {
    if (this.rules.kingdomId !== this.config.kingdomId || !this.services.expeditionRanking)
      throw new GameError(errors.unsupported, "ranking");
    const now = this.now();
    const profile = this.checkProfile(await this.db.getProfileById(uid), now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const limit = expeditionRankingLimit(this.rules);
    const entries = await this.services.expeditionRanking(limit);
    return expeditionRanking(selectExpeditionRanking(uid, limit, decodeExpeditionRanking(entries)));
  }
  private async allianceRanking(uid: string, kind: AllianceRankingKind): Promise<Fields> {
    if (this.rules.kingdomId !== this.config.kingdomId)
      throw new GameError(errors.unsupported, "ranking");
    const query = allianceRankingQuery(kind, this.rules, this.now());
    const snapshot = await this.db.allianceRanking(uid, query);
    const profile = this.checkProfile(snapshot.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    return allianceRanking(kind, selectAllianceRanking(query, snapshot, this.rules));
  }
  private async ranking(uid: string, kind: PlayerRankingKind): Promise<Fields> {
    if (this.rules.kingdomId !== this.config.kingdomId)
      throw new GameError(errors.unsupported, "ranking");
    const query = playerRankingQuery(kind, this.rules, this.now());
    const snapshot = await this.db.playerRanking(uid, query);
    const profile = this.checkProfile(snapshot.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    return playerRanking(kind, selectPlayerRanking(uid, query, snapshot));
  }
  private async publicProfile(uid: string, params: Fields): Promise<Fields> {
    const now = this.now();
    const observer = this.checkProfile(await this.db.getProfileById(uid), now);
    if (text(observer, "uid") !== uid) throw new GameError(errors.invalid);
    const target = params.uid;
    if (!target || target.type === Type.Null) throw new GameError(errors.missing);
    if (target.type !== Type.String || typeof target.value !== "string")
      throw new GameError(errors.invalid);
    if (!target.value.trim()) throw new GameError(errors.missing);
    if (!/^[0-9]{1,40}$/.test(target.value)) throw new GameError(errors.invalid);
    const result = await this.db.publicProfile(target.value, text(observer, "allianceId"));
    if (!result?.state.profile) throw new GameError(errors.missing);
    const { state, kingdomId } = result;
    if (
      !Number.isInteger(kingdomId) ||
      kingdomId <= 0 ||
      kingdomId > 2147483647 ||
      text(state.profile!, "uid") !== target.value ||
      num(state.profile!, "serverId") !== kingdomId
    )
      throw new GameError(errors.invalid);
    if (
      state.alliance &&
      state.alliance.withEffects !==
        (text(observer, "allianceId") !== text(state.profile!, "allianceId"))
    )
      throw new GameError(errors.invalid);
    const context = { kingdomId: this.config.kingdomId, version: MOBILE_CLIENT_VERSION, now };
    const body = {
      ...publicProfileBase(state, this.rules, context, "", kingdomId),
      ...publicProfileGenerals(state, this.rules, now),
      ...publicProfileAlliance(state, this.rules, kingdomId !== this.config.kingdomId),
    };
    const updates = await this.services.playerUpdateTimes?.(kingdomId, [target.value]);
    body.lastUpdateTime = sfs.string(updates?.get(target.value) ?? "");
    return body;
  }
  private async power(uid: string): Promise<Fields> {
    const now = this.now();
    const state = await this.db.getPowerByPlayerId(uid, now);
    const profile = this.checkProfile(state.profile, now);
    if (text(profile, "uid") !== uid) throw new GameError(errors.invalid);
    const ruleContext = {
      now,
      kingdomId: this.config.kingdomId,
      version: MOBILE_CLIENT_VERSION,
    };
    const context = powerContext(this.rules, state.knight, ruleContext);
    if (
      context.dragonLevelUp &&
      context.dragonScience &&
      state.dragons.some((dragon) => num(dragon, "dragonState") === 3)
    ) {
      if (!this.services.worldPowerEffects) throw new GameError(errors.unsupported, "power_state");
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
    return powerInfo(state.statistics, power, state.upload, this.rules);
  }
  private async playerSummaries(params: Fields): Promise<Fields> {
    const value = params.uids;
    if (!value || value.type === Type.Null) return { uids: sfs.array() };
    if (value.type !== Type.Array || !Array.isArray(value.value))
      throw new GameError(errors.invalid);
    const uids: string[] = [];
    for (const entry of value.value as Value[]) {
      if (entry?.type !== Type.String || typeof entry.value !== "string")
        throw new GameError(errors.invalid);
      if (!entry.value.trim()) continue;
      if (entry.value.length > 255) throw new GameError(errors.invalid);
      uids.push(entry.value);
    }
    if (!uids.length || uids.length > 50) return { uids: sfs.array() };
    const summaries = await this.db.getPlayerSummariesByIds(
      uids.filter((id) => id !== "3000002"),
      "allservers" in params,
    );
    const groups = new Map<number, string[]>();
    for (const summary of summaries) {
      const ids = groups.get(summary.kingdomId) ?? [];
      ids.push(text(summary.data, "uid"));
      groups.set(summary.kingdomId, ids);
    }
    const updates = new Map<number, ReadonlyMap<string, string>>();
    for (const [id, ids] of groups)
      updates.set(
        id,
        (await this.services.playerUpdateTimes?.(id, [...new Set(ids)])) ?? new Map(),
      );
    const fallback = String(Math.trunc(this.now() / 1000));
    const out = summaries.map((summary) =>
      sfs.object(
        playerSummary(
          summary,
          updates.get(summary.kingdomId)?.get(text(summary.data, "uid")) ?? fallback,
        ),
      ),
    );
    if (uids.includes("3000002")) out.push(sfs.object(guidePlayerSummary()));
    return { uids: sfs.array(out) };
  }
  private checkProfile(profile: Row | undefined, now = this.now()): Row {
    if (!profile) throw new GameError(errors.missing);
    if (long(profile, "banTime") > BigInt(now) || num(profile, "banFlag") !== 0)
      throw new GameError(errors.invalid);
    return profile;
  }
  private featureContext(profile: Row): FeatureContext {
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
  private async configuration(uid: string): Promise<Fields> {
    const state = await this.db.getConfigurationByPlayerId(uid);
    const profile = this.checkProfile(state.profile);
    const context = this.featureContext(profile);
    const result = loginConfigurationPreferences(this.rules, state);
    await this.initializeWorldNewsPreference(uid, state.pushSettings, context.now);
    try {
      const switchRows = this.db.configurationSwitches
        ? await this.db.configurationSwitches()
        : state.switches;
      if (switchRows !== undefined) {
        Object.assign(result, loginSwitches(switchRows));
        let count: string | null = null;
        if (accountVerificationEnabled(this.rules, context)) {
          if (!this.services.changeAccountCount)
            throw new GameError(errors.unsupported, "account_rule");
          count = await this.services.changeAccountCount(String(profile.deviceId ?? "null"));
        }
        result.isVerifyChangeAccount = sfs.bool(
          accountVerificationRequired(this.rules, context, count),
        );
      }
    } catch {}
    Object.assign(result, featureConfig(this.rules, context));
    return result;
  }
  private async initializeWorldNewsPreference(uid: string, rows: readonly Row[], now: number) {
    if (
      rows.length < PUSH_SETTING_COUNT &&
      !rows.some((row) => num(row, "type") === WORLD_NEWS_PUSH_TYPE)
    ) {
      if (!this.db.initializeWorldNewsPreference)
        throw new GameError(errors.unsupported, "config_record");
      await this.db.initializeWorldNewsPreference(uid, now);
    }
  }
  private async nicknameCheck(uid: string, params: Fields): Promise<Fields> {
    const profile = await this.profile(uid);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
      throw new GameError(errors.invalid);
    const result = await checkNickname(
      wireString(params, "nickName"),
      Object.hasOwn(params, "type") ? wireInt(params, "type") : 0,
      {
        containsBadWords: (name) => {
          if (!this.services.nicknameBadWords) throw new GameError(errors.unsupported);
          return this.services.nicknameBadWords(name);
        },
        occupied: (name) => {
          if (!this.db.nicknameOccupied) throw new GameError(errors.unsupported);
          return this.db.nicknameOccupied(name);
        },
      },
    );
    return {
      occupied: sfs.int(result.occupied),
      exist: sfs.int(result.exist),
      length: sfs.int(result.length),
      remainLength: sfs.int(result.remainLength),
    };
  }
  private async getPushPreferences(uid: string): Promise<Fields> {
    const state = await this.db.getConfigurationByPlayerId(uid);
    const now = this.now();
    this.checkProfile(state.profile, now);
    const pushSetting = pushPreferences(state.pushSettings);
    await this.initializeWorldNewsPreference(uid, state.pushSettings, now);
    return { pushSetting };
  }
  private async setPushPreference(uid: string, params: Fields): Promise<Fields> {
    const audio = wireInt(params, "audio", 1);
    const type = wireInt(params, "type");
    const status = wireInt(params, "status");
    if (
      [type, status, audio].some(
        (value) => !Number.isInteger(value) || value < -2147483648 || value > 2147483647,
      )
    )
      throw new GameError(errors.invalid);
    if (!this.db.setPushPreference) throw new GameError(errors.unsupported);
    await this.profile(uid);
    const dto: UpdatePushPreferenceDto = { type, status, audio };
    await this.db.setPushPreference(uid, dto, this.now());
    return {};
  }
  private async otherLogin(uid: string, params: Fields): Promise<Fields> {
    if (!params.army) {
      if (params.config) return this.configuration(uid);
      if (params.store) return { store: sfs.array() };
      if (params.exchange) return { exchange: sfs.array(), exchange_gift: sfs.array() };
    }
    const state = await this.state(uid);
    if (params.army)
      return {
        resource: sfs.object(resource(state.resource)),
        ...militarySnapshot(state.armies, state.hospital ?? [], state.forts ?? [], this.rules),
        items: sfs.array(state.items.map((r) => sfs.object(inventoryItem(r, this.rules)))),
      };
    const lord = state.lord;
    if (!lord) throw new GameError(errors.missing);
    const out: Fields = { medal: sfs.string(text(lord, "medal")) };
    const time = serverClock(this.now(), 0);
    out.nextDay = sfs.long(Number(time.tomorrow!.value) * 1000);
    for (const key of ["levelUp", "pveLevel", "freshRechargeTotal", "castleLevelUp"])
      out[key] = sfs.int(num(lord, key));
    out.remainAttackTime = sfs.int(num(lord, "remainAttackLeaderBossTime"));
    return { lord: sfs.object(out), tomorrow: time.tomorrow! };
  }
}
