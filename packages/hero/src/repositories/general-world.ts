import { and, eq, inArray, asc } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import type { GeneralWrite } from "@opencok/hero/contracts/generals";
import type { MutationTransaction } from "@opencok/repositories/mutation";

export async function writeGeneralWorldResources(
  tx: MutationTransaction,
  resources: NonNullable<GeneralWrite["worldResources"]>,
  now: bigint,
) {
  if (!resources.length) return;

  if (
    resources.length > 16 ||
    new Set(resources.map((row) => row.pointId)).size !== resources.length
  )
    throw new Error("Invalid general resource targets");

  const points = await tx
    .select()
    .from(worldpoint)
    .where(
      and(
        eq(worldpoint.worldId, 0),
        inArray(
          worldpoint.id,
          resources.map((row) => row.pointId),
        ),
      ),
    )
    .orderBy(asc(worldpoint.id))
    .for("update");

  if (points.length !== resources.length) throw new Error("Missing general resource target");

  for (const resource of resources) {
    const point = points.find((row) => row.id === resource.pointId)!;

    if (
      point.pointType !== 0 ||
      point.gridType !== 2 ||
      point.grid2Type !== 0 ||
      point.ownerId?.trim() ||
      ![0, 1, 2, 3].includes(resource.type) ||
      !Number.isInteger(resource.level) ||
      resource.level < 1 ||
      resource.level > 100 ||
      !Number.isInteger(resource.amount) ||
      resource.amount < 1 ||
      resource.amount > 2147483647
    )
      throw new Error("Occupied general resource target");

    await tx
      .update(worldpoint)
      .set({
        pointType: 3,
        pointItem: String(resource.type),
        resLevel: resource.level,
        resInitValue: resource.amount,
        resCostValue: 0,
        flushTime: now + 3600000n,
        flushFlag: 1,
      })
      .where(and(eq(worldpoint.id, resource.pointId), eq(worldpoint.worldId, 0)));
  }
}
