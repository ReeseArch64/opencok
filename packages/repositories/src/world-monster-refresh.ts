import { randomUUID } from "node:crypto";
import { and, eq, sql, inArray, asc, lte } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import { world_barbarion_dead } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion_dead";
import { black_land_barbarion_dead } from "@opencok/drizzle/schema/opencok_kingdom/black_land_barbarion_dead";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { encodeJavaIntMap } from "@opencok/messages/java-int-map";
import { encode, sfs } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import type {
  WorldMonsterFamily,
  WorldMonsterRefreshExecutor,
  WorldMonsterSupplyClock,
} from "@opencok/contracts/world-monster-refresh";
import type { Database } from "./game";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";

const key = (family: WorldMonsterFamily) => `opencok.world.monsters.${family}.v1`;

function parseClock(raw: string, authority: RealmAuthority, size: number): WorldMonsterSupplyClock {
  if (Buffer.byteLength(raw) > 262144) throw new Error("Oversized monster clock");

  const value = JSON.parse(raw);

  if (
    !value ||
    Object.keys(value).sort().join() !==
      "area,attempts,epoch,initial,kingdomId,nextAt,pool,quota,remaining,size,stage,version" ||
    value.version !== 1 ||
    value.kingdomId !== authority.kingdomId ||
    value.size !== size ||
    typeof value.epoch !== "string" ||
    !/^\d{1,19}$/.test(value.epoch) ||
    BigInt(value.epoch) < 1n ||
    BigInt(value.epoch) > authority.epoch ||
    typeof value.nextAt !== "string" ||
    !/^\d{1,19}$/.test(value.nextAt) ||
    BigInt(value.nextAt) > 9223372036854775807n ||
    !["idle", "reset", "fill", "seed"].includes(value.stage) ||
    typeof value.initial !== "boolean" ||
    !Number.isInteger(value.area) ||
    value.area < 0 ||
    value.area > size * size ||
    !Number.isInteger(value.attempts) ||
    value.attempts < 0 ||
    value.attempts > 4096 ||
    !Array.isArray(value.pool) ||
    value.pool.length > 4096 ||
    new Set(value.pool).size !== value.pool.length ||
    !value.pool.every(
      (id: unknown) =>
        typeof id === "number" && Number.isInteger(id) && id >= 1 && id <= size * size,
    )
  )
    throw new Error("Invalid monster clock");

  for (const record of [value.quota, value.remaining])
    if (
      !record ||
      typeof record !== "object" ||
      Array.isArray(record) ||
      Object.keys(record).length > 1024 ||
      Object.entries(record).some(
        ([id, count]) =>
          !/^\d{1,10}$/.test(id) ||
          typeof count !== "number" ||
          !Number.isInteger(count) ||
          count < 0 ||
          count > 2147483647,
      )
    )
      throw new Error("Invalid monster quota snapshot");

  return {
    version: 1,
    stage: value.stage,
    area: value.area,
    nextAt: BigInt(value.nextAt),
    initial: value.initial,
    quota: value.quota,
    remaining: value.remaining,
    pool: value.pool,
    attempts: value.attempts,
  };
}

export function createWorldMonsterRefreshExecutor(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  size: number,
  captureTime = Date.now,
): WorldMonsterRefreshExecutor {
  if (!Number.isInteger(size) || size < 2 || size > 4000)
    throw new Error("Invalid monster map size");

  return {
    async execute(at, work) {
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        await tx.execute(sql`select pg_advisory_xact_lock(728214,0)`);
        const now = at ?? BigInt(captureTime());

        if (now < 0n || now > BigInt(Number.MAX_SAFE_INTEGER))
          throw new Error("Invalid monster clock");

        const [info] = await tx.select().from(server_info).where(eq(server_info.uid, "server")),
          [profile] = await tx.select({ uid: userprofile.uid }).from(userprofile).limit(1),
          [terrain] = await tx
            .select({ value: trigger_var.value })
            .from(trigger_var)
            .where(
              and(
                eq(trigger_var.type, -1),
                eq(trigger_var.uid, "@world:0"),
                eq(trigger_var.key, "opencok.world.terrain.v1"),
              ),
            );
        const manifest = terrain ? JSON.parse(terrain.value) : undefined,
          fresh = Boolean(
            !profile &&
            manifest?.version === 1 &&
            manifest.kingdomId === authority.kingdomId &&
            manifest.size === size &&
            manifest.complete === true,
          ),
          opening = info?.activityTime ?? 0n;
        let monsterStart = info?.shuaguaiActStart ?? 0n;

        if (!monsterStart) monsterStart = info?.daoliangStart ?? 0n;

        if (!monsterStart) monsterStart = opening;
        else if (opening > 0n && now >= opening && now < monsterStart) monsterStart = now;

        const changed = new Set<number>();
        const rows = async (ranges: readonly number[][]) => {
          const result = await tx
            .select({
              point: worldpoint,
              claimed: sql<boolean>`EXISTS(SELECT 1 FROM opencok_kingdom.world_march m WHERE m."worldId"=0 AND m."targetId" IN (${worldpoint.id},${worldpoint.id}+1,${worldpoint.id}+${size},${worldpoint.id}+${size + 1})) OR EXISTS(SELECT 1 FROM opencok_kingdom.t_worldboss b WHERE b.point=${worldpoint.id} AND b.status=1) OR (${worldpoint.pointType}=0 AND EXISTS(SELECT 1 FROM opencok_kingdom.world_barbarion b WHERE b."pointId"=${worldpoint.id}))`,
            })
            .from(worldpoint)
            .where(
              and(
                eq(worldpoint.worldId, 0),
                sql`(${sql.join(
                  ranges.map(
                    ([x1, x2, y1, y2]) =>
                      sql`${worldpoint.x} BETWEEN ${x1} AND ${x2} AND ${worldpoint.y} BETWEEN ${y1} AND ${y2}`,
                  ),
                  sql` OR `,
                )})`,
              ),
            )
            .orderBy(asc(worldpoint.id))
            .limit(4097)
            .for("update");

          if (result.length > 4096) throw new Error("Monster area exceeds bound");

          return result.map((row) => ({ ...row.point, runtimeClaimed: row.claimed ? 1 : 0 }));
        };
        const readPoints = async (ids: readonly number[]) => {
          if (ids.length > 4096) throw new Error("Monster point aggregate exceeds bound");

          if (!ids.length) return [];

          const output: Row[] = [];

          for (const id of new Set(ids)) {
            if (!Number.isInteger(id) || id < 1 || id > size * size) continue;

            const x = (id - 1) % size,
              y = Math.floor((id - 1) / size);
            output.push(...(await rows([[x, x, y, y]])));
          }

          return output;
        };
        const write = async (points: readonly Row[]) => {
          if (points.length > 256) throw new Error("Monster write aggregate exceeds bound");

          for (const row of points) {
            if (
              num(row, "worldId") !== 0 ||
              num(row, "id") < 1 ||
              num(row, "id") > size * size ||
              row.runtimeClaimed ||
              text(row, "ownerId") ||
              text(row, "ownerMarchUUid")
            )
              throw new Error("Claimed monster point");

            await tx
              .update(worldpoint)
              .set({
                pointType: num(row, "pointType"),
                pointItem: row.pointItem == null ? null : text(row, "pointItem"),
                resLevel: num(row, "resLevel"),
                resInitValue: num(row, "resInitValue"),
                resCostValue: num(row, "resCostValue"),
                startTime: long(row, "startTime"),
                flushTime: long(row, "flushTime"),
                flushFlag: num(row, "flushFlag"),
                monsterCurrHP: num(row, "monsterCurrHP"),
                monsterInfo: Buffer.isBuffer(row.monsterInfo) ? row.monsterInfo : null,
              })
              .where(and(eq(worldpoint.id, num(row, "id")), eq(worldpoint.worldId, 0)));
            changed.add(num(row, "id"));
          }
        };
        const loadClock = async (family: WorldMonsterFamily) => {
          const [saved] = await tx
            .select({ value: trigger_var.value })
            .from(trigger_var)
            .where(
              and(
                eq(trigger_var.type, -1),
                eq(trigger_var.uid, "@world:0"),
                eq(trigger_var.key, key(family)),
              ),
            )
            .for("update");

          return saved ? parseClock(saved.value, authority, size) : undefined;
        };
        const saveClock = async (family: WorldMonsterFamily, clock: WorldMonsterSupplyClock) => {
          const value = JSON.stringify({
            ...clock,
            nextAt: String(clock.nextAt),
            epoch: String(authority.epoch),
            kingdomId: authority.kingdomId,
            size,
          });
          parseClock(value, authority, size);
          await tx
            .insert(trigger_var)
            .values({ type: -1, uid: "@world:0", key: key(family), value, refreshtime: now })
            .onConflictDoUpdate({
              target: [trigger_var.type, trigger_var.uid, trigger_var.key],
              set: { value, refreshtime: now },
            });
        };
        await work({
          now,
          opening,
          monsterStart,
          fresh,
          clock: loadClock,
          save: saveClock,
          cells: rows,
          points: readPoints,
          async expired() {
            const saved = await loadClock("expiry"),
              select = (after: number) =>
                tx
                  .select({ id: worldpoint.id })
                  .from(worldpoint)
                  .where(
                    and(
                      eq(worldpoint.worldId, 0),
                      inArray(worldpoint.pointType, [6, 7, 9, 15, 44]),
                      sql`${worldpoint.id}>${after}`,
                      sql`${worldpoint.flushTime} <= ${now}::bigint - CASE WHEN ${worldpoint.pointType} IN (6,7) THEN 5 ELSE 1 END`,
                    ),
                  )
                  .orderBy(asc(worldpoint.id))
                  .limit(64);
            let selected = await select(saved?.area ?? 0);

            if (!selected.length && saved?.area) selected = await select(0);

            if (selected.length || saved?.area)
              await saveClock("expiry", {
                version: 1,
                stage: "idle",
                area: selected.at(-1)?.id ?? 0,
                nextAt: 0n,
                initial: false,
                quota: {},
                remaining: {},
                pool: [],
                attempts: 0,
              });

            return readPoints(selected.map((row) => row.id));
          },
          write,
          async defer(points, deadline) {
            if (!points.length || points.length > 4 || deadline < 0n)
              throw new Error("Invalid deferred monster footprint");

            for (const point of points) {
              await tx
                .update(worldpoint)
                .set({ flushTime: deadline })
                .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, num(point, "id"))));
              changed.add(num(point, "id"));
            }
          },
          async barbarian(points, actor) {
            if (actor ? points.length !== 4 : points.length < 1 || points.length > 4)
              throw new Error("Invalid barbarian footprint");

            if (actor) {
              const army = encodeJavaIntMap(actor.army),
                awards = encodeJavaIntMap(actor.awards);
              await tx.insert(world_barbarion).values(
                points.map((row) => ({
                  pointId: num(row, "id"),
                  configId: actor.configId,
                  currentHP: actor.currentHP,
                  lastBeAttackedTime: 0n,
                  lastArmyMapByteArray: army,
                  lastAwardArmyMapByteArray: awards,
                })),
              );
            } else
              await tx.delete(world_barbarion).where(
                inArray(
                  world_barbarion.pointId,
                  points.map((row) => num(row, "id")),
                ),
              );

            await write(points);
          },
          async tickets() {
            const normal = await tx
                .select()
                .from(world_barbarion_dead)
                .where(lte(world_barbarion_dead.deadFinishTime, now - 1n))
                .orderBy(asc(world_barbarion_dead.deadFinishTime), asc(world_barbarion_dead.id))
                .limit(64)
                .for("update"),
              black = await tx
                .select()
                .from(black_land_barbarion_dead)
                .where(lte(black_land_barbarion_dead.deadFinishTime, now - 1n))
                .orderBy(
                  asc(black_land_barbarion_dead.deadFinishTime),
                  asc(black_land_barbarion_dead.id),
                )
                .limit(64)
                .for("update");

            return [...normal, ...black.map((row) => ({ ...row, blackLand: 1 }))]
              .sort((a, b) => (long(a, "deadFinishTime") < long(b, "deadFinishTime") ? -1 : 1))
              .slice(0, 64);
          },
          async population(area) {
            const result = await tx.execute<{ count: number }>(
              area === 0
                ? sql`SELECT ((SELECT count(*) FROM opencok_kingdom.worldpoint WHERE "worldId"=0 AND "pointType"=44 AND "flushFlag"=0 AND x BETWEEN 575 AND 625 AND y BETWEEN 575 AND 625)+(SELECT count(*) FROM opencok_kingdom.black_land_barbarion_dead))::integer AS count`
                : sql`SELECT ((SELECT count(*) FROM opencok_kingdom.worldpoint WHERE "worldId"=0 AND "pointType"=44 AND "flushFlag"=0 AND "areaId"=${area} AND coalesce("pointItem",'')<>'4800000')+(SELECT count(*) FROM opencok_kingdom.world_barbarion_dead WHERE "areaId"=${area} AND coalesce("pointItem",'')<>'4800000'))::integer AS count`,
            );

            return result.rows[0]!.count;
          },
          async ticket(area, item, level, deadline, count) {
            if (!Number.isInteger(count) || count < 1 || count > 256)
              throw new Error("Invalid barbarian tickets");

            await tx.insert(world_barbarion_dead).values(
              Array.from({ length: count }, () => ({
                id: randomUUID().replaceAll("-", ""),
                areaId: area,
                pointItem: item,
                level,
                deadFinishTime: deadline,
              })),
            );
          },
          async retry(ticket, deadline) {
            if (ticket.blackLand)
              await tx
                .update(black_land_barbarion_dead)
                .set({ deadFinishTime: deadline })
                .where(eq(black_land_barbarion_dead.id, text(ticket, "id")));
            else
              await tx
                .update(world_barbarion_dead)
                .set({ deadFinishTime: deadline })
                .where(eq(world_barbarion_dead.id, text(ticket, "id")));
          },
          async remove(ticket) {
            if (ticket.blackLand)
              await tx
                .delete(black_land_barbarion_dead)
                .where(eq(black_land_barbarion_dead.id, text(ticket, "id")));
            else
              await tx
                .delete(world_barbarion_dead)
                .where(eq(world_barbarion_dead.id, text(ticket, "id")));
          },
        });

        if (changed.size) {
          const id = randomUUID().replaceAll("-", "");
          await tx.insert(mutation_outbox).values({
            kingdomId: authority.kingdomId,
            ownerUid: "",
            requestId: `monsters:${id}`,
            eventId: id,
            eventType: "world.monsters",
            payload: Buffer.from(
              encode({
                owner: sfs.string(""),
                origin: sfs.int(0),
                points: sfs.array([...changed].map((id) => sfs.object({ id: sfs.int(id) }))),
              }),
            ),
            createdAt: now,
            publishedAt: 0n,
          });
        }

        authority.assertReady();
      });
    },
  };
}
