import { readHeroEvents } from "./hero-event";
import type { HeroEventSelection } from "@opencok/contracts/hero-event";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { user_hospital } from "@opencok/drizzle/schema/opencok_kingdom/user_hospital";
import { user_wall } from "@opencok/drizzle/schema/opencok_kingdom/user_wall";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { deleteMailConversations } from "./mail-conversation-delete.ts";
import { relayMailChat } from "./mail-chat-intents.ts";
import type { ChatMailboxPublisher } from "@opencok/contracts/chat-mailbox";
import { readBattleRankingState } from "./battle-ranking.ts";
import { readFlowerRanking } from "./flower-ranking.ts";
import { readDonationRanking, readCemeteryRanking } from "./community-ranking.ts";
import { readThroneRanking } from "./throne-ranking.ts";
import type { ThroneRankingPeriod } from "@opencok/contracts/throne-ranking";
import {
  readHeroRanking,
  readHeroInsideRanking,
  readHeroHistory,
  readHeroHistoryPresentation,
} from "./hero-ranking.ts";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { reportAvatar } from "./avatar-report.ts";
import { pic_upload_record } from "@opencok/drizzle/schema/opencok_kingdom/pic_upload_record";
import { readSystemMail } from "./mail-system.ts";
import { readMailBatch } from "./mail-batch.ts";
import { readNormalRankingRealm, readCrossRankingRealm } from "./ranking-realm.ts";
import { readMailUpdates } from "./mail-updates.ts";
import type { MailUpdateInspector, MailUpdateQuery } from "@opencok/contracts/mail-updates";
import { markMailConversationRead } from "./mail-conversation-read.ts";
import { deleteMailCategories, deleteMailType } from "./mail-batch-delete.ts";
import { readMailGroups } from "./mail-groups.ts";
import { readMailCategory } from "./mail-category.ts";
import { translationv2 } from "@opencok/drizzle/schema/opencok_kingdom/translationv2";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { readMailStatus } from "./mail.ts";
import type {
  MailSystemQuery,
  MailSystemInspector,
  MailBatchQuery,
  MailGroupQuery,
  MailGroupInspector,
  MailCategoryQuery,
  MailCategoryInspector,
  MailContentsQuery,
  MailContentsInspector,
  MailConversationSaveQuery,
  MailConversationReadQuery,
  MailCategoryDeleteQuery,
  MailCategoryDeleteInspector,
  MailBatchInvitationPlanner,
  MailTypeDeleteQuery,
  MailConversationDeleteQuery,
  MailDeleteQuery,
  MailDeletePlanner,
  MailReadQuery,
  MailSaveQuery,
  MailStatusQuery,
} from "@opencok/contracts/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import { alliance_invite_move } from "@opencok/drizzle/schema/opencok_kingdom/alliance_invite_move";
import { deleteMail } from "./mail-delete.ts";
import { readMailContents } from "./mail-contents.ts";
import { saveMailConversation } from "./mail-conversation-save.ts";
import { mail_gift_log } from "@opencok/drizzle/schema/opencok_global/mail_gift_log";
import { mail_gift_opening } from "@opencok/drizzle/schema/opencok_kingdom/mail_gift_opening";
import { markMailRead } from "./mail-read.ts";
import { relayMailGiftOpenings } from "./mail-gift-relay.ts";
import { mail_update } from "@opencok/drizzle/schema/opencok_kingdom/mail_update";
import { saveMail } from "./mail-save.ts";
import { material_cost_ranking } from "@opencok/drizzle/schema/opencok_kingdom/material_cost_ranking";
import { readAllianceRanking } from "./alliance-ranking.ts";
import type { AllianceRankingQuery } from "@opencok/contracts/alliance-ranking";
import { createDatabases } from "@opencok/drizzle";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_civilization_prestige } from "@opencok/drizzle/schema/opencok_kingdom/user_civilization_prestige";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { user_mine } from "@opencok/drizzle/schema/opencok_kingdom/user_mine";
import { switches } from "@opencok/drizzle/schema/opencok_kingdom/switches";
import { parse_info } from "@opencok/drizzle/schema/opencok_kingdom/parse_info";
import { WORLD_NEWS_PUSH_TYPE } from "@opencok/constants/game";
import { setPushPreference } from "./push-preferences.ts";
import { updateProfilePreference } from "./profile-preferences.ts";
import { nicknameOccupied } from "./nickname.ts";
import { readCelebrityDescription, saveCelebrityDescription } from "./celebrity.ts";
import { celebrity } from "@opencok/drizzle/schema/opencok_kingdom/celebrity";
import { usermapping } from "@opencok/drizzle/schema/opencok_global/usermapping";
import { DependencyError } from "@opencok/errors/dependency";
import {
  and,
  asc,
  eq,
  getTableColumns,
  gt,
  inArray,
  or,
  sql,
  DrizzleQueryError,
} from "drizzle-orm";
import type { ServerConfig } from "@opencok/contracts/server";
import type {
  GameStore,
  CityState,
  LoginConfigurationState,
  PushPreference,
  ProfilePreferenceField,
} from "@opencok/contracts/game";
import { num, type Row } from "@opencok/contracts/rows";
import { checkPlayerSummaryStore, getPlayerSummariesByIds } from "./players.ts";
import { checkPowerStore, getPowerByPlayerId } from "./power.ts";
import { checkPublicProfileStore, loadPublicProfile } from "./profile.ts";
import { loadFriendshipMine } from "./reconnect-mine.ts";
import type { FriendshipMine, FriendshipMineStore } from "@opencok/contracts/reconnect";
import type { PlayerRankingQuery } from "@opencok/contracts/ranking";
import { readPlayerRanking } from "./ranking.ts";

type GameRepositoryConfig = Pick<
  ServerConfig,
  | "databaseUrl"
  | "timeoutMs"
  | "globalDatabase"
  | "kingdomId"
  | "kingdomDatabase"
  | "playerKingdoms"
  | "mailChat"
>;

export class Database implements GameStore, FriendshipMineStore {
  readonly databases;
  readonly kingdom;
  async rankingPrivacy(uid: string, kind: "payment" | "consumption"): Promise<number> {
    if (!uid || uid.length > 40 || (kind !== "payment" && kind !== "consumption"))
      throw new Error("Invalid ranking privacy request");
    const column = kind === "payment" ? user_mixed_info.payHide : user_mixed_info.costHide;
    const rows = await this.kingdom.db
      .select({ hide: column })
      .from(user_mixed_info)
      .where(eq(user_mixed_info.uid, uid))
      .limit(1);
    return rows[0]?.hide ?? 0;
  }
  battleRankingState(uid: string, now: number) {
    return readBattleRankingState(
      this.kingdom.db,
      this.databases.global.db,
      uid,
      this.config.kingdomId,
      now,
    );
  }
  heroEvents(uid: string, kingdomId: number, selection: HeroEventSelection, now: number) {
    if (!Number.isInteger(kingdomId) || kingdomId < 1 || !this.databases.kingdoms.has(kingdomId))
      throw new Error("Unconfigured hero realm");
    return readHeroEvents(this.databases.getKingdom(kingdomId).db, uid, selection, now);
  }
  heroHistory(uid: string, kingdomId: number, type: number, now: number) {
    if (!Number.isInteger(kingdomId) || kingdomId < 1 || !this.databases.kingdoms.has(kingdomId))
      throw new Error("Unconfigured hero ranking realm");
    return readHeroHistory(this.databases.getKingdom(kingdomId).db, uid, type, now);
  }
  heroHistoryPresentation(alliances: readonly string[], realms: readonly number[]) {
    return readHeroHistoryPresentation(this.databases.global.db, alliances, realms);
  }
  heroInsideRanking(uid: string, kingdomId: number, eventId: string, now: number) {
    if (!Number.isInteger(kingdomId) || kingdomId < 1 || !this.databases.kingdoms.has(kingdomId))
      throw new Error("Unconfigured hero ranking realm");
    return readHeroInsideRanking(this.databases.getKingdom(kingdomId).db, uid, eventId, now);
  }
  heroRanking(uid: string, kingdomId: number, activityId: string, now: number) {
    if (!Number.isInteger(kingdomId) || kingdomId < 1 || !this.databases.kingdoms.has(kingdomId))
      throw new Error("Unconfigured hero ranking realm");
    return readHeroRanking(this.databases.getKingdom(kingdomId).db, uid, activityId, now);
  }
  throneRanking(kingdomId: number, publication?: ThroneRankingPeriod) {
    if (!Number.isInteger(kingdomId) || kingdomId < 1 || !this.databases.kingdoms.has(kingdomId))
      throw new Error("Unconfigured throne ranking realm");
    return readThroneRanking(
      this.databases.getKingdom(kingdomId).db,
      this.databases.global.db,
      publication,
    );
  }
  donationRanking(uid: string, now: number) {
    return readDonationRanking(this.kingdom.db, uid, now);
  }
  cemeteryRanking(uid: string, type: "0" | "1", now: number) {
    return readCemeteryRanking(this.kingdom.db, uid, type, now);
  }
  crossRankingRealm(): Promise<boolean> {
    return readCrossRankingRealm(this.databases.global.db, this.config.kingdomId);
  }
  flowerRanking(uid: string, realm: number, uids: readonly string[]) {
    if (!Number.isInteger(realm) || realm < 1 || !this.databases.kingdoms.has(realm))
      throw new Error("Unconfigured flower ranking realm");
    return readFlowerRanking(this.databases.getKingdom(realm).db, uid, uids);
  }
  normalRankingRealm(): Promise<boolean> {
    return readNormalRankingRealm(this.databases.global.db, this.config.kingdomId);
  }
  constructor(readonly config: GameRepositoryConfig) {
    const kingdoms = [...(config.playerKingdoms ?? [])];
    const own = kingdoms.find((realm) => realm.id === config.kingdomId);
    if (own && own.database !== config.kingdomDatabase)
      throw new Error("Player realm configuration conflicts with the selected realm");
    if (!own) kingdoms.push({ id: config.kingdomId, database: config.kingdomDatabase });
    if (kingdoms.length > 2) throw new Error("At most two player realms may be configured");
    this.databases = createDatabases(
      {
        connectionString: config.databaseUrl,
        max: 8,
        connectionTimeoutMillis: config.timeoutMs,
        statement_timeout: config.timeoutMs,
        query_timeout: config.timeoutMs,
      },
      {
        globalDatabase: config.globalDatabase,
        kingdoms,
      },
    );
    this.kingdom = this.databases.getKingdom(config.kingdomId);

    for (const kingdom of this.databases.kingdoms.values()) kingdom.pool.on("error", () => {});
    this.databases.global.pool.on("error", () => {});
  }
  async start() {
    await this.kingdom.db.select().from(userprofile).limit(0);
    for (const table of [
      user_resource,
      user_building,
      queue,
      user_world,
      worldpoint,
      world_march,
      user_army,
      user_item,
      user_lord,
      user_civilization_prestige,
      user_mine,
      material_cost_ranking,
      mail,
      mail_update,
      mail_gift_opening,
      mail_contents,
      translationv2,
      mail_group,
      alliance_invite_move,
      switches,
      parse_info,
      celebrity,
      pic_upload_record,
    ])
      await this.kingdom.db.select().from(table).limit(0);
    await this.databases.global.db.select().from(account_new).limit(0);
    await this.databases.global.db
      .select({
        uid: usermapping.gameUid,
        type: usermapping.mappingType,
        value: usermapping.mappingValue,
      })
      .from(usermapping)
      .limit(0);
    await this.databases.global.db
      .select({
        uid: mail_gift_log.uid,
        sendTime: mail_gift_log.sendTime,
        toUid: mail_gift_log.toUid,
        isOpened: mail_gift_log.isOpened,
        receiveTime: mail_gift_log.receiveTime,
      })
      .from(mail_gift_log)
      .limit(0);
    await checkPlayerSummaryStore(this.kingdom.db);
    await checkPowerStore(this.kingdom.db);
    await checkPublicProfileStore(this.kingdom.db);
  }
  async health() {
    await Promise.all([
      this.kingdom.db.execute(sql`select 1`),
      this.databases.global.db.execute(sql`select 1`),
    ]);
  }
  async getProfileById(uid: string): Promise<Row | undefined> {
    return (
      await this.kingdom.db.select().from(userprofile).where(eq(userprofile.uid, uid)).limit(1)
    )[0];
  }
  updateAvatarReport(owner: string, target: string, now: number) {
    return reportAvatar(this.kingdom.db, this.config.kingdomId, owner, target, now);
  }
  celebrityDescription(uid: string, kingdomId: number): Promise<Buffer | null> {
    return readCelebrityDescription(this.databases, uid, kingdomId);
  }
  saveCelebrityDescription(uid: string, now: number, readDescription: () => Buffer | null) {
    return saveCelebrityDescription(
      this.kingdom.db,
      uid,
      this.config.kingdomId,
      now,
      readDescription,
    );
  }
  async getAccountsByPlayerId(uid: string): Promise<Row[]> {
    return this.databases.global.db
      .select({ active: account_new.active, server: account_new.server, uuid: account_new.uuid })
      .from(account_new)
      .where(eq(account_new.gameUid, uid));
  }
  async getCityByPlayerId(uid: string, now: number): Promise<CityState> {
    return this.kingdom.db.transaction(
      async (tx) => {
        const profile = (
          await tx.select().from(userprofile).where(eq(userprofile.uid, uid)).limit(1)
        )[0];
        const civilizationType = profile ? num(profile, "civilizationType") : 0;
        const prestige =
          civilizationType > 0
            ? (
                await tx
                  .select({ value: user_civilization_prestige.prestigeValue })
                  .from(user_civilization_prestige)
                  .where(
                    and(
                      eq(user_civilization_prestige.uid, uid),
                      eq(user_civilization_prestige.civilizationType, civilizationType),
                    ),
                  )
                  .limit(1)
              )[0]
            : undefined;
        const resource = (
          await tx.select().from(user_resource).where(eq(user_resource.uid, uid)).limit(1)
        )[0];
        const buildings = await tx
          .select()
          .from(user_building)
          .where(eq(user_building.uid, uid))
          .orderBy(asc(user_building.uuid));
        const queues = await tx
          .select()
          .from(queue)
          .where(eq(queue.ownerId, uid))
          .orderBy(asc(queue.uuid));
        const world = (
          await tx
            .select({
              ...getTableColumns(user_world),
              cityDefValue: worldpoint.cityDefValue,
              gridType: worldpoint.gridType,
              fireTime: worldpoint.fireTime,
            })
            .from(user_world)
            .innerJoin(
              worldpoint,
              and(
                eq(worldpoint.id, user_world.pointId),
                eq(worldpoint.worldId, user_world.worldId),
              ),
            )
            .where(eq(user_world.uid, uid))
            .limit(1)
        )[0];
        const hasMarches =
          (await tx.select({ uuid: world_march.uuid }).from(world_march).limit(1)).length > 0;
        const armies = await tx
          .select()
          .from(user_army)
          .where(eq(user_army.uid, uid))
          .orderBy(asc(user_army.armyId));
        const items = await tx
          .select()
          .from(user_item)
          .where(
            and(
              eq(user_item.ownerId, uid),
              gt(user_item.count, 0),
              or(eq(user_item.vanishTime, 0n), gt(user_item.vanishTime, BigInt(now))),
            ),
          )
          .orderBy(asc(user_item.itemId));
        const hospital = await tx
          .select()
          .from(user_hospital)
          .where(eq(user_hospital.uid, uid))
          .orderBy(asc(user_hospital.armyId));
        const forts = await tx
          .select()
          .from(user_wall)
          .where(eq(user_wall.uid, uid))
          .orderBy(asc(user_wall.armyId));
        const equipment = await tx
          .select()
          .from(user_equip)
          .where(eq(user_equip.uid, uid))
          .orderBy(asc(user_equip.uuid))
          .limit(1001);
        if (equipment.length > 1000) throw new Error("Oversized equipment inventory");
        const sciences = await tx
          .select()
          .from(user_science)
          .where(eq(user_science.uid, uid))
          .orderBy(asc(user_science.itemId));
        const lord = (await tx.select().from(user_lord).where(eq(user_lord.uid, uid)).limit(1))[0];
        return {
          profile,
          resource,
          buildings,
          queues,
          world,
          hasMarches,
          armies,
          sciences,
          equipment,
          hospital,
          forts,
          items,
          lord,
          civilizationPrestige: prestige?.value ?? 0n,
        };
      },
      { isolationLevel: "repeatable read", accessMode: "read only" },
    );
  }
  getConfigurationByPlayerId(uid: string): Promise<LoginConfigurationState> {
    return getConfigurationByPlayerId(this.kingdom.db, uid);
  }
  configurationSwitches(): Promise<Row[] | undefined> {
    return readLoginSwitches(this.kingdom.db);
  }
  initializeWorldNewsPreference(uid: string, now: number): Promise<void> {
    return initializeWorldNewsPreference(this.kingdom.db, uid, this.config.kingdomId, now);
  }
  setPushPreference(uid: string, preference: PushPreference, now: number): Promise<void> {
    return setPushPreference(this.kingdom.db, uid, this.config.kingdomId, preference, now);
  }
  nicknameOccupied(name: string): Promise<boolean> {
    return nicknameOccupied(this.databases.global.db, name);
  }
  updateProfilePreference(
    uid: string,
    field: ProfilePreferenceField,
    now: number,
    readValue: () => number,
  ): Promise<number | undefined> {
    return updateProfilePreference(
      this.kingdom.db,
      uid,
      this.config.kingdomId,
      field,
      now,
      readValue,
    );
  }
  getPowerByPlayerId(uid: string, now: number) {
    return getPowerByPlayerId(this.kingdom.db, uid, now);
  }
  getPlayerSummariesByIds(uids: string[], allServers: boolean) {
    return getPlayerSummariesByIds(this.databases, this.config.kingdomId, uids, allServers);
  }
  publicProfile(uid: string, observerAllianceId: string) {
    return loadPublicProfile(this.databases, this.config.kingdomId, uid, observerAllianceId);
  }
  mailStatus(uid: string, query: MailStatusQuery) {
    return readMailStatus(this.kingdom.db, uid, query);
  }
  mailSave(uid: string, query: MailSaveQuery) {
    return saveMail(this.kingdom.db, this.config.kingdomId, uid, query);
  }
  mailBatch(uid: string, query: MailBatchQuery, inspect: MailCategoryInspector) {
    return readMailBatch(this.databases, this.config.kingdomId, uid, query, inspect);
  }
  mailGroups(uid: string, query: MailGroupQuery, inspect: MailGroupInspector) {
    return readMailGroups(this.databases, this.config.kingdomId, uid, query, inspect);
  }
  mailCategory(uid: string, query: MailCategoryQuery, inspect: MailCategoryInspector) {
    return readMailCategory(this.databases, this.config.kingdomId, uid, query, inspect);
  }
  mailContents(uid: string, query: MailContentsQuery, inspect: MailContentsInspector) {
    return readMailContents(this.kingdom.db, this.config.kingdomId, uid, query, inspect);
  }
  mailConversationSave(uid: string, query: MailConversationSaveQuery) {
    return saveMailConversation(this.kingdom.db, this.config.kingdomId, uid, query);
  }
  mailRead(uid: string, query: MailReadQuery) {
    return markMailRead(this.kingdom.db, this.config.kingdomId, uid, query);
  }
  mailConversationRead(uid: string, query: MailConversationReadQuery) {
    if (query.effects.some((effect) => effect.kind === "chat") && !this.config.mailChat)
      throw new DependencyError("chat read delivery unavailable");
    return markMailConversationRead(this.kingdom.db, this.config.kingdomId, uid, query);
  }
  mailCategoryDelete(
    uid: string,
    query: MailCategoryDeleteQuery,
    inspect: MailCategoryDeleteInspector,
    invitations?: MailBatchInvitationPlanner,
    chatEnabled = false,
  ) {
    return deleteMailCategories(
      this.kingdom.db,
      this.config.kingdomId,
      uid,
      query,
      inspect,
      invitations,
      chatEnabled && !!this.config.mailChat,
    );
  }
  mailConversationDelete(uid: string, query: MailConversationDeleteQuery) {
    if (!this.config.mailChat) throw new DependencyError("chat deletion delivery unavailable");
    return deleteMailConversations(this.kingdom.db, this.config.kingdomId, uid, query);
  }
  mailTypeDelete(uid: string, query: MailTypeDeleteQuery) {
    return deleteMailType(this.kingdom.db, this.config.kingdomId, uid, query);
  }
  mailDelete(uid: string, query: MailDeleteQuery, plan: MailDeletePlanner) {
    return deleteMail(this.kingdom.db, this.config.kingdomId, uid, query, plan);
  }
  getSystemMailByPlayerId(uid: string, query: MailSystemQuery, inspect: MailSystemInspector) {
    return readSystemMail(this.databases, this.config.kingdomId, uid, query, inspect);
  }
  mailUpdates(uid: string, query: MailUpdateQuery, inspect: MailUpdateInspector) {
    return readMailUpdates(this.kingdom.db, this.config.kingdomId, uid, query, inspect);
  }
  relayMailChat(publish: ChatMailboxPublisher) {
    return relayMailChat(this.kingdom.db, this.config.kingdomId, publish, this.config.timeoutMs);
  }
  relayMailGifts() {
    return relayMailGiftOpenings(this.kingdom.db, this.databases.global.db);
  }
  allianceRanking(uid: string, query: AllianceRankingQuery) {
    return readAllianceRanking(this.kingdom.db, uid, query);
  }
  playerRanking(uid: string, query: PlayerRankingQuery) {
    return readPlayerRanking(this.kingdom.db, uid, query);
  }
  friendshipMine(uid: string, initial: () => FriendshipMine) {
    return loadFriendshipMine(
      this.databases.global.db,
      this.kingdom.db,
      this.config.kingdomId,
      uid,
      initial,
    );
  }
  async getWorldByPointIds(uid: string, ids: number[]) {
    return this.kingdom.db.transaction(
      async (tx) => {
        const world = (
          await tx.select().from(user_world).where(eq(user_world.uid, uid)).limit(1)
        )[0];
        const hasMarches =
          (await tx.select({ uuid: world_march.uuid }).from(world_march).limit(1)).length > 0;
        const points = ids.length
          ? await tx
              .select()
              .from(worldpoint)
              .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, ids)))
          : [];
        const owners = [
          ...new Set(
            points.filter((row) => row.pointType === 1 && row.ownerId).map((row) => row.ownerId!),
          ),
        ];
        const cosmetics = owners.length
          ? await tx
              .select()
              .from(user_state)
              .where(
                and(inArray(user_state.uid, owners), inArray(user_state.type2, [100, 105, 200])),
              )
              .orderBy(user_state.uid, user_state.stateId)
              .limit(8193)
          : [];
        if (cosmetics.length > 8192) throw new Error("World cosmetic projection exceeds bound");
        return { world, hasMarches, points, cosmetics };
      },
      { isolationLevel: "repeatable read", accessMode: "read only" },
    );
  }
  close() {
    return this.databases.close();
  }
}

export function getConfigurationByPlayerId(
  db: Database["kingdom"]["db"],
  uid: string,
): Promise<LoginConfigurationState> {
  return db.transaction(
    async (tx) => {
      const profile = (
        await tx.select().from(userprofile).where(eq(userprofile.uid, uid)).limit(1)
      )[0];
      const pushSettings = await tx
        .select({ type: parse_info.type, status: parse_info.status, audio: parse_info.audio })
        .from(parse_info)
        .where(eq(parse_info.uid, uid))
        .orderBy(asc(parse_info.type));
      return { profile, switches: undefined, pushSettings };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}

export async function readLoginSwitches(db: Database["kingdom"]["db"]): Promise<Row[] | undefined> {
  try {
    return await db.select().from(switches).orderBy(asc(switches.name));
  } catch (error) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error;
    if (
      cause &&
      typeof cause === "object" &&
      "code" in cause &&
      typeof cause.code === "string" &&
      /^[0-9A-Z]{5}$/.test(cause.code)
    )
      return [];
    return undefined;
  }
}

export async function initializeWorldNewsPreference(
  db: Database["kingdom"]["db"],
  uid: string,
  kingdomId: number,
  now: number,
): Promise<void> {
  if (
    !uid ||
    uid.length > 40 ||
    !Number.isSafeInteger(now) ||
    now < 0 ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1
  )
    throw new DependencyError("configuration preference input");
  await db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({
            uid: userprofile.uid,
            serverId: userprofile.serverId,
            banFlag: userprofile.banFlag,
            banTime: userprofile.banTime,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, uid))
          .limit(1)
          .for("update")
      )[0];
      if (
        !profile ||
        profile.uid !== uid ||
        profile.serverId !== kingdomId ||
        (profile.banFlag ?? 0) !== 0 ||
        (profile.banTime ?? 0n) > BigInt(now)
      )
        throw new DependencyError("configuration preference owner");
      await tx.insert(parse_info).values({ uid, type: WORLD_NEWS_PUSH_TYPE, status: 0, audio: 1 });
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
