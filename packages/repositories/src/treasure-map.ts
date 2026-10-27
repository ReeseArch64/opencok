import { and, asc, eq, inArray } from "drizzle-orm";
import { treasure_map } from "@opencok/drizzle/schema/opencok_kingdom/treasure_map";
import { num, text, long, type Row } from "@opencok/contracts/rows";
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

  if (rows.length > 4096) {throw new Error("Treasure map aggregate exceeds bound");}

  return rows;
}

export async function writeTreasureMaps(
  tx: MutationTransaction,
  owner: string,
  write: WorldMutationWrite,
) {
  for (const row of write.treasures ?? []) {
    if (row.currentOwner !== owner) {throw new Error("Foreign treasure map write");}

    const [prior] = await tx
      .select({ owner: treasure_map.currentOwner })
      .from(treasure_map)
      .where(eq(treasure_map.uuid, text(row, "uuid")));

    if (prior && prior.owner !== owner) {throw new Error("Foreign treasure map identity");}

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
    {await tx
      .delete(treasure_map)
      .where(
        and(
          eq(treasure_map.currentOwner, owner),
          inArray(treasure_map.uuid, [...write.deletedTreasures]),
        ),
      );}
}

export async function withTreasureMarchTimes<T extends Row>(
  db: Pick<MutationTransaction, "select">,
  rows: readonly T[],
): Promise<(T & { treasureMapTime?: number; treasureMapFinishTime?: bigint })[]> {
  const selected = rows.filter(
    (row) => num(row, "type") === 0 && num(row, "state") === 1 && num(row, "targetType") === 2,
  );

  if (!selected.length) {return [...rows];}

  const maps = await db
    .select()
    .from(treasure_map)
    .where(
      and(
        eq(treasure_map.state, 1),
        inArray(treasure_map.currentOwner, [
          ...new Set(selected.map((row) => text(row, "ownerUid"))),
        ]),
        inArray(
          treasure_map.marchId,
          selected.map((row) => text(row, "uuid")),
        ),
      ),
    )
    .orderBy(asc(treasure_map.uuid))
    .limit(32768);
  const indexed = new Map<string, (typeof maps)[number]>();

  for (const row of maps) {
    const key = `${row.currentOwner}:${row.marchId}`;

    if (indexed.has(key)) {throw new Error("Ambiguous treasure march identity");}

    indexed.set(key, row);
  }

  return rows.map((row) => {
    const map = indexed.get(`${row.ownerUid}:${row.uuid}`);

    return map ? { ...row, treasureMapTime: map.time, treasureMapFinishTime: map.finishTime } : row;
  });
}
