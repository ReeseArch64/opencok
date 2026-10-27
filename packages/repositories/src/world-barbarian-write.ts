import { and, eq, inArray, sql } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import { encodeJavaIntMap } from "@opencok/messages/java-int-map";
import { num, text, long } from "@opencok/contracts/rows";
import type { WorldMutationWrite } from "@opencok/contracts/world-march-runtime";
import type { MutationTransaction } from "./mutation";

export async function writeWorldBarbarianActors(
  tx: MutationTransaction,
  write: WorldMutationWrite,
) {
  const actor = write.barbarianActors;

  if (!actor) return;

  const ids = [...actor.points],
    points = write.points ?? [];

  if (
    ids.length !== 4 ||
    new Set(ids).size !== 4 ||
    points.length !== 4 ||
    points.filter((row) => num(row, "pointType") === 44).length !== 1 ||
    points.some(
      (row) =>
        !ids.includes(num(row, "id")) ||
        ![44, 45].includes(num(row, "pointType")) ||
        text(row, "pointItem") !== actor.configId ||
        num(row, "worldId") !== 0,
    ) ||
    !Number.isInteger(actor.currentHP) ||
    actor.currentHP < 0 ||
    actor.currentHP > 2147483647
  )
    throw new Error("Invalid barbarian actor plan");

  const saved = await tx
    .select()
    .from(worldpoint)
    .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, ids)))
    .for("update");

  if (
    saved.length !== 4 ||
    saved.some(
      (row) =>
        row.pointType !== 0 ||
        row.gridType !== 2 ||
        row.grid2Type !== 0 ||
        row.ownerId ||
        row.ownerMarchUUid,
    )
  )
    throw new Error("Barbarian footprint changed");

  const [claimed] = await tx
    .select({ id: worldpoint.id })
    .from(worldpoint)
    .where(
      and(
        eq(worldpoint.worldId, 0),
        inArray(worldpoint.id, ids),
        sql`(EXISTS(SELECT 1 FROM opencok_kingdom.world_march m WHERE m."worldId"=0 AND m."targetId"=${worldpoint.id}) OR EXISTS(SELECT 1 FROM opencok_kingdom.t_worldboss b WHERE b.point=${worldpoint.id} AND b.status=1))`,
      ),
    )
    .limit(1);

  if (claimed) throw new Error("Barbarian footprint claimed");

  const army = encodeJavaIntMap(actor.army),
    awards = encodeJavaIntMap(actor.awards);
  await tx.insert(world_barbarion).values(
    points.map((point) => ({
      pointId: num(point, "id"),
      configId: actor.configId,
      currentHP: actor.currentHP,
      lastBeAttackedTime: 0n,
      lastArmyMapByteArray: army,
      lastAwardArmyMapByteArray: awards,
    })),
  );

  if (points.some((point) => long(point, "flushTime") <= 0n))
    throw new Error("Invalid barbarian lifetime");
}
