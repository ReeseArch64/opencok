import { worldPointDetail } from "./world-point-detail.ts";
import { profilePreference } from "./profile-preferences.ts";
import { celebrityDescription, saveCelebrityDescription } from "./celebrity.ts";
import { checkNickname } from "@opencok/rules/nickname";
import { favoriteInteger, favoriteName, favoriteServer } from "@opencok/rules/world-favorites";
import { worldFavorites } from "@opencok/dtos/world-favorites";
import { worldSearch } from "@opencok/dtos/world-search";
import { worldSearchName, worldSearchOffset } from "@opencok/rules/world-search";
import { playerSearch } from "@opencok/dtos/player-search";
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
import { mailDeleted, mailSave, mailStatus } from "@opencok/dtos/mail";
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
import { planMailDeletion } from "./mail-delete.ts";
import { mailUpdateCursor, mailUpdatesProjection } from "./mail-updates.ts";
import {
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
import { expeditionRanking } from "@opencok/dtos/expedition-ranking";
import { expeditionRankingLimit, selectExpeditionRanking } from "@opencok/rules/expedition-ranking";
import { decodeExpeditionRanking } from "./expedition-ranking.ts";
import { allianceRanking } from "@opencok/dtos/alliance-ranking";
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
import { guidePlayerSummary, playerSummary } from "@opencok/dtos/players";
import { building, gold, queue, resource, user } from "@opencok/dtos/city";
import { powerInfo } from "@opencok/dtos/power";
import { publicProfileBase } from "@opencok/dtos/profile";
import { publicProfileAlliance, publicProfileGenerals } from "./profile.ts";
import { playerRanking } from "@opencok/dtos/ranking";
import { playerRankingQuery, selectPlayerRanking } from "@opencok/rules/ranking";
import type { PlayerRankingKind } from "@opencok/contracts/ranking";
import { calculatePlayerPower } from "@opencok/rules/power";
import { powerContext, decodeWorldPowerEffects, generalSkillPoints } from "./power.ts";
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
  armySnapshot,
  dataConfig,
  featureConfig,
  inventoryItem,
  serverClock,
  settingConfig,
  loginConfigurationPreferences,
  loginSwitches,
  pushPreferences,
} from "@opencok/dtos/bootstrap";

const playerRankingKinds = {
  "server.rank": "power",
  "kill.rank": "kills",
  "level.rank": "level",
  "building.rank": "building",
  "silver.contribute.rank": "contribution",
} as const;

type GameConfig = Pick<ServerConfig, "kingdomId" | "mailTranslationEnabled" | "crossSearchEnabled">;

type ReadyCity = CityState & { profile: Row; resource: Row };
export interface Result {
  body: Fields;
  pushes: { command: string; body: Fields }[];
}

export class Game {
  constructor(
    readonly db: GameStore,
    readonly rules: Rules,
    readonly config: GameConfig,
    readonly now = Date.now,
    readonly services: GameServices = {},
  ) {}
  private async state(uid: string): Promise<ReadyCity> {
    const state = await this.db.city(uid, this.now());
    if (!state.profile || !state.resource) throw new GameError(errors.missing);
    if (long(state.profile, "banTime") > BigInt(this.now()) || num(state.profile, "banFlag") !== 0)
      throw new GameError(errors.invalid);
    return { ...state, profile: state.profile, resource: state.resource };
  }
  private queueDto(q: Row, state: ReadyCity, helped = true, now = this.now()): Fields {
    const target = state.buildings.find((b) => text(b, "uuid") === text(q, "itemId"));
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
          .map((q) => sfs.object(this.queueDto(q, state, true, now))),
      ),
      resource: sfs.object(resource(state.resource)),
      gold: sfs.long(gold(state.profile)),
    };
  }
  async initial(uid: string): Promise<Fields> {
    const state = await this.state(uid);
    const world = state.world;
    if (!world || num(world, "worldId") !== 0 || state.hasMarches)
      throw new GameError(errors.unsupported, "world_state");
    return {
      ...serverClock(this.now(), 0),
      ...featureConfig(this.rules, this.featureContext(state.profile)),
      ...this.info(state),
      user: sfs.object(user(state.profile, this.rules, this.config.kingdomId)),
      newAccount: sfs.bool(false),
      queue: sfs.array(state.queues.map((q) => sfs.object(this.queueDto(q, state)))),
      world: sfs.object({
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
      }),
      serverTime: sfs.long(this.now()),
    };
  }
  async execute(uid: string, command: string, params: Fields): Promise<Result> {
    let body: Fields;
    let pushes: Result["pushes"] = [];
    switch (command) {
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
      case "user.avatar.finish":
        ({ body, pushes } = await this.avatarFinish(uid, params));
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
    if (command === "act.score.rank" && encode(extension(command, body)).length > MAX_FRAME)
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
      const query = {
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
        now,
      };
      const state = await store.add(uid, query);
      check(state.profile);
      const repliedAt = this.now();
      if (!Number.isSafeInteger(repliedAt) || repliedAt < 0) throw new GameError(errors.invalid);
      return { state: sfs.int(1), createTime: sfs.long(repliedAt), point: sfs.int(query.point) };
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
        grant: service.issue(uid, sequence),
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
      pendingHash: sfs.string(state.grant.pendingHash),
    };
  }
  private async chatSession(uid: string): Promise<Fields> {
    if (!this.services.chatSession) throw new GameError(errors.unsupported);
    const now = this.now();
    const profile = this.checkProfile(await this.db.profile(uid), now);
    const request = realmChatSessionRequest(profile, uid, this.config.kingdomId);
    try {
      return realmChatSessionResponse(await this.services.chatSession(request), this.now());
    } catch {
      throw new GameError(errors.invalid);
    }
  }
  private async profile(uid: string): Promise<Row> {
    return this.checkProfile(await this.db.profile(uid));
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
  private async mailUpdates(uid: string, params: Fields): Promise<Fields> {
    const now = this.now();
    const profile = this.checkProfile(await this.db.profile(uid), now);
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
    if (!this.db.mailConversationRead || query.effects.some((effect) => effect.kind === "chat"))
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
    const state = await this.db.mailCategoryDelete(uid, query, (counts) => {
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
    });
    const profile = this.checkProfile(state.profile, query.now);
    if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
      throw new GameError(errors.invalid);
    return body;
  }
  private async mailTypeDelete(uid: string, params: Fields): Promise<Fields> {
    wireInt(params, "mod", 0);
    if (params.fromUser !== undefined) {
      if (params.fromUser.type !== Type.Null) wireString(params, "fromUser");
      throw new GameError(errors.unsupported, "mail");
    }
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
  private async scoreActivityRanking(uid: string): Promise<Fields> {
    const profile = this.checkProfile(await this.db.profile(uid), this.now());
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
    const profile = this.checkProfile(await this.db.profile(uid), now);
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
    const observer = this.checkProfile(await this.db.profile(uid), now);
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
    const state = await this.db.power(uid, now);
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
    const summaries = await this.db.playerSummaries(
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
    const state = await this.db.configuration(uid);
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
    const state = await this.db.configuration(uid);
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
    await this.db.setPushPreference(uid, { type, status, audio }, this.now());
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
        army: sfs.array(state.armies.map((r) => sfs.object(armySnapshot(r, this.rules)))),
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
