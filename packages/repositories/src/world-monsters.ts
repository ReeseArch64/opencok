import { and, eq, sql, asc, or, inArray } from "drizzle-orm";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { worldMonsterAreaRanges } from "@opencok/rules/world-monsters";
import type { WorldMonsterReader } from "@opencok/contracts/world-monsters";
import type { MutationTransaction } from "./mutation";
export function worldMonsterReader(tx: MutationTransaction, size: number): WorldMonsterReader {
  const read = async (ranges: readonly number[][], free: boolean) => {
    const rows = await tx
      .select()
      .from(worldpoint)
      .where(
        and(
          eq(worldpoint.worldId, 0),
          eq(worldpoint.gridType, 2),
          eq(worldpoint.grid2Type, 0),
          free ? eq(worldpoint.pointType, 0) : undefined,
          sql`coalesce(${worldpoint.ownerId},'')=''`,
          sql`coalesce(${worldpoint.ownerMarchUUid},'')=''`,
          sql`(${worldpoint.pointType}<>0 OR NOT EXISTS(SELECT 1 FROM opencok_kingdom.world_march m WHERE m."worldId"=0 AND m."targetId" IN (${worldpoint.id},${worldpoint.id}+1,${worldpoint.id}+${size},${worldpoint.id}+${size + 1})))`,
          sql`(${worldpoint.pointType}<>0 OR NOT EXISTS(SELECT 1 FROM opencok_kingdom.world_barbarion b WHERE b."pointId"=${worldpoint.id}))`,
          sql`NOT EXISTS(SELECT 1 FROM opencok_kingdom.t_worldboss b WHERE b.point=${worldpoint.id} AND b.status=1)`,
          or(
            ...ranges.map(
              ([x1, x2, y1, y2]) =>
                sql`${worldpoint.x} BETWEEN ${x1} AND ${x2} AND ${worldpoint.y} BETWEEN ${y1} AND ${y2}`,
            ),
          ),
        ),
      )
      .orderBy(asc(worldpoint.id))
      .limit(4097)
      .for("update");
    if (rows.length > 4096) throw new Error("Monster candidate aggregate exceeds bound");
    return rows;
  };
  return {
    async barbarians(points) {
      if (points.length > 4096) throw new Error("Barbarian actor aggregate exceeds bound");
      if (!points.length) return [];
      return tx
        .select()
        .from(world_barbarion)
        .where(inArray(world_barbarion.pointId, [...points]))
        .for("update");
    },
    async nearestBoss(origin) {
      if (!Number.isInteger(origin) || origin < 0 || origin > size * size)
        throw new Error("Invalid boss search origin");
      const result = await tx.execute<{ id: number }>(
        sql`SELECT wp.id FROM opencok_kingdom.worldpoint wp JOIN opencok_kingdom.worldpoint origin ON origin.id=${origin} AND origin."worldId"=0 WHERE wp."worldId"=0 AND wp."pointType"=15 ORDER BY (wp.x-origin.x)*(wp.x-origin.x)+(wp.y-origin.y)*(wp.y-origin.y),wp.id LIMIT 1`,
      );
      return result.rows[0]?.id ?? 0;
    },
    nearby(origin, radius) {
      if (
        !Number.isInteger(origin) ||
        origin < 1 ||
        origin > size * size ||
        !Number.isInteger(radius) ||
        radius < 0 ||
        radius > 32
      )
        throw new Error("Invalid monster search range");
      const x = (origin - 1) % size,
        y = Math.floor((origin - 1) / size);
      return read(
        [
          [
            Math.max(0, x - radius),
            Math.min(size - 1, x + radius),
            Math.max(0, y - radius),
            Math.min(size - 1, y + radius),
          ],
        ],
        false,
      );
    },
    area(area, side) {
      return read(worldMonsterAreaRanges(area, side, size), true);
    },
  };
}
