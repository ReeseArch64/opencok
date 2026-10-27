import { createHash } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import type {
  WorldTerrain,
  WorldTerrainManifest,
  WorldTerrainRules,
} from "@opencok/contracts/world-terrain";
import {
  worldTerrainKey,
  worldTerrainOwner,
  worldTerrainPoint,
} from "@opencok/rules/world-terrain";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type { MutationTransaction } from "./mutation";
import type { Database } from "./game";

type RealmDatabase = Database["kingdom"]["db"];

const identity = and(
  eq(trigger_var.type, -1),
  eq(trigger_var.uid, worldTerrainOwner),
  eq(trigger_var.key, worldTerrainKey),
);

const keys = [
  "version",
  "format",
  "kingdomId",
  "size",
  "bornSide",
  "resourceSide",
  "monsterSide",
  "sourceHash",
  "layoutHash",
  "cursor",
  "complete",
  "epoch",
].sort();

function decode(raw: string): WorldTerrainManifest {
  if (Buffer.byteLength(raw) > 4096) throw new Error("Invalid terrain manifest");

  const value = JSON.parse(raw) as WorldTerrainManifest;

  if (
    !value ||
    typeof value !== "object" ||
    Object.keys(value).sort().join() !== keys.join() ||
    value.version !== 1 ||
    value.format !== "worldcreator-v2.normal.v1" ||
    typeof value.sourceHash !== "string" ||
    typeof value.layoutHash !== "string" ||
    typeof value.epoch !== "string" ||
    !/^[0-9a-f]{64}$/.test(value.sourceHash) ||
    !/^[0-9a-f]{64}$/.test(value.layoutHash) ||
    !/^[1-9][0-9]{0,18}$/.test(value.epoch) ||
    typeof value.complete !== "boolean"
  )
    throw new Error("Invalid terrain manifest");

  for (const key of [
    "kingdomId",
    "size",
    "bornSide",
    "resourceSide",
    "monsterSide",
    "cursor",
  ] as const)
    if (!Number.isSafeInteger(value[key]) || value[key] < (key === "cursor" ? 0 : 1))
      throw new Error("Invalid terrain manifest counter");

  if (
    BigInt(value.epoch) > 9223372036854775807n ||
    value.kingdomId > 2147483647 ||
    value.size < 2 ||
    value.size > 4000 ||
    value.bornSide > value.size ||
    value.resourceSide > value.size ||
    value.monsterSide > value.size ||
    value.cursor > value.size * value.size ||
    (value.complete && value.cursor !== value.size * value.size)
  )
    throw new Error("Invalid terrain manifest dimensions");

  return value;
}

async function manifest(tx: MutationTransaction, mode: "share" | "update") {
  const [saved] = await tx
    .select({ value: trigger_var.value })
    .from(trigger_var)
    .where(identity)
    .for(mode);

  return saved ? decode(saved.value) : undefined;
}

async function shape(tx: MutationTransaction, size: number) {
  const result = await tx.execute<{ count: string; maximum: number | null; invalid: string }>(sql`
    SELECT count(*)::text AS count, max(id) AS maximum,
    count(*) FILTER (WHERE "worldId" <> 0 OR id <> 1+x+y*${size} OR x<0 OR y<0 OR x>=${size} OR y>=${size})::text AS invalid
    FROM opencok_kingdom.worldpoint`);

  return result.rows[0]!;
}

export async function assertWorldTerrain(
  db: RealmDatabase,
  authority: RealmAuthority,
  size: number,
) {
  if (!Number.isInteger(size) || size < 2 || size > 4000)
    throw new Error("Invalid configured map size");

  return db.transaction(async (tx) => {
    await fenceRealmTransaction(tx, authority);
    const saved = await manifest(tx, "share");

    if (!saved) return undefined;

    if (
      saved.kingdomId !== authority.kingdomId ||
      BigInt(saved.epoch) > authority.epoch ||
      saved.size !== size ||
      !saved.complete
    )
      throw new Error("Realm terrain incomplete or configured map size mismatch");

    const actual = await shape(tx, size);

    if (
      Number(actual.count) !== size * size ||
      actual.maximum !== size * size ||
      Number(actual.invalid)
    )
      throw new Error("Realm terrain shape changed");

    return saved;
  });
}

async function fresh(
  tx: MutationTransaction,
  cursor: number,
  size: number,
  kingdomId: number,
  full: boolean,
) {
  await tx.execute(
    sql`LOCK TABLE opencok_kingdom.userprofile, opencok_kingdom.user_world, opencok_kingdom.world_march, opencok_kingdom.world_march_checkpoint, opencok_kingdom.worldpoint IN SHARE ROW EXCLUSIVE MODE`,
  );
  const result = await tx.execute<{ occupied: boolean }>(sql`SELECT
    EXISTS(SELECT 1 FROM opencok_kingdom.realm_authority WHERE "kingdomId"<>${kingdomId}) OR
    EXISTS(SELECT 1 FROM opencok_kingdom.userprofile) OR
    EXISTS(SELECT 1 FROM opencok_kingdom.user_world) OR
    EXISTS(SELECT 1 FROM opencok_kingdom.world_march) OR
    EXISTS(SELECT 1 FROM opencok_kingdom.world_march_checkpoint) OR
    EXISTS(SELECT 1 FROM opencok_kingdom.world_barbarion) OR
    EXISTS(SELECT 1 FROM opencok_kingdom.world_res_dead) OR
    EXISTS(SELECT 1 FROM opencok_kingdom.world_field_monster_dead) OR
    ${full ? sql`EXISTS(SELECT 1 FROM opencok_kingdom.worldpoint WHERE coalesce("ownerId",'')<>'' OR coalesce("ownerMarchUUid",'')<>'' OR coalesce("territoryAlliance",'')<>'' OR coalesce("territoryId",0)<>0 OR "pointType" NOT IN (0,10,11,12,13,48))` : sql`false`} AS occupied`);

  if (!full) {
    const actual = await tx.execute<{ maximum: number | null }>(
      sql`SELECT max(id) AS maximum FROM opencok_kingdom.worldpoint`,
    );

    if (result.rows[0]!.occupied || (actual.rows[0]!.maximum ?? 0) !== cursor)
      throw new Error("Terrain import prefix changed");

    return;
  }

  const actual = await shape(tx, size);

  if (
    result.rows[0]!.occupied ||
    Number(actual.count) !== cursor ||
    (actual.maximum ?? 0) !== cursor ||
    Number(actual.invalid)
  )
    throw new Error("Terrain import requires an untouched fresh realm");
}

export async function checkWorldTerrainImportTarget(db: RealmDatabase, kingdomId: number) {
  if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 2147483647)
    throw new Error("Invalid terrain realm");

  await db.transaction(
    async (tx) => {
      const foreign = await tx.execute<{ foreign: boolean }>(
        sql`SELECT EXISTS(SELECT 1 FROM opencok_kingdom.realm_authority WHERE "kingdomId"<>${kingdomId}) AS foreign`,
      );

      if (foreign.rows[0]!.foreign) throw new Error("Foreign terrain database");

      const [raw] = await tx.select({ value: trigger_var.value }).from(trigger_var).where(identity);
      const saved = raw ? decode(raw.value) : undefined;

      if (saved) {
        if (saved.kingdomId !== kingdomId) throw new Error("Foreign terrain manifest");

        return;
      }

      const occupied = await tx.execute<{ occupied: boolean }>(
        sql`SELECT EXISTS(SELECT 1 FROM opencok_kingdom.userprofile) OR EXISTS(SELECT 1 FROM opencok_kingdom.worldpoint) OR EXISTS(SELECT 1 FROM opencok_kingdom.world_march) AS occupied`,
      );

      if (occupied.rows[0]!.occupied) throw new Error("Terrain import requires a fresh realm");
    },
    { accessMode: "read only" },
  );
}

export async function importWorldTerrain(
  db: RealmDatabase,
  authority: RealmAuthority,
  source: WorldTerrain,
  settings: WorldTerrainRules,
  options: {
    complete(tx: MutationTransaction, authority: RealmAuthority, now: bigint): Promise<void>;
    pageSize?: number;
    pageLimit?: number;
    now?: () => number;
  },
): Promise<WorldTerrainManifest> {
  settings = { ...settings };
  const terrain = { ...source, grid: source.grid.slice(), overlay: source.overlay.slice() },
    pageSize = options.pageSize ?? 1000,
    pageLimit = options.pageLimit ?? 2147483647,
    total = terrain.size * terrain.size;

  if (
    terrain.format !== "worldcreator-v2.normal.v1" ||
    terrain.size !== settings.size ||
    !Number.isInteger(terrain.size) ||
    terrain.size < 2 ||
    terrain.size > 4000 ||
    !/^[0-9a-f]{64}$/.test(terrain.sourceHash) ||
    terrain.grid.length !== total ||
    terrain.overlay.length !== total ||
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 1000 ||
    !Number.isInteger(pageLimit) ||
    pageLimit < 1 ||
    pageLimit > 2147483647 ||
    typeof options.complete !== "function"
  )
    throw new Error("Invalid terrain import plan");

  for (const side of [settings.bornSide, settings.resourceSide, settings.monsterSide])
    if (!Number.isInteger(side) || side < 1 || side > terrain.size)
      throw new Error("Invalid terrain area width");

  if (terrain.grid.some((value) => value > 2) || terrain.overlay.some((value) => value > 1))
    throw new Error("Invalid terrain cell");

  const description = {
      format: terrain.format,
      size: terrain.size,
      bornSide: settings.bornSide,
      resourceSide: settings.resourceSide,
      monsterSide: settings.monsterSide,
      sourceHash: terrain.sourceHash,
    },
    layoutHash = createHash("sha256")
      .update(JSON.stringify(description))
      .update(terrain.grid)
      .update(terrain.overlay)
      .digest("hex");
  let result: WorldTerrainManifest | undefined;

  for (let page = 0; page < pageLimit; page++) {
    result = await db.transaction(async (tx) => {
      await fenceRealmTransaction(tx, authority);
      await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
      const saved = await manifest(tx, "update"),
        now = BigInt((options.now ?? Date.now)());

      if (
        saved &&
        (saved.kingdomId !== authority.kingdomId ||
          BigInt(saved.epoch) > authority.epoch ||
          saved.layoutHash !== layoutHash ||
          saved.sourceHash !== terrain.sourceHash ||
          saved.size !== terrain.size ||
          saved.bornSide !== settings.bornSide ||
          saved.resourceSide !== settings.resourceSide ||
          saved.monsterSide !== settings.monsterSide)
      )
        throw new Error("Terrain import identity changed");

      if (now < 0n) throw new Error("Invalid terrain import clock");

      if (saved?.complete) {
        await assertShape();

        return saved;
      }

      const cursor = saved?.cursor ?? 0;
      await fresh(
        tx,
        cursor,
        terrain.size,
        authority.kingdomId,
        page === 0 || cursor + pageSize >= total,
      );
      const next = Math.min(total, cursor + pageSize),
        rows = [];

      for (let index = cursor; index < next; index++)
        rows.push(worldTerrainPoint(terrain, settings, index));

      if (rows.length) await tx.insert(worldpoint).values(rows);

      const complete = next === total;

      if (complete) {
        await options.complete(tx, authority, now);
        await assertShape();
      }

      const value: WorldTerrainManifest = {
        version: 1,
        ...description,
        kingdomId: authority.kingdomId,
        layoutHash,
        cursor: next,
        complete,
        epoch: String(authority.epoch),
      };
      await tx
        .insert(trigger_var)
        .values({
          type: -1,
          uid: worldTerrainOwner,
          key: worldTerrainKey,
          value: JSON.stringify(value),
          refreshtime: now,
        })
        .onConflictDoUpdate({
          target: [trigger_var.type, trigger_var.uid, trigger_var.key],
          set: { value: JSON.stringify(value), refreshtime: now },
        });
      authority.assertReady();

      return value;

      async function assertShape() {
        const actual = await shape(tx, terrain.size);

        if (Number(actual.count) !== total || actual.maximum !== total || Number(actual.invalid))
          throw new Error("Realm terrain shape changed");
      }
    });

    if (result.complete) break;
  }

  return result!;
}
