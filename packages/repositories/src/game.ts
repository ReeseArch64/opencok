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
import { switches } from "@opencok/drizzle/schema/opencok_kingdom/switches";
import { parse_info } from "@opencok/drizzle/schema/opencok_kingdom/parse_info";
import { and, asc, eq, getTableColumns, gt, inArray, or, sql } from "drizzle-orm";
import type { ServerConfig } from "@opencok/contracts/server";
import type { GameStore, CityState, LoginConfigurationState } from "@opencok/contracts/game";
import { num, type Row } from "@opencok/contracts/rows";
import { checkPlayerSummaryStore, loadPlayerSummaries } from "./players.ts";
import { checkPowerStore, readPowerState } from "./power.ts";

type GameRepositoryConfig = Pick<
  ServerConfig,
  | "databaseUrl"
  | "timeoutMs"
  | "globalDatabase"
  | "kingdomId"
  | "kingdomDatabase"
  | "playerKingdoms"
>;

export class Database implements GameStore {
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
      user_civilization_prestige,
      switches,
      parse_info,
    ])
      await this.kingdom.db.select().from(table).limit(0);
    await this.databases.global.db.select().from(account_new).limit(0);
    await checkPlayerSummaryStore(this.kingdom.db);
    await checkPowerStore(this.kingdom.db);
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
        const lord = (await tx.select().from(user_lord).where(eq(user_lord.uid, uid)).limit(1))[0];
        return {
          profile,
          resource,
          buildings,
          queues,
          world,
          hasMarches,
          armies,
          items,
          lord,
          civilizationPrestige: prestige?.value ?? 0n,
        };
      },
      { isolationLevel: "repeatable read", accessMode: "read only" },
    );
  }
  configuration(uid: string): Promise<LoginConfigurationState> {
    return readLoginConfiguration(this.kingdom.db, uid);
  }
  power(uid: string, now: number) {
    return readPowerState(this.kingdom.db, uid, now);
  }
  playerSummaries(uids: string[], allServers: boolean) {
    return loadPlayerSummaries(this.databases, this.config.kingdomId, uids, allServers);
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
      const flags = await tx.select().from(switches).orderBy(asc(switches.name));
      const pushSettings = await tx
        .select({ type: parse_info.type, status: parse_info.status, audio: parse_info.audio })
        .from(parse_info)
        .where(eq(parse_info.uid, uid))
        .orderBy(asc(parse_info.type));
      return { profile, switches: flags, pushSettings };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
