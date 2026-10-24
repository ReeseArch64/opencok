import { readMailBatch } from "./mail-batch.ts";
import { readMailGroups } from "./mail-groups.ts";
import { readMailCategory } from "./mail-category.ts";
import { translationv2 } from "@opencok/drizzle/schema/opencok_kingdom/translationv2";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { readMailStatus } from "./mail.ts";
import type {
  MailBatchQuery,
  MailGroupQuery,
  MailGroupInspector,
  MailCategoryQuery,
  MailCategoryInspector,
  MailContentsQuery,
  MailContentsInspector,
  MailConversationSaveQuery,
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
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { user_mine } from "@opencok/drizzle/schema/opencok_kingdom/user_mine";
import { switches } from "@opencok/drizzle/schema/opencok_kingdom/switches";
import { parse_info } from "@opencok/drizzle/schema/opencok_kingdom/parse_info";
import { WORLD_NEWS_PUSH_TYPE } from "@opencok/constants/game";
import { setPushPreference } from "./push-preferences.ts";
import { updateProfilePreference } from "./profile-preferences.ts";
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
import type { Row } from "@opencok/contracts/rows";
import { checkPlayerSummaryStore, loadPlayerSummaries } from "./players.ts";
import { checkPowerStore, readPowerState } from "./power.ts";
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
>;

export class Database implements GameStore, FriendshipMineStore {
  readonly databases;
  readonly kingdom;
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
    ])
      await this.kingdom.db.select().from(table).limit(0);
    await this.databases.global.db.select().from(account_new).limit(0);
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
  async profile(uid: string): Promise<Row | undefined> {
    return (
      await this.kingdom.db.select().from(userprofile).where(eq(userprofile.uid, uid)).limit(1)
    )[0];
  }
  async accounts(uid: string): Promise<Row[]> {
    return this.databases.global.db
      .select({ active: account_new.active, server: account_new.server, uuid: account_new.uuid })
      .from(account_new)
      .where(eq(account_new.gameUid, uid));
  }
  async city(uid: string, now: number): Promise<CityState> {
    return this.kingdom.db.transaction(
      async (tx) => {
        const profile = (
          await tx.select().from(userprofile).where(eq(userprofile.uid, uid)).limit(1)
        )[0];
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
        const lord = (await tx.select().from(user_lord).where(eq(user_lord.uid, uid)).limit(1))[0];
        return { profile, resource, buildings, queues, world, hasMarches, armies, items, lord };
      },
      { isolationLevel: "repeatable read", accessMode: "read only" },
    );
  }
  configuration(uid: string): Promise<LoginConfigurationState> {
    return readLoginConfiguration(this.kingdom.db, uid);
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
  power(uid: string, now: number) {
    return readPowerState(this.kingdom.db, uid, now);
  }
  playerSummaries(uids: string[], allServers: boolean) {
    return loadPlayerSummaries(this.databases, this.config.kingdomId, uids, allServers);
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
  mailDelete(uid: string, query: MailDeleteQuery, plan: MailDeletePlanner) {
    return deleteMail(this.kingdom.db, this.config.kingdomId, uid, query, plan);
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
  async world(uid: string, ids: number[]) {
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
        return { world, hasMarches, points };
      },
      { isolationLevel: "repeatable read", accessMode: "read only" },
    );
  }
  close() {
    return this.databases.close();
  }
}

export function readLoginConfiguration(
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
