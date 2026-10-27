import { and, asc, eq, inArray } from "drizzle-orm";
import { treasure_map } from "@opencok/drizzle/schema/opencok_kingdom/treasure_map";
import { num, text, long } from "@opencok/contracts/rows";
import type { WorldMutationWrite } from "@opencok/contracts/world-march-runtime";
import type { MutationTransaction } from "./mutation";

export async function readTreasureMaps(tx: MutationTransaction, owner: string) {
  const rows = await tx
    .select()
    .from(treasure_map)
    .where(eq(treasure_map.currentOwner, owner))
    .orderBy(asc(treasure_map.uuid))
    .limit(4097)
    .for("update");
  if (rows.length > 4096) throw new Error("Treasure map aggregate exceeds bound");
  return rows;
}
export async function writeTreasureMaps(
  tx: MutationTransaction,
  owner: string,
  write: WorldMutationWrite,
) {
  for (const row of write.treasures ?? []) {
    if (row.currentOwner !== owner) throw new Error("Foreign treasure map write");
    const [prior] = await tx
      .select({ owner: treasure_map.currentOwner })
      .from(treasure_map)
      .where(eq(treasure_map.uuid, text(row, "uuid")));
    if (prior && prior.owner !== owner) throw new Error("Foreign treasure map identity");
    const value = {
      uuid: text(row, "uuid"),
      treasureId: text(row, "treasureId"),
      currentOwner: owner,
      originalOwner: text(row, "originalOwner"),
      targetId: num(row, "targetId"),
      time: num(row, "time"),
      colour: num(row, "colour"),
      marchId: text(row, "marchId"),
      startTime: long(row, "startTime"),
      finishTime: long(row, "finishTime"),
      state: num(row, "state"),
    };
    await tx
      .insert(treasure_map)
      .values(value)
      .onConflictDoUpdate({ target: treasure_map.uuid, set: value });
  }
  if (write.deletedTreasures?.length)
    await tx
      .delete(treasure_map)
      .where(
        and(
          eq(treasure_map.currentOwner, owner),
          inArray(treasure_map.uuid, [...write.deletedTreasures]),
        ),
      );
}
