import { and, asc, eq, inArray, lte, sql, or, isNull } from "drizzle-orm";
import { totem_activation } from "@opencok/drizzle/schema/opencok_kingdom/totem_activation";
import { totemFootprint, restoreTotemConfiguration } from "@opencok/rules/totem";
import { civilization_castle } from "@opencok/drizzle/schema/opencok_kingdom/civilization_castle";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { world_interest } from "@opencok/drizzle/schema/opencok_kingdom/world_interest";
import type { WorldMutationWrite } from "@opencok/contracts/world-march-runtime";
import { num, long, text } from "@opencok/contracts/rows";
import { decode, int } from "@opencok/messages/sfs";
import { worldFootprint } from "@opencok/rules/world-march-runtime";
import type { MutationTransaction } from "./mutation";
import type { Database } from "./game";
import type { RealmAuthority } from "./realm-authority";
import { fenceRealmTransaction } from "./realm-authority";

export async function readWorldMutationState(
  tx: MutationTransaction,
  owner: string,
  request: Uint8Array | undefined,
  size: number,
  command?: string,
) {
  await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
  const [world] = await tx.select().from(user_world).where(eq(user_world.uid, owner)).for("update");
  if (!world || world.worldId !== 0) throw new Error("Missing resident world owner");
  const marches = await tx
    .select()
    .from(world_march)
    .where(eq(world_march.ownerUid, owner))
    .orderBy(asc(world_march.uuid))
    .limit(257)
    .for("update");
  const checkpoints = await tx
    .select()
    .from(world_march_checkpoint)
    .where(and(eq(world_march_checkpoint.ownerUid, owner), eq(world_march_checkpoint.status, 0)))
    .limit(257)
    .for("update");
  if (marches.length > 256 || checkpoints.length > 256)
    throw new Error("World march aggregate exceeds bound");
  const params = request ? decode(Buffer.from(request)) : {};
  let randomDestination: number | undefined;
  if (command === "world.mv" && params.point && int(params, "point") === 0) {
    const result = await tx.execute<{ id: number }>(
      sql`select p.id from opencok_kingdom.worldpoint p join opencok_kingdom.worldpoint e on e.id=p.id+1 and e."worldId"=0 join opencok_kingdom.worldpoint s on s.id=p.id+${size} and s."worldId"=0 join opencok_kingdom.worldpoint c on c.id=p.id+${size + 1} and c."worldId"=0 where p."worldId"=0 and p.x<${size - 1} and p.y<${size - 1} and p."pointType"=0 and e."pointType"=0 and s."pointType"=0 and c."pointType"=0 and p."gridType"=2 and e."gridType"=2 and s."gridType"=2 and c."gridType"=2 and p."grid2Type"=0 and e."grid2Type"=0 and s."grid2Type"=0 and c."grid2Type"=0 order by random() limit 1`,
    );
    randomDestination = result.rows[0]?.id;
  }
  const [castle] =
    command === "civilizationCastle"
      ? await tx.select().from(civilization_castle).where(eq(civilization_castle.uid, owner))
      : [];
  const ids = new Set<number>();
  if (command === "totem") {
    const active = await tx
      .select({ point: totem_activation.pointId, payload: totem_activation.payload })
      .from(totem_activation)
      .where(eq(totem_activation.status, 0))
      .limit(4097);
    if (active.length > 4096) throw new Error("Totem map bound exceeded");
    for (const entry of active)
      for (const id of totemFootprint(
        entry.point,
        restoreTotemConfiguration(entry.payload).width,
        size,
      ))
        ids.add(id);
    const target = int(params, "pointId", 1),
      x = (target - 1) % size,
      y = Math.floor((target - 1) / size);
    if (target > 0 && target <= size * size)
      for (let dx = 0; dx < 4 && x + dx < size; dx++)
        for (let dy = 0; dy < 4 && y + dy < size; dy++) ids.add(target + dx + dy * size);
  }
  for (const point of [
    world.pointId,
    castle?.pointId ?? 0,
    randomDestination ?? 0,
    ...marches.flatMap((row) => [row.ownerId, row.targetId]),
    int(params, "point", 0),
    command === "totem" ? 0 : int(params, "pointId", 0),
  ])
    if (point > 0) for (const id of worldFootprint(point, size)) ids.add(id);
  const points = await tx
    .select()
    .from(worldpoint)
    .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, [...ids])))
    .orderBy(asc(worldpoint.id))
    .for("update");
  return { world, points, marches, checkpoints, randomDestination };
}
export async function writeWorldMutation(
  tx: MutationTransaction,
  owner: string,
  write: WorldMutationWrite,
) {
  if (write.world) {
    if (write.world.uid !== owner) throw new Error("Foreign world write");
    await tx
      .update(user_world)
      .set({
        pointId: num(write.world, "pointId"),
        lastMoveCityTime: long(write.world, "lastMoveCityTime"),
      })
      .where(eq(user_world.uid, owner));
  }
  for (const row of write.points ?? []) {
    if (num(row, "worldId") !== 0) throw new Error("Foreign world point");
    await tx
      .update(worldpoint)
      .set({
        pointType: num(row, "pointType"),
        monsterCurrHP: num(row, "monsterCurrHP"),
        pointItem: row.pointItem == null ? null : text(row, "pointItem"),
        ownerId: row.ownerId == null ? null : text(row, "ownerId"),
        ownerName: row.ownerName == null ? null : text(row, "ownerName"),
        allianceId: row.allianceId == null ? null : text(row, "allianceId"),
        ownerMarchUUid: row.ownerMarchUUid == null ? null : text(row, "ownerMarchUUid"),
        resCostValue: num(row, "resCostValue"),
        resInitValue: num(row, "resInitValue"),
        resLevel: num(row, "resLevel"),
        startOccupyTime: long(row, "startOccupyTime"),
        startTime: long(row, "startTime"),
        fireTime: long(row, "fireTime"),
        flushTime: long(row, "flushTime"),
        shieldTime: long(row, "shieldTime"),
        cityDefValue: num(row, "cityDefValue"),
      })
      .where(and(eq(worldpoint.id, num(row, "id")), eq(worldpoint.worldId, 0)));
  }
  for (const row of write.marches ?? []) {
    if (row.ownerUid !== owner) throw new Error("Foreign march write");
    const value = {
      uuid: text(row, "uuid"),
      ownerUid: owner,
      ownerId: num(row, "ownerId"),
      ownerName: text(row, "ownerName"),
      ownerColor: num(row, "ownerColor"),
      allianceId: text(row, "allianceId"),
      type: num(row, "type"),
      targetId: num(row, "targetId"),
      targetType: num(row, "targetType"),
      targetUid: text(row, "targetUid"),
      marchStartTime: long(row, "marchStartTime"),
      marchTime: num(row, "marchTime"),
      marchArrivalTime: long(row, "marchArrivalTime"),
      returnStartTime: long(row, "returnStartTime"),
      arrivalTime: long(row, "arrivalTime"),
      collectSpd: Number(row.collectSpd ?? 0),
      changeCollectSpdTime: long(row, "changeCollectSpdTime"),
      collectedBeforeSpd: long(row, "collectedBeforeSpd"),
      state: num(row, "state"),
      worldId: 0,
      armyInfo: row.armyInfo as Buffer,
      plunderRes: text(row, "plunderRes"),
      blackLandMarchTime: text(row, "blackLandMarchTime"),
      retrieveRes: text(row, "retrieveRes"),
      resLevel: num(row, "resLevel"),
    };
    const [existing] = await tx
      .select({ owner: world_march.ownerUid })
      .from(world_march)
      .where(eq(world_march.uuid, value.uuid));
    if (existing && existing.owner !== owner) throw new Error("Foreign march identity");
    await tx
      .insert(world_march)
      .values(value)
      .onConflictDoUpdate({ target: world_march.uuid, set: value });
  }
  for (const row of write.checkpoints ?? []) {
    if (row.ownerUid !== owner) throw new Error("Foreign march checkpoint");
    const value = {
      id: text(row, "id"),
      ownerUid: owner,
      version: num(row, "version"),
      status: num(row, "status"),
      dueAt: long(row, "dueAt"),
      payload: row.payload as Buffer,
    };
    if (num(row, "expectedVersion") === 0) await tx.insert(world_march_checkpoint).values(value);
    else {
      const saved = await tx
        .update(world_march_checkpoint)
        .set(value)
        .where(
          and(
            eq(world_march_checkpoint.id, value.id),
            eq(world_march_checkpoint.ownerUid, owner),
            eq(world_march_checkpoint.version, num(row, "expectedVersion")),
            eq(world_march_checkpoint.status, 0),
          ),
        )
        .returning({ id: world_march_checkpoint.id });
      if (saved.length !== 1) throw new Error("Stale march checkpoint");
    }
  }
  if (write.deletedMarches?.length)
    await tx
      .delete(world_march)
      .where(
        and(eq(world_march.ownerUid, owner), inArray(world_march.uuid, [...write.deletedMarches])),
      );
}
export async function dueWorldMarches(
  db: Database["kingdom"]["db"],
  now: bigint,
  after?: { dueAt: bigint; id: string },
) {
  return db
    .select({
      id: world_march_checkpoint.id,
      owner: world_march_checkpoint.ownerUid,
      version: world_march_checkpoint.version,
      dueAt: world_march_checkpoint.dueAt,
    })
    .from(world_march_checkpoint)
    .where(
      and(
        eq(world_march_checkpoint.status, 0),
        lte(world_march_checkpoint.dueAt, now),
        after
          ? sql`(${world_march_checkpoint.dueAt},${world_march_checkpoint.id}) > (${after.dueAt},${after.id})`
          : undefined,
      ),
    )
    .orderBy(asc(world_march_checkpoint.dueAt), asc(world_march_checkpoint.id))
    .limit(64);
}
export function createWorldInterest(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  size: number,
  now = Date.now,
) {
  return {
    async subscribe(owner: string, x: number, y: number) {
      if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= size || y >= size)
        throw new Error("Invalid world interest");
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const [world] = await tx.select().from(user_world).where(eq(user_world.uid, owner));
        if (!world || world.worldId !== 0) throw new Error("Foreign world interest");
        const value = { ownerUid: owner, worldId: 0, x, y, updatedAt: BigInt(now()) };
        await tx
          .insert(world_interest)
          .values(value)
          .onConflictDoUpdate({ target: world_interest.ownerUid, set: value });
      });
    },
    async interested(points: readonly number[], owner: string, target: string) {
      const rows = await db
        .select()
        .from(world_interest)
        .where(
          and(
            eq(world_interest.worldId, 0),
            sql`${world_interest.updatedAt} >= ${BigInt(now() - 300000)}`,
          ),
        );
      return [
        ...new Set([
          owner,
          ...(target ? [target] : []),
          ...rows
            .filter((row) =>
              points.some(
                (point) =>
                  Math.abs(((point - 1) % size) - row.x) < 26 &&
                  Math.abs(Math.floor((point - 1) / size) - row.y) < 26,
              ),
            )
            .map((row) => row.ownerUid),
        ]),
      ];
    },
    async marches(ids: readonly number[]) {
      if (!ids.length) return [];
      return db
        .select()
        .from(world_march)
        .where(
          and(
            eq(world_march.worldId, 0),
            or(inArray(world_march.ownerId, [...ids]), inArray(world_march.targetId, [...ids])),
          ),
        )
        .orderBy(asc(world_march.uuid))
        .limit(1025);
    },
  };
}

export async function unregisteredWorldMarches(db: Database["kingdom"]["db"], after?: string) {
  return db
    .select({ id: world_march.uuid, owner: world_march.ownerUid })
    .from(world_march)
    .leftJoin(world_march_checkpoint, eq(world_march_checkpoint.id, world_march.uuid))
    .where(
      and(
        eq(world_march.worldId, 0),
        eq(world_march.type, 0),
        eq(world_march.targetType, 3),
        isNull(world_march_checkpoint.id),
        after ? sql`${world_march.uuid}>${after}` : undefined,
      ),
    )
    .orderBy(asc(world_march.uuid))
    .limit(64);
}
